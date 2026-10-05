import type { ClassDef } from '../../types/character';

export const wizard: ClassDef = {
  id: 'wizard',
  name: 'Wizard',
  hitDie: 6,
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: ['simple'],
  toolProficiencies: [],
  skills: {
    granted: [],
    choices: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
    choiceCount: 2,
  },
  spellcasting: {
    ability: 'int',
    cantripsMode: 'known',
    cantripCountByLevel: {
      1: 3, 2: 3, 3: 3, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 5,
      11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5,
    },
    spellsMode: 'prepared',
    spellCountByLevel: {
      1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15,
      11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 25,
    },
    slotTable: {
      1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1],
      8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1],
      12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1],
      15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
      18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
    },
  },
  subclassLevel: 3,
  extraFeatLevel: 4,
  subclasses: [
    {
      id: 'abjurer',
      classId: 'wizard',
      name: 'Abjurer',
      description: 'Specializes in protective magic, warding allies and banishing threats.',
      features: [
        { level: 3, name: 'Arcane Ward', description: 'When you cast an abjuration spell of 1st level or higher, create a ward with HP = 2 × wizard level + Int mod. Ward takes damage first. Once per long rest, as a bonus action, regain HP equal to spell level × proficiency bonus.' },
        { level: 3, name: 'Projected Ward', description: 'When a creature within 30 feet takes damage, use reaction to have your Arcane Ward take the damage instead.' },
        { level: 6, name: 'Improved Abjuration', description: 'Add proficiency bonus to ability checks made as part of casting abjuration spells (e.g., Counterspell, Dispel Magic).' },
        { level: 10, name: 'Spell Resistance', description: 'Advantage on saves against spells. Resistance to spell damage.' },
        { level: 14, name: 'Spell Breaker', description: 'You always have Counterspell and Dispel Magic prepared (don\'t count against limit). When you cast Dispel Magic, you can end one spell on a target without an ability check. You can cast Counterspell as a reaction without a spell slot once per short rest.' },
      ],
    },
    {
      id: 'diviner',
      classId: 'wizard',
      name: 'Diviner',
      description: 'Masters of foresight, using portent dice to shape fate.',
      features: [
        { level: 3, name: 'Portent', description: 'After a long rest, roll two d20s. Any time you or a creature you see makes a d20 roll, replace it with one of your foretelling rolls. Each roll used once. Unused rolls lost at next long rest.' },
        { level: 3, name: 'Expert Divination', description: 'When you cast a divination spell of 2nd level or higher, regain one expended spell slot of lower level (max 5th).' },
        { level: 6, name: 'The Third Eye', description: 'As a bonus action, gain one benefit until short/long rest: Darkvision 60 ft, Ethereal Sight 60 ft, see invisible 10 ft, or read any language. Change on short/long rest.' },
        { level: 10, name: 'Greater Portent', description: 'Roll three d20s for Portent instead of two.' },
        { level: 14, name: 'Foresight', description: 'You can cast Foresight (9th level) without a spell slot once per long rest. While under its effect, you can use Portent rolls on the target\'s rolls.' },
      ],
    },
    {
      id: 'evoker',
      classId: 'wizard',
      name: 'Evoker',
      description: 'Channels raw elemental energy, sculpting spells to spare allies.',
      features: [
        { level: 3, name: 'Sculpt Spells', description: 'When you cast an evocation spell that affects other creatures you can see, choose up to 1 + spell level of them. They automatically succeed on saves and take no damage.' },
        { level: 3, name: 'Potent Cantrip', description: 'Your damaging cantrips deal half damage to creatures that succeed on the save.' },
        { level: 6, name: 'Empowered Evocation', description: 'Add Intelligence modifier to one damage roll of any evocation spell you cast.' },
        { level: 10, name: 'Overchannel', description: 'When you cast a wizard evocation spell of 1st-5th level, deal max damage. First use free. Each subsequent use before a long rest deals 2d12 necrotic per spell level (ignores resistance/immunity).' },
        { level: 14, name: 'Overchannel Mastery', description: 'When you use Overchannel, you can roll one damage die twice and use the higher result.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      { id: 'spellcasting', name: 'Spellcasting', description: 'You know 3 cantrips and prepare spells from the wizard list. Intelligence is your spellcasting ability. You have a spellbook containing 6 1st-level spells.' },
      { id: 'arcane-recovery', name: 'Arcane Recovery', description: 'Once per day after a short rest, recover expended spell slots with combined level ≤ half wizard level (rounded up), no slot higher than 6th.' },
      { id: 'ritual-adept', name: 'Ritual Adept', description: 'You can cast any wizard spell you have prepared as a ritual if it has the ritual tag.' },
    ],
    2: [
      { id: 'scholar', name: 'Scholar', description: 'Gain proficiency in one skill: Arcana, History, Insight, Investigation, Medicine, or Religion. If you already have it, gain Expertise (double proficiency bonus).' },
    ],
    3: [
      { id: 'wizard-subclass', name: 'Arcane Tradition', description: 'Choose an Arcane Tradition (subclass). It grants features at levels 3, 6, 10, and 14.' },
    ],
    4: [
      { id: 'ability-score-improvement', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
    ],
    5: [
      { id: 'memorize-spell', name: 'Memorize Spell', description: 'After a short rest, replace one prepared spell with another from your spellbook. The replaced spell must be of a level you have slots for. Cost: 1st-level slot to memorize a 1st-level spell, 2nd-level slot for 2nd, etc. (You can use a higher slot for a lower-level spell.)' },
    ],
    8: [
      { id: 'ability-score-improvement-2', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
    ],
    12: [
      { id: 'ability-score-improvement-3', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
    ],
    16: [
      { id: 'ability-score-improvement-4', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
    ],
    18: [
      { id: 'spell-mastery', name: 'Spell Mastery', description: 'Choose one 1st-level and one 2nd-level wizard spell in your spellbook. You can cast them at their lowest level without expending a spell slot. Change choices after a long rest.' },
    ],
    19: [
      { id: 'epic-boon', name: 'Epic Boon', description: 'Gain an Epic Boon feat or another Ability Score Improvement.' },
    ],
    20: [
      { id: 'ability-score-improvement-5', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
      { id: 'signature-spells', name: 'Signature Spells', description: 'Choose two 3rd-level wizard spells in your spellbook. They are always prepared, don\'t count against your limit, and you can cast each once at 3rd level without a spell slot per short rest. Change choices after a long rest.' },
    ],
  },
  multiclassGains: [
    'Three cantrips from the wizard spell list',
    'Spellcasting (prepared spells from wizard list, Int-based)',
    'Ritual Adept',
    'Arcane Recovery',
  ],
  asiLevels: [4, 8, 12, 16],
  sourceNote: 'SRD 5.2',
};