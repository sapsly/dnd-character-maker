import { APP_ID } from '../types/character';

/**
 * Density preference — compact / comfortable / spacious.
 *
 * Density is expressed purely as CSS custom-property overrides keyed off
 * `<html data-density="…">` (see `styles/density.css`), so a single attribute
 * on a stable ancestor reaches every route and portal. This module owns
 * reading, applying and persisting that attribute, and it is the only place in
 * the app that writes to `document`.
 *
 * Every `localStorage` access is guarded the way `lib/storage.ts` guards its
 * own: private mode, sandboxed iframes and quota errors must never throw into
 * a render. When storage is unavailable the choice still applies for the
 * session, it simply is not remembered.
 *
 * Call `initDensity()` once before the first render (top of `main.tsx`) so the
 * stored density is applied before paint on reload. `DensityToggle` applies the
 * value again from a layout effect, so a missed call still cannot flash the
 * wrong density.
 */

export type Density = 'compact' | 'comfortable' | 'spacious';

export interface DensityOption {
  readonly value: Density;
  /** Human label — this is what the toggle renders and what SRs read. */
  readonly label: string;
}

/**
 * Ordered densest-first, so a toggle can map over it directly and land
 * comfortable in the middle.
 */
export const DENSITIES: readonly DensityOption[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' },
];

/**
 * `comfortable` deliberately has no override block: it is the untouched
 * `:root` baseline in `global.css`, so the default renders pixel-identical to
 * the previous build.
 */
export const DEFAULT_DENSITY: Density = 'comfortable';

/** The ancestor attribute every density selector hangs off. */
const ATTRIBUTE = 'data-density';

const STORAGE_KEY = `${APP_ID}.density.v1`;

/** String membership check derived from DENSITIES, so the list stays the source of truth. */
const DENSITY_VALUES: ReadonlySet<string> = new Set(DENSITIES.map((option) => option.value));

function isDensity(value: unknown): value is Density {
  return typeof value === 'string' && DENSITY_VALUES.has(value);
}

/** localStorage can throw in private mode, sandboxed iframes, or when over quota. */
function safeStorage(): Storage | null {
  try {
    const probe = `${APP_ID}.__probe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

/** The remembered choice. Returns `comfortable` when storage is blocked or the stored value is unreadable. */
export function loadDensity(): Density {
  const store = safeStorage();
  if (!store) return DEFAULT_DENSITY;
  try {
    const stored = store.getItem(STORAGE_KEY);
    return isDensity(stored) ? stored : DEFAULT_DENSITY;
  } catch {
    return DEFAULT_DENSITY;
  }
}

/** Density currently applied to `<html>`; falls back to the remembered choice. */
export function getDensity(): Density {
  const applied = document.documentElement.getAttribute(ATTRIBUTE);
  return isDensity(applied) ? applied : loadDensity();
}

/** The one write to `document`: sets the attribute. Storage-neutral on purpose. */
export function applyDensity(density: Density): void {
  document.documentElement.setAttribute(ATTRIBUTE, density);
}

/** Applies the density and remembers it. Never throws. */
export function setDensity(density: Density): void {
  applyDensity(density);
  const store = safeStorage();
  // Storage blocked: the attribute is already applied, so the session keeps the
  // choice — it just will not survive a reload.
  if (!store) return;
  try {
    store.setItem(STORAGE_KEY, density);
  } catch {
    // Quota exceeded or a racing write; same session-only outcome as above.
  }
}

/** Reads and applies the stored choice. Call once before the first render. */
export function initDensity(): Density {
  const density = loadDensity();
  applyDensity(density);
  return density;
}
