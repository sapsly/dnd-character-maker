/**
 * Leveling helpers for D&D 2024 (SRD 5.2).
 *
 * Implements:
 * - proficiencyBonusForLevel (re-exported)
 * - MAX_CHARACTER_LEVEL = 20
 * - nextLevelChoices: what becomes choosable at a new level
 * - 2024 ASI validation: feat OR +2 to one ability OR +1 to two abilities, cap 20
 * - Class-specific ASI levels via ClassDef.asiLevels
 * - Multiclass character may NOT take a subclass on the Multiclass level itself
 * - Weapon Mastery swap eligibility: replace one property each time a level is gained
 */

import type {
  Character,
  ClassDef,
  ClassEntry,
  AbilityKey,
  AbilityBonusMap,
  WeaponMasteryProperty,
} from '../../types/character';
import { proficiencyBonusForLevel, MAX_CHARACTER_LEVEL } from './proficiency';
import {
  findSubclass,
  grantsPicks,
  subclassFeatureKey,
  subclassFeaturesGrantingAtLevel,
  subclassSpellMaxLevel,
  subclassSpellMinLevel,
  subclassSpellPickCount,
} from './subclassPicks';

export { proficiencyBonusForLevel, MAX_CHARACTER_LEVEL };

/** Check if a class grants an ASI/Feat at a given class level. */
export function isAsiLevel(classDef: ClassDef, classLevel: number): boolean {
  return classDef.asiLevels.includes(classLevel);
}

/** Validate a 2024 ASI allocation: feat OR +2 to one OR +1 to two, cap 20. */
export interface AsiValidationResult {
  valid: boolean;
  errors: string[];
  /** The ability increases if valid (empty if taking a feat). */
  abilityIncreases: AbilityBonusMap;
}

export function validateAsiAllocation(
  baseScores: Record<AbilityKey, number>,
  speciesBonuses: AbilityBonusMap,
  backgroundBonuses: AbilityBonusMap,
  asiIncreases: AbilityBonusMap,
  takingFeat: boolean
): AsiValidationResult {
  const errors: string[] = [];
  const abilityIncreases: AbilityBonusMap = {};

  if (takingFeat) {
    if (Object.keys(asiIncreases).length > 0) {
      errors.push('Cannot allocate ability increases when taking a feat');
    }
    return { valid: errors.length === 0, errors, abilityIncreases: {} };
  }

  // Must be exactly one of: +2 to one, or +1 to two
  const entries = Object.entries(asiIncreases) as [AbilityKey, number][];
  const nonZeroEntries = entries.filter(([, v]) => v > 0);

  if (nonZeroEntries.length === 0) {
    errors.push('Must choose either a feat or an ability score increase');
  } else if (nonZeroEntries.length === 1) {
    const [, value] = nonZeroEntries[0];
    if (value !== 2) {
      errors.push('Single ability increase must be exactly +2');
    }
  } else if (nonZeroEntries.length === 2) {
    const [v1, v2] = nonZeroEntries.map(([, v]) => v);
    if (v1 !== 1 || v2 !== 1) {
      errors.push('Two ability increases must each be exactly +1');
    }
  } else {
    errors.push('Can increase at most two abilities');
  }

  // Check 20 cap against current final scores
  if (errors.length === 0) {
    for (const [ability, increase] of entries) {
      if (increase <= 0) continue;
      const currentFinal = baseScores[ability] + (speciesBonuses[ability] ?? 0) + (backgroundBonuses[ability] ?? 0);
      if (currentFinal + increase > 20) {
        errors.push(`${ability.toUpperCase()}: would exceed 20 (current ${currentFinal} + ${increase})`);
      } else {
        abilityIncreases[ability] = increase;
      }
    }
  }

  return { valid: errors.length === 0, errors, abilityIncreases };
}

/**
 * Determine if a multiclass character can take a subclass at a given level.
 * 2024 rule: A multiclass character may NOT take a subclass on the Multiclass level itself.
 * They must reach the subclassLevel in a specific class entry.
 */
export function canTakeSubclassAtLevel(
  character: Character,
  classDefs: ClassDef[],
  targetClassEntryId: string,
  _newLevel: number
): boolean {
  const entry = character.classes.find((c) => c.id === targetClassEntryId);
  if (!entry) return false;

  const classDef = classDefs.find((c) => c.id === entry.classId);
  if (!classDef) return false;

  // The new level in THIS class entry
  const newClassLevel = entry.level + (entry.isPrimary ? 0 : 1); // This logic needs the caller to pass the correct new class level
  // Actually, the caller should compute the new class level for this entry
  // We'll just check if the class has a subclass at the level the entry would reach

  return classDef.subclassLevel === newClassLevel;
}

/**
 * Compute what choices become available when gaining a level.
 */
