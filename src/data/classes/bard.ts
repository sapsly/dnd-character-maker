import type { ClassDef } from '../../types/character';
import { SKILL_DEFS } from '../../lib/rules/skillList';

/** The 18 canonical 2024 skill keys, used wherever Bard offers a skill choice. */
const ALL_SKILL_KEYS = SKILL_DEFS.map((skill) => skill.key);

export const bard: ClassDef = {
  id: 'bard',
  name: 'Bard',
  hitDie: 8,
  savingThrowProficiencies: ['dex', 'cha'],
  armorProficiencies: ['Light armor'],
  weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
  // 2024 PHB: Choose 3 musical instruments. SRD instruments: bagpipes, drum, dulcimer, flute, horn, lute, lyre, pan flute, shawm, viol.
  toolProficiencies: ["lute", "flute", "drum"],
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
    choiceCount: 3,
  },
  spellcasting: {
    ability: 'cha',
    cantripsMode: 'known',
    cantripCountByLevel: { 1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4, 11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4 },
    spellsMode: 'prepared',
    spellCountByLevel: { 1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
    slotTable: {
      1: [2],
      2: [3],
      3: [4, 2],
      4: [4, 3],
      5: [4, 3, 2],
      6: [4, 3, 3],
      7: [4, 3, 3, 1],
      8: [4, 3, 3, 2],
      9: [4, 3, 3, 3, 1],
      10: [4, 3, 3, 3, 2],
      11: [4, 3, 3, 3, 2, 1],
      12: [4, 3, 3, 3, 2, 1],
      13: [4, 3, 3, 3, 2, 1, 1],
      14: [4, 3, 3, 3, 2, 1, 1],
      15: [4, 3, 3, 3, 2, 1, 1, 1],
      16: [4, 3, 3, 3, 2, 1, 1, 1],
      17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
      18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
      19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
      20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
    },
  },
  subclassLevel: 3,
  sourceNote: 'SRD 5.2',
  asiLevels: [4, 8, 12, 16],
  multiclassGains: [
    'Light armor',
    'Simple weapons, Hand crossbows, Longswords, Rapiers, Shortswords',
    'Three musical instruments (e.g., lute, flute, drum)',
    'One skill of your choice',
  ],
  subclasses: [
    {
      id: 'lore',
      classId: 'bard',
      name: 'College of Lore',
      description: 'Gathers knowledge from diverse sources, gaining extra skills, Cutting Words to hinder foes, and access to spells from any class.',
      features: [
        {
          id: 'lore-bonus-proficiencies',
          level: 3,
          name: 'Bonus Proficiencies',
          description: 'Choose three skills from the standard list. Your proficiencies in them are added to the Bard list, so you can apply expertise to any of them later.',
          skillChoices: ALL_SKILL_KEYS,
          skillChoiceCount: 3,
        },
        { level: 3, name: 'Cutting Words', description: 'When a creature within 60 feet makes an attack roll, ability check, or damage roll, use reaction and expend Bardic Inspiration to subtract the die roll. Can be used after the roll but before results.' },
        {
          id: 'lore-magical-discoveries',
          level: 6,
          name: 'Magical Discoveries',
          description: 'Choose two spells from the cleric, druid, or wizard spell list. Each must be a cantrip or a spell for which you have spell slots. You always have the chosen spells prepared, and they do not count against the number of spells you prepare. Whenever you gain a Bard level, you can replace one of them with another spell that meets these requirements.',
          spellChoice: {
            count: 2,
            lists: ['cleric', 'druid', 'wizard'],
            alwaysPrepared: true,
            replaceableEachLevel: true,
          },
        },
        { level: 14, name: 'Peerless Skill', description: 'When you make an ability check or attack roll and fail, you can expend Bardic Inspiration to add the die to the roll, potentially turning failure into success. On failure, the Bardic Inspiration isn\'t expended.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'You can cast bard spells using Charisma. Cantrips known and prepared spells per the Bard table. Spell save DC = 8 + proficiency + Charisma, spell attack = proficiency + Charisma.',
      },
      {
        id: 'bardic-inspiration',
        name: 'Bardic Inspiration',
        description: 'As a bonus action, choose a creature within 60 feet (not yourself). They gain a Bardic Inspiration die (d6, scales at 5/10/15). Within 1 hour, they can add it to one ability check, attack roll, or saving throw. Usable Charisma modifier times per long rest (min 1).',
      },
    ],
    2: [
      {
        id: 'expertise',
        name: 'Expertise',
        description: 'Choose two of your skill proficiencies. Your proficiency bonus is doubled for checks using them. You gain Expertise in two more skills at level 9.',
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
        id: 'jack-of-all-trades',
        name: 'Jack of All Trades',
        description: 'Add half your proficiency bonus (rounded down) to any ability check that doesn\'t already include your proficiency bonus.',
      },
    ],
    3: [
      { id: 'subclass-feature-3', name: 'Bard College', description: 'Choose a Bard College (subclass). You gain its 3rd-level features.' },
    ],
    4: [
      { id: 'ability-score-improvement', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    5: [
      { id: 'font-of-inspiration', name: 'Font of Inspiration', description: 'You regain all expended Bardic Inspiration uses on a short or long rest.' },
    ],
    6: [
      { id: 'subclass-feature-6', name: 'Bard College Feature', description: 'Gain your Bard College\'s 6th-level feature.' },
    ],
    7: [
      { id: 'countercharm', name: 'Countercharm', description: 'As an action, start a performance lasting until your next turn. You and allies within 30 feet have advantage on saves against frightened and charmed. Must be able to hear you.' },
    ],
    8: [
      { id: 'ability-score-improvement-8', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    9: [
      { id: 'song-of-rest-2', name: 'Song of Rest (d8)', description: 'Song of Rest now grants 1d8 extra HP.' },
      {
        id: 'expertise-2',
        name: 'Expertise (2 more)',
        description: 'Choose two more skill proficiencies for doubled proficiency bonus.',
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
    10: [
      { id: 'magical-secrets-2', name: 'Magical Secrets (2 more)', description: 'Learn two more spells from any class of a level you can cast.' },
    ],
    12: [
      { id: 'ability-score-improvement-12', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    13: [
      { id: 'song-of-rest-3', name: 'Song of Rest (d10)', description: 'Song of Rest now grants 1d10 extra HP.' },
    ],
    14: [
      { id: 'subclass-feature-14', name: 'Bard College Feature', description: 'Gain your Bard College\'s 14th-level feature.' },
      { id: 'magical-secrets-3', name: 'Magical Secrets (2 more)', description: 'Learn two more spells from any class of a level you can cast.' },
    ],
    16: [
      { id: 'ability-score-improvement-16', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    17: [
      { id: 'song-of-rest-4', name: 'Song of Rest (d12)', description: 'Song of Rest now grants 1d12 extra HP.' },
    ],
    18: [
      { id: 'magical-secrets-4', name: 'Magical Secrets (2 more)', description: 'Learn two more spells from any class of a level you can cast.' },
    ],
    20: [
      { id: 'superior-inspiration', name: 'Superior Inspiration', description: 'When you roll initiative and have no Bardic Inspiration uses, you regain one.' },
    ],
  },
};