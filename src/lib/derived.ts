/**
 * Derived character model — pure read model computed from a stored Character.
 * Slice 1: ability scores, proficiency bonus, saving throws, AC, HP, initiative, speed, passive perception.
 */

import type {
  Character,
  AbilityScores,
  AbilityBonusMap,
  AbilityKey,
  ClassDef,
  SpeciesDef,
  BackgroundDef,
  SavingThrowProficiency,
  SkillProficiencyEntry,
  ArmorClassResult,
  HitPointResult,
  InitiativeResult,
  SpellSlotRow,
} from '../types/character';
import {
  combineAbilityScores,
  allAbilityModifiers,
} from './rules/ability';
import { proficiencyBonusForLevel } from './rules/proficiency';
import { computeArmorClass } from './rules/armorClass';
import { computeHitPoints } from './rules/hitPoints';
import { computeInitiative } from './rules/initiative';
import { computeSpeed } from './rules/speed';
import { computeSkillProficiencies } from './rules/skills';
import { computeMulticlassSpellSlots } from './rules/multiclassSlots';
import { getClass } from '../data/classes';
import { SPECIES_BY_ID } from '../data/species';
import { BACKGROUNDS_BY_ID } from '../data/backgrounds';
import { ARMOR_BY_ID } from '../data/equipment';
import { MAX_SPELL_LEVEL } from '../data/spells';

/**
 * Result of deriving a full character from stored state.
 * Mirrors the DerivedCharacter shape in types/character.ts for compatibility.
 */
export interface DerivedCharacter {
  character: Character;
  level: number;
  proficiencyBonus: number;
  abilityScores: AbilityScores;
  abilityBonuses: AbilityBonusMap;
  abilityModifiers: Record<AbilityKey, number>;
  savingThrows: SavingThrowProficiency[];
  skills: SkillProficiencyEntry[];
  armorClass: ArmorClassResult;
  hitPoints: HitPointResult;
  initiative: InitiativeResult;
  speed: number;
  passivePerception: number;
  spellSlots: { level: number; total: number; used: number; pactMagic: boolean }[];
  spellSaveDc: Record<AbilityKey, number> | null;
  spellAttackBonus: Record<AbilityKey, number> | null;
  outstandingChoices: Character['choices'];
  species: SpeciesDef | null;
  background: BackgroundDef | null;
  classDefs: ClassDef[];
  casterClasses: ClassDef[];
  warnings: string[];
}

/**
 * Derive a complete read-model from a stored Character.
 * Pure, deterministic, and degrades gracefully with warnings instead of throwing.
 */
