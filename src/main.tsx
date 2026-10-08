import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import './styles/global.css'
import './styles/app.css'
import './styles/ui.css'
import './styles/roster.css'
import './styles/sheet.css'
import './styles/levelup.css'
import './styles/create.css'
// After create.css so the compendium's detail-pane overrides (its accent rail,
// stat rows and feature blocks) win against the shared panel rules it borrows.
import './styles/compendium.css'
import './styles/density.css'
import './styles/theme.css'
// Last on purpose: light mode has to win the cascade against the accent
// blocks in theme.css, so it is imported after them.
import './styles/mode.css'
// After the mode tokens, before print: per-character accent blocks belong to
// the token layer, and they must lose to print.css's paper palette.
import './styles/tint.css'
// Skins beat every on-screen layer (mode.css, theme.css, density.css and the
// component sheets) but must lose to print.css: both are (0,2,0) token blocks
// and only source order decides, so a dark skin's ink would otherwise print
// light-on-white. Rule for new imports: skins go here, never after print.
import './styles/skins.css'
// Last of all: print.css re-points the token ladder at its own paper palette
// and overrides the responsive sheet layout, so it has to win the tie against
// mode.css, theme.css and sheet.css. Every rule it contains is scoped to
// `@media print`, so the on-screen render is unaffected.
import './styles/print.css'
import { initDensity } from './lib/density'
import { initAccent, initThemeMode } from './lib/theme'
import { initSkin } from './lib/skin'
import App from './App'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container #root was not found in the document.')
}

// Applied before the first render so a remembered density never flashes.
initDensity()

// Same for the accent: the remembered hue is on <html> before the first paint.
initAccent()

// And the colour mode. index.html has already set data-theme pre-paint; this
// re-asserts it (the inline script can be stripped) and, when the stored
// choice is `system`, starts the matchMedia listener that follows the OS.
initThemeMode()

// And the skin. index.html has already set data-skin pre-paint; this
// re-asserts it (the inline script can be stripped) so a stored skin never
// flashes the default classic on reload.
initSkin()

createRoot(container).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
