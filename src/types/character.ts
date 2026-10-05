/**
 * Core data model for the D&D Character Manager.
 *
 * Ruleset: 2024 D&D (SRD 5.2) with level-based progression.
 *
 * Design rule: this file declares *stored* state and the *shape* of static
 * rules data. It intentionally contains no game logic. Rules live in
 * `src/lib/rules`, static content in `src/data`.
 */

// Type-only import of the accent palette. `lib/theme` imports `APP_ID` back
// from this file, so this closes a cycle in the *type* graph; `import type` is
// erased entirely at compile time, so no runtime cycle is created.
import type { Accent } from '../lib/theme';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export const ABILITY_KEYS: readonly AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const ABILITY_ABBREV: Record<AbilityKey, string> = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

export type AbilityBonusMap = Partial<Record<AbilityKey, number>>;

export type AbilityScores = Record<AbilityKey, number>;

/**
 * 2024 species pick their size: Aarakocra, Halfling (fixed Small), Human,
 * Tiefling, Owlkin, and Tabaxi offer "Small or Medium" as a player choice.
 * The `Flexible` flag lets the creation wizard render a size selector.
 */
export type CreatureSize = 'Small' | 'Medium' | 'Large' | 'Small or Medium';

export function isFlexibleSize(size: CreatureSize): boolean {
  return size === 'Small or Medium';
}

/**
 * The 8 Weapon Mastery properties defined in SRD 5.2
 * (srd/equipment.md "### Mastery Properties", line 90).
 * 'Versatile' is deliberately absent: it is a WeaponProperty, not a mastery.
 */
export type WeaponMasteryProperty =
  | 'Cleave'
  | 'Graze'
  | 'Nick'
  | 'Push'
  | 'Sap'
  | 'Slow'
  | 'Topple'
  | 'Vex';

export const WEAPON_MASTERY_PROPERTIES: readonly WeaponMasteryProperty[] = [
  'Cleave',
  'Graze',
  'Nick',
  'Push',
  'Sap',
  'Slow',
  'Topple',
  'Vex',
] as const;

/** Ordinary weapon properties (what a weapon IS), distinct from mastery properties. */
export type WeaponProperty =
  | 'Ammunition'
  | 'Finesse'
  | 'Heavy'
  | 'Loading'
  | 'Mounted'
  | 'Range'
  | 'Reach'
  | 'Thrown'
  | 'Two-Handed'
  | 'Versatile';

/**
 * Weapon properties are disjoint from mastery properties.
 * 'Versatile' is a WeaponProperty only; the mastery list does not include it.
 */
export const WEAPON_PROPERTIES: readonly WeaponProperty[] = [
  'Ammunition',
  'Finesse',
  'Heavy',
  'Loading',
  'Mounted',
  'Range',
  'Reach',
  'Thrown',
  'Two-Handed',
  'Versatile',
] as const;

export type DamageType =
  | 'bludgeoning'
  | 'piercing'
  | 'slashing'
  | 'fire'
  | 'cold'
  | 'lightning'
  | 'thunder'
  | 'acid'
  | 'necrotic'
  | 'radiant'
  | 'psychic'
  | 'force';

export type ItemRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'very rare'
  | 'legendary'
  | 'artifact'
  | 'varies';

export type ProficiencyLevel = 0 | 1 | 2; // none / proficient / expertise

export type SkillProficiency = ProficiencyLevel;

/** Skill keys are stable string ids (e.g. `athletics`, `sleight-of-hand`). */
export type SkillKey = string;
export type ToolKey = string;
export type ArmorKey = string;
export type WeaponKey = string;
export type FeatKey = string;
export type SpellKey = string;
/**
 * Id of an item held in `Character.inventory`.
 *
 * Deliberately an open `string`, not a hand-written union: the catalogues
 * (`GEAR`, `WEAPONS`, `ARMOR` in `src/data/equipment.ts`) type their `id`
 * fields as plain `string`, so a union "derived" from them would collapse back
 * to `string` anyway — narrowing further would mean editing the data files.
 * Unknown ids are tolerated at load time by `normalizeCharacter()` and render
 * as an unresolved row rather than throwing.
 */
export type ItemKey = string;

// ---------------------------------------------------------------------------
// Static rules data (populated in `src/data`)
// ---------------------------------------------------------------------------

export interface SpeciesTrait {
  name: string;
  description: string;
}

/**
 * A 2024 species ("species + ability increases"). In 2024 the Background is a
 * separate choice, so species only supplies traits, size, speed and its own
 * ability increases.
 */
