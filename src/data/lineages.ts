import type { SpeciesLineageDef, LineageGrant } from '../types/character';

/**
 * 2024 species lineages that grant spells, rebuilt from dnd2024.wikidot.com.
 *
 * Elf, Gnome and Tiefling pick one lineage instead of a single fixed list. The
 * choice is permanent and does three things:
 *
 *  - grants a signature cantrip immediately
 *  - (Elf/Tiefling) grants another spell at level 3 and one more at level 5
 *  - lets the player choose their spellcasting ability (Int, Wis or Cha)
 *
 * Lineage spells are always prepared. Each can be cast once without a spell
 * slot, and that ability is regained on a Long Rest. They can also be cast
 * using spell slots of the appropriate level.
 *
 * Elf gained two lineages on the site: Lorwyn Elf and Shadowmoor Elf. Gnome's
 * lineages are bullet options (both spells at level 0), not a table.
 */

/**
 * Spells a species grants to every member, independent of any lineage choice.
 *
 * Rebuilt from the site: Tiefling (Thaumaturgy), Aasimar (Light), plus species
 * from the Lorwyn and neighbours pages whose cantrip/level spells are not a
 * choice: Rimekin, Flamekin, Faerie, Khoravar. (Valen is not a species on the
 * site and was removed.)
 *
 * Keyed by SpeciesDef.id.
 */
