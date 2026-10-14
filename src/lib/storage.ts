import { APP_ID, ABILITY_KEYS, SCHEMA_VERSION } from '../types/character';
import type {
  AbilityKey,
  Character,
  CharacterFile,
  CharacterFileInput,
  CoinPurse,
  InventoryItem,
  SpellKey,
} from '../types/character';
import { isAccent } from './theme';
import { asiIncreases } from './rules/asi';

/**
 * Persistence for characters.
 *
 * Storage is deliberately small and self-contained: `localStorage` holds a
 * single namespaced key holding a list of characters, and export/import writes
 * a `CharacterFile` envelope to a downloadable `.json` file.
 *
 * Everything here is defensive. A browser quota error, a hand-edited file, or a
 * character saved by an older build must never throw into a React render; the
 * functions here return result objects instead of raising.
 */

const STORAGE_KEY = `${APP_ID}.characters.v${SCHEMA_VERSION}`;

/** Default empty coin purse for back-compat with characters saved before coins existed. */
const DEFAULT_COINS: CoinPurse = { cp: 0, sp: 0, gp: 0 };

/**
 * Coerces a stored `inventory` value into a clean `InventoryItem[]`.
 *
 * Characters saved before the inventory feature have no `inventory` key at
 * all, and an imported file may hold anything, so every entry is checked:
 * entries without a string `itemId` are dropped, quantities fall back to 1 and
 * are rounded to a positive integer, flags become booleans, and duplicate ids
 * are merged (summing quantity) so row keys stay unique. Never throws.
 */
function normalizeInventory(value: unknown): InventoryItem[] {
  if (!Array.isArray(value)) return [];
  const merged = new Map<string, InventoryItem>();
  for (const raw of value) {
    if (typeof raw !== 'object' || raw === null) continue;
    const item = raw as Partial<InventoryItem>;
    if (typeof item.itemId !== 'string' || item.itemId === '') continue;
    const quantity =
      typeof item.quantity === 'number' && Number.isFinite(item.quantity) && item.quantity >= 1
        ? Math.round(item.quantity)
        : 1;
    const existing = merged.get(item.itemId);
    if (existing) {
      existing.quantity += quantity;
      continue;
    }
    merged.set(item.itemId, {
      itemId: item.itemId,
      quantity,
      equipped: item.equipped === true,
      attuned: item.attuned === true,
      ...(typeof item.chargesUsed === 'number' &&
      Number.isFinite(item.chargesUsed) &&
      item.chargesUsed >= 0
        ? { chargesUsed: Math.round(item.chargesUsed) }
        : {}),
    });
  }
  return Array.from(merged.values());
}

/**
 * Normalizes lineage-granted spells (spell level -> spell keys), dropping any
 * non-numeric level bucket or non-string entry rather than trusting a stale
 * save or a hand-edited import. Duplicate keys within a level are collapsed so
 * re-saving cannot inflate the sheet's spell list. Never throws.
 */
function normalizeLineageSpellIds(value: unknown): Record<number, SpellKey[]> {
  if (typeof value !== 'object' || value === null) return {};
  const out: Record<number, SpellKey[]> = {};
  for (const [rawLevel, rawIds] of Object.entries(value as Record<string, unknown>)) {
    const level = Number(rawLevel);
    if (!Number.isInteger(level) || level < 0 || level > 9) continue;
    if (!Array.isArray(rawIds)) continue;
    const ids: SpellKey[] = [];
    for (const raw of rawIds) {
      if (typeof raw !== 'string' || raw === '') continue;
      if (!ids.includes(raw as SpellKey)) ids.push(raw as SpellKey);
    }
    if (ids.length > 0) out[level] = ids;
  }
  return out;
}

/**
 * True when `value` is one of the six ability keys. Used to validate the
 * lineage spellcasting ability on read, so a stale or hand-edited save cannot
 * put an illegal ability on the sheet.
 */
function isAbilityKey(value: unknown): value is AbilityKey {
  return typeof value === 'string' && ABILITY_KEYS.includes(value as AbilityKey);
}

/**
 * Removes choices and picks that can no longer be valid for a character.
 *
 * Deliberately conservative: it only drops data it can positively prove stale,
 * because a wrongly removed pick silently loses a player's decision.
 *
 * Rules:
 *  1. A class-scoped choice whose owning class entry no longer exists is stale.
 *  2. A `backgroundTools` choice with no picks is a legacy unresolved stub.
 *  3. An individual pick with no option id carries no decision.
 *  4. A choice emptied by the above has its `resolved` flag recomputed.
 *
 * Idempotent: running it over its own output changes nothing.
 */