export interface SpeciesDef {
  id: string;
  name: string;
  size: CreatureSize;
  /** Base walking speed in feet, before armor/speed modifiers. */
  speed: number;
  abilityBonuses: AbilityBonusMap;
  traits: SpeciesTrait[];
  /** Character levels at which this species grants a bonus feat, if any. */
  featLevels?: number[];
  description: string;
}

export interface FeatDef {
  id: string;
  name: string;
  description: string;
  prerequisites?: string;
  /** True when the feat is legal as a species feat or Origin Feat. */
  usableAsOriginFeat?: boolean;
  source?: 'general' | 'origin' | 'species' | 'item';
}

/**
 * 2024 Background = Origin Feat + ability-score increase + skill/tool
 * proficiencies + starting equipment. It no longer supplies a species.
 *
 * There is deliberately NO background *feature* field. 2024 removed features
 * entirely: D&D Beyond's official rules article states "Origin feats are
 * similar to the features each background got in the 2014 Player's Handbook",
 * and lists a 2024 background's five aspects as ability scores, skill
 * proficiencies, one tool proficiency, starting equipment, and an Origin feat.
 * The SRD 5.2 background text confirms this — each background is listed with
 * exactly those five lines and no feature. Any `featureName` you remember for
 * Acolyte, Sage, or Criminal is 2014 data and does not apply here.
 *
 * Verified against SRD 5.2: "A background lists three of your character's
 * ability scores. Increase one by 2 and another one by 1, or increase all
 * three by 1. None of these increases can raise a score above 20."
 *
 * So the bonuses are a *player choice among three listed abilities*, not a
 * fixed grant. `abilityBonusChoices` holds exactly those three keys and the
 * chosen allocation is stored on the character as an `abilityBonuses` entry
 * (base scores stay untouched so the allocation can be re-picked freely).
 */
export interface BackgroundDef {
  id: string;
  name: string;
  /**
   * Which book this background's text came from.
   *
   * 'srd' entries are verified line-by-line against the SRD 5.2 document in
   * srd/character-origins.md. 'phb' entries are transcribed from the 2024
   * Player's Handbook, which is a broader source than the SRD, and are shown
   * with a badge in the UI so the distinction is never hidden from the player.
   */
  source: 'srd' | 'phb';
  /**
   * Slug of the granted Origin feat. Resolves against `FEATS` only for the four
   * Origin feats the SRD catalog carries (alert, magic-initiate, savage-attacker,
   * skilled); the other PHB Origin feats use canonical slugs that are not in
   * the catalog yet, so `originFeatName`/`originFeatDescription` below are the
   * authoritative display source and must not be derived from this lookup.
   */
  originFeatId: FeatKey;
  /** Display name, including the class variant for Magic Initiate. */
  originFeatName: string;
  /** Verbatim benefit text for the Origin feat this background grants. */
  originFeatDescription: string;
  /** The three abilities this background may raise. */
  abilityBonusChoices: AbilityKey[];
  /** Granted outright. */
  skillsGranted: SkillKey[];
  /** Offered as a "pick N" choice. */
  skillChoices: SkillKey[];
  skillChoiceCount: number;
  toolsGranted: ToolKey[];
  /** Offered as a "pick N" choice. Display-ready strings (e.g., "Artisan's Tools (one kind of your choice)"). */
  toolChoices: ToolKey[];
  toolChoiceCount: number;
  /**
   * Machine-readable category for toolChoices, so the creation wizard knows
   * which catalog to offer. Only used when toolChoiceCount > 0.
   * 'artisansTools' = one of the 17 artisan tools; 'gamingSet' = one of the 4 gaming sets.
   */
  toolChoiceCategory?: 'artisansTools' | 'gamingSet';
  description: string;
}

/** One selectable option inside a class feature's "choose" block. */
export interface FeatureOption {
  id: string;
  name: string;
  description: string;
  /** Extra data for option kinds that need a sub-pick (e.g. Fighting Style). */
  spellIds?: SpellKey[];
}

export interface ClassFeature {
  id: string;
  name: string;
  description: string;
  /** Present when the player must pick from a pool at this feature. */
  options?: FeatureOption[];
  optionCount?: number;
  /** Skills offered by this feature, if any. */
  skillChoices?: SkillKey[];
  skillChoiceCount?: number;
}

export interface SubclassDef {
  id: string;
  classId: string;
  name: string;
  description: string;
  features: SubclassFeature[];
}