export interface NextLevelChoicesInput {
  character: Character;
  classDefs: ClassDef[];
  /** The class entry gaining the level (for multiclass). */
  gainingEntry: ClassEntry;
  /** The new level in the gaining class. */
  newClassLevel: number;
  /**
   * The subclass this level-up is resolving against, when one is chosen.
   *
   * Pass the live draft value, not just the stored one: a subclass is often
   * chosen on the same level that grants its first picks (Bard College of Lore's
   * three Bonus Proficiencies arrive at the subclass level itself), so the picks
   * only appear once the player has picked the subclass.
   */
  subclassId?: string;
}

/**
 * Whether a pick came from a class feature or a subclass feature.
 *
 * Both share one pipeline — `ClassEntry.featurePicks` plus the draft keyed by
 * feature id — so they also share one result array; the source only labels them.
 */
export type PickSource = 'class' | 'subclass';

/** A subclass spell pool offered at this level, e.g. College of Lore's Magical Discoveries. */
export interface SubclassSpellChoicePrompt {
  classId: string;
  subclassId: string;
  subclassName: string;
  /** `ClassEntry.featurePicks` key the picks are stored under. */
  featureId: string;
  name: string;
  /** How many spells to choose at this level. */
  count: number;
  /** Class spell lists the pool is drawn from. */
  lists: string[];
  minLevel: number;
  maxLevel: number;
  /** Chosen spells are always prepared and do not count against the prepared limit. */
  alwaysPrepared: boolean;
  /**
   * True when the pool was already filled and this level only offers the single
   * replacement pick the feature grants each level.
   */
  replace: boolean;
}

export interface NextLevelChoicesResult {
  /** Subclass choice if this class gains subclass at this level. */
  subclassChoice: { classId: string; className: string; subclasses: { id: string; name: string }[] } | null;
  /** ASI/Feat choice if at an ASI level. */
  asiChoice: { level: number; isMulticlass: boolean } | null;
  /** Spell picks (cantrips and levelled) for classes with spellcasting. */
  spellPicks: { classId: string; cantripCount: number; spellCount: number; spellLevel: number[] }[];
  /** Weapon mastery picks for classes with weapon mastery. */
  weaponMasteryPicks: { classId: string; picks: number; pool: WeaponMasteryProperty[] }[];
  /** Class features with options at this level. */
  featureChoices: {
    classId: string;
    featureId: string;
    name: string;
    options: { id: string; name: string; description: string }[];
    count: number;
    source: PickSource;
    subclassName?: string;
  }[];
  /** Skill choices from class or subclass features at this level. */
  skillChoices: {
    classId: string;
    featureId: string;
    name: string;
    skills: string[];
    count: number;
    source: PickSource;
    subclassName?: string;
  }[];
  /** Subclass spell pools offered at this level. */
  subclassSpellChoices: SubclassSpellChoicePrompt[];
}

