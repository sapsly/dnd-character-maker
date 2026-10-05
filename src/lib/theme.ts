import { APP_ID } from '../types/character';

/**
 * Accent colour preference — the one hue the player gets to change.
 *
 * The accent is expressed purely as CSS custom-property overrides keyed off
 * `<html data-accent="…">` (see `styles/theme.css`), so a single attribute on
 * a stable ancestor reaches every route, portal and sticky header. This module
 * owns reading, applying and persisting that attribute, and it is the only
 * place in the app that writes `data-accent` to `document`. Storing a data
 * attribute instead of inline styles keeps the hex values in CSS, where they
 * can cascade — one declaration recolours the whole UI.
 *
 * Every `localStorage` access is guarded the way `lib/density.ts` guards its
 * own: private mode, sandboxed iframes and quota errors must never throw into
 * a render. When storage is unavailable the choice still applies for the
 * session, it simply is not remembered. Stored values are validated against
 * `ACCENTS`, so stale or corrupt data falls back to the default rather than
 * leaving `data-accent` pointing at a block that does not exist.
 *
 * Call `initAccent()` once before the first render (top of `main.tsx`) so the
 * stored accent is applied before paint on reload. `AccentPicker` applies the
 * value again from a layout effect, so a missed call still cannot flash the
 * default gold.
 */

export type Accent =
  | 'gold'
  | 'amethyst'
  | 'crimson'
  | 'emerald'
  | 'azure'
  | 'rose'
  | 'copper'
  | 'verdigris';

export interface AccentOption {
  readonly value: Accent;
  /** Human label — this is what the picker names each swatch for screen readers. */
  readonly label: string;
}

/**
 * Picker order: warm to cool roughly left to right. Hex values live only in
 * `styles/theme.css` (one `[data-accent]` block per entry), so this list is
 * just ids and labels — the swatches preview their colour by carrying the
 * attribute locally, which keeps every hex in a single source of truth.
 */
export const ACCENTS: readonly AccentOption[] = [
  { value: 'gold', label: 'Gold' },
  { value: 'amethyst', label: 'Amethyst' },
  { value: 'crimson', label: 'Crimson' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'azure', label: 'Azure' },
  { value: 'rose', label: 'Rose' },
  { value: 'copper', label: 'Copper' },
  { value: 'verdigris', label: 'Verdigris' },
];

/**
 * `gold` reproduces the `:root` trio in `global.css` byte-for-byte, so the
 * app looks unchanged on first load — nothing here re-tunes the baseline.
 */
export const DEFAULT_ACCENT: Accent = 'gold';

/** The ancestor attribute every accent selector hangs off. */
const ATTRIBUTE = 'data-accent';

const STORAGE_KEY = `${APP_ID}.accent.v1`;

/** String membership check derived from ACCENTS, so the list stays the source of truth. */
const ACCENT_VALUES: ReadonlySet<string> = new Set(ACCENTS.map((option) => option.value));

/**
 * Narrows an unknown value to a known accent id.
 *
 * Exported so the character sheet and `lib/storage` can validate a *stored*
 * per-character accent against the same list the CSS blocks are written for,
 * instead of each re-declaring the eight ids.
 */
export function isAccent(value: unknown): value is Accent {
  return typeof value === 'string' && ACCENT_VALUES.has(value);
}