/**
 * A spell pool offered by a subclass feature that is not the class's own spell
 * list (e.g. Bard College of Lore's Magical Discoveries draws from the cleric,
 * druid, and wizard lists).
 *
 * The pick is stored under `ClassEntry.featurePicks[feature.id]`, the same map
 * class feature picks use, so no extra persisted field is needed.
 */
export interface SubclassSpellChoice {
  /** How many spells are chosen each time this feature is gained. */
  count: number;
  /** Class spell lists the draws come from. */
  lists: string[];
  /**
   * Lowest spell level the pool may contain. Defaults to 1 — cantrips are never
   * offered by a subclass spell pool.
   */
  minLevel?: number;
  /**
   * Highest spell level the pool may contain. Left unset by default: 2024 rules
   * do not cap these picks by slot level, and inventing a cap would be a rule
   * error. Set it only where a real published feature states one.
   */
  maxLevel?: number;
  /** Chosen spells are always prepared and do not count against the prepared limit. */
  alwaysPrepared: boolean;
  /** The player may swap one chosen spell each time a level is gained in this class. */
  replaceableEachLevel?: boolean;
}

/**
 * A feature granted by a subclass.
 *
 * The pick fields mirror `ClassFeature` on purpose: both are surfaced through the
 * same level-up choice pipeline and stored in the same `ClassEntry.featurePicks`
 * map, so any subclass can offer picks without new plumbing.
 */
export interface SubclassFeature {
  /**
   * Explicit stable id, unique within the subclass. Doubles as the
   * `ClassEntry.featurePicks` key for this feature's picks.
   *
   * Optional: when omitted, `subclassFeatureKey()` derives the key from the
   * enclosing subclass id plus this feature's name, so the ~150 existing
   * subclass features need no hand-written ids. Give an explicit id to any
   * feature that grants picks so its stored picks survive a rename.
   */
  id?: string;
  level: number;
  name: string;
  description: string;
  /** Present when the player picks from a pool of discrete options. */
  options?: FeatureOption[];
  optionCount?: number;
  /** Skills offered by this feature. */
  skillChoices?: SkillKey[];
  skillChoiceCount?: number;
  /** Spells offered by this feature, possibly outside the class's own list. */
  spellChoice?: SubclassSpellChoice;
}

/**
 * 2024 spellcasting rules are irregular: cantrips and levelled spells may be
 * "known" (fixed list) or "prepared" (chose each rest). Counts differ per
 * class level, so both are stored as per-class-level maps.
 */
export interface ClassSpellcastingDef {
  ability: AbilityKey;
  /** How cantrips are acquired. */
  cantripsMode: 'known' | 'fixed';
  /** Class level -> number of cantrips known (mode 'known') or granted (mode 'fixed'). */
  cantripCountByLevel: Record<number, number>;
  /** How levelled spells are acquired. */
  spellsMode: 'known' | 'prepared';
  /** Class level -> count to know. For 'prepared' classes, the number you may prepare. */
  spellCountByLevel: Record<number, number>;
  /** Class level -> spell level (1-9) -> number of slots. */
  slotTable: Record<number, number[]>;
  /** Warlock-style Pact Magic: slots come from this single track. */
  pactMagic?: boolean;
  /** Subclass that grants spellcasting (e.g. a Cleric domain). */
  grantsFromSubclass?: boolean;
}

export interface ClassSkillDef {
  granted: SkillKey[];
  choices: SkillKey[];
  choiceCount: number;
}

export interface ClassWeaponMasteryDef {
  /** Class level at which the mastery-pick feature arrives. */
  featureLevel: number;
  /** How many mastery properties are chosen. */
  choiceCount: number;
  /** Pool the properties are drawn from. */
  pool: WeaponMasteryProperty[];
  /** Levels at which an extra pick is granted. */
  extraPicksAtLevels?: number[];
}

export interface ClassDef {
  id: string;
  name: string;
  hitDie: number;
  savingThrowProficiencies: AbilityKey[];
  /** Free-text proficiency groups, e.g. "Light armor", "All weapons". */
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: ToolKey[];
  skills: ClassSkillDef;
  spellcasting?: ClassSpellcastingDef;
  /** Character level within this class at which the subclass is chosen. */
  subclassLevel: number;
  subclasses: SubclassDef[];
  /** Class level -> features gained at that class level. */
  featuresByLevel: Record<number, ClassFeature[]>;
  weaponMastery?: ClassWeaponMasteryDef;
  /** What a 1st-level multiclass into this class grants, in PHB order. */
  multiclassGains: string[];
  /** Class level at which the class grants an extra feat on top of the normal ASI. */
  extraFeatLevel?: number;
  /** Character levels at which this class offers an ASI/Feat choice. */
  asiLevels: number[];
  /** Source used to sort/verify the class list. */
  sourceNote?: string;
}

