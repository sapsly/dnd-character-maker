import type { FeatDef } from '../types/character';

/**
 * SRD 5.2 feats (2024 D&D).
 *
 * 2024 separates feats into categories:
 *  - Origin feats (granted at 1st level by Background or species; swappable).
 *  - General feats (taken via an ASI/feat slot, typically Level 4+).
 *  - Fighting Style feats (require Fighting Style class feature).
 *  - Epic Boon feats (Level 19+).
 *
 * Prerequisites are stored as short human-readable strings rather than
 * structured objects: they are only ever displayed in the UI, and the SRD
 * wording varies enough that parsing them would add fragility for no gain.
 */
export const FEATS: FeatDef[] = [
  // ---------------- Origin feats ----------------
  {
    id: 'alert',
    name: 'Alert',
    source: 'origin',
    usableAsOriginFeat: true,
    description:
      'Add your Proficiency Bonus to Initiative. After rolling Initiative, you can swap your Initiative with that of one willing ally in the same combat. You cannot use this swap if you or the ally is Incapacitated.',
  },
  {
    id: 'magic-initiate',
    name: 'Magic Initiate',
    source: 'origin',
    usableAsOriginFeat: true,
    description:
      'You learn two cantrips and one level 1 spell from the Cleric, Druid, or Wizard list. You can cast the level 1 spell once per Long Rest without a slot. Repeatable with a different spell list.',
  },
  {
    id: 'savage-attacker',
    name: 'Savage Attacker',
    source: 'origin',
    usableAsOriginFeat: true,
    description:
      'Once per turn when you hit with a weapon, you can roll the weapon damage dice twice and use either roll.',
  },
  {
    id: 'skilled',
    name: 'Skilled',
    source: 'origin',
    usableAsOriginFeat: true,
    description: 'You gain proficiency in any combination of three skills or tools of your choice. Repeatable.',
  },

  // ---------------- General feats ----------------
  {
    id: 'ability-score-improvement',
    name: 'Ability Score Improvement',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Increase one ability score by 2, or two ability scores by 1. Cannot increase a score above 20. Repeatable.',
  },
  {
    id: 'grappler',
    name: 'Grappler',
    source: 'general',
    prerequisites: 'Level 4+, Strength or Dexterity 13+',
    description:
      'Increase Strength or Dexterity by 1 (max 20). When you hit with an Unarmed Strike, you can deal damage and grapple. You have Advantage on attacks against creatures you grapple. You can move a grappled creature of your size or smaller without extra movement.',
  },

  // ---------------- Fighting Style feats ----------------
  {
    id: 'archery',
    name: 'Archery',
    source: 'general',
    prerequisites: 'Fighting Style feature',
    description: 'You gain a +2 bonus to attack rolls you make with Ranged weapons.',
  },
  {
    id: 'defense',
    name: 'Defense',
    source: 'general',
    prerequisites: 'Fighting Style feature',
    description: 'While you are wearing Light, Medium, or Heavy armor, you gain a +1 bonus to AC.',
  },
  {
    id: 'great-weapon-fighting',
    name: 'Great Weapon Fighting',
    source: 'general',
    prerequisites: 'Fighting Style feature',
    description:
      'When you roll damage for a melee attack with a Two-Handed or Versatile weapon, treat any 1 or 2 on a damage die as a 3.',
  },
  {
    id: 'two-weapon-fighting',
    name: 'Two-Weapon Fighting',
    source: 'general',
    prerequisites: 'Fighting Style feature',
    description:
      'When you make the extra attack from the Light property, you can add your ability modifier to that attack damage.',
  },

  // ---------------- Epic Boon feats (Level 19+) ----------------
  {
    id: 'boon-of-combat-prowess',
    name: 'Boon of Combat Prowess',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Increase one ability score by 1 (max 30). When you miss an attack, you can hit instead. Once per turn.',
  },
  {
    id: 'boon-of-dimensional-travel',
    name: 'Boon of Dimensional Travel',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Increase one ability score by 1 (max 30). After taking the Attack or Magic action, you can teleport up to 30 feet to an unoccupied space you can see.',
  },
  {
    id: 'boon-of-fate',
    name: 'Boon of Fate',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Increase one ability score by 1 (max 30). When a creature within 60 ft succeeds or fails a D20 test, roll 2d4 and apply as bonus or penalty. Once per rest.',
  },
  {
    id: 'boon-of-irresistible-offense',
    name: 'Boon of Irresistible Offense',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Increase Strength or Dexterity by 1 (max 30). Your Bludgeoning, Piercing, and Slashing damage ignores Resistance. On a natural 20, deal extra damage equal to the increased ability score.',
  },
  {
    id: 'boon-of-spell-recall',
    name: 'Boon of Spell Recall',
    source: 'item',
    prerequisites: 'Level 19+, Spellcasting feature',
    description:
      'Increase Intelligence, Wisdom, or Charisma by 1 (max 30). When you cast a level 1-4 spell, roll 1d4; if it matches the slot level, the slot is not expended.',
  },
  {
    id: 'boon-of-the-night-spirit',
    name: 'Boon of the Night Spirit',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Increase one ability score by 1 (max 30). In dim light or darkness, you can become Invisible as a Bonus Action (ends after action/Bonus Action/Reaction). You have Resistance to all damage except Psychic and Radiant in dim light/darkness.',
  },
  {
    id: 'boon-of-truesight',
    name: 'Boon of Truesight',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Increase one ability score by 1 (max 30). You gain Truesight with a range of 60 feet.',
  },
];

export const FEATS_BY_ID: Record<string, FeatDef> = Object.fromEntries(
  FEATS.map((f) => [f.id, f]),
);

export const ORIGIN_FEATS: FeatDef[] = FEATS.filter((f) => f.source === 'origin');
export const GENERAL_FEATS: FeatDef[] = FEATS.filter((f) => f.source === 'general');
