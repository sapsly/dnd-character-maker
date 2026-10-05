import type { ClassDef } from '../../types/character';

export const paladin: ClassDef = {
  id: 'paladin',
  name: 'Paladin',
  hitDie: 10,
  savingThrowProficiencies: ['wis', 'cha'],
  armorProficiencies: ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'],
  weaponProficiencies: ['Simple weapons', 'Martial weapons'],
  toolProficiencies: ['artisan\'s tools', 'playing card set'],
  skills: {
    granted: [],
    choices: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
    choiceCount: 2,
  },
  spellcasting: {
    ability: 'wis',
    cantripsMode: 'known',
    cantripCountByLevel: {},
    spellsMode: 'prepared',
    spellCountByLevel: {
      2: 2, 3: 2, 4: 3, 5: 3, 6: 4, 7: 4, 8: 4, 9: 5, 10: 5,
      11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5,
    },
    slotTable: {
      2: [2],
      3: [3],
      4: [3],
      5: [4, 2],
      6: [4, 2],
      7: [4, 3],
      8: [4, 3],
      9: [4, 3, 2],
      10: [4, 3, 2],
      11: [4, 3, 3],
      12: [4, 3, 3],
      13: [4, 3, 3, 1],
      14: [4, 3, 3, 1],
      15: [4, 3, 3, 2],
      16: [4, 3, 3, 2],
      17: [4, 3, 3, 3, 1],
      18: [4, 3, 3, 3, 1],
      19: [4, 3, 3, 3, 2],
      20: [4, 3, 3, 3, 2],
    },
    pactMagic: false,
    grantsFromSubclass: false,
  },
  subclassLevel: 3,
  sourceNote: 'SRD 5.2',
  asiLevels: [4, 8, 12, 16],
  multiclassGains: [
    'Light armor, Medium armor, Shields, Simple weapons, Martial weapons',
    'Lay on Hands, Divine Sense',
  ],
  subclasses: [
    {
      id: 'oath-of-devotion',
      classId: 'paladin',
      name: 'Oath of Devotion',
      description: 'Uphold the ideals of justice, virtue, and order; smite evil and protect the innocent.',
      features: [
        { level: 3, name: 'Sacred Weapon', description: 'As an action, imbue one weapon with positive energy for 1 minute. Attack rolls with it gain a bonus equal to your Charisma modifier (minimum +1), and it emits bright light 20 ft. and dim light 20 ft. Once per Long Rest.' },
        { level: 3, name: 'Turn the Unholy', description: 'As an action, present your holy symbol and speak a prayer. Each fiend or undead within 30 ft. must succeed on a Wisdom save or be turned for 1 minute. Once per Long Rest.' },
        { level: 7, name: 'Aura of Devotion', description: 'You and friendly creatures within 10 ft. can\'t be charmed while you are conscious. At 18th level, the aura extends to 30 ft.' },
        { level: 15, name: 'Purity of Spirit', description: 'You are always under the effect of a Protection from Evil and Good spell. As an action, you can end one spell on yourself or a willing creature you touch. Once per Long Rest.' },
        { level: 20, name: 'Holy Nimbus', description: 'As an action, emit an aura of sunlight for 1 minute. Bright light 30 ft., dim light 30 ft. Enemies in bright light take radiant damage equal to your Charisma modifier at the start of their turns. Once per Long Rest.' },
      ],
    },
    {
      id: 'oath-of-the-ancients',
      classId: 'paladin',
      name: 'Oath of the Ancients',
      description: 'Preserve the light of life and joy; fight the forces that would extinguish hope.',
      features: [
        { level: 3, name: 'Nature\'s Wrath', description: 'As an action, cause spectral vines to restrain a creature within 10 ft. It must succeed on a Strength or Dexterity save (your choice) or be restrained for 1 minute. It repeats the save at the end of each turn. Once per Long Rest.' },
        { level: 3, name: 'Turn the Faithless', description: 'As an action, present your holy symbol. Each fey or fiend within 30 ft. must succeed on a Wisdom save or be turned for 1 minute. Once per Long Rest.' },
        { level: 7, name: 'Aura of Warding', description: 'You and friendly creatures within 10 ft. have resistance to spell damage. At 18th level, the aura extends to 30 ft.' },
        { level: 15, name: 'Undying Sentinel', description: 'When you drop to 0 HP and don\'t die, you instead drop to 1 HP and regain hit points equal to 1d6 + your Paladin level. Once per Long Rest. You also don\'t age and can\'t be aged magically.' },
        { level: 20, name: 'Elder Champion', description: 'As an action, transform for 1 minute. You regain 10 HP at the start of each turn, can cast a Paladin spell with a 1-action casting time as a bonus action, and enemies within 10 ft. have disadvantage on saves against your spells. Once per Long Rest.' },
      ],
    },
    {
      id: 'oath-of-vengeance',
      classId: 'paladin',
      name: 'Oath of Vengeance',
      description: 'Punish those who commit grievous sins; show no mercy to the wicked.',
      features: [
        { level: 3, name: 'Abjure Enemy', description: 'As an action, target one creature within 60 ft. It must succeed on a Wisdom save or be frightened for 1 minute. It repeats the save at the end of its turns if it takes damage. Once per Long Rest.' },
        { level: 3, name: 'Vow of Enmity', description: 'As a bonus action, choose one creature within 10 ft. You have advantage on attack rolls against it for 1 minute. Once per Long Rest.' },
        { level: 7, name: 'Relentless Avenger', description: 'When you hit a creature with an opportunity attack, you can move up to half your speed after the attack. This movement doesn\'t provoke opportunity attacks.' },
        { level: 15, name: 'Soul of Vengeance', description: 'When a creature under your Vow of Enmity makes an attack, you can use your reaction to make a melee weapon attack against it if it\'s within range.' },
        { level: 20, name: 'Avenging Angel', description: 'As an action, grow spectral wings for 1 hour. You gain a flying speed of 60 ft. and an aura of menace: hostile creatures within 30 ft. must succeed on a Wisdom save or be frightened. Once per Long Rest.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'lay-on-hands',
        name: 'Lay on Hands',
        description: 'You have a pool of healing power equal to 5 × your Paladin level. As an action, touch a creature to restore HP from the pool. As an action, expend 5 HP from the pool to cure one disease or the poisoned condition.',
      },
      {
        id: 'divine-sense',
        name: 'Divine Sense',
        description: 'As an action, detect celestial, fiend, or undead within 60 ft. until the end of your next turn. Also detects consecrated/desecrated ground. Uses equal to 1 + Charisma modifier per Long Rest.',
      },
      {
        id: 'fighting-style',
        name: 'Fighting Style',
        description: 'Choose two Fighting Style options from: Blessed Warrior, Defense, Dueling, Great Weapon Fighting, Protection, Two-Weapon Fighting. You can change one when you gain a Paladin level.',
        options: [
          { id: 'blessed-warrior', name: 'Blessed Warrior', description: 'Learn two cantrips from the Cleric list. Wisdom is your spellcasting ability for them. Change one when you gain a Paladin level.' },
          { id: 'defense', name: 'Defense', description: 'While wearing armor, you gain a +1 bonus to AC.' },
          { id: 'dueling', name: 'Dueling', description: 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
          { id: 'great-weapon-fighting', name: 'Great Weapon Fighting', description: 'When you roll a 1 or 2 on a damage die for a two-handed or versatile melee weapon attack, reroll the die and use the new roll.' },
          { id: 'protection', name: 'Protection', description: 'When a creature you can see attacks a target within 5 ft. of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.' },
          { id: 'two-weapon-fighting', name: 'Two-Weapon Fighting', description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the off-hand attack.' },
        ],
        optionCount: 2,
      },
    ],
    2: [
      {
        id: 'divine-smite',
        name: 'Divine Smite',
        description: 'Once per turn when you hit with a melee weapon attack, expend a spell slot to deal radiant damage: 2d8 + 1d8 per spell slot level above 1st (max 5d8). Damage increases by 1d8 vs. fiends/undead.',
      },
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'You can prepare and cast Paladin spells using Wisdom. You prepare a number of spells equal to half your Paladin level + Wisdom modifier (minimum 1).',
      },
      {
        id: 'paladin-smite-spells',
        name: 'Smite Spells',
        description: 'Certain Paladin spells (e.g., Searing Smite, Thunderous Smite) are always prepared for you and don\'t count against your prepared spell limit.',
      },
    ],
    3: [
      {
        id: 'divine-health',
        name: 'Divine Health',
        description: 'You are immune to disease.',
      },
      {
        id: 'oath-subclass',
        name: 'Sacred Oath',
        description: 'Choose a Sacred Oath: Oath of Devotion, Oath of the Ancients, or Oath of Vengeance. Each grants features at 3rd, 7th, 15th, and 20th level.',
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
        id: 'aura-of-protection',
        name: 'Aura of Protection',
        description: 'You and friendly creatures within 10 ft. gain a bonus to saving throws equal to your Charisma modifier (minimum +1). At 18th level, the aura extends to 30 ft.',
      },
    ],
    7: [],
    8: [
      {
        id: 'ability-score-improvement-2',
        name: 'Ability Score Improvement',
        description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.',
      },
    ],
    10: [
      {
        id: 'aura-of-courage',
        name: 'Aura of Courage',
        description: 'You and friendly creatures within 10 ft. can\'t be frightened while you are conscious. At 18th level, the aura extends to 30 ft.',
      },
    ],
    11: [
      {
        id: 'improved-divine-smite',
        name: 'Improved Divine Smite',
        description: 'Your melee weapon attacks deal an extra 1d8 radiant damage on a hit. When you use Divine Smite, the extra damage increases by 1d8.',
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
        id: 'cleansing-touch',
        name: 'Cleansing Touch',
        description: 'As an action, end one spell on yourself or a willing creature you touch. Uses equal to your Charisma modifier per Long Rest (minimum 1).',
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
        id: 'aura-expansion',
        name: 'Aura Expansion',
        description: 'The range of your Aura of Protection, Aura of Courage, and subclass auras increases to 30 ft.',
      },
    ],
    20: [
      {
        id: 'ability-score-improvement-5',
        name: 'Ability Score Improvement',
        description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.',
      },
      {
        id: 'subclass-capstone',
        name: 'Sacred Oath Feature',
        description: 'Gain the 20th-level feature of your chosen Sacred Oath.',
      },
    ],
  },
};