export interface WeaponDef {
  id: string;
  name: string;
  category: 'simple' | 'martial';
  /** e.g. "1d8" or "1d6+2" for versatile damage. */
  damage: string;
  damageType: DamageType;
  /** The single Weapon Mastery property this weapon grants in 2024. */
  mastery: WeaponMasteryProperty;
  ranged: boolean;
  /** Versatile damage dice when wielded two-handed, if applicable. */
  versatileDamage?: string;
  weightLb: number;
  cost: string;
  description?: string;
}

export interface ArmorDef {
  id: string;
  name: string;
  category: 'light' | 'medium' | 'heavy' | 'shield';
  /** Base AC before modifiers, or `null` when the item is not armor. */
  baseAc: number | null;
  dexterityCap: number | null;
  stealthDisadvantage: boolean;
  strengthRequired: number;
  cost: string;
  weightLb: number;
  description?: string;
}

export interface ItemDef {
  id: string;
  name: string;
  category: 'gear' | 'magic' | 'weapon' | 'armor' | 'container';
  rarity: ItemRarity;
  requiresAttunement: boolean;
  description: string;
  weightLb?: number;
  cost?: string;
  /** Magic items with limited charges/uses. */
  charges?: number;
}

/**
 * Species that grant spells pick a lineage instead of a single fixed list.
 *
 * In 2024 Elf, Gnome and Tiefling each offer three lineages. The choice sets a
 * signature cantrip, adds spells at levels 3 and 5, and lets the player pick
 * their spellcasting ability (Int, Wis or Cha). The union is closed on
 * purpose so a typo is a compile error rather than a spell that silently never
 * appears in the picker.
 */
export type SpeciesLineageId =
  // Elf
  | 'elf-drow'
  | 'elf-high-elf'
  | 'elf-wood-elf'
  // Gnome
  | 'gnome-forest-gnome'
  | 'gnome-rock-gnome'
  // Tiefling
  | 'tiefling-abyssal'
  | 'tiefling-chthonic'
  | 'tiefling-infernal';

export interface SpellDef {
  id: string;
  name: string;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  school: string;
  castingTime: string;
  range: string;
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialText?: string;
    ritual: boolean;
  };
  duration: string;
  concentration: boolean;
  /** Class ids that can cast it. */
  classes: string[];
  /**
   * Species lineages that grant this spell, as `SpeciesLineageId` values.
   *
   * A 2024 lineage grant is NOT a class feature: the spell is added to the
   * character's list at a fixed level and is cast without spending a slot. It
   * is kept out of `classes` deliberately so the class spell pools stay honest,
   * then surfaced alongside class spells with a source tag in the UI.
   */
  speciesLineages?: SpeciesLineageId[];
  description: string;
}

// ---------------------------------------------------------------------------
// Choice system
// ---------------------------------------------------------------------------

/**
 * Every deferred or resolved decision the player has to make is represented as
 * a `Choice`. The rules engine derives which choices are outstanding; this
 * keeps level-up, multiclass, and mid-session retraining consistent.
 */
export type ChoiceKind =
  | 'originFeat'
  | 'backgroundSkills'
  | 'backgroundTools'
  | 'classSkills'
  | 'subclass'
  | 'cantrips'
  | 'spellsKnown'
  | 'spellsPrepared'
  | 'weaponMastery'
  | 'speciesFeat'
  | 'featOrAsi'
  | 'asiAbilityIncrease'
  | 'fightingStyle'
  | 'toolProficiency'
  | 'proficiency'
  | 'other';

export interface ChoicePick {
  /** Feat id, spell id, ability key, mastery property, skill key, etc. */
  optionId: string;
  /** Set when the pick is an Ability Score Improvement rather than a feat. */
  abilityIncreases?: AbilityBonusMap;
  note?: string;
}

export interface Choice {
  /** Stable unique id. */
  id: string;
  kind: ChoiceKind;
  /** Owning class entry id, when the choice is class-specific. */
  classEntryId?: string;
  /** Total character level at which this choice became available. */
  grantedAtLevel: number;
  label: string;
  /** How many picks are required to resolve. */
  count: number;
  picks: ChoicePick[];
  resolved: boolean;
}