export function deriveCharacter(character: Character): DerivedCharacter {
  const warnings: string[] = [];

  // Look up species
  const species = SPECIES_BY_ID[character.species.speciesId] ?? null;
  if (!species) {
    warnings.push(`Unknown species ID: ${character.species.speciesId}`);
  }

  // Look up background
  const background = BACKGROUNDS_BY_ID[character.background.backgroundId] ?? null;
  if (!background) {
    warnings.push(`Unknown background ID: ${character.background.backgroundId}`);
  }

  // Look up class definitions
  const classDefs: ClassDef[] = [];
  const casterClasses: ClassDef[] = [];
  for (const entry of character.classes) {
    const classDef = getClass(entry.classId);
    if (classDef) {
      classDefs.push(classDef);
      if (classDef.spellcasting) {
        casterClasses.push(classDef);
      }
    } else {
      warnings.push(`Unknown class ID: ${entry.classId}`);
    }
  }

  // Combine ability scores: base + species + background
  const speciesBonuses = species?.abilityBonuses ?? {};
  const backgroundBonuses = character.background.abilityBonuses;
  const combined = combineAbilityScores(
    character.abilityScoreBase,
    speciesBonuses,
    backgroundBonuses
  );
  warnings.push(...combined.warnings);

  const abilityScores = combined.abilityScores;
  const abilityBonuses = combined.abilityBonuses;
  const abilityModifiers = allAbilityModifiers(abilityScores);

  // Proficiency bonus from total level
  const proficiencyBonus = proficiencyBonusForLevel(character.level);

  // Saving throws: class proficiencies + species trait bonuses
  const saveProficiencies = new Set<AbilityKey>();
  const saveAdvantages = new Set<AbilityKey>();
  for (const classDef of classDefs) {
    for (const ability of classDef.savingThrowProficiencies) {
      saveProficiencies.add(ability);
    }
  }
  // Species save advantages (e.g., Dwarf poison, Gnome int/wis/cha, Halfling frightened)
  if (species) {
    for (const trait of species.traits) {
      const desc = trait.description.toLowerCase();
      if (desc.includes('advantage on saving throws') || desc.includes('advantage on saves')) {
        if (desc.includes('poison')) saveAdvantages.add('con');
        if (desc.includes('charmed')) saveAdvantages.add('wis');
        if (desc.includes('frightened')) saveAdvantages.add('wis');
        if (desc.includes('magic')) saveAdvantages.add('wis');
        if (desc.includes('intelligence') || desc.includes('wisdom') || desc.includes('charisma')) {
          // Gnomish Cunning: Advantage on Int/Wis/Cha saves against magic
          saveAdvantages.add('int');
          saveAdvantages.add('wis');
          saveAdvantages.add('cha');
        }
      }
    }
  }

  const savingThrows: SavingThrowProficiency[] = (['str', 'dex', 'con', 'int', 'wis', 'cha'] as AbilityKey[]).map((ability) => ({
    ability,
    proficient: saveProficiencies.has(ability),
    modifier: abilityModifiers[ability] + (saveProficiencies.has(ability) ? proficiencyBonus : 0),
    advantage: saveAdvantages.has(ability),
  }));

  // Armor class
  const armorId = character.combat.armorId;
  const armor = armorId && armorId !== 'none' && armorId !== 'unarmored' ? ARMOR_BY_ID[armorId] ?? null : null;
  if (armorId && armorId !== 'none' && armorId !== 'unarmored' && !armor) {
    warnings.push(`Unknown armor ID: ${armorId}`);
  }

  // Determine unarmored type from class features
  let unarmoredType: 'none' | 'barbarian' | 'monk' | 'draconic' = 'none';
  let classSpeedBonus = 0;
  for (const entry of character.classes) {
    const classDef = classDefs.find((c) => c.id === entry.classId);
    if (!classDef) continue;
    if (classDef.id === 'barbarian' && entry.level >= 1) {
      unarmoredType = 'barbarian';
      // Fast Movement at level 5: +10 ft while not wearing heavy armor
      if (entry.level >= 5 && (!armor || armor.category !== 'heavy')) {
        classSpeedBonus += 10;
      }
    } else if (classDef.id === 'monk' && entry.level >= 1) {
      unarmoredType = 'monk';
      // Unarmored Movement: +10 at 2, +15 at 6, +20 at 10, +25 at 14, +30 at 18
      if (entry.level >= 2) {
        let bonus = 10;
        if (entry.level >= 6) bonus = 15;
        if (entry.level >= 10) bonus = 20;
        if (entry.level >= 14) bonus = 25;
        if (entry.level >= 18) bonus = 30;
        // Only applies when not wearing armor or shield
        if (!armor && !character.combat.shieldEquipped) {
          classSpeedBonus += bonus;
        }
      }
    } else if (classDef.id === 'sorcerer' && entry.level >= 3) {
      // Draconic Resilience (Draconic Sorcery subclass)
      // Check if character has draconic-sorcery subclass
      const subclassId = entry.subclassId;
      if (subclassId === 'draconic-sorcery') {
        unarmoredType = 'draconic';
      }
    }
    // TODO(srd-verify): Other unarmored defenses (e.g., Barbarian Path of the Beast natural armor, etc.)
  }

  // Defense Fighting Style check
  const hasDefenseFightingStyle = character.classes.some((entry) => {
    const classDef = classDefs.find((c) => c.id === entry.classId);
    return classDef?.id === 'fighter' && entry.featurePicks['fighting-style']?.includes('defense');
  });
  // Paladin also gets Defense fighting style
  const hasPaladinDefense = character.classes.some((entry) => {
    const classDef = classDefs.find((c) => c.id === entry.classId);
    return classDef?.id === 'paladin' && entry.featurePicks['fighting-style']?.includes('defense');
  });
  // Ranger also gets Defense fighting style
  const hasRangerDefense = character.classes.some((entry) => {
    const classDef = classDefs.find((c) => c.id === entry.classId);
    return classDef?.id === 'ranger' && entry.featurePicks['fighting-style']?.includes('defense');
  });

  const armorClass = computeArmorClass({
    abilityScores,
    combat: character.combat,
    armor,
    unarmoredType,
    hasDefenseFightingStyle: hasDefenseFightingStyle || hasPaladinDefense || hasRangerDefense,
  });

  // Hit points
  const hitPoints = computeHitPoints(character, classDefs, character.combat, abilityScores);

  // Speed
  const speed = computeSpeed({
    species,
    combat: character.combat,
    armor,
    classSpeedBonus,
    strength: abilityScores.str,
  });

  // Expertise skills from class feature picks (e.g., Rogue Expertise, Bard Expertise)
  const expertiseSkills = new Set<string>();
  for (const entry of character.classes) {
    // Expertise feature picks are stored under featureId 'expertise' and 'expertise-2'
    const expertisePicks = entry.featurePicks['expertise'] ?? [];
    const expertise2Picks = entry.featurePicks['expertise-2'] ?? [];
    for (const pick of [...expertisePicks, ...expertise2Picks]) {
      expertiseSkills.add(pick);
    }
  }

  // Determine initiative proficiency from feats/features
  // Check for Alert feat (from background origin feat or general feat choice)
  let initiativeProficiency = false;
  const originFeatId = background?.originFeatId;
  if (originFeatId === 'alert') {
    initiativeProficiency = true;
  }
  // Check character's choices for Alert feat
  for (const choice of character.choices) {
    if (choice.kind === 'originFeat' || choice.kind === 'featOrAsi') {
      for (const pick of choice.picks) {
        if (pick.optionId === 'alert' || pick.optionId === 'alert-adventure') {
          initiativeProficiency = true;
        }
      }
    }
  }
  // Barbarian Feral Instinct (level 7) gives advantage on initiative
  // In 2024, this is advantage, not proficiency bonus. We'll track as warning.
  for (const entry of character.classes) {
    const classDef = classDefs.find((c) => c.id === entry.classId);
    if (classDef?.id === 'barbarian' && entry.level >= 7) {
      warnings.push('Barbarian Feral Instinct grants Advantage on Initiative (not proficiency bonus).');
    }
  }
  // Ranger Deft Explorer (Canny) can grant proficiency in a skill but not initiative
  // Observant feat would grant proficiency but not in SRD 5.2
  if (!initiativeProficiency) {
    warnings.push('No source grants Initiative proficiency (Alert feat or similar).');
  }

  // Compute skills using the rules engine
  const skills = computeSkillProficiencies({
    character,
    background,
    classDefs,
    finalAbilityScores: abilityScores,
    expertiseSkills,
    perceptionProficient: false, // Will be determined from skills result below
  });

  // Determine perception proficiency from skills result for initiative
  const perceptionEntry = skills.find((s) => s.key === 'perception');
  const perceptionProficient = perceptionEntry !== undefined && perceptionEntry.proficiency > 0;

  // Recompute initiative with correct perception proficiency and initiative proficiency
  const initiativeResult = computeInitiative({
    abilityScores,
    combat: character.combat,
    level: character.level,
    initiativeProficiency,
    perceptionProficient,
  });

  // === SLICE 3: Spell slots, save DC, attack bonus ===

  // Spell slots: compute per 2024 multiclass spellcasting rules
  // - Full casters (Bard, Cleric, Druid, Sorcerer, Wizard): 1 level per class level
  // - Half casters (Paladin, Ranger): 1/2 level per class level (rounded down)
  // - Third casters (Eldritch Knight, Arcane Trickster): 1/3 level per class level (rounded down)
  // - Warlock Pact Magic: computed separately, NOT combined with the above
  const spellSlotsUsed = character.spellSlotsUsed ?? {};

  const { combined: combinedSlots, pactMagic } = computeMulticlassSpellSlots(character.classes);

  // Build spellSlots array, sorted by level (combined first, then pact magic)
  const spellSlots: SpellSlotRow[] = [];

  for (const slot of combinedSlots) {
    const used = spellSlotsUsed[slot.level] ?? 0;
    // Warn if slots exist for levels beyond our spell catalog
    if (slot.level > MAX_SPELL_LEVEL) {
      warnings.push(`Spell slots for level ${slot.level} exist but spell catalog only covers levels 0-${MAX_SPELL_LEVEL}.`);
    }
    spellSlots.push({
      level: slot.level,
      total: slot.total,
      used,
      pactMagic: false,
    });
  }

  for (const slot of pactMagic) {
    const used = spellSlotsUsed[slot.level] ?? 0;
    if (slot.level > MAX_SPELL_LEVEL) {
      warnings.push(`Spell slots for level ${slot.level} exist but spell catalog only covers levels 0-${MAX_SPELL_LEVEL}.`);
    }
    spellSlots.push({
      level: slot.level,
      total: slot.total,
      used,
      pactMagic: true,
    });
  }

  // Sort by level, with non-pact magic first for same level
  spellSlots.sort((a, b) => a.level - b.level || (a.pactMagic === b.pactMagic ? 0 : a.pactMagic ? 1 : -1));

  // Spell save DC and spell attack bonus per 2024 multiclass rules
  // Each spellcasting class uses its own ability. Compute DC/attack for EACH class's ability.
  // The output Record<AbilityKey, number> can hold multiple abilities' values.
  let spellSaveDc: Record<AbilityKey, number> | null = null;
  let spellAttackBonus: Record<AbilityKey, number> | null = null;

  const castingClasses = character.classes.filter((entry) => {
    const classDef = classDefs.find((c) => c.id === entry.classId);
    return classDef?.spellcasting !== undefined;
  });

  if (castingClasses.length > 0) {
    // Initialize with zeros
    spellSaveDc = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
    spellAttackBonus = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

    let hasConflictingAbilities = false;
    const seenAbilities = new Set<AbilityKey>();

    for (const entry of castingClasses) {
      const classDef = classDefs.find((c) => c.id === entry.classId);
      if (!classDef?.spellcasting) continue;

      const ability = classDef.spellcasting.ability;
      const mod = abilityModifiers[ability];
      const dc = 8 + proficiencyBonus + mod;
      const attack = proficiencyBonus + mod;

      // If multiple classes share the same ability, use the highest proficiency/level?
      // Per 2024 rules: proficiency bonus is based on TOTAL character level, not class level.
      // So all classes use the same proficiency bonus. If they share an ability, DC/attack is the same.
      if (seenAbilities.has(ability)) {
        // Same ability, same total level proficiency -> same DC/attack, no conflict
      } else {
        seenAbilities.add(ability);
        spellSaveDc[ability] = dc;
        spellAttackBonus[ability] = attack;
      }

      // Track if we have multiple DIFFERENT abilities among casting classes
      if (seenAbilities.size > 1) {
        hasConflictingAbilities = true;
      }
    }

    if (hasConflictingAbilities) {
      warnings.push('Multiple spellcasting classes use different abilities. Spell save DC and attack bonus are shown per ability; use the one matching the spell\'s class.');
    }
  }

  return {
    character,
    level: character.level,
    proficiencyBonus,
    abilityScores,
    abilityBonuses,
    abilityModifiers,
    savingThrows,
    skills,
    armorClass,
    hitPoints,
    initiative: initiativeResult,
    speed,
    passivePerception: initiativeResult.passivePerception,
    spellSlots,
    spellSaveDc,
    spellAttackBonus,
    outstandingChoices: character.choices,
    species,
    background,
    classDefs,
    casterClasses,
    warnings,
  };
}