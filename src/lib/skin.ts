import { APP_ID } from '../types/character';

/**
 * Skin preference — the visual style family for the whole app.
 *
 * A skin is expressed purely as CSS custom-property overrides keyed off
 * `<html data-skin="…">` (see `styles/skins.css`), so a single attribute on
 * a stable ancestor reaches every route, portal and sticky header. This module
 * owns reading, applying and persisting that attribute, and it is the only
 * place in the app that writes `data-skin` to `document`. Storing a data
 * attribute instead of inline styles keeps the token values in CSS, where they
 * can cascade — one declaration re-themes the whole UI.
 *
 * Every `localStorage` access is guarded the way `lib/density.ts` guards its
 * own: private mode, sandboxed iframes and quota errors must never throw into
 * a render. When storage is unavailable the choice still applies for the
 * session, it simply is not remembered. Stored values are validated against
 * `SKINS`, so stale or corrupt data falls back to the default rather than
 * leaving `data-skin` pointing at a block that does not exist.
 *
 * Call `initSkin()` once before the first render (top of `main.tsx`) so the
 * stored skin is applied before paint on reload. `SkinPicker` applies the
 * value again from a layout effect, so a missed call still cannot flash the
 * default classic skin.
 */

export type Skin = 'classic' | 'playful' | 'brutalist' | 'cozy' | 'parchment';

export interface SkinOption {
  readonly value: Skin;
  /** Human label — this is what the picker names each segment for screen readers. */
  readonly label: string;
}

/**
 * Picker order: Classic first (the app default), then the four expressive styles.
 * Token values live only in `styles/skins.css` (one `[data-skin]` block per entry),
 * so this list is just ids and labels.
 */
export const SKINS: readonly SkinOption[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'playful', label: 'Playful' },
  { value: 'brutalist', label: 'Brutalist' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'parchment', label: 'Parchment' },
];

/**
 * `classic` reproduces the existing app exactly — the current token ladder in
 * `global.css` / `mode.css` / `theme.css` / `density.css` IS the classic skin,
 * so no override block is needed for it.
 */
export const DEFAULT_SKIN: Skin = 'classic';

/** The ancestor attribute every skin selector hangs off. */
const ATTRIBUTE = 'data-skin';

const STORAGE_KEY = `${APP_ID}.skin.v1`;

/** String membership check derived from SKINS, so the list stays the source of truth. */
const SKIN_VALUES: ReadonlySet<string> = new Set(SKINS.map((option) => option.value));

/**
 * Narrows an unknown value to a known skin id.
 *
 * Exported so other modules can validate a stored skin against the same list
 * the CSS blocks are written for, instead of each re-declaring the five ids.
 */
export function isSkin(value: unknown): value is Skin {
  return typeof value === 'string' && SKIN_VALUES.has(value);
}

/** localStorage can throw in private mode, sandboxed iframes, or when over quota. */
function safeStorage(): Storage | null {
  try {
    const probe = `${APP_ID}.__skinProbe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

/** The remembered choice. Returns `classic` when storage is blocked or the stored value is unreadable. */
export function loadSkin(): Skin {
  const store = safeStorage();
  if (!store) return DEFAULT_SKIN;
  try {
    const stored = store.getItem(STORAGE_KEY);
    return isSkin(stored) ? stored : DEFAULT_SKIN;
  } catch {
    return DEFAULT_SKIN;
  }
}

/** Skin currently applied to `<html>`; falls back to the remembered choice. */
export function getSkin(): Skin {
  const applied = document.documentElement.getAttribute(ATTRIBUTE);
  return isSkin(applied) ? applied : loadSkin();
}

/** The one write to `document`: sets the attribute. Storage-neutral on purpose. */
export function applySkin(skin: Skin): void {
  document.documentElement.setAttribute(ATTRIBUTE, skin);
}

/** Applies the skin and remembers it. Never throws. */
export function setSkin(skin: Skin): void {
  applySkin(skin);
  const store = safeStorage();
  // Storage blocked: the attribute is already applied, so the session keeps the
  // choice — it just will not survive a reload.
  if (!store) return;
  try {
    store.setItem(STORAGE_KEY, skin);
  } catch {
    // Quota exceeded or a racing write; same session-only outcome as above.
  }
}

/** Reads and applies the stored skin. Call once before the first render. */
export function initSkin(): Skin {
  const skin = loadSkin();
  applySkin(skin);
  return skin;
}