export function pruneCharacterPicks(character: Character): Character {
  if (!Array.isArray(character.choices)) return character;

  const classEntryIds = new Set(character.classes.map((entry) => entry.id));
  let changed = false;

  const choices = character.choices
    .filter((choice) => {
      if (choice.classEntryId && !classEntryIds.has(choice.classEntryId)) {
        changed = true;
        return false;
      }
      if (choice.kind === 'backgroundTools' && choice.picks.length === 0) {
        changed = true;
        return false;
      }
      return true;
    })
    .map((choice) => {
      const picks = choice.picks.filter((pick) => pick.optionId.trim().length > 0);
      if (picks.length === choice.picks.length) return choice;
      changed = true;
      const resolved = choice.count > 0 ? picks.length >= choice.count : picks.length > 0;
      return { ...choice, picks, resolved };
    });

  return changed ? { ...character, choices } : character;
}

/**
 * Normalizes a character loaded from storage, ensuring all optional fields
 * introduced after the initial schema have safe defaults. This is the single
 * migration path — call it once after parsing so the rest of the app never
 * sees `undefined` for these fields.
 */
export function normalizeCharacter(c: Character): Character {
  const coins: CoinPurse = c.coins ?? DEFAULT_COINS;
  const inventory = normalizeInventory(c.inventory);
  // Per-character accent override. Absent means "follow the app-wide accent",
  // so `null` is the correct normalized value for an unaccented character. An
  // id this build has no CSS block for (stale save, hand-edited file, or a
  // spelling mistake) is dropped rather than trusted, otherwise the sheet
  // would emit a `data-character-accent` that tints nothing.
  const accent = isAccent(c.accent) ? c.accent : null;
  const background = {
    ...c.background,
    startingEquipmentOptionId: c.background.startingEquipmentOptionId,
  };
  const classes = c.classes.map((entry) => ({
    ...entry,
    startingEquipmentOptionId: entry.startingEquipmentOptionId,
  }));
  // Lineage spells: absent for pre-lineage saves, so default to `{}` rather than
  // leaving `undefined` for the sheet and the level-up hook to each guard.
  const lineageSpellIds = normalizeLineageSpellIds(c.lineageSpellIds);
  // Lineage casting ability: `null` means "never chose", which is also what a
  // character saved before this field existed normalizes to. A stale or
  // hand-edited value is dropped rather than trusted, the same way a bad accent
  // id is dropped, so the sheet never renders an ability the game rules forbid.
  const lineageSpellcastingAbility = isAbilityKey(c.lineageSpellcastingAbility)
    ? c.lineageSpellcastingAbility
    : null;

  // ----------------------------------------------------------------
  // SCHEMA_VERSION 2 migration: un-bake ASI from abilityScoreBase.
  // ----------------------------------------------------------------
  // Old saves (schemaVersion < 2) baked ASI increases directly into
  // abilityScoreBase (capped at 20). The choice log (character.choices)
  // still contains the original picks with abilityIncreases.
  // We now derive ASI from the log at read time, so we must subtract
  // the logged ASI from the stored base to avoid double-counting.
  //
  // This migration is IDEMPOTENT: it only runs when schemaVersion < 2,
  // and bumps schemaVersion to 2 so it never runs again.
  //
  // NOTE: Characters whose base was clamped at 20 by the old bake
  // lose the ability to recover their true pre-increase raw value.
  // That is ACCEPTED and expected — the true raw is irretrievable.
  let abilityScoreBase = { ...c.abilityScoreBase };
  if ((c.schemaVersion ?? 1) < 2) {
    const asiBonuses = asiIncreases(c.choices);
    for (const [ability, increase] of Object.entries(asiBonuses)) {
      const key = ability as AbilityKey;
      // Subtract the logged ASI, floor at 1 per clampAbilityScore convention.
      abilityScoreBase[key] = Math.max(1, abilityScoreBase[key] - increase);
    }
  }

  return pruneCharacterPicks({
    ...c,
    schemaVersion: Math.max(c.schemaVersion ?? 1, 2),
    coins,
    inventory,
    accent,
    background,
    classes,
    lineageSpellIds,
    lineageSpellcastingAbility,
    abilityScoreBase,
  });
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

export interface StorageResult<T> {
  ok: boolean;
  value: T;
  error?: string;
}

function isCharacter(value: unknown): value is Character {
  if (typeof value !== 'object' || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.level === 'number' &&
    typeof c.species === 'object' &&
    c.species !== null &&
    typeof (c.species as Record<string, unknown>).speciesId === 'string' &&
    typeof c.background === 'object' &&
    c.background !== null &&
    typeof (c.background as Record<string, unknown>).backgroundId === 'string' &&
    Array.isArray(c.classes) &&
    Array.isArray(c.choices) &&
    typeof c.abilityScoreBase === 'object' &&
    c.abilityScoreBase !== null
  );
}

export function loadCharacters(): StorageResult<Character[]> {
  const store = safeStorage();
  if (!store) {
    return { ok: false, value: [], error: 'Local storage is unavailable in this browser context.' };
  }
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return { ok: true, value: [] };
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { ok: false, value: [], error: 'Stored character data was not a list.' };
    }
    // Silently drop corrupt entries rather than losing the whole library.
    const characters = parsed.filter(isCharacter).map(normalizeCharacter);
    if (characters.length !== parsed.length) {
      return {
        ok: false,
        value: characters,
        error: `${parsed.length - characters.length} saved character(s) were unreadable and were skipped.`,
      };
    }
    return { ok: true, value: characters };
  } catch (error) {
    return {
      ok: false,
      value: [],
      error: `Could not read saved characters: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export function saveCharacters(characters: Character[]): StorageResult<Character[]> {
  const store = safeStorage();
  if (!store) {
    return { ok: false, value: characters, error: 'Local storage is unavailable; changes will not persist.' };
  }
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(characters));
    return { ok: true, value: characters };
  } catch (error) {
    const quota = error instanceof DOMException && error.name === 'QuotaExceededError';
    return {
      ok: false,
      value: characters,
      error: quota
        ? 'Local storage is full. Export your characters to a file and delete some to free space.'
        : `Could not save characters: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export function upsertCharacter(character: Character): StorageResult<Character[]> {
  const { value, error } = loadCharacters();
  const index = value.findIndex((c) => c.id === character.id);
  const next = index >= 0
    ? value.map((c) => (c.id === character.id ? character : c))
    : [...value, character];
  const result = saveCharacters(next);
  return { ...result, error: result.error ?? error };
}

export function deleteCharacter(id: string): StorageResult<Character[]> {
  const { value, error } = loadCharacters();
  const next = value.filter((c) => c.id !== id);
  const result = saveCharacters(next);
  return { ...result, error: result.error ?? error };
}

/** Stable id without pulling in a uuid dependency or needing crypto.randomUUID. */
export function createId(prefix = 'char'): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}

// ---------------------------------------------------------------------------
// Export / import
// ---------------------------------------------------------------------------

export function buildExportFile(character: Character): CharacterFile {
  return {
    kind: APP_ID,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    character,
  };
}

export function toExportJson(character: Character): string {
  return JSON.stringify(buildExportFile(character), null, 2);
}

export function downloadCharacter(character: Character): void {
  const json = toExportJson(character);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeName = character.meta.name.trim().replace(/[^\w\-]+/g, '_') || 'character';
  anchor.href = url;
  anchor.download = `${safeName}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  ok: boolean;
  character?: Character;
  error?: string;
}

/**
 * Accepts either a full export envelope or a bare character object, so a
 * hand-edited file is still usable. Rejects anything that cannot be read.
 */
export function parseImport(text: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    return {
      ok: false,
      error: `That file is not valid JSON: ${error instanceof Error ? error.message : 'parse error'}`,
    };
  }

  const candidate = parsed as CharacterFileInput;
  const body =
    isCharacter(candidate) ? candidate : isCharacter(candidate?.character) ? candidate.character : null;

  if (!body) {
    return { ok: false, error: 'That file does not contain a readable character.' };
  }

  const version = typeof candidate?.schemaVersion === 'number' ? candidate.schemaVersion : SCHEMA_VERSION;
  if (version > SCHEMA_VERSION) {
    return {
      ok: false,
      error: `That character was saved by a newer version (v${version}) and may not open here.`,
    };
  }

  return { ok: true, character: normalizeCharacter(body) };
}

export async function importFromFile(file: File): Promise<ImportResult> {
  try {
    return parseImport(await file.text());
  } catch (error) {
    return {
      ok: false,
      error: `Could not read that file: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}
