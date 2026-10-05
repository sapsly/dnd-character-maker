/**
 * Initiative and Passive Perception rules for D&D 2024 (SRD 5.2).
 *
 * Implements:
 * - Initiative: Dex mod + combat.initiativeBonus, plus proficiency bonus ONLY when a
 *   source explicitly grants it (Alert or Observant feats, Scout's Cunning Action
 *   replacement, etc.). Proficiency in Perception does NOT grant initiative
 *   proficiency in 2024 -- that was never a rule. See `initiativeProficiency`.
 * - Passive Perception: 10 + Wis mod + proficiency bonus if proficient in Perception
 */

import type { AbilityScores, InitiativeResult, CharacterCombat } from '../../types/character';
import { abilityModifier } from './ability';
import { proficiencyBonusForLevel } from './proficiency';

export interface InitiativeInput {
  abilityScores: AbilityScores;
  combat: CharacterCombat;
  level: number;
  /**
   * True when a feat or class feature explicitly adds the proficiency bonus to
   * initiative (Alert, Observant, Scout, ...). Deliberately NOT derived from
   * Perception proficiency.
   */
  initiativeProficiency: boolean;
  /** Whether the character has proficiency in Perception (background, class, or feat). */
  perceptionProficient: boolean;
}

/** Compute initiative modifier and passive perception. */
export function computeInitiative(input: InitiativeInput): InitiativeResult {
  const { abilityScores, combat, level, initiativeProficiency, perceptionProficient } = input;
  const dexMod = abilityModifier(abilityScores.dex);
  const wisMod = abilityModifier(abilityScores.wis);
  const proficiencyBonus = proficiencyBonusForLevel(level);

  // Initiative: Dex + flat bonus + proficiency only when a source grants it.
  const initiativeProficiencyBonus = initiativeProficiency ? proficiencyBonus : 0;
  const modifier = dexMod + combat.initiativeBonus + initiativeProficiencyBonus;

  // Passive Perception: 10 + Wis + proficiency if proficient in Perception
  const passivePerceptionProficiency = perceptionProficient ? proficiencyBonus : 0;
  const passivePerception = 10 + wisMod + passivePerceptionProficiency;

  return {
    modifier,
    totalBonus: combat.initiativeBonus + initiativeProficiencyBonus,
    passivePerception,
  };
}