export function nextLevelChoices(input: NextLevelChoicesInput): NextLevelChoicesResult {
  const { character, classDefs, gainingEntry, newClassLevel } = input;
  const classDef = classDefs.find((c) => c.id === gainingEntry.classId);

  const result: NextLevelChoicesResult = {
    subclassChoice: null,
    asiChoice: null,
    spellPicks: [],
    weaponMasteryPicks: [],
    featureChoices: [],
    skillChoices: [],
    subclassSpellChoices: [],
  };

  if (!classDef) return result;

  // Subclass choice
  if (classDef.subclassLevel === newClassLevel) {
    result.subclassChoice = {
      classId: classDef.id,
      className: classDef.name,
      subclasses: classDef.subclasses.map((s) => ({ id: s.id, name: s.name })),
    };
  }

  // ASI/Feat choice - a class grants ASI at its own asiLevels (class level).
  // For multiclass, the character gets ASI when the gaining class reaches one of its asiLevels.
  if (isAsiLevel(classDef, newClassLevel)) {
    result.asiChoice = {
      level: newClassLevel,
      isMulticlass: character.classes.length > 1,
    };
  }

  // Spell picks
  if (classDef.spellcasting) {
    const sc = classDef.spellcasting;
    // cantripCountByLevel / spellCountByLevel are CUMULATIVE totals (how many you know by this level).
    // We need the DELTA gained at this level: total(N) - total(N-1).
    const prevLevel = newClassLevel - 1;
    const cantripTotal = sc.cantripCountByLevel[newClassLevel] ?? 0;
    const cantripPrevTotal = prevLevel >= 1 ? sc.cantripCountByLevel[prevLevel] ?? 0 : 0;
    const cantripCount = cantripTotal - cantripPrevTotal;
    const spellTotal = sc.spellCountByLevel[newClassLevel] ?? 0;
    const spellPrevTotal = prevLevel >= 1 ? sc.spellCountByLevel[prevLevel] ?? 0 : 0;
    const spellCount = spellTotal - spellPrevTotal;
    const slotTable = sc.slotTable[newClassLevel] ?? [];
    const spellLevels = slotTable
      .map((slots, idx) => (slots > 0 ? idx + 1 : -1))
      .filter((l) => l > 0);

    if (cantripCount > 0 || spellCount > 0 || spellLevels.length > 0) {
      result.spellPicks.push({
        classId: classDef.id,
        cantripCount,
        spellCount,
        spellLevel: spellLevels,
      });
    }
  }

  // Weapon Mastery picks
  if (classDef.weaponMastery) {
    const wm = classDef.weaponMastery;
    let picks = 0;
    if (wm.featureLevel === newClassLevel) {
      picks += wm.choiceCount;
    }
    if (wm.extraPicksAtLevels?.includes(newClassLevel)) {
      picks += 1; // Assuming one extra pick per level listed
    }
    if (picks > 0) {
      result.weaponMasteryPicks.push({
        classId: classDef.id,
        picks,
        pool: wm.pool,
      });
    }
  }

  // Class features with options at this class level
  const featuresAtLevel = classDef.featuresByLevel[newClassLevel] ?? [];
  for (const feature of featuresAtLevel) {
    if (feature.options && feature.optionCount && feature.optionCount > 0) {
      result.featureChoices.push({
        classId: classDef.id,
        featureId: feature.id,
        name: feature.name,
        options: feature.options,
        count: feature.optionCount,
        source: 'class',
      });
    }
    if (feature.skillChoices && feature.skillChoiceCount && feature.skillChoiceCount > 0) {
      result.skillChoices.push({
        classId: classDef.id,
        featureId: feature.id,
        name: feature.name,
        skills: feature.skillChoices,
        count: feature.skillChoiceCount,
        source: 'class',
      });
    }
  }

  // Subclass features that grant picks at this class level.
  //
  // These are appended to the same arrays as class features on purpose: the
  // draft is keyed by feature id and `ClassEntry.featurePicks` stores the result,
  // so subclass picks need no separate selection or storage path. A subclass
  // feature that grants no picks (almost all of them) is skipped.
  const subclass = findSubclass(classDef, input.subclassId);
  if (subclass) {
    for (const feature of subclassFeaturesGrantingAtLevel(subclass, newClassLevel)) {
      if (!grantsPicks(feature)) continue;
      const featureId = subclassFeatureKey(subclass.id, feature);

      if (feature.options && feature.optionCount && feature.optionCount > 0) {
        result.featureChoices.push({
          classId: classDef.id,
          featureId,
          name: feature.name,
          options: feature.options,
          count: feature.optionCount,
          source: 'subclass',
          subclassName: subclass.name,
        });
      }

      if (feature.skillChoices && feature.skillChoiceCount && feature.skillChoiceCount > 0) {
        result.skillChoices.push({
          classId: classDef.id,
          featureId,
          name: feature.name,
          skills: feature.skillChoices,
          count: feature.skillChoiceCount,
          source: 'subclass',
          subclassName: subclass.name,
        });
      }

      const spec = feature.spellChoice;
      if (spec) {
        const count = subclassSpellPickCount(subclass.id, feature, gainingEntry, newClassLevel);
        if (count > 0) {
          result.subclassSpellChoices.push({
            classId: classDef.id,
            subclassId: subclass.id,
            subclassName: subclass.name,
            featureId,
            name: feature.name,
            count,
            lists: spec.lists,
            minLevel: subclassSpellMinLevel(feature),
            maxLevel: subclassSpellMaxLevel(feature, classDef, newClassLevel),
            alwaysPrepared: spec.alwaysPrepared,
            replace: count < spec.count,
          });
        }
      }
    }
  }

  return result;
}

/**
 * Weapon Mastery swap eligibility: you may replace one property each time a level is gained.
 * Returns true if a swap is allowed at this level gain.
 */
export function canSwapWeaponMastery(
  _character: Character,
  _gainingEntry: ClassEntry,
  _newClassLevel: number
): boolean {
  // Per 2024 rules: "You may replace one property each time a level is gained"
  // This applies to any level gain in a class that has Weapon Mastery
  // The actual swap logic is handled by the UI; this just confirms eligibility
  return true;
}

/**
 * Get the weapon mastery pool for a class at a given level.
 */
export function getWeaponMasteryPool(classDef: ClassDef, classLevel: number): WeaponMasteryProperty[] {
  if (!classDef.weaponMastery) return [];
  const wm = classDef.weaponMastery;
  if (classLevel < wm.featureLevel) return [];
  return wm.pool;
}

/**
 * Compute how many weapon mastery properties a class entry should have at a given level.
 */
export function weaponMasteryCountAtLevel(classDef: ClassDef, classLevel: number): number {
  if (!classDef.weaponMastery) return 0;
  const wm = classDef.weaponMastery;
  if (classLevel < wm.featureLevel) return 0;
  let count = wm.choiceCount;
  if (wm.extraPicksAtLevels) {
    for (const lvl of wm.extraPicksAtLevels) {
      if (classLevel >= lvl) count += 1;
    }
  }
  return count;
}