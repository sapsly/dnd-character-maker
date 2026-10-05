import type { AbilityKey, SpeciesLineageId } from '../types/character';

/**
 * 2024 species lineages that grant spells.
 *
 * Elf, Gnome and Tiefling each pick one of three lineages instead of a single
 * fixed list. The choice is permanent and does three things:
 *
 *  - grants a signature cantrip immediately
 *  - grants another spell at level 3 and one more at level 5
 *  - lets the player choose their spellcasting ability (Int, Wis or Cha)
 *
 * Lineage spells are always prepared. Each can be cast once without a spell
 * slot, and that ability is regained on a Long Rest. They can also be cast
 * using spell slots of the appropriate level. They do not count toward the
 * number of spells a class learns. They live in the same spell list as class
 * spells, tagged so the sheet can say where each one came from.
 */

/**
 * Spells a species grants to every member, independent of any lineage choice.
 *
 * Unlike lineage grants, these are not a player choice — they apply to the
 * whole species. Tiefling is the only 2024 species with such a grant:
 * Thaumaturgy is granted by the Otherworldly Presence trait, which every
 * tiefling has regardless of Fiendish Legacy.
 *
 * Keyed by SpeciesDef.id (e.g., 'tiefling').
 */
export const SPECIES_SPELL_GRANTS: Record<string, LineageGrant[]> = {
  tiefling: [{ atLevel: 0, spellId: 'thaumaturgy' }],
};

/**
 * Every species-wide spell a character has at a given level, oldest level first.
 *
 * Modelled on `lineageSpellsUpTo`: same return shape, same "skip unresolvable
 * ids rather than emit a dangling id" behaviour, same early returns.
 * Species-wide grants are a pure function of (speciesId, characterLevel) and
 * require no persistence — unlike lineageSpellIds, which is stored because
 * level-up writes it.
 */
export function speciesSpellGrantsUpTo(
  speciesId: string | undefined,
  characterLevel: number,
  resolve: (spellId: string) => { name: string; level: number } | null,
): { spellId: string; name: string; level: number; grantedAt: number }[] {
  if (!speciesId) return [];
  const grants = SPECIES_SPELL_GRANTS[speciesId];
  if (!grants) return [];
  return grants
    .filter((g) => g.atLevel <= characterLevel)
    .map((g) => ({ spellId: g.spellId, grantedAt: g.atLevel, ...resolve(g.spellId) }))
    .filter((g): g is { spellId: string; name: string; level: number; grantedAt: number } => g.name != null);
}

export interface LineageGrant {
  /** Character level at which this spell is added. Cantrips are level 0. */
  atLevel: number;
  /** The spell's id in `src/data/spells-*.ts`. */
  spellId: string;
}

export interface SpeciesLineageDef {
  id: SpeciesLineageId;
  /** The species this lineage belongs to, matching `SpeciesDef.id`. */
  speciesId: string;
  name: string;
  summary: string;
  /** Signature cantrip plus the level 3 and 5 grants. */
  grants: LineageGrant[];
  /**
   * 2024 lets these species use Int, Wis or Cha for lineage spells. The player
   * picks one; it does not have to match the class casting ability.
   */
  spellcastingAbilityOptions: AbilityKey[];
  /** Extra trait text shown on the sheet alongside the spells. */
  bonusTrait?: string;
}

