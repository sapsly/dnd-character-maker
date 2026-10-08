import type { SpellDef } from '../types/character';

import { SPELL_CANTRIPS } from './spells-cantrips';
import { SPELLS_L1 } from './spells-l1';
import { SPELLS_L2 } from './spells-l2';
import { SPELLS_L3 } from './spells-l3';
import { SPELLS_L4 } from './spells-l4';
import { SPELLS_L5 } from './spells-l5';
import { SPELLS_L6 } from './spells-l6';
import { SPELLS_L7 } from './spells-l7';
import { SPELLS_L8 } from './spells-l8';
import { SPELLS_L9 } from './spells-l9';

export {
  SPELL_CANTRIPS,
  SPELLS_L1,
  SPELLS_L2,
  SPELLS_L3,
  SPELLS_L4,
  SPELLS_L5,
  SPELLS_L6,
  SPELLS_L7,
  SPELLS_L8,
  SPELLS_L9,
};

/**
 * Complete SRD 5.2 spell catalog (all levels 0-9).
 * Aggregated from per-level modules.
 */
export const SPELLS: SpellDef[] = [
  ...SPELL_CANTRIPS,
  ...SPELLS_L1,
  ...SPELLS_L2,
  ...SPELLS_L3,
  ...SPELLS_L4,
  ...SPELLS_L5,
  ...SPELLS_L6,
  ...SPELLS_L7,
  ...SPELLS_L8,
  ...SPELLS_L9,
].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

/** The highest spell level present in the catalog. */
export const MAX_SPELL_LEVEL = 9;

const BY_ID: Record<string, SpellDef> = Object.fromEntries(SPELLS.map((s) => [s.id, s]));

export function getSpell(id: string): SpellDef | null {
  return BY_ID[id] ?? null;
}

/** Spells of one level, ordered by name. Cantrips are level 0. */
export function spellsAtLevel(level: number): SpellDef[] {
  return SPELLS.filter((s) => s.level === level);
}

/** Spells on a class's list, ordered by level then name. */
export function spellsForClass(classId: string): SpellDef[] {
  return SPELLS.filter((s) => s.classes.includes(classId));
}