export const SPECIES_SPELL_GRANTS: Record<string, LineageGrant[]> = {
  'aasimar': [{ atLevel: 0, spellId: 'light' }],
  'tiefling': [{ atLevel: 0, spellId: 'thaumaturgy' }],
  'khoravar': [{ atLevel: 0, spellId: 'friends' }],
  'faerie': [{ atLevel: 0, spellId: 'druidcraft' }, { atLevel: 3, spellId: 'faerie-fire' }, { atLevel: 5, spellId: 'enlarge-reduce' }],
  'flamekin': [{ atLevel: 0, spellId: 'produce-flame' }, { atLevel: 3, spellId: 'burning-hands' }, { atLevel: 5, spellId: 'flame-blade' }],
  'rimekin': [{ atLevel: 0, spellId: 'ray-of-frost' }, { atLevel: 3, spellId: 'ice-knife' }, { atLevel: 5, spellId: 'flame-blade' }],
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

export const SPECIES_LINEAGES: SpeciesLineageDef[] = [
  {
    id: 'elf-drow',
    speciesId: 'elf',
    name: 'Drow',
    summary: 'The range of your Darkvision increases to 120 feet. You also know the Dancing Lights cantrip.',
    grants: [{ atLevel: 0, spellId: 'dancing-lights' }, { atLevel: 3, spellId: 'faerie-fire' }, { atLevel: 5, spellId: 'darkness' }],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'The range of your Darkvision increases to 120 feet. You also know the Dancing Lights cantrip.',
  },
  {
    id: 'elf-high-elf',
    speciesId: 'elf',
    name: 'High Elf',
    summary: 'You know the Prestidigitation cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Wizard spell list.',
    grants: [{ atLevel: 0, spellId: 'prestidigitation' }, { atLevel: 3, spellId: 'detect-magic' }, { atLevel: 5, spellId: 'misty-step' }],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'You know the Prestidigitation cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Wizard spell list.',
  },
  {
    id: 'elf-wood-elf',
    speciesId: 'elf',
    name: 'Wood Elf',
    summary: 'Your Speed increases to 35 feet. You also know the Druidcraft cantrip.',
    grants: [{ atLevel: 0, spellId: 'druidcraft' }, { atLevel: 3, spellId: 'longstrider' }, { atLevel: 5, spellId: 'pass-without-trace' }],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'Your Speed increases to 35 feet. You also know the Druidcraft cantrip.',
  },
  {
    id: 'elf-lorwyn-elf',
    speciesId: 'elf',
    name: 'Lorwyn Elf',
    summary: 'You know the Thorn Whip cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Druid spell list.',
    grants: [{ atLevel: 0, spellId: 'thorn-whip' }, { atLevel: 3, spellId: 'command' }, { atLevel: 5, spellId: 'silence' }],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'You know the Thorn Whip cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Druid spell list.',
    source: 'lorwyn',
  },
  {
    id: 'elf-shadowmoor-elf',
    speciesId: 'elf',
    name: 'Shadowmoor Elf',
    summary: 'The range of your Darkvision increases to 120 feet. You also know the Starry Wisp cantrip.',
    grants: [{ atLevel: 0, spellId: 'starry-wisp' }, { atLevel: 3, spellId: 'heroism' }, { atLevel: 5, spellId: 'gentle-repose' }],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'The range of your Darkvision increases to 120 feet. You also know the Starry Wisp cantrip.',
    source: 'lorwyn',
  },
  {
    id: 'tiefling-abyssal',
    speciesId: 'tiefling',
    name: 'Abyssal',
    summary: 'You have Resistance to Poison damage. You also know the Poison Spray cantrip.',
    grants: [{ atLevel: 0, spellId: 'poison-spray' }, { atLevel: 3, spellId: 'ray-of-sickness' }, { atLevel: 5, spellId: 'hold-person' }],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'You have Resistance to Poison damage. You also know the Poison Spray cantrip.',
  },
  {
    id: 'tiefling-chthonic',
    speciesId: 'tiefling',
    name: 'Chthonic',
    summary: 'You have Resistance to Necrotic damage. You also know the Chill Touch cantrip.',
    grants: [{ atLevel: 0, spellId: 'chill-touch' }, { atLevel: 3, spellId: 'false-life' }, { atLevel: 5, spellId: 'ray-of-enfeeblement' }],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'You have Resistance to Necrotic damage. You also know the Chill Touch cantrip.',
  },
  {
    id: 'tiefling-infernal',
    speciesId: 'tiefling',
    name: 'Infernal',
    summary: 'You have Resistance to Fire damage. You also know the Fire Bolt cantrip.',
    grants: [{ atLevel: 0, spellId: 'fire-bolt' }, { atLevel: 3, spellId: 'hellish-rebuke' }, { atLevel: 5, spellId: 'darkness' }],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'You have Resistance to Fire damage. You also know the Fire Bolt cantrip.',
  },
  {
    id: 'gnome-forest-gnome',
    speciesId: 'gnome',
    name: 'Forest Gnome',
    summary: 'Forest Gnome. You know the Minor Illusion cantrip. You also always have the Speak with Animals spell prepared. You can cast it without a spell slot a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. You can also use any spell slots you have to cast the spell.',
    grants: [{ atLevel: 0, spellId: 'minor-illusion' }, { atLevel: 0, spellId: 'speak-with-animals' }],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'Forest Gnome. You know the Minor Illusion cantrip. You also always have the Speak with Animals spell prepared. You can cast it without a spell slot a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. You can also use any spell slots you have to cast the spell.',
  },
  {
    id: 'gnome-rock-gnome',
    speciesId: 'gnome',
    name: 'Rock Gnome',
    summary: 'Rock Gnome. You know the Mending and Prestidigitation cantrips. In addition, you can spend 10 minutes casting Prestidigitation to create a Tiny clockwork device (AC 5,1 HP), such as a toy, fire starter, or music box. When you create the device, you determine its function by choosing one effect from Prestidigitation; the device produces that effect whenever you or another creature takes a Bonus Action to activate it with a touch. If the chosen effect has options within it, you choose one of those options for the device when you create it. For example, if you choose the spell\'s ignite-extinguish effect, you determine whether the device ignites or extinguishes fire; the device doesn\'t do both. You can have three such devices in existence at a time, and each falls apart 8 hours after its creation or when you dismantle it with a touch as a Utilize action.',
    grants: [{ atLevel: 0, spellId: 'mending' }, { atLevel: 0, spellId: 'prestidigitation' }],
    spellcastingAbilityOptions: ['int', 'wis', 'cha'],
    bonusTrait: 'Rock Gnome. You know the Mending and Prestidigitation cantrips. In addition, you can spend 10 minutes casting Prestidigitation to create a Tiny clockwork device (AC 5,1 HP), such as a toy, fire starter, or music box. When you create the device, you determine its function by choosing one effect from Prestidigitation; the device produces that effect whenever you or another creature takes a Bonus Action to activate it with a touch. If the chosen effect has options within it, you choose one of those options for the device when you create it. For example, if you choose the spell\'s ignite-extinguish effect, you determine whether the device ignites or extinguishes fire; the device doesn\'t do both. You can have three such devices in existence at a time, and each falls apart 8 hours after its creation or when you dismantle it with a touch as a Utilize action.',
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