/** localStorage can throw in private mode, sandboxed iframes, or when over quota. */
function safeStorage(): Storage | null {
  try {
    const probe = `${APP_ID}.__accentProbe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

/** The remembered choice. Returns `gold` when storage is blocked or the stored value is unreadable. */
export function loadAccent(): Accent {
  const store = safeStorage();
  if (!store) return DEFAULT_ACCENT;
  try {
    const stored = store.getItem(STORAGE_KEY);
    return isAccent(stored) ? stored : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

/** Accent currently applied to `<html>`; falls back to the remembered choice. */
export function getAccent(): Accent {
  const applied = document.documentElement.getAttribute(ATTRIBUTE);
  return isAccent(applied) ? applied : loadAccent();
}

/** The one write to `document`: sets the attribute. Storage-neutral on purpose. */
export function applyAccent(accent: Accent): void {
  document.documentElement.setAttribute(ATTRIBUTE, accent);
}

/** Applies the accent and remembers it. Never throws. */
export function setAccent(accent: Accent): void {
  applyAccent(accent);
  const store = safeStorage();
  // Storage blocked: the attribute is already applied, so the session keeps the
  // choice — it just will not survive a reload.
  if (!store) return;
  try {
    store.setItem(STORAGE_KEY, accent);
  } catch {
    // Quota exceeded or a racing write; same session-only outcome as above.
  }
}

/** Reads and applies the stored accent. Call once before the first render. */
export function initAccent(): Accent {
  const accent = loadAccent();
  applyAccent(accent);
  return accent;
}

/* ==========================================================================
   Colour mode — light / dark / system
   ==========================================================================

   Same shape as the accent and density models above: one attribute on
   `<html>` (`data-theme`) carries the *resolved* scheme into CSS, while the
   three-way *preference* — including `system` — is what gets persisted. That
   split is the whole design:

   - `data-theme` only ever holds `light` or `dark`, so the selectors in
     `styles/mode.css` and `styles/global.css` stay trivially greppable and
     CSS never has to evaluate `prefers-color-scheme` itself.
   - `system` is resolved by JS, which is also what makes it react live: a
     single `matchMedia` listener re-resolves and re-writes the attribute
     when the OS flips, with no reload and no React render.

   The pre-paint path is `index.html`, not a React effect. Its inline script
   reads this same storage key, resolves `system` against `matchMedia` and
   sets `data-theme` before the first byte of the body is parsed, so a
   remembered mode is already correct when the CSS first lays out. This
   module repeats the work at start-up rather than trusting it — the script
   can be stripped by an extension, storage can change between parse and
   boot — and `ThemeModePicker` applies again from a layout effect, so a
   missed call still cannot flash the wrong palette.

   `initThemeMode()` must be called before the first render (top of
   `main.tsx`), alongside `initDensity()` and `initAccent()`.
   */

export type ThemeMode = 'light' | 'dark' | 'system';

/** The two schemes that can actually reach CSS — `system` is resolved first. */
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeModeOption {
  readonly value: ThemeMode;
  /** Human label — this is what the picker names each segment for screen readers. */
  readonly label: string;
}

/** Picker order: the two fixed schemes first, "follow the OS" last. */
export const THEME_MODES: readonly ThemeModeOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

/**
 * `dark`, not `system`: `:root` in `global.css` *is* the dark palette, so a
 * visitor who has never touched the picker keeps the exact app they have
 * today on every OS. Nothing changes until someone asks it to.
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'dark';

/** The ancestor attribute the colour-mode selectors hang off. */
const THEME_ATTRIBUTE = 'data-theme';

const THEME_STORAGE_KEY = `${APP_ID}.theme.v1`;

const DARK_SCHEME = '(prefers-color-scheme: dark)';

/** Membership check derived from THEME_MODES, so the list stays the source of truth. */
const THEME_MODE_VALUES: ReadonlySet<string> = new Set(THEME_MODES.map((option) => option.value));

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && THEME_MODE_VALUES.has(value);
}

function isResolvedTheme(value: unknown): value is ResolvedTheme {
  return value === 'light' || value === 'dark';
}

/**
 * `true` when the OS asks for dark. Without `matchMedia` — an ancient
 * browser, or a sandboxed context that strips it — we answer `dark`, which
 * is the app default, rather than guessing light and inverting the page.
 */
function prefersDark(): boolean {
  try {
    if (typeof window.matchMedia !== 'function') return true;
    return window.matchMedia(DARK_SCHEME).matches;
  } catch {
    return true;
  }
}

/** Folds `system` down to a scheme the CSS can select on. Never throws. */
export function resolveThemeMode(mode: ThemeMode): ResolvedTheme {
  if (mode !== 'system') return mode;
  return prefersDark() ? 'dark' : 'light';
}

/** The resolved scheme currently on `<html>`, or `null` if none/invalid. */
export function getAppliedTheme(): ResolvedTheme | null {
  const applied = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isResolvedTheme(applied) ? applied : null;
}

/** The one write to `document` for colour mode: sets the attribute. */
export function applyTheme(resolved: ResolvedTheme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, resolved);
}

/** The remembered preference. Returns the default when storage is blocked or unreadable. */
export function loadThemeMode(): ThemeMode {
  const store = safeStorage();
  if (!store) return DEFAULT_THEME_MODE;
  try {
    const stored = store.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : DEFAULT_THEME_MODE;
  } catch {
    return DEFAULT_THEME_MODE;
  }
}

/** Last mode applied this session — survives storage being blocked. */
let activeMode: ThemeMode | null = null;

/**
 * Mode the picker should show. `data-theme` only ever holds a resolved
 * scheme, so `system` cannot be read back off the DOM — it lives in storage,
 * or in `activeMode` when storage is unavailable and the session still has a
 * choice to honour.
 */
export function getThemeMode(): ThemeMode {
  if (activeMode !== null) return activeMode;
  return loadThemeMode();
}

/* --- Live `system` tracking ------------------------------------------------
   One module-level listener, started only while the mode is `system` and
   torn down the moment it is not, so following the OS costs nothing when the
   user has picked a fixed scheme. Idempotent: `applyThemeMode` may run twice
   under StrictMode without stacking listeners.
   -------------------------------------------------------------------------- */

let schemeQuery: MediaQueryList | null = null;
let schemeListener: (() => void) | null = null;

function stopSchemeWatcher(): void {
  const query = schemeQuery;
  const listener = schemeListener;
  schemeQuery = null;
  schemeListener = null;
  if (!query || !listener) return;
  if (typeof query.removeEventListener === 'function') {
    query.removeEventListener('change', listener);
  } else {
    query.addListener(listener);
  }
}

function startSchemeWatcher(): void {
  if (schemeQuery) return;
  if (typeof window.matchMedia !== 'function') return;
  const query = window.matchMedia(DARK_SCHEME);
  const listener = () => {
    // Re-resolve only while the user is actually following the OS; a fixed
    // scheme keeps its own listener torn down and never gets here.
    if (activeMode === 'system') applyTheme(resolveThemeMode('system'));
  };
  schemeQuery = query;
  schemeListener = listener;
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', listener);
  } else {
    query.addListener(listener);
  }
}

/**
 * Resolves a mode and writes it to `<html>`. Idempotent, never throws, and
 * safe to call from a layout effect — it is what keeps a controlled picker
 * and the document in step before paint.
 */
export function applyThemeMode(mode: ThemeMode): void {
  activeMode = mode;
  applyTheme(resolveThemeMode(mode));
  if (mode === 'system') startSchemeWatcher();
  else stopSchemeWatcher();
}

/** Applies the mode and remembers it. Never throws. */
export function setThemeMode(mode: ThemeMode): void {
  applyThemeMode(mode);
  const store = safeStorage();
  // Storage blocked: the attribute is already applied, so the session keeps
  // the choice — it just will not survive a reload.
  if (!store) return;
  try {
    store.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Quota exceeded or a racing write; same session-only outcome as above.
  }
}

/** Reads and applies the stored mode. Call once before the first render. */
export function initThemeMode(): ThemeMode {
  const mode = loadThemeMode();
  applyThemeMode(mode);
  return mode;
}
