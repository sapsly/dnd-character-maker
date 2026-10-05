/**
 * Speed rules for D&D 2024 (SRD 5.2).
 *
 * Implements:
 * - Base speed from species + class features + combat.speedBonus
 * - Armor with strengthRequired > 0: if character's Strength is below the
 *   required score, speed is reduced by 10 feet (Plate, Chain Mail, Splint)
 * - Shield does not affect speed
 * - Multiplicative modifier (Haste) applies AFTER all additive bonuses; defaults to 1
 */

import type { CharacterCombat, ArmorDef, SpeciesDef } from '../../types/character';

export interface SpeedInput {
  species: SpeciesDef | null;
  combat: CharacterCombat;
  armor: ArmorDef | null;
  /** Additive bonuses from class features (e.g., Monk Unarmored Movement, Barbarian Fast Movement). */
  classSpeedBonus: number;
  /** Multiplicative modifier (e.g., Haste = 2, Slow = 0.5). Defaults to 1. */
  speedMultiplier?: number;
  /** Character's Strength score. Optional — if omitted, no strength-based armor penalty is applied. */
  strength?: number;
}

/** Compute final speed in feet. */
export function computeSpeed(input: SpeedInput): number {
  const { species, combat, armor, classSpeedBonus, speedMultiplier = 1, strength } = input;

  let speed = (species?.speed ?? 30) + combat.speedBonus + classSpeedBonus;

  // Armor speed penalty: only applies to armor with strengthRequired > 0
  // (Plate, Chain Mail, Splint in SRD 5.2). If Strength is below the
  // required score, reduce speed by 10 feet.
  if (armor && armor.strengthRequired > 0 && strength !== undefined && strength < armor.strengthRequired) {
    speed -= 10;
  }

  // Apply multiplicative modifier (Haste, Slow, etc.)
  speed = Math.floor(speed * speedMultiplier);

  // Minimum speed of 0 (can't be negative)
  return Math.max(0, speed);
}