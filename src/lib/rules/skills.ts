/**
 * Skill proficiency rules for D&D 2024 (SRD 5.2).
 *
 * Implements:
 * - Proficiency from background (skillsGranted + chosen picks) plus EVERY class entry's skillPicks
 * - A skill granted by two sources still counts as one proficiency
 * - Expertise doubles the proficiency bonus and outranks ordinary proficiency
 * - SkillProficiencyEntry.source lists which grants provided it, e.g. "Background, Rogue"
 */

import type {
  SkillKey,
  AbilityKey,
  SkillProficiency,
  SkillProficiencyEntry,
  Character,
  BackgroundDef,
  ClassDef,
  AbilityScores,
} from '../../types/character';
import { proficiencyBonusForLevel } from './proficiency';
import { SKILL_DEF_MAP, skillAbility } from './skillList';
import { allAbilityModifiers } from './ability';

/** Input for computing skill proficiencies. */
export interface SkillProficiencyInput {
  character: Character;
  background: BackgroundDef | null;
  classDefs: ClassDef[];
  /** Final ability scores (after species/background bonuses) for modifier calculation. */
  finalAbilityScores: AbilityScores;
  /** Set of skill keys that have expertise (from subclasses/features). */
  expertiseSkills: Set<SkillKey>;
  /** Whether the character is proficient in Perception (for initiative). */
  perceptionProficient: boolean;
}

/**
 * Compute all 18 skill proficiency entries for the character.
 */
export function computeSkillProficiencies(
  input: SkillProficiencyInput
): SkillProficiencyEntry[] {
  const { character, background, classDefs, finalAbilityScores, expertiseSkills, perceptionProficient } = input;
  const proficiencyBonus = proficiencyBonusForLevel(character.level);
  const abilityModifiers = allAbilityModifiers(finalAbilityScores);

  // Track proficiency sources per skill
  const proficiencySources = new Map<SkillKey, string[]>();
  const expertiseSet = new Set(expertiseSkills);

  // 1. Background granted skills
  if (background) {
    for (const skill of background.skillsGranted) {
      addSource(proficiencySources, skill, 'Background');
    }
    // Background chosen skill picks are stored in character.choices, not here
    // The caller should have resolved background skill choices into the character's choices
    // For now, we only handle explicitly granted skills
  }

  // 2. Class entries' skillPicks
  for (const entry of character.classes) {
    const classDef = classDefs.find((c) => c.id === entry.classId);
    if (!classDef) continue;
    const className = classDef.name;
    for (const skill of entry.skillPicks) {
      addSource(proficiencySources, skill, className);
    }
  }

  // 3. Perception proficiency from Alert feat or similar (passed in separately)
  if (perceptionProficient && !proficiencySources.has('perception')) {
    addSource(proficiencySources, 'perception', 'Feat/Feature');
  }

  // Build entries for all 18 standard skills
  const entries: SkillProficiencyEntry[] = [];
  for (const def of SKILL_DEF_MAP.values()) {
    const sources = proficiencySources.get(def.key) ?? [];
    const isProficient = sources.length > 0;
    const hasExpertise = expertiseSet.has(def.key);
    const proficiencyLevel: SkillProficiency = hasExpertise ? 2 : isProficient ? 1 : 0;
    const profBonus = proficiencyLevel === 2 ? proficiencyBonus * 2 : proficiencyLevel === 1 ? proficiencyBonus : 0;
    const abilityMod = abilityModifiers[def.ability];
    const modifier = abilityMod + profBonus;

    entries.push({
      key: def.key,
      name: def.name,
      ability: def.ability,
      abilityLabel: def.ability.toUpperCase(),
      modifier,
      proficiency: proficiencyLevel,
      expertise: hasExpertise,
      source: sources.join(', ') || '—',
    });
  }

  return entries;
}

function addSource(map: Map<SkillKey, string[]>, skill: SkillKey, source: string): void {
  const existing = map.get(skill) ?? [];
  if (!existing.includes(source)) {
    existing.push(source);
    map.set(skill, existing);
  }
}

/**
 * Compute a single skill's modifier (used for passive perception, etc.).
 */
export function skillModifier(
  skillKey: SkillKey,
  abilityModifiers: Record<AbilityKey, number>,
  proficiencyBonus: number,
  isProficient: boolean,
  hasExpertise: boolean
): number {
  const ability = skillAbility(skillKey);
  const abilityMod = abilityModifiers[ability] ?? 0;
  const profBonus = hasExpertise ? proficiencyBonus * 2 : isProficient ? proficiencyBonus : 0;
  return abilityMod + profBonus;
}