@echo off
REM ============================================================================
REM  DND Character Manager - host
REM
REM  Builds the app, serves it locally, and opens a public Cloudflare tunnel.
REM
REM  Usage:
REM    host.cmd              build, then host
REM    host.cmd skipbuild     host the existing dist\ as-is (faster)
REM
REM  The share link is:
REM    - printed in a big banner below
REM    - copied to your clipboard automatically
REM    - saved to share-link.txt in this folder
REM
REM  The banner only appears after the tunnel has actually served the app
REM  twice in a row, so a link that would give people a 502 is never
REM  advertised or copied.
REM
REM  Keep this window open while people are using the site.
REM ============================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

set "PORT=4173"
set "CF=%TEMP%\opencode\cf\cloudflared.exe"
set "LOG=%~dp0host-tunnel.log"
set "LINKFILE=%~dp0share-link.txt"
set "SKIPBUILD=0"
if /i "%~1"=="skipbuild" set "SKIPBUILD=1"

echo.
echo  ============================================
echo   DND Character Manager - host
echo  ============================================
echo.

REM --- 1. tunnel binary -------------------------------------------------------
if not exist "%CF%" (
  echo  [X] cloudflared.exe not found at:
  echo      %CF%
  echo.
  echo      That temp folder gets wiped sometimes. Download it again from
  echo      https://github.com/cloudflare/cloudflared/releases/latest
  echo      ^(pick "cloudflared-windows-amd64.exe"^)
  echo.
  pause
  exit /b 1
)

REM --- 2. build ---------------------------------------------------------------
if "%SKIPBUILD%"=="0" (
  echo  [1/3] Building...
  call npm run build
  if errorlevel 1 (
    echo.
    echo  [X] Build failed. Fix the errors above, then run host.cmd again.
    pause
    exit /b 1
  )
) else (
  echo  [1/3] Skipping build ^(using existing dist\^).
)

REM --- 3. local server --------------------------------------------------------
echo.
echo  [2/3] Starting local server on port %PORT%...
start "DND Manager - local server" cmd /k "cd /d ""%~dp0"" && npm run preview -- --port %PORT%"

REM give the preview server time to bind before cloudflared connects
set /a waited=0
:waitlocal
timeout /t 1 /nobreak >nul
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:%PORT%' -UseBasicParsing -TimeoutSec 3; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 goto localready
set /a waited+=1
if !waited! GEQ 30 goto localfail
goto waitlocal

:localready
echo        Local server is up ^(http://localhost:%PORT%^).
goto startunnel

:localfail
echo  [X] Local server did not start within 30s.
echo      Check the "DND Manager - local server" window for errors.
pause
exit /b 1

REM --- 4. tunnel in background, capture the URL --------------------------------
:startunnel
echo.
echo  [3/3] Opening public tunnel - this takes about 10 seconds...
del /q "%LOG%" 2>nul
start "DND Manager - tunnel" /b cmd /c ""%CF%" tunnel --url http://localhost:%PORT% --no-autoupdate > "%LOG%" 2>&1"

set /a tries=0
:waiturl
set "URL="
for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "$m=[regex]::Match((Get-Content '%LOG%' -Raw -ErrorAction SilentlyContinue),'https://[a-zA-Z0-9-]+\.trycloudflare\.com'); if($m.Success){$m.Value}" 2^>nul`) do set "URL=%%a"
if defined URL goto goturl
timeout /t 1 /nobreak >nul
set /a tries+=1
if !tries! GEQ 60 goto failurl
goto waiturl

:goturl
REM A registered tunnel is not a working tunnel: on wifi that blocks TCP 7844,
REM cloudflared is forced onto QUIC/UDP and can take a minute of failed dials
REM before it settles. Advertising the link at that point hands people a URL
REM that answers 502. So prove the link serves the app first.
echo        Waiting for the tunnel to answer...
set /a vtry=0
set /a okstreak=0
:verifyurl
timeout /t 3 /nobreak >nul
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri '%URL%' -UseBasicParsing -TimeoutSec 10; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  set /a okstreak=0
  set /a vtry+=1
  if !vtry! GEQ 30 goto flapping
  goto verifyurl
)
set /a okstreak+=1
if !okstreak! GEQ 2 goto linkgood
set /a vtry+=1
if !vtry! GEQ 30 goto flapping
goto verifyurl

:linkgood
echo        Tunnel is up and serving the app.
> "%LINKFILE%" echo %URL%
powershell -NoProfile -Command "Set-Clipboard -Value '%URL%'" 2>nul

echo.
echo  ====================================================================
echo.
echo     SHARE THIS LINK WITH YOUR TABLE:
echo.
echo       %URL%
echo.
echo     It has been copied to your clipboard.
echo     It is also saved in: share-link.txt
echo.
echo     They should hard-refresh with Ctrl+Shift+R.
echo     The link changes every run, so send the fresh one each time.
echo.
echo  ====================================================================
echo.
echo  Keep this window open. Press Ctrl+C to stop.
echo.

REM keep the window alive so the tunnel stays up
:tail
timeout /t 5 /nobreak >nul
tasklist /fi "imagename eq cloudflared.exe" | find /i "cloudflared.exe" >nul
if errorlevel 1 goto tunnelgone
goto tail

:tunnelgone
echo.
echo  Tunnel process ended. Site is offline.
echo.
endlocal

:flapping
echo.
echo  [X] Got a URL but it never served the app:
echo      %URL%
echo.
echo      The tunnel registered but could not carry traffic. That is usually
echo      a blocked or unstable UDP/QUIC path on the current network.
echo.
echo      Try one of these, in order:
echo        1. Use a different network - phone hotspot is the most reliable.
echo        2. Restart the router, then run host.cmd again.
echo        3. Turn off any VPN / proxy that filters UDP 7844.
echo.
echo      Nothing was shared or copied, so no broken link went out.
echo.
pause
exit /b 1

:failurl
echo  [X] Could not read a tunnel URL after 60 seconds.
echo      Scroll up in this window and look for cloudflared errors.
echo      Common cause: the "%CF%" binary was removed or blocked.
echo.
pause
exit /b 1