/**
 * Multiclass spell slot calculation per 2024 PHB rules.
 *
 * Rules (SRD 5.2 / 2024 PHB Chapter 6):
 * - Full casters (Bard, Cleric, Druid, Sorcerer, Wizard): 1 level per class level
 * - Half casters (Paladin, Ranger): 1/2 level per class level (rounded down)
 * - Third casters (Eldritch Knight Fighter, Arcane Trickster Rogue): 1/3 level per class level (rounded down)
 * - Warlock Pact Magic: computed separately, NOT combined with the above
 * - The combined caster level indexes into the unified Multiclass Spellcaster table
 *   (which is identical to the full-caster slot table)
 */

import type { ClassDef } from '../../types/character';
import { getClass } from '../../data/classes';

/** Class IDs that are full casters (1:1 level contribution) */
export const FULL_CASTER_CLASS_IDS = new Set(['bard', 'cleric', 'druid', 'sorcerer', 'wizard']);

/** Class IDs that are half casters (1/2 level contribution, rounded down) */
export const HALF_CASTER_CLASS_IDS = new Set(['paladin', 'ranger']);

/** Subclass IDs that grant third-caster spellcasting (1/3 level contribution, rounded down) */
export const THIRD_CASTER_SUBCLASS_IDS = new Set(['eldritch-knight', 'arcane-trickster']);

/**
 * Check if a class entry contributes as a full caster for multiclass spell slots.
 */
export function isFullCaster(classId: string): boolean {
  return FULL_CASTER_CLASS_IDS.has(classId);
}

/**
 * Check if a class entry contributes as a half caster for multiclass spell slots.
 */
export function isHalfCaster(classId: string): boolean {
  return HALF_CASTER_CLASS_IDS.has(classId);
}

/**
 * Check if a class entry contributes as a third caster for multiclass spell slots.
 * Third casters are subclasses (Eldritch Knight, Arcane Trickster), not base classes.
 */
export function isThirdCaster(_classId: string, subclassId?: string): boolean {
  if (!subclassId) return false;
  return THIRD_CASTER_SUBCLASS_IDS.has(subclassId);
}

/**
 * Check if a class uses Pact Magic (Warlock) — slots are tracked separately.
 */
export function isPactMagic(classDef: ClassDef): boolean {
  return classDef.spellcasting?.pactMagic === true;
}

/**
 * Compute the combined multiclass caster level per 2024 rules.
 *
 * @param classes Array of character class entries (with classId, level, subclassId)
 * @returns Total effective caster level for the unified slot table
 */
export function computeMulticlassCasterLevel(classes: Array<{
  classId: string;
  level: number;
  subclassId?: string;
}>): number {
  let total = 0;

  for (const entry of classes) {
    const classDef = getClass(entry.classId);
    if (!classDef?.spellcasting) continue;

    // Warlock Pact Magic does not contribute to the combined table
    if (isPactMagic(classDef)) continue;

    if (isFullCaster(entry.classId)) {
      total += entry.level;
    } else if (isHalfCaster(entry.classId)) {
      total += Math.floor(entry.level / 2);
    } else if (isThirdCaster(entry.classId, entry.subclassId)) {
      total += Math.floor(entry.level / 3);
    }
    // Non-casting classes and subclasses without spellcasting contribute 0
  }

  return total;
}

/**
 * Get the unified multiclass spell slot table (identical to full-caster table).
 * Derived from the full-caster class slotTable data (all full casters share the same table).
 *
 * @param casterLevel Combined multiclass caster level (1-20+)
 * @returns Array of slot counts per spell level (index 0 = 1st level, etc.), or undefined if level not in table
 */
export function getMulticlassSlotTable(casterLevel: number): readonly number[] | undefined {
  // Use any full caster's slotTable as the reference (they're all identical)
  const referenceClass = getClass('cleric');
  if (!referenceClass?.spellcasting?.slotTable) return undefined;

  const slotTable = referenceClass.spellcasting.slotTable;
  return slotTable[casterLevel];
}

/**
 * Get Warlock Pact Magic slots for a given warlock level.
 * These are tracked separately from the combined multiclass table.
 */
export function getPactMagicSlots(warlockLevel: number): readonly number[] | undefined {
  const warlockClass = getClass('warlock');
  if (!warlockClass?.spellcasting?.slotTable) return undefined;

  const slotTable = warlockClass.spellcasting.slotTable;
  return slotTable[warlockLevel];
}

/**
 * Determine the Pact Magic slot level for a given warlock level per 2024 rules.
 * Warlock slot levels: 1st at 1-2, 2nd at 3-4, 3rd at 5-6, 4th at 7-8, 5th at 9+.
 */
function getPactMagicSlotLevel(warlockLevel: number): number {
  if (warlockLevel <= 2) return 1;
  if (warlockLevel <= 4) return 2;
  if (warlockLevel <= 6) return 3;
  if (warlockLevel <= 8) return 4;
  return 5;
}

/**
 * Compute all spell slots for a multiclass character per 2024 rules.
 *
 * Returns an object with:
 * - combined: slots from the unified multiclass table (full/half/third casters combined)
 * - pactMagic: slots from Warlock levels (separate, not combined)
 *
 * Each slot entry: { level: spell level (1-9), total: number of slots, pactMagic: boolean }
 */
export function computeMulticlassSpellSlots(classes: Array<{
  classId: string;
  level: number;
  subclassId?: string;
}>): { combined: Array<{ level: number; total: number; pactMagic: false }>; pactMagic: Array<{ level: number; total: number; pactMagic: true }> } {
  // Compute combined caster level (excluding Warlock)
  const casterLevel = computeMulticlassCasterLevel(classes);

  const combined: Array<{ level: number; total: number; pactMagic: false }> = [];
  const pactMagic: Array<{ level: number; total: number; pactMagic: true }> = [];

  // Combined multiclass slots (full/half/third casters)
  if (casterLevel > 0) {
    const slotTable = getMulticlassSlotTable(casterLevel);
    if (slotTable) {
      for (let i = 0; i < slotTable.length; i++) {
        const spellLevel = i + 1;
        const count = slotTable[i];
        if (count > 0) {
          combined.push({ level: spellLevel, total: count, pactMagic: false });
        }
      }
    }
  }

  // Warlock Pact Magic slots (separate)
  for (const entry of classes) {
    const classDef = getClass(entry.classId);
    if (!classDef?.spellcasting || !isPactMagic(classDef)) continue;

    const slotTable = getPactMagicSlots(entry.level);
    if (slotTable) {
      // Warlock slotTable format is different from standard casters:
      // It has a single-element array [numberOfSlots] where the slot level
      // is determined by warlock level, not by array index.
      // e.g., level 1: [1] = one 1st-level slot; level 3: [2] = two 2nd-level slots
      const slotCount = slotTable[0];
      const slotLevel = getPactMagicSlotLevel(entry.level);

      if (slotCount > 0) {
        pactMagic.push({ level: slotLevel, total: slotCount, pactMagic: true });
      }
    }
  }

  return { combined, pactMagic };
}