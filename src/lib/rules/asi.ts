/**
 * ASI (Ability Score Improvement) helpers for D&D 2024 (SRD 5.2).
 *
 * Computes the cumulative ability increases from the character's choice log.
 * The choice log is append-only and records both 'featOrAsi' (when a feat is taken)
 * and 'asiAbilityIncrease' (when raw ability increases are taken) choices.
 * Each pick carries `abilityIncreases?: AbilityBonusMap`.
 */

import type { AbilityBonusMap, AbilityKey, Character } from '../../types/character';

/**
 * Sum all ASI ability increases from a character's choices.
 *
 * Iterates over `character.choices` and accumulates `picks[].abilityIncreases`
 * for choices whose `kind` is `'featOrAsi'` or `'asiAbilityIncrease'`.
 *
 * Returns an `AbilityBonusMap` with only non-zero entries (missing keys = 0).
 * Pure, typed, and has no side effects.
 */
export function asiIncreases(choices: Character['choices']): AbilityBonusMap {
  const result: AbilityBonusMap = {};

  for (const choice of choices) {
    if (choice.kind !== 'featOrAsi' && choice.kind !== 'asiAbilityIncrease') {
      continue;
    }
    for (const pick of choice.picks) {
      if (!pick.abilityIncreases) continue;
      for (const [ability, increase] of Object.entries(pick.abilityIncreases)) {
        const key = ability as AbilityKey;
        const current = result[key] ?? 0;
        result[key] = current + (increase as number);
      }
    }
  }

  // Prune zero entries to match AbilityBonusMap convention
  for (const key of Object.keys(result) as AbilityKey[]) {
    if (result[key] === 0) {
      delete result[key];
    }
  }

  return result;
}