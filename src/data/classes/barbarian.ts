import type { ClassDef } from '../../types/character';

export const barbarian: ClassDef = {
  id: 'barbarian',
  name: 'Barbarian',
  hitDie: 12,
  savingThrowProficiencies: ['str', 'con'],
  armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
  weaponProficiencies: ['Simple weapons', 'Martial weapons'],
  // 2024 PHB: Choose 4 from: carpenter's tools, cobbler's tools, cooper's tools, glassblower's tools,
  // jeweler's tools, leatherworker's tools, potter's tools, smith's tools, tinkerer's tools,
  // weaver's tools, land vehicles, water vehicles. Represented as a fixed sample; player chooses 4.
  toolProficiencies: ["carpenter's tools", "leatherworker's tools", "smith's tools", "land vehicles"],
  skills: {
    granted: [],
    choices: [
      'acrobatics',
      'animalHandling',
      'arcana',
      'athletics',
      'deception',
      'history',
      'insight',
      'intimidation',
      'investigation',
      'medicine',
      'nature',
      'perception',
      'performance',
      'persuasion',
      'religion',
      'sleightOfHand',
      'stealth',
      'survival',
    ],
    choiceCount: 2,
  },
  subclassLevel: 3,
  sourceNote: 'SRD 5.2',
  asiLevels: [4, 8, 12, 16],
  weaponMastery: {
    featureLevel: 1,
    choiceCount: 2,
    pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'],
    extraPicksAtLevels: [4, 10],
  },
  multiclassGains: [
    'Light armor, Medium armor, Shields',
    'Simple weapons, Martial weapons',
    'Two skills from the Barbarian list',
    "Four artisan tools or vehicles (carpenter's tools, leatherworker's tools, smith's tools, land vehicles, etc.)",
  ],
  subclasses: [
    {
      id: 'berserker',
      classId: 'barbarian',
      name: 'Path of the Berserker',
      description: 'Focuses on pure rage-fueled offense, gaining Frenzy for extra attacks and Mindless Rage for charm/frighten immunity while raging.',
      features: [
        { level: 3, name: 'Frenzy', description: 'When you enter a rage, you can choose to Frenzy. Until the rage ends, you can make a single melee weapon attack as a bonus action on each of your turns. When the rage ends, you suffer one level of exhaustion.' },
        { level: 6, name: 'Mindless Rage', description: 'While raging, you cannot be charmed or frightened. If you are charmed or frightened when you enter rage, the effect is suspended for the duration of the rage.' },
        { level: 10, name: 'Intimidating Presence', description: 'As an action, you can frighten a creature within 30 feet that can see or hear you (Wisdom save DC = 8 + proficiency + Strength). The effect lasts until the end of your next turn; you can extend it as a bonus action on subsequent turns. Once a creature succeeds or the effect ends, it is immune for 24 hours.' },
        { level: 14, name: 'Retaliation', description: 'When you take damage from a creature within 5 feet, you can use your reaction to make a melee weapon attack against that creature.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'rage',
        name: 'Rage',
        description: 'As a bonus action, enter a rage for 1 minute. Gain advantage on Strength checks/saves, +2 damage on Strength melee attacks (scales at levels 9, 13, 17), and resistance to bludgeoning/piercing/slashing. Ends early if you don\'t attack or take damage, or if you end it. Usable 2 times (3 at 3, 4 at 6, 5 at 12, 6 at 17).',
      },
      {
        id: 'unarmored-defense',
        name: 'Unarmored Defense',
        description: 'While not wearing armor, AC = 10 + Dexterity + Constitution. You can use a shield and still benefit.',
      },
      {
        id: 'weapon-mastery',
        name: 'Weapon Mastery',
        description: 'Your training lets you use the mastery properties of two kinds of weapons. At levels 4 and 10, you can replace a mastery or choose an additional one.',
      },
    ],
    2: [
      {
        id: 'reckless-attack',
        name: 'Reckless Attack',
        description: 'When you make your first attack on your turn, you can attack recklessly. Gain advantage on Strength melee attack rolls until your next turn, but attack rolls against you have advantage until then.',
      },
      {
        id: 'danger-sense',
        name: 'Danger Sense',
        description: 'You have advantage on Dexterity saving throws against effects you can see (traps, spells, etc.). You lose this if blinded, deafened, or incapacitated.',
      },
    ],
    3: [
      { id: 'subclass-feature-3', name: 'Primal Path', description: 'Choose a Primal Path (subclass). You gain its 3rd-level feature.' },
      { id: 'primal-knowledge', name: 'Primal Knowledge', description: 'Gain proficiency in two skills from: Animal Handling, Athletics, Insight, Intimidation, Nature, Perception, Survival. You can change these choices on a long rest.' },
    ],
    4: [
      { id: 'ability-score-improvement', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    5: [
      { id: 'extra-attack', name: 'Extra Attack', description: 'You can attack twice instead of once when you take the Attack action.' },
      { id: 'fast-movement', name: 'Fast Movement', description: 'Your speed increases by 10 feet while not wearing heavy armor.' },
    ],
    6: [
      { id: 'subclass-feature-6', name: 'Primal Path Feature', description: 'Gain your Primal Path\'s 6th-level feature.' },
    ],
    7: [
      { id: 'feral-instinct', name: 'Feral Instinct', description: 'You have advantage on initiative rolls. If surprised, you can act normally on your first turn if you enter rage before doing anything else.' },
      { id: 'instinctive-pounce', name: 'Instinctive Pounce', description: 'As part of the bonus action you take to enter your rage, you can move up to half your speed.' },
    ],
    8: [
      { id: 'ability-score-improvement-8', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    9: [
      { id: 'brutal-strike', name: 'Brutal Strike', description: 'When you use Reckless Attack, you can forgo advantage on one Strength attack to deal an extra 1d10 damage and apply a Brutal Strike effect (Forceful Blow or Hamstring Blow).' },
    ],
    10: [
      { id: 'subclass-feature-10', name: 'Primal Path Feature', description: 'Gain your Primal Path\'s 10th-level feature.' },
    ],
    11: [
      { id: 'relentless-rage', name: 'Relentless Rage', description: 'If you drop to 0 HP while raging, make a DC 10 Constitution save (increases by 5 each use). On success, drop to 1 HP instead. Resets on short/long rest.' },
    ],
    12: [
      { id: 'ability-score-improvement-12', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    13: [
      { id: 'improved-brutal-strike', name: 'Improved Brutal Strike', description: 'Your Brutal Strike gains two new effects: Staggering Blow (target has disadvantage on next save, no opportunity attacks) and Sundering Blow (next attack against target gains +5 bonus).' },
    ],
    14: [
      { id: 'subclass-feature-14', name: 'Primal Path Feature', description: 'Gain your Primal Path\'s 14th-level feature.' },
    ],
    15: [
      { id: 'persistent-rage', name: 'Persistent Rage', description: 'When you roll initiative, you can regain all expended rage uses (once per long rest). Your rage lasts 10 minutes without needing to extend it, ending only if unconscious or you don heavy armor.' },
    ],
    16: [
      { id: 'ability-score-improvement-16', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    17: [
      { id: 'improved-brutal-strike-2', name: 'Improved Brutal Strike', description: 'Your Brutal Strike extra damage increases to 2d10. You can now apply two different Brutal Strike effects when you use the feature.' },
    ],
    18: [
      { id: 'indomitable-might', name: 'Indomitable Might', description: 'If your total for a Strength check or Strength saving throw is less than your Strength score, you can use that score in place of the total.' },
    ],
    19: [
      { id: 'epic-boon', name: 'Epic Boon', description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Irresistible Offense is recommended.' },
    ],
    20: [
      { id: 'primal-champion', name: 'Primal Champion', description: 'Strength and Constitution increase by 4 each, to a maximum of 24.' },
    ],
  },
};