export const SPECIES_LINEAGES: SpeciesLineageDef[] = [
  // ---------------------------------------------------------------- Elf
  {
    id: 'elf-drow',
    speciesId: 'elf',
    name: 'Drow',
    summary: 'Darkvision 120 ft; Dancing Lights; Faerie Fire at 3, Darkness at 5.',
    grants: [
      { atLevel: 0, spellId: 'dancing-lights' },
      { atLevel: 3, spellId: 'faerie-fire' },
      { atLevel: 5, spellId: 'darkness' },
    ],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
  },
  {
    id: 'elf-high-elf',
    speciesId: 'elf',
    name: 'High Elf',
    summary: 'Prestidigitation, extra tool proficiency; Detect Magic at 3, Misty Step at 5.',
    grants: [
      { atLevel: 0, spellId: 'prestidigitation' },
      { atLevel: 3, spellId: 'detect-magic' },
      { atLevel: 5, spellId: 'misty-step' },
    ],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'You know Prestidigitation and gain proficiency with two additional tools of your choice. You may swap Prestidigitation on a Long Rest.',
  },
  {
    id: 'elf-wood-elf',
    speciesId: 'elf',
    name: 'Wood Elf',
    summary: 'Speed 35 ft; Druidcraft; Longstrider at 3, Pass without Trace at 5.',
    grants: [
      { atLevel: 0, spellId: 'druidcraft' },
      { atLevel: 3, spellId: 'longstrider' },
      { atLevel: 5, spellId: 'pass-without-trace' },
    ],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'Your speed increases to 35 feet.',
  },

  // -------------------------------------------------------------- Gnome
  {
    id: 'gnome-forest-gnome',
    speciesId: 'gnome',
    name: 'Forest Gnome',
    summary: 'Minor Illusion; Speak with Animals always prepared; cast it without slots.',
    grants: [
      { atLevel: 0, spellId: 'minor-illusion' },
      { atLevel: 0, spellId: 'speak-with-animals' },
    ],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'Speak with Animals is always prepared and can be cast a number of times equal to your Proficiency Bonus per Long Rest without a spell slot.',
  },
  {
    id: 'gnome-rock-gnome',
    speciesId: 'gnome',
    name: 'Rock Gnome',
    summary: 'Mending and Prestidigitation; build clockwork devices with Prestidigitation.',
    grants: [
      { atLevel: 0, spellId: 'mending' },
      { atLevel: 0, spellId: 'prestidigitation' },
    ],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'You can use Prestidigitation to create a clockwork device that lasts 8 hours. You can maintain 3 devices at a time.',
  },

  // ----------------------------------------------------------- Tiefling
  {
    id: 'tiefling-abyssal',
    speciesId: 'tiefling',
    name: 'Abyssal Legacy',
    summary: 'Poison resistance; Poison Spray; Ray of Sickness at 3, Hold Person at 5.',
    grants: [
      { atLevel: 0, spellId: 'poison-spray' },
      { atLevel: 3, spellId: 'ray-of-sickness' },
      { atLevel: 5, spellId: 'hold-person' },
    ],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'You have Resistance to Poison damage.',
  },
  {
    id: 'tiefling-chthonic',
    speciesId: 'tiefling',
    name: 'Chthonic Legacy',
    summary: 'Necrotic resistance; Chill Touch; False Life at 3, Ray of Enfeeblement at 5.',
    grants: [
      { atLevel: 0, spellId: 'chill-touch' },
      { atLevel: 3, spellId: 'false-life' },
      { atLevel: 5, spellId: 'ray-of-enfeeblement' },
    ],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'You have Resistance to Necrotic damage.',
  },
  {
    id: 'tiefling-infernal',
    speciesId: 'tiefling',
    name: 'Infernal Legacy',
    summary: 'Fire resistance; Fire Bolt; Hellish Rebuke at 3, Darkness at 5.',
    grants: [
      { atLevel: 0, spellId: 'fire-bolt' },
      { atLevel: 3, spellId: 'hellish-rebuke' },
      { atLevel: 5, spellId: 'darkness' },
    ],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'You have Resistance to Fire damage.',
  },
];

export const LINEAGES_BY_ID: Record<string, SpeciesLineageDef> = Object.fromEntries(
  SPECIES_LINEAGES.map((l) => [l.id, l]),
);

/** The lineages a given species offers, in display order. */
export function lineagesForSpecies(speciesId: string): SpeciesLineageDef[] {
  return SPECIES_LINEAGES.filter((l) => l.speciesId === speciesId);
}

/**
 * Every lineage spell a character has at a given level, oldest level first.
 *
 * Returns grant plus resolved spell so callers do not have to join twice.
 * Spells the catalog does not contain are skipped rather than emitted with a
 * dangling id, so a bad reference degrades quietly instead of crashing.
 */
export function lineageSpellsUpTo(
  lineageId: string | undefined,
  characterLevel: number,
  resolve: (spellId: string) => { name: string; level: number } | null,
): { spellId: string; name: string; level: number; grantedAt: number }[] {
  if (!lineageId) return [];
  const lineage = LINEAGES_BY_ID[lineageId];
  if (!lineage) return [];
  return lineage.grants
    .filter((g) => g.atLevel <= characterLevel)
    .map((g) => ({ spellId: g.spellId, grantedAt: g.atLevel, ...resolve(g.spellId) }))
    .filter((g): g is { spellId: string; name: string; level: number; grantedAt: number } => g.name != null);
}

/** The spell ids granted exactly on reaching `newLevel`, for level-up prompts. */
export function lineageGrantsAtLevel(lineageId: string | undefined, newLevel: number): string[] {
  if (!lineageId) return [];
  const lineage = LINEAGES_BY_ID[lineageId];
  if (!lineage) return [];
  return lineage.grants.filter((g) => g.atLevel === newLevel).map((g) => g.spellId);
}