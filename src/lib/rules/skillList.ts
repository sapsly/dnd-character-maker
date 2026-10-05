/**
 * Canonical skill list for D&D 2024 (SRD 5.2).
 *
 * Implements the 18 standard skills with their associated abilities.
 * 2024 renamed 2014's "Knowledge" skills to separate history skills — we use 'history'.
 */

import type { SkillKey, AbilityKey } from '../../types/character';

export interface SkillDef {
  key: SkillKey;
  name: string;
  ability: AbilityKey;
}

/** The 18 standard D&D 2024 skills in alphabetical order by key. */
export const SKILL_DEFS: readonly SkillDef[] = [
  { key: 'acrobatics', name: 'Acrobatics', ability: 'dex' },
  { key: 'animalHandling', name: 'Animal Handling', ability: 'wis' },
  { key: 'arcana', name: 'Arcana', ability: 'int' },
  { key: 'athletics', name: 'Athletics', ability: 'str' },
  { key: 'deception', name: 'Deception', ability: 'cha' },
  { key: 'history', name: 'History', ability: 'int' },
  { key: 'insight', name: 'Insight', ability: 'wis' },
  { key: 'intimidation', name: 'Intimidation', ability: 'cha' },
  { key: 'investigation', name: 'Investigation', ability: 'int' },
  { key: 'medicine', name: 'Medicine', ability: 'wis' },
  { key: 'nature', name: 'Nature', ability: 'int' },
  { key: 'perception', name: 'Perception', ability: 'wis' },
  { key: 'performance', name: 'Performance', ability: 'cha' },
  { key: 'persuasion', name: 'Persuasion', ability: 'cha' },
  { key: 'religion', name: 'Religion', ability: 'int' },
  { key: 'sleightOfHand', name: 'Sleight of Hand', ability: 'dex' },
  { key: 'stealth', name: 'Stealth', ability: 'dex' },
  { key: 'survival', name: 'Survival', ability: 'wis' },
] as const;

/** Map from skill key to its definition for O(1) lookup. */
export const SKILL_DEF_MAP: ReadonlyMap<SkillKey, SkillDef> = new Map(
  SKILL_DEFS.map((def) => [def.key, def])
);

/** Get the ability key for a skill. Returns 'str' as fallback for unknown skills. */
export function skillAbility(skillKey: SkillKey): AbilityKey {
  return SKILL_DEF_MAP.get(skillKey)?.ability ?? 'str';
}

/** Get the display name for a skill. Returns the key as fallback. */
export function skillName(skillKey: SkillKey): string {
  return SKILL_DEF_MAP.get(skillKey)?.name ?? skillKey;
}

/** Check if a skill key is one of the 18 standard skills. */
export function isStandardSkill(skillKey: SkillKey): boolean {
  return SKILL_DEF_MAP.has(skillKey);
}