// ---------------------------------------------------------------------------
// Character
// ---------------------------------------------------------------------------

export interface CharacterMeta {
  name: string;
  playerName: string;
  pronouns: string;
  avatarColor: string;
  isFavorite: boolean;
}

export type AbilityScoreMethod = 'standard' | 'pointBuy' | 'rolled';

export interface ClassEntry {
  /** Unique per character so multiclasses of the same class stay distinct. */
  id: string;
  classId: string;
  /** Levels taken in this class. Level 1 class is `isPrimary`. */
  level: number;
  isPrimary: boolean;
  subclassId?: string;
  /** Skill picks made for this class entry. */
  skillPicks: SkillKey[];
  /** Cantrip spell ids known. */
  cantripIds: SpellKey[];
  /** Levelled spell ids for "known" classes. */
  spellIdsKnown: SpellKey[];
  /** Levelled spell ids for "prepared" classes. */
  spellIdsPrepared: SpellKey[];
  /** Weapon mastery properties held by this class entry. */
  weaponMasteries: WeaponMasteryProperty[];
  /** Graspable/defensive sub-picks stored as "featureId::optionId". */
  featurePicks: Record<string, string[]>;
  /**
   * The starting equipment option the player chose for this class.
   * Holds the option id (e.g., 'a', 'b', or 'c') so the verbatim contents
   * can be resolved from the data at display time. Optional for back-compat
   * with characters saved before this field existed.
   */
  startingEquipmentOptionId?: string;
}

export interface CharacterCombat {
  /** Armor id, or 'none' / 'unarmored'. */
  armorId: string;
  shieldEquipped: boolean;
  /** Monk / Barbarian / other unarmored AC source. */
  unarmoredAbility?: AbilityKey;
  /** Manual flat AC adjustments. */
  acBonusFlat: number;
  speedBonus: number;
  initiativeBonus: number;
  /** External flat HP bonuses (Constitution, boons, items). */
  hpBonusFlat: number;
  /** Overrides the computed max HP. */
  hpOverride?: number;
  hitPointsCurrent: number;
  temporaryHitPoints: number;
  exhaustionLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  conditions: string[];
}

export interface InventoryItem {
  itemId: ItemKey;
  quantity: number;
  equipped: boolean;
  attuned: boolean;
  chargesUsed?: number;
}

export interface CharacterNotes {
  appearance: string;
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
  notes: string;
  privateNotes: string;
}

export interface HitDiePool {
  die: number;
  total: number;
  used: number;
}

export interface SpeciesSelection {
  speciesId: string;
  /**
   * Only populated for flexible species, where the player chooses which
   * abilities receive the bonus (Human is +2/+1/0 arranged as the player
   * likes). Empty for every species with a fixed pattern, in which case the
   * bonuses come straight from the species definition.
   */
  abilityBonuses: AbilityBonusMap;
  /**
   * Which lineage the player took, for species that offer a choice (Elf,
   * Gnome, Tiefling). Optional for back-compat with characters saved before
   * lineages existed, and empty for species with no lineage choice at all.
   */
  lineageId?: SpeciesLineageId;
}

export interface BackgroundSelection {
  backgroundId: string;
  /**
   * The player's chosen allocation across the background's three listed
   * abilities. Either +2/+1 across two of them, or +1/+1/+1 across all three.
   * Empty until the player allocates it.
   */
  abilityBonuses: AbilityBonusMap;
  /**
   * Tool proficiency chosen from the background's toolChoices (e.g., a specific
   * Artisan's Tool or Gaming Set). Stored as the display name from the tool catalog
   * (e.g., "Calligrapher's Supplies"). Empty if the background has no tool choice
   * or the player hasn't picked yet.
   *
   * 2024 rule: "one tool — either a specific tool or one chosen from the Artisan's
   * Tools category." Each Artisan's Tool is a SEPARATE proficiency (17 distinct
   * tools), not a single "Artisan's Tools" proficiency.
   */
  toolProficiencies?: string[];
  /**
   * The starting equipment option the player chose for this background.
   * Holds the option id (e.g., 'a' or 'b') so the verbatim contents can be
   * resolved from the data at display time. Optional for back-compat with
   * characters saved before this field existed.
   */
  startingEquipmentOptionId?: string;
}

/** Coin purse with copper, silver, and gold pieces. Uses the same order as COIN_TYPES. */
export interface CoinPurse {
  cp: number;
  sp: number;
  gp: number;
}

