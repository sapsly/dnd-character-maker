// Post-build: restore the SPA fallback files that Vite's build clears out.
//
// The app uses BrowserRouter, so a host that serves `dist/` statically will 404
// on any path other than `/` unless it rewrites unknown paths to index.html.
// Two mechanisms are needed, because no single host config covers everyone:
//   - `_redirects`      Netlify / Cloudflare Pages
//   - `404.html`        plain static hosts (GitHub Pages, S3, most others)
//
// 404.html is a copy of index.html, so the pre-paint theme script in <head>
// survives and a deep link still boots the app without a light/dark flash.
//
// Run automatically by `npm run build`. Idempotent; safe to re-run.

import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const index = join(dist, 'index.html');

if (!existsSync(index)) {
  console.error('postbuild: dist/index.html not found — did the build fail?');
  process.exit(1);
}

copyFileSync(index, join(dist, '404.html'));

// A trailing newline keeps the file POSIX-friendly. No BOM: some hosts serve it
// verbatim and a BOM breaks the first directive.
writeFileSync(join(dist, '_redirects'), '/*  /index.html  200\n', 'utf8');

console.log('postbuild: wrote dist/404.html and dist/_redirects');