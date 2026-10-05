import type { ClassDef } from '../../types/character';

export const rogue: ClassDef = {
  id: 'rogue',
  name: 'Rogue',
  hitDie: 8,
  savingThrowProficiencies: ['dex', 'int'],
  armorProficiencies: ['Light armor'],
  weaponProficiencies: [
    'Simple weapons',
    'Hand crossbows',
    'Longswords',
    'Rapiers',
    'Shortswords',
    'Daggers (two)',
  ],
  toolProficiencies: ['thieves\' tools'],
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
    choiceCount: 4,
  },
  subclassLevel: 3,
  extraFeatLevel: 4,
  sourceNote: 'SRD 5.2',
  asiLevels: [4, 8, 10, 12, 16],
  multiclassGains: [
    'Light armor, Simple weapons, Hand crossbows, Longswords, Rapiers, Shortswords, Daggers (two)',
    'Thieves\' tools, Expertise (two skills/thieves\' tools), Sneak Attack, Thieves\' Cant',
  ],
  weaponMastery: {
    featureLevel: 2,
    choiceCount: 2,
    pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'],
    extraPicksAtLevels: [4, 6, 10, 16],
  },
  subclasses: [
    {
      id: 'thief',
      classId: 'rogue',
      name: 'Thief',
      description: 'Specialize in stealth, climbing, and using objects with lightning speed.',
      features: [
        { level: 3, name: 'Fast Hands', description: 'Use Cunning Action to make a Sleight of Hand check, use thieves\' tools, or take the Use an Object action as a bonus action.' },
        { level: 3, name: 'Second-Story Work', description: 'Climbing no longer costs extra movement. Running jump distance increases by your Dexterity modifier.' },
        { level: 9, name: 'Supreme Sneak', description: 'Advantage on Dex (Stealth) checks if you move no more than half your speed on the same turn.' },
        { level: 13, name: 'Use Magic Device', description: 'Ignore all class, race, and level requirements on using magic items.' },
        { level: 17, name: 'Thief\'s Reflexes', description: 'Take two turns on the first round of combat. The second turn occurs at your initiative minus 10.' },
      ],
    },
{
        id: 'assassin',
        classId: 'rogue',
        name: 'Assassin',
        description: 'Master infiltration and deadly first strikes against unsuspecting foes.',
        features: [
          { level: 3, name: 'Assassinate', description: 'Advantage on attack rolls vs. creatures that haven\'t taken a turn. Any hit against a surprised creature is a critical hit.' },
          { level: 3, name: 'Infiltration Expertise', description: 'Spend 7 days and 25 gp to create a false identity. You can\'t be detected as an imposter by nonmagical means.' },
          { level: 3, name: 'Ambusher', description: 'When you take the Study action or at the start of combat, mark a creature within 30 ft. as your quarry. Attacks and spells against your quarry have Advantage until the end of your next turn after you hit it.' },
          { level: 9, name: 'Impostor', description: 'Advantage on Charisma (Deception) and Charisma (Performance) checks while disguised. You can mimic speech and handwriting.' },
          { level: 13, name: 'Death Strike', description: 'When you hit a surprised creature, it must make a Con save (DC = 8 + Dex mod + proficiency) or take double the Sneak Attack damage.' },
        ],
      },
{
        id: 'arcane-trickster',
        classId: 'rogue',
        name: 'Arcane Trickster',
        description: 'Blend rogue skills with wizardly magic for enchantment and illusion.',
        features: [
          { level: 3, name: 'Spellcasting', description: 'Learn 3 Wizard cantrips (Mage Hand + 2 of choice) and 3 1st-level Wizard spells (enchantment/illusion). Int is spellcasting ability. Spell slots: 3 at 1st, 4 at 2nd, 4 at 3rd, etc. Learn more spells at higher levels.' },
          { level: 3, name: 'Mage Hand Legerdemain', description: 'You can cast Mage Hand as a Bonus Action. The hand is invisible and doesn\'t need an unoccupied space. You can move it up to 30 ft. and then: stow/retrieve an object, pick a pocket, or use Thieves\' Tools to pick a lock.' },
          { level: 9, name: 'Magical Ambush', description: 'When you cast a spell while hidden, the target has disadvantage on its save if it can\'t see you.' },
          { level: 13, name: 'Versatile Trickster', description: 'As a bonus action, designate a creature within 5 ft. of your Mage Hand. You have advantage on attack rolls against it until the end of your turn.' },
          { level: 17, name: 'Spell Thief', description: 'When a creature casts a spell or creates an effect targeting you or including you in its area, use your reaction to force a save. On failure, the effect is negated and you learn the spell until you cast it or 8 hours pass.' },
        ],
      },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'expertise',
        name: 'Expertise',
        description: 'Choose two of your skill proficiencies, or one skill and thieves\' tools. Your proficiency bonus is doubled for checks using them. Choose two more at 6th level.',
        options: [
          { id: 'acrobatics', name: 'Acrobatics', description: 'Gain Expertise in Acrobatics (double proficiency bonus).' },
          { id: 'animalHandling', name: 'Animal Handling', description: 'Gain Expertise in Animal Handling (double proficiency bonus).' },
          { id: 'arcana', name: 'Arcana', description: 'Gain Expertise in Arcana (double proficiency bonus).' },
          { id: 'athletics', name: 'Athletics', description: 'Gain Expertise in Athletics (double proficiency bonus).' },
          { id: 'deception', name: 'Deception', description: 'Gain Expertise in Deception (double proficiency bonus).' },
          { id: 'history', name: 'History', description: 'Gain Expertise in History (double proficiency bonus).' },
          { id: 'insight', name: 'Insight', description: 'Gain Expertise in Insight (double proficiency bonus).' },
          { id: 'intimidation', name: 'Intimidation', description: 'Gain Expertise in Intimidation (double proficiency bonus).' },
          { id: 'investigation', name: 'Investigation', description: 'Gain Expertise in Investigation (double proficiency bonus).' },
          { id: 'medicine', name: 'Medicine', description: 'Gain Expertise in Medicine (double proficiency bonus).' },
          { id: 'nature', name: 'Nature', description: 'Gain Expertise in Nature (double proficiency bonus).' },
          { id: 'perception', name: 'Perception', description: 'Gain Expertise in Perception (double proficiency bonus).' },
          { id: 'performance', name: 'Performance', description: 'Gain Expertise in Performance (double proficiency bonus).' },
          { id: 'persuasion', name: 'Persuasion', description: 'Gain Expertise in Persuasion (double proficiency bonus).' },
          { id: 'religion', name: 'Religion', description: 'Gain Expertise in Religion (double proficiency bonus).' },
          { id: 'sleightOfHand', name: 'Sleight of Hand', description: 'Gain Expertise in Sleight of Hand (double proficiency bonus).' },
          { id: 'stealth', name: 'Stealth', description: 'Gain Expertise in Stealth (double proficiency bonus).' },
          { id: 'survival', name: 'Survival', description: 'Gain Expertise in Survival (double proficiency bonus).' },
        ],
        optionCount: 2,
      },
      {
        id: 'sneak-attack',
        name: 'Sneak Attack',
        description: 'Once per turn, deal extra damage when you have advantage on the attack (or an ally within 5 ft. of target, no disadvantage). Damage: 1d6 at 1st, 2d6 at 3rd, 3d6 at 5th, 4d6 at 7th, 5d6 at 9th, 6d6 at 11th, 7d6 at 13th, 8d6 at 15th, 9d6 at 17th, 10d6 at 19th. Must use finesse or ranged weapon.',
      },
      {
        id: 'thieves-cant',
        name: 'Thieves\' Cant',
        description: 'Know a secret language for hiding messages in normal conversation. Takes 4× longer to convey. Understand secret signs and symbols.',
      },
    ],
    2: [
      {
        id: 'cunning-action',
        name: 'Cunning Action',
        description: 'Take the Dash, Disengage, or Hide action as a bonus action on each turn.',
      },
      {
        id: 'weapon-mastery',
        name: 'Weapon Mastery',
        description: 'Choose two weapon mastery properties from the pool. You can apply them to weapons you wield. Gain additional choices at Rogue levels 4, 6, 10, and 16.',
      },
    ],
    3: [
      {
        id: 'rogue-subclass',
        name: 'Roguish Archetype',
        description: 'Choose a Roguish Archetype: Thief, Assassin, or Arcane Trickster. Each grants features at 3rd, 9th, 13th, and 17th level.',
      },
      {
        id: 'steady-aim',
        name: 'Steady Aim',
        description: 'As a Bonus Action, you give yourself Advantage on the next Attack Roll you make this turn. This ends if you make another Attack Roll before that one.',
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.',
      },
      {
        id: 'weapon-mastery-2',
        name: 'Weapon Mastery',
        description: 'Whenever you gain a Rogue level, you can replace one Weapon Mastery property you have with a different one from the pool.',
      },
    ],
    5: [
      {
        id: 'cunning-strike',
        name: 'Cunning Strike',
        description: 'When you deal Sneak Attack damage, you can forgo Sneak Attack dice to add effects: Poison (1d6, Con save, Poisoned 1 min, requires Poisoner\'s Kit), Trip (1d6, Dex save, Prone), or Withdraw (1d6, move half Speed without opportunity attacks). DC = 8 + Dex mod + proficiency.',
      },
      {
        id: 'uncanny-dodge',
        name: 'Uncanny Dodge',
        description: 'When an attacker you can see hits you with an attack roll, use a Reaction to halve the damage (round down).',
      },
    ],
    6: [
      {
        id: 'expertise-2',
        name: 'Expertise',
        description: 'Choose two more of your skill proficiencies (or one skill and thieves\' tools). Your proficiency bonus is doubled for checks using them.',
        options: [
          { id: 'acrobatics', name: 'Acrobatics', description: 'Gain Expertise in Acrobatics (double proficiency bonus).' },
          { id: 'animalHandling', name: 'Animal Handling', description: 'Gain Expertise in Animal Handling (double proficiency bonus).' },
          { id: 'arcana', name: 'Arcana', description: 'Gain Expertise in Arcana (double proficiency bonus).' },
          { id: 'athletics', name: 'Athletics', description: 'Gain Expertise in Athletics (double proficiency bonus).' },
          { id: 'deception', name: 'Deception', description: 'Gain Expertise in Deception (double proficiency bonus).' },
          { id: 'history', name: 'History', description: 'Gain Expertise in History (double proficiency bonus).' },
          { id: 'insight', name: 'Insight', description: 'Gain Expertise in Insight (double proficiency bonus).' },
          { id: 'intimidation', name: 'Intimidation', description: 'Gain Expertise in Intimidation (double proficiency bonus).' },
          { id: 'investigation', name: 'Investigation', description: 'Gain Expertise in Investigation (double proficiency bonus).' },
          { id: 'medicine', name: 'Medicine', description: 'Gain Expertise in Medicine (double proficiency bonus).' },
          { id: 'nature', name: 'Nature', description: 'Gain Expertise in Nature (double proficiency bonus).' },
          { id: 'perception', name: 'Perception', description: 'Gain Expertise in Perception (double proficiency bonus).' },
          { id: 'performance', name: 'Performance', description: 'Gain Expertise in Performance (double proficiency bonus).' },
          { id: 'persuasion', name: 'Persuasion', description: 'Gain Expertise in Persuasion (double proficiency bonus).' },
          { id: 'religion', name: 'Religion', description: 'Gain Expertise in Religion (double proficiency bonus).' },
          { id: 'sleightOfHand', name: 'Sleight of Hand', description: 'Gain Expertise in Sleight of Hand (double proficiency bonus).' },
          { id: 'stealth', name: 'Stealth', description: 'Gain Expertise in Stealth (double proficiency bonus).' },
          { id: 'survival', name: 'Survival', description: 'Gain Expertise in Survival (double proficiency bonus).' },
        ],
        optionCount: 2,
      },
    ],
    7: [
      {
        id: 'evasion',
        name: 'Evasion',
        description: 'When you make a Dex save for half damage, you take no damage on a success and half on a failure. You can\'t use this while Incapacitated.',
      },
      {
        id: 'reliable-talent',
        name: 'Reliable Talent',
        description: 'When you make an ability check using a skill or tool proficiency, treat a d20 roll of 9 or lower as a 10.',
      },
    ],
    8: [
      {
        id: 'ability-score-improvement-2',
        name: 'Ability Score Improvement',
        description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.',
      },
    ],
    9: [
      {
        id: 'subclass-feature-9',
        name: 'Roguish Archetype Feature',
        description: 'Gain your Roguish Archetype\'s 9th-level feature.',
      },
    ],
    10: [
      {
        id: 'ability-score-improvement-3',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.',
      },
    ],
