/**
 * Ability score rules for D&D 2024 (SRD 5.2).
 *
 * Implements:
 * - Ability modifier: floor((score - 10) / 2)
 * - Score clamping: 1-20
 * - Combining base + species + background bonuses with 20 cap and warnings
 */

import type { AbilityKey, AbilityScores, AbilityBonusMap } from '../../types/character';

/** Clamp a raw ability score to the valid 1-20 range. */
export function clampAbilityScore(score: number): number {
  return Math.max(1, Math.min(20, Math.floor(score)));
}

/** Compute the ability modifier per 2024 rules: floor((score - 10) / 2). */
export function abilityModifier(score: number): number {
  const clamped = clampAbilityScore(score);
  return Math.floor((clamped - 10) / 2);
}

/** Compute modifiers for all six abilities at once. */
export function allAbilityModifiers(scores: AbilityScores): Record<AbilityKey, number> {
  return {
    str: abilityModifier(scores.str),
    dex: abilityModifier(scores.dex),
    con: abilityModifier(scores.con),
    int: abilityModifier(scores.int),
    wis: abilityModifier(scores.wis),
    cha: abilityModifier(scores.cha),
  };
}

/**
 * Combine base scores with species, background, and extra bonuses.
 * Returns final scores (capped at 20) and any warnings from clamping.
 *
 * 2024 rule: Species grants +2/+1/0. Background grants +2/+1 across two of
 * three listed abilities, or +1/+1/+1 across all three. A single ability can
 * reach +4 total bonus. Cap at 20 and surface warnings instead of throwing.
 *
 * The 4th parameter `extraBonuses` is additive and folded the same way as
 * species/background bonuses (e.g., cumulative ASI increases from the choice log).
 * Defaults to {} so existing callers compile unchanged.
 */
export interface CombinedAbilityResult {
  abilityScores: AbilityScores;
  abilityBonuses: AbilityBonusMap;
  warnings: string[];
}

export function combineAbilityScores(
  base: AbilityScores,
  speciesBonuses: AbilityBonusMap,
  backgroundBonuses: AbilityBonusMap,
  extraBonuses: AbilityBonusMap = {}
): CombinedAbilityResult {
  const warnings: string[] = [];
  const abilityBonuses: AbilityBonusMap = {};
  const finalScores: AbilityScores = {
    str: base.str,
    dex: base.dex,
    con: base.con,
    int: base.int,
    wis: base.wis,
    cha: base.cha,
  };

  const allKeys: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

  for (const key of allKeys) {
    const species = speciesBonuses[key] ?? 0;
    const background = backgroundBonuses[key] ?? 0;
    const extra = extraBonuses[key] ?? 0;
    const totalBonus = species + background + extra;
    if (totalBonus !== 0) {
      abilityBonuses[key] = totalBonus;
    }
    const raw = base[key] + totalBonus;
    if (raw > 20) {
      warnings.push(`${key.toUpperCase()}: bonus would raise score to ${raw}, capped at 20`);
      finalScores[key] = 20;
    } else {
      finalScores[key] = raw;
    }
  }

  return { abilityScores: finalScores, abilityBonuses, warnings };
}