export interface Character {
  id: string;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;

  meta: CharacterMeta;

  /**
   * Per-character accent override, or `null`/absent to follow the app-wide
   * accent. Optional on purpose: characters saved before this field existed
   * must keep loading, and `null` is what "cleared back to the app default"
   * writes. Applied as `data-character-accent` on the character sheet's own
   * root — never on `<html>`, which would tint every other character too.
   */
  accent?: Accent | null;

  /** Total character level. Progression is level-based, not XP-based. */
  level: number;
  /** Optional XP tracker; never gates progression. */
  xp: number;

  classes: ClassEntry[];
  species: SpeciesSelection;
  background: BackgroundSelection;

  /**
   * Spells granted by the character's species lineage (2024 PHB), by level.
   *
   * Deliberately its own field rather than folded into any `ClassEntry`'s
   * `spellIdsPrepared`: a lineage spell is cast without expending a spell slot
   * in 2024, so mixing the two would wrongly consume one of the character's
   * prepared picks, and re-leveling must never duplicate a grant.
   *
   * Optional and defaulted to `{}` on read so characters saved before this
   * field existed keep loading.
   */
  lineageSpellIds?: Record<number, SpellKey[]>;

  abilityScoreMethod: AbilityScoreMethod;
  /**
   * The 8-15 allocation the player made, *before* species/background bonuses.
   * Species and background bonuses are applied at read time so that changing
   * species in the wizard can never double-apply a bonus.
   */
  abilityScoreBase: AbilityScores;

  choices: Choice[];

  combat: CharacterCombat;
  hitDice: HitDiePool;
  deathSaves: { successes: number; failures: number };
  /** Spell level (1-9) -> number of slots spent since the last long rest. */
  spellSlotsUsed: Record<number, number>;
  /** Limited-use class features, e.g. `fighter:second-wind:3`. */
  featureUses: Record<string, number>;

  inventory: InventoryItem[];
  /** Coin purse for tracking copper, silver, and gold pieces. Defaults to zero. */
  coins: CoinPurse;
  notes: CharacterNotes;
}

// ---------------------------------------------------------------------------
// Export envelope
// ---------------------------------------------------------------------------

export const APP_ID = 'dnd-character-manager';
export const SCHEMA_VERSION = 1;

export interface CharacterFile {
  kind: typeof APP_ID;
  schemaVersion: number;
  exportedAt: string;
  character: Character;
}

export interface CharacterFileInput {
  kind?: string;
  schemaVersion?: number;
  exportedAt?: string;
  character?: unknown;
}

// ---------------------------------------------------------------------------
// Derived / read-model types (produced by `src/lib/rules`)
// ---------------------------------------------------------------------------

export interface SavingThrowProficiency {
  ability: AbilityKey;
  proficient: boolean;
  modifier: number;
  /**
   * Set by `deriveCharacter` when a species trait grants advantage on this
   * save (Dwarf poison, Gnome magic, Halfling frightened). Optional because
   * most sources never grant it.
   */
  advantage?: boolean;
}

export interface SkillProficiencyEntry {
  key: SkillKey;
  name: string;
  ability: AbilityKey;
  abilityLabel: string;
  /** Final = ability mod + proficiency level (+ other bonuses). */
  modifier: number;
  proficiency: SkillProficiency;
  expertise: boolean;
  source: string;
}

export interface ArmorClassBreakdown {
  label: string;
  value: number | null;
  note?: string;
}

export interface ArmorClassResult {
  total: number;
  formula: string;
  breakdown: ArmorClassBreakdown[];
}

export interface HitPointBreakdownRow {
  label: string;
  roll: string;
  result: number;
  note?: string;
}

export interface HitPointResult {
  max: number;
  /** Max before any manual override, so the UI can offer "use computed". */
  computed: number;
  current: number;
  temporary: number;
  rows: HitPointBreakdownRow[];
}

export interface SpellSlotRow {
  level: number;
  total: number;
  used: number;
  pactMagic: boolean;
}

export interface InitiativeResult {
  modifier: number;
  totalBonus: number;
  passivePerception: number;
}

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
  spellSlots: SpellSlotRow[];
  spellSaveDc: Record<AbilityKey, number> | null;
  spellAttackBonus: Record<AbilityKey, number> | null;
  outstandingChoices: Choice[];
  species: SpeciesDef | null;
  background: BackgroundDef | null;
  classDefs: ClassDef[];
  casterClasses: ClassDef[];
}