11: [
      {
        id: 'improved-cunning-strike',
        name: 'Improved Cunning Strike',
        description: 'You can use up to two Cunning Strike effects when you deal Sneak Attack damage, paying the die cost for each.',
      },
    ],
    12: [
      {
        id: 'ability-score-improvement-4',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.',
      },
    ],
    13: [
      {
        id: 'subclass-feature-13',
        name: 'Roguish Archetype Feature',
        description: 'Gain your Roguish Archetype\'s 13th-level feature.',
      },
    ],
    14: [
      {
        id: 'devious-strikes',
        name: 'Devious Strikes',
        description: 'New Cunning Strike options: Daze (2d6, Con save, target can only move or take action/Bonus Action), Knock Out (6d6, Con save, Unconscious 1 min or until damaged), Obscure (3d6, Dex save, Blinded until end of next turn).',
      },
    ],
    15: [
      {
        id: 'slippery-mind',
        name: 'Slippery Mind',
        description: 'You gain proficiency in Wisdom and Charisma saving throws.',
      },
    ],
    16: [
      {
        id: 'ability-score-improvement-5',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.',
      },
    ],
    17: [
      {
        id: 'subclass-feature-17',
        name: 'Roguish Archetype Feature',
        description: 'Gain your Roguish Archetype\'s 17th-level feature.',
      },
    ],
    18: [
      {
        id: 'elusive',
        name: 'Elusive',
        description: 'No attack roll can have Advantage against you unless you have the Incapacitated condition.',
      },
    ],
    19: [
      {
        id: 'epic-boon',
        name: 'Epic Boon',
        description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify.',
      },
    ],
    20: [
      {
        id: 'stroke-of-luck',
        name: 'Stroke of Luck',
        description: 'If you fail a D20 Test, you can turn the roll into a 20. Once used, you can\'t use this again until you finish a Short or Long Rest.',
      },
    ],
  },
};