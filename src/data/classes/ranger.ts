import type { ClassDef } from '../../types/character';

export const ranger: ClassDef = {
  id: 'ranger',
  name: 'Ranger',
  hitDie: 10,
  savingThrowProficiencies: ['str', 'dex'],
  armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
  weaponProficiencies: ['Simple weapons', 'Martial weapons'],
  toolProficiencies: ['cartographer\'s tools', 'musical instrument', 'navigator\'s tools', 'land vehicles', 'water vehicles'],
  skills: {
    granted: [],
    choices: ['animalHandling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
    choiceCount: 3,
  },
  spellcasting: {
    ability: 'wis',
    cantripsMode: 'known',
    cantripCountByLevel: {},
    spellsMode: 'prepared',
    spellCountByLevel: {
      2: 2, 3: 3, 4: 4, 5: 5, 6: 5, 7: 6, 8: 6, 9: 7, 10: 7,
      11: 8, 12: 8, 13: 9, 14: 9, 15: 10, 16: 10, 17: 11, 18: 11, 19: 12, 20: 12,
    },
    slotTable: {
      2: [2],
      3: [2],
      4: [3],
      5: [3],
      6: [4, 2],
      7: [4, 2],
      8: [4, 3],
      9: [4, 3],
      10: [4, 3, 2],
      11: [4, 3, 2],
      12: [4, 3, 3],
      13: [4, 3, 3],
      14: [4, 3, 3, 1],
      15: [4, 3, 3, 1],
      16: [4, 3, 3, 2],
      17: [4, 3, 3, 2, 1],
      18: [4, 3, 3, 2, 1],
      19: [4, 3, 3, 3, 1, 1],
      20: [4, 3, 3, 3, 2, 1],
    },
    pactMagic: false,
    grantsFromSubclass: false,
  },
  subclassLevel: 3,
  sourceNote: 'SRD 5.2',
  asiLevels: [4, 8, 12, 16],
  multiclassGains: [
    'Light armor, Medium armor, Shields, Simple weapons, Martial weapons',
    'Favored Enemy, Natural Explorer',
  ],
  subclasses: [
    {
      id: 'hunter',
      classId: 'ranger',
      name: 'Hunter',
      description: 'Master techniques to take down any quarry, from hordes to titans.',
      features: [
        { level: 3, name: 'Hunter\'s Prey', description: 'Choose one: Colossus Slayer (once per turn, deal +1d8 to a creature below max HP), Giant Killer (reaction attack when Large+ creature attacks you), or Horde Breaker (extra attack on your turn vs. a different creature within 5 ft. of the original target).' },
        { level: 7, name: 'Defensive Tactics', description: 'Choose one: Escape the Horde (opportunity attacks against you have disadvantage), Multiattack Defense (when a creature hits you, gain +4 AC vs. its subsequent attacks this turn), or Steel Will (advantage on saves against frightened).' },
        { level: 11, name: 'Multiattack', description: 'Choose one: Volley (action, ranged attack vs. any number of creatures within 10 ft. of a point you can see) or Whirlwind Attack (action, melee attack vs. any number of creatures within 5 ft.).' },
        { level: 15, name: 'Superior Hunter\'s Defense', description: 'Choose one: Evasion (Dex saves for half damage → no damage on success, half on fail), Stand Against the Tide (reaction: force a missed melee attacker to repeat the attack vs. another target), or Uncanny Dodge (reaction: halve damage from an attack you see).' },
      ],
    },
    {
      id: 'beast-master',
      classId: 'ranger',
      name: 'Beast Master',
      description: 'Form a mystical bond with an animal companion that fights alongside you.',
      features: [
        { level: 3, name: 'Animal Companion', description: 'Gain a beast companion (stat block provided). It acts on your initiative. You can command it as a bonus action to take the Attack, Dash, Disengage, or Help action. It gains proficiency in two skills and all saves. Add your proficiency bonus to its AC, attack, damage, and HP (5 × Ranger level).' },
        { level: 7, name: 'Exceptional Training', description: 'Your companion gains proficiency in all saving throws. When you command it to take the Attack action, it can attack twice.' },
        { level: 11, name: 'Bestial Fury', description: 'Your companion\'s attacks count as magical. When you command it to take the Attack action, it can attack three times.' },
        { level: 15, name: 'Share Spells', description: 'When you cast a spell targeting yourself, you can also affect your companion if it\'s within 30 ft.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'favored-enemy',
        name: 'Favored Enemy',
        description: 'Choose one type: Aberrations, Beasts, Celestials, Constructs, Dragons, Elementals, Fey, Fiends, Giants, Monstrosities, Oozes, Plants, or Undead. You have advantage on Wisdom (Survival) checks to track them and Intelligence checks to recall info about them. You learn one language they speak. Choose another at 6th and 14th level.',
      },
      {
        id: 'natural-explorer',
        name: 'Natural Explorer',
        description: 'Choose one terrain: Arctic, Coast, Desert, Forest, Grassland, Mountain, Swamp, or Underdark. Double proficiency bonus on Int/Wis checks related to it. While traveling there: difficult terrain doesn\'t slow group, can\'t get lost except by magic, remain alert to danger, forage twice as much food, track exact number/size/time of creatures. Choose additional terrains at 6th and 10th level.',
      },
      {
        id: 'fighting-style',
        name: 'Fighting Style',
        description: 'Choose two Fighting Style options from: Archery, Blind Fighting, Defense, Druidic Warrior, Dueling, Thrown Weapon Fighting, Two-Weapon Fighting. You can change one when you gain a Ranger level.',
        options: [
          { id: 'archery', name: 'Archery', description: 'You gain a +2 bonus to attack rolls with ranged weapons.' },
          { id: 'blind-fighting', name: 'Blind Fighting', description: 'You have blindsight with a range of 10 ft. Within that range, you can see anything that isn\'t behind total cover, even if blinded or in darkness.' },
          { id: 'defense', name: 'Defense', description: 'While wearing armor, you gain a +1 bonus to AC.' },
          { id: 'druidic-warrior', name: 'Druidic Warrior', description: 'Learn two cantrips from the Druid list. Wisdom is your spellcasting ability for them. You can change one when you gain a Ranger level. These are Druid cantrips, not Ranger cantrips.' },
          { id: 'dueling', name: 'Dueling', description: 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
          { id: 'thrown-weapon-fighting', name: 'Thrown Weapon Fighting', description: 'You can draw a thrown weapon as part of the attack. When you hit with a ranged attack using a thrown weapon, you gain a +2 bonus to the damage roll.' },
          { id: 'two-weapon-fighting', name: 'Two-Weapon Fighting', description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the off-hand attack.' },
        ],
        optionCount: 2,
      },
    ],
    2: [
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'You can prepare and cast Ranger spells using Wisdom. You prepare a number of spells equal to half your Ranger level + Wisdom modifier (minimum 1).',
      },
      {
        id: 'deft-explorer',
        name: 'Deft Explorer',
        description: 'Choose one: Canny (gain proficiency in one skill and double proficiency bonus with it), Roving (walking speed +5, gain climb and swim speeds equal to walking speed), or Tireless (gain temporary HP equal to 1d8 + Wis mod as a bonus action, uses = proficiency bonus per Long Rest). You can change the choice when you gain a Ranger level.',
      },
    ],
    3: [
      {
        id: 'ranger-archetype',
        name: 'Ranger Archetype',
        description: 'Choose a Ranger Archetype: Hunter or Beast Master. Each grants features at 3rd, 7th, 11th, and 15th level.',
      },
      {
        id: 'primeval-awareness',
        name: 'Primeval Awareness',
        description: 'As an action, expend a spell slot. For 1 minute per slot level, sense whether Aberrations, Celestials, Dragons, Elementals, Fey, Fiends, or Undead are within 1 mile (6 miles in favored terrain). You learn which types are present, their numbers, and general direction/distance.',
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.',
      },
    ],
    5: [
      {
        id: 'extra-attack',
        name: 'Extra Attack',
        description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
      },
    ],
    6: [
      {
        id: 'favored-enemy-2',
        name: 'Favored Enemy Improvement',
        description: 'Choose an additional Favored Enemy type and associated language.',
      },
      {
        id: 'natural-explorer-2',
        name: 'Natural Explorer Improvement',
        description: 'Choose an additional favored terrain.',
      },
      {
        id: 'deft-explorer-2',
        name: 'Deft Explorer Improvement',
        description: 'Choose an additional Deft Explorer benefit.',
      },
    ],
    8: [
      {
        id: 'ability-score-improvement-2',
        name: 'Ability Score Improvement',
        description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.',
      },
      {
        id: 'land-stride',
        name: 'Land\'s Stride',
        description: 'Nonmagical difficult terrain costs no extra movement. You can pass through nonmagical plants without being slowed or taking damage. Advantage on saves vs. magical plants that impede movement.',
      },
    ],
    10: [
      {
        id: 'natural-explorer-3',
        name: 'Natural Explorer Improvement',
        description: 'Choose an additional favored terrain.',
      },
      {
        id: 'hide-in-plain-sight',
        name: 'Hide in Plain Sight',
        description: 'Spend 1 minute creating camouflage. Gain +10 to Dex (Stealth) checks while stationary. Must reapply after moving or taking an action.',
      },
    ],
    12: [
      {
        id: 'ability-score-improvement-3',
        name: 'Ability Score Improvement',
        description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.',
      },
    ],
    14: [
      {
        id: 'favored-enemy-3',
        name: 'Favored Enemy Improvement',
        description: 'Choose an additional Favored Enemy type and associated language.',
      },
      {
        id: 'vanish',
        name: 'Vanish',
        description: 'As a bonus action, take the Hide action. You can\'t be tracked by nonmagical means unless you choose to leave a trail.',
      },
    ],
    16: [
      {
        id: 'ability-score-improvement-4',
        name: 'Ability Score Improvement',
        description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.',
      },
    ],
    18: [
      {
        id: 'feral-senses',
        name: 'Feral Senses',
        description: 'You have advantage on attack rolls against creatures you can\'t see. You are aware of the location of any invisible creature within 30 ft. unless it successfully hides from you.',
      },
    ],
    19: [
      {
        id: 'epic-boon',
        name: 'Epic Boon',
        description: 'Gain an Epic Boon feat or another Ability Score Improvement.',
      },
    ],
    20: [
      {
        id: 'ability-score-improvement-5',
        name: 'Ability Score Improvement',
        description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.',
      },
      {
        id: 'foe-slayer',
        name: 'Foe Slayer',
        description: 'Once per turn, when you hit a Favored Enemy with an attack, add your Wisdom modifier to the attack roll or damage roll (choose after the roll).',
      },
    ],
  },
};