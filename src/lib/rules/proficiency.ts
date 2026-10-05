/**
 * Proficiency bonus rules for D&D 2024 (SRD 5.2).
 *
 * Implements:
 * - Proficiency bonus by character level: 1-4→+2, 5-8→+3, 9-12→+4, 13-16→+5, 17-20→+6
 * - Level clamping to 1-20
 * - MAX_CHARACTER_LEVEL constant
 */

export const MAX_CHARACTER_LEVEL = 20;

/**
 * Proficiency bonus for a given character level (1-20).
 * Levels outside 1-20 are clamped.
 */
export function proficiencyBonusForLevel(level: number): number {
  const clamped = Math.max(1, Math.min(MAX_CHARACTER_LEVEL, Math.floor(level)));
  if (clamped <= 4) return 2;
  if (clamped <= 8) return 3;
  if (clamped <= 12) return 4;
  if (clamped <= 16) return 5;
  return 6;
}