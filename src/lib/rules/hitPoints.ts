/**
 * Hit Point rules for D&D 2024 (SRD 5.2).
 *
 * Implements:
 * - Level 1: class hit die rolled or averaged, + Con
 * - Each later single-class level: fixed average increment, + Con
 * - Average increments: d6→3, d8→4, d10→5, d12→6
 * - Multiclass: FIRST level in a second-or-later class contributes one hit die roll/average;
 *   every Multiclass level after that contributes a flat +1 only. Con applies per level regardless.
 * - combat.hpBonusFlat adds to total (Tough, boons, items)
 * - combat.hpOverride, when set, replaces computed max
 * - Build rows as auditable per-level breakdown, each row labeled with its class, showing die expression and result.
 * - Mark Multiclass rows distinctly.
 */

import type {
  Character,
  ClassDef,
  HitPointResult,
  HitPointBreakdownRow,
  CharacterCombat,
  AbilityScores,
} from '../../types/character';
import { abilityModifier } from './ability';

/** Average roll for a hit die type. */
function averageHitDie(hitDie: number): number {
  switch (hitDie) {
    case 6:
      return 3;
    case 8:
      return 4;
    case 10:
      return 5;
    case 12:
      return 6;
    default:
      return Math.floor((hitDie + 1) / 2);
  }
}

/** Format a hit die as a string like "d8". */
function hitDieString(hitDie: number): string {
  return `d${hitDie}`;
}

/**
 * Compute hit points with full per-level breakdown.
 * Takes final ability scores (after species/background bonuses) for Con modifier.
 */
export function computeHitPoints(
  character: Character,
  classDefs: ClassDef[],
  combat: CharacterCombat,
  finalAbilityScores: AbilityScores
): HitPointResult {
  const conMod = abilityModifier(finalAbilityScores.con);
  const rows: HitPointBreakdownRow[] = [];
  let total = 0;

  // Sort classes: primary first, then by level (or any stable order)
  const sortedEntries = [...character.classes].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.id.localeCompare(b.id);
  });

  let hasSeenPrimary = false;

  for (const entry of sortedEntries) {
    const classDef = classDefs.find((c) => c.id === entry.classId);
    if (!classDef) continue;
    const hitDie = classDef.hitDie;
    const avgDie = averageHitDie(hitDie);
    const isPrimary = entry.isPrimary;

    for (let lvl = 1; lvl <= entry.level; lvl++) {
      const isFirstLevelOverall = !hasSeenPrimary && isPrimary && lvl === 1;
      const isFirstLevelInThisClass = lvl === 1;
      const isMulticlassLevel = !isPrimary || (isPrimary && hasSeenPrimary);

      let hpGain = 0;
      let rollExpr = '';
      let note = '';

      if (isFirstLevelOverall) {
        // Level 1: max hit die + Con
        hpGain = hitDie + conMod;
        rollExpr = `${hitDieString(hitDie)} (max) + ${conMod >= 0 ? '+' : ''}${conMod}`;
        note = '1st level (max)';
      } else if (isPrimary) {
        // Single-class subsequent levels: average + Con
        hpGain = avgDie + conMod;
        rollExpr = `${avgDie} (avg of ${hitDieString(hitDie)}) + ${conMod >= 0 ? '+' : ''}${conMod}`;
        note = `${classDef.name} ${lvl}`;
      } else {
        // Multiclass
        if (isFirstLevelInThisClass) {
          // First level in a multiclass: one hit die (average) + Con
          hpGain = avgDie + conMod;
          rollExpr = `${avgDie} (avg of ${hitDieString(hitDie)}) + ${conMod >= 0 ? '+' : ''}${conMod}`;
          note = `Multiclass: ${classDef.name} 1 (first level in class)`;
        } else {
          // Subsequent multiclass levels: flat +1 + Con
          hpGain = 1 + conMod;
          rollExpr = `1 (multiclass) + ${conMod >= 0 ? '+' : ''}${conMod}`;
          note = `Multiclass: ${classDef.name} ${lvl}`;
        }
      }

      total += hpGain;
      rows.push({
        label: note,
        roll: rollExpr,
        result: hpGain,
        note: isMulticlassLevel && !isFirstLevelOverall ? 'Multiclass level' : undefined,
      });
    }

    if (isPrimary) {
      hasSeenPrimary = true;
    }
  }

  // Apply flat HP bonus
  if (combat.hpBonusFlat !== 0) {
    total += combat.hpBonusFlat;
    rows.push({
      label: 'Flat Bonus',
      roll: `${combat.hpBonusFlat >= 0 ? '+' : ''}${combat.hpBonusFlat}`,
      result: combat.hpBonusFlat,
      note: 'Tough, boons, items, etc.',
    });
  }

  // Apply override
  let maxHp = total;
  if (combat.hpOverride !== undefined && combat.hpOverride !== null) {
    maxHp = combat.hpOverride;
  }

  return {
    max: maxHp,
    computed: total,
    current: combat.hitPointsCurrent,
    temporary: combat.temporaryHitPoints,
    rows,
  };
}

/**
 * Compute Hit Die pool: die = primary class hit die, total = character level.
 */
export function computeHitDiePool(character: Character, classDefs: ClassDef[]): { die: number; total: number } {
  const primaryEntry = character.classes.find((c) => c.isPrimary);
  const primaryClass = primaryEntry ? classDefs.find((c) => c.id === primaryEntry.classId) : null;
  const die = primaryClass?.hitDie ?? 8;
  const total = character.level;
  return { die, total };
}