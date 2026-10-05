import type { SpeciesDef } from '../types/character';

/**
 * SRD 5.2 species (2024 D&D).
 *
 * In the 2024 rules a species is the ancestry choice. It supplies traits, size,
 * and speed. Ability score increases are now granted by backgrounds, not species.
 * The 2014 "subrace + racial ASI" structure is removed.
 *
 * Human's Versatile trait grants an Origin feat; ability-score increases are
 * handled via `SpeciesSelection` at character creation.
 */
export const SPECIES: SpeciesDef[] = [
  {
    id: 'human',
    name: 'Human',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      {
        name: 'Resourceful',
        description: 'You gain Heroic Inspiration whenever you finish a Long Rest.',
      },
      {
        name: 'Skillful',
        description: 'You gain proficiency in one skill of your choice.',
      },
      {
        name: 'Versatile',
        description:
          'You gain an Origin feat of your choice. (Skilled is recommended.)',
      },
    ],
    featLevels: [1],
    description:
      'Humanity is the most adaptable and ambitious people in the multiverse. Human versatility, drive, and willingness to take risks set them apart.',
  },
  {
    id: 'elf',
    name: 'Elf',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 60 feet.',
      },
      {
        name: 'Fey Ancestry',
        description:
          'You have Advantage on saving throws to avoid or end the Charmed condition, and magic can’t put you to sleep.',
      },
      {
        name: 'Keen Senses',
        description: 'You have proficiency in Insight, Perception, or Survival (choose one).',
      },
      {
        name: 'Trance',
        description:
          'You don’t need to sleep. A Long Rest takes 4 hours of trance meditation.',
      },
      {
        name: 'Elven Lineage',
        description:
          'Choose Drow (120-ft darkvision, Dancing Lights), High Elf (Prestidigitation, swap on LR), or Wood Elf (35-ft speed, Druidcraft). At levels 3/5 gain lineage spells (Faerie Fire/Darkness, Detect Magic/Misty Step, or Longstrider/Pass without Trace). Spellcasting ability: Int, Wis, or Cha (choose).',
      },
    ],
    featLevels: [1, 3, 5],
    description:
      'Elves have darkvision, fey ancestry, keen senses, trance, and choose a lineage granting cantrips and spells at levels 1/3/5.',
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 120 feet.',
      },
      {
        name: 'Dwarven Resilience',
        description:
          'You have Resistance to Poison damage and Advantage on saving throws to avoid or end the Poisoned condition.',
      },
      {
        name: 'Dwarven Toughness',
        description: 'Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level.',
      },
      {
        name: 'Stonecunning',
        description:
          'As a Bonus Action, gain Tremorsense 60 ft for 10 min while on stone. Uses = Proficiency Bonus, recharge on Long Rest.',
      },
    ],
    featLevels: [1],
    description:
      'Dwarves have 120-ft darkvision, poison resistance, extra HP per level, and stonecunning (tremorsense on stone).',
  },
  {
    id: 'halfling',
    name: 'Halfling',
    size: 'Small',
    speed: 30,
    abilityBonuses: {},
    traits: [
      {
        name: 'Brave',
        description: 'You have Advantage on saving throws to avoid or end the Frightened condition.',
      },
      {
        name: 'Halfling Nimbleness',
        description: 'You can move through the space of any creature larger than you.',
      },
      {
        name: 'Luck',
        description: 'When you roll a 1 on the d20 for a D20 Test, you can reroll the die and must use the new roll.',
      },
      {
        name: 'Naturally Stealthy',
        description:
          'You can take the Hide action even when obscured only by a creature at least one size larger than you.',
      },
    ],
    featLevels: [1],
    description:
      'Halflings are small, nimble folk with advantage vs fear, move through larger creatures, reroll 1s, and hide behind larger creatures.',
  },
  {
    id: 'gnome',
    name: 'Gnome',
    size: 'Small',
    speed: 30,
    abilityBonuses: {},
    traits: [
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 60 feet.',
      },
      {
        name: 'Gnomish Cunning',
        description:
          'You have Advantage on Intelligence, Wisdom, and Charisma saving throws.',
      },
      {
        name: 'Gnomish Lineage',
        description:
          'Choose Forest Gnome (Minor Illusion cantrip, Speak with Animals prepared, cast without slots PB times/LR) or Rock Gnome (Mending and Prestidigitation cantrips, create clockwork devices via Prestidigitation, 3 at a time, last 8 hrs). Spellcasting ability: Int, Wis, or Cha (choose).',
      },
    ],
    featLevels: [1],
    description:
      'Gnomes have darkvision, advantage on Int/Wis/Cha saves, and choose a lineage granting cantrips and magical abilities.',
  },
  {
    id: 'dragonborn',
    name: 'Dragonborn',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 60 feet.',
      },
      {
        name: 'Draconic Ancestry',
        description:
          'Choose a dragon progenitor. Your choice determines your Breath Weapon and Damage Resistance damage type.',
      },
      {
        name: 'Breath Weapon',
        description:
          'As an Attack action, replace one attack with a 15-ft cone or 30-ft line (5 ft wide). Dex save (DC 8 + Con mod + PB). Fail: 1d10 damage (scales at levels 5/11/17). Success: half. Uses = PB, recharge on Long Rest.',
      },
      {
        name: 'Damage Resistance',
        description: 'You have Resistance to the damage type of your Draconic Ancestry.',
      },
      {
        name: 'Draconic Flight',
        description:
          'At level 5, as a Bonus Action sprout spectral wings for 10 min (fly speed = your speed). Once per Long Rest.',
      },
    ],
    featLevels: [1, 5],
    description:
      'Dragonborn have draconic ancestry granting a breath weapon, damage resistance, darkvision, and flight at level 5.',
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 60 feet.',
      },
      {
        name: 'Fiendish Legacy',
        description:
          'Choose Abyssal (Poison resist, Poison Spray; Ray of Sickness; Hold Person), Chthonic (Necrotic resist, Chill Touch; False Life; Ray of Enfeeblement), or Infernal (Fire resist, Fire Bolt; Hellish Rebuke; Darkness). Gain level 1 benefit. At levels 3/5 gain legacy spells. Spellcasting ability: Int, Wis, or Cha (choose).',
      },
      {
        name: 'Otherworldly Presence',
        description:
          'You know the Thaumaturgy cantrip. It uses the same spellcasting ability as your Fiendish Legacy.',
      },
    ],
    featLevels: [1, 3, 5],
    description:
      'Tieflings have darkvision, choose a fiendish legacy (resistance + cantrip + spells at 3/5), and know Thaumaturgy.',
  },
  {
    id: 'goliath',
    name: 'Goliath',
    size: 'Medium',
    speed: 35,
    abilityBonuses: {},
    traits: [
      {
        name: 'Giant Ancestry',
        description:
          'Choose one: Cloud\'s Jaunt (Bonus Action teleport 30 ft), Fire\'s Burn (on hit, +1d10 fire), Frost\'s Chill (on hit, +1d6 cold, -10 ft speed), Hill\'s Tumble (on hit vs Large or smaller, Prone), Stone\'s Endurance (Reaction: reduce damage by 1d12+Con), Storm\'s Thunder (Reaction when hit: 1d8 thunder to attacker). Uses = PB, recharge on Long Rest.',
      },
      {
        name: 'Large Form',
        description:
          'At level 5, as a Bonus Action become Large for 10 min (if space allows). Advantage on Strength checks, +10 ft speed. Once per Long Rest.',
      },
      {
        name: 'Powerful Build',
        description:
          'Advantage on checks to end Grappled. Count as one size larger for carrying capacity.',
      },
    ],
    featLevels: [1, 5],
    description:
      'Goliaths have giant ancestry (choose 1 of 6 benefits), powerful build, and gain Large Form at level 5.',
  },
  {
    id: 'orc',
    name: 'Orc',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      {
        name: 'Adrenaline Rush',
        description:
          'You can take the Dash action as a Bonus Action and gain Temporary Hit Points equal to your Proficiency Bonus. Uses = PB, recharge on Short or Long Rest.',
      },
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 120 feet.',
      },
      {
        name: 'Relentless Endurance',
        description:
          'When reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once per Long Rest.',
      },
    ],
    featLevels: [1],
    description:
      'Orcs have adrenaline rush (dash + temp HP), 120-ft darkvision, and relentless endurance (drop to 1 HP).',
  },
];

export const SPECIES_BY_ID: Record<string, SpeciesDef> = Object.fromEntries(
  SPECIES.map((s) => [s.id, s]),
);
