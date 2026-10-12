import type { SourceKey } from '../../types/character';

/** All available source books, core first. */
export const ALL_SOURCES: SourceKey[] = [
  'core',
  'eberron',
  'faerun',
  'ravenloft',
  'lorwyn',
  'exotic',
  'arcana-unleashed',
];

/** Display labels for each source book. */
export const SOURCE_LABELS: Record<SourceKey, string> = {
  core: "Player\u2019s Handbook (Core)",
  eberron: 'Eberron',
  faerun: 'Faer\u00fbn',
  ravenloft: 'Ravenloft',
  lorwyn: 'Lorwyn',
  exotic: 'Exotic',
  'arcana-unleashed': 'Arcana Unleashed',
};

/**
 * Returns the source book for a definition.
 * Definitions without an explicit source are treated as 'core'.
 * Legacy feat source values ('general', 'origin', 'species', 'item') are also mapped to 'core'.
 */
export function entrySource(def: { source?: string } | null | undefined): SourceKey {
  const s = def?.source;
  if (s && ALL_SOURCES.includes(s as SourceKey)) return s as SourceKey;
  return 'core';
}

/**
 * Maps a BackgroundDef/StartingEquipmentDef source string to a SourceKey.
 * - 'srd' | 'phb' | undefined | missing -> 'core'
 * - 'eberron' | 'faerun' | 'ravenloft' | 'arcana-unleashed' | 'exotic' -> same
 * - anything unknown -> 'core'
 */
export function backgroundSourceKey(source: string | undefined): SourceKey {
  if (!source) return 'core';
  switch (source) {
    case 'srd':
    case 'phb':
      return 'core';
    case 'eberron':
    case 'faerun':
    case 'ravenloft':
    case 'arcana-unleashed':
    case 'exotic':
      return source;
    default:
      return 'core';
  }
}

/**
 * Returns the set of enabled source books for a character.
 * Missing or empty array -> all sources enabled (backward compatibility).
 * Unknown strings in the array are dropped defensively.
 */
export function enabledSources(character: { sources?: SourceKey[] }): Set<SourceKey> {
  const src = character.sources;
  if (!src || src.length === 0) {
    return new Set(ALL_SOURCES);
  }
  const set = new Set<SourceKey>();
  for (const s of src) {
    if (ALL_SOURCES.includes(s)) {
      set.add(s);
    }
  }
  return set;
}

/** Checks if a specific source book is enabled for a character. */
export function isSourceEnabled(character: { sources?: SourceKey[] }, key: SourceKey): boolean {
  return enabledSources(character).has(key);
}

/**
 * Convenience: checks if a definition's source book is enabled for a character.
 * Uses the definition's `source` field (defaulting to 'core') unless an explicit
 * `key` override is provided.
 * Accepts legacy feat source values ('general', 'origin', 'species', 'item') which map to 'core'.
 */
export function isEntryAllowed(
  character: { sources?: SourceKey[] },
  def: { source?: SourceKey | 'general' | 'origin' | 'species' | 'item' } | null,
  key?: SourceKey
): boolean {
  return enabledSources(character).has(key ?? entrySource(def));
}