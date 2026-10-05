import type { ClassDef } from '../../types/character';

export const sorcerer: ClassDef = {
  id: 'sorcerer',
  name: 'Sorcerer',
  hitDie: 6,
  savingThrowProficiencies: ['con', 'cha'],
  armorProficiencies: [],
  weaponProficiencies: ['simple'],
  toolProficiencies: [],
  skills: {
    granted: [],
    choices: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
    choiceCount: 2,
  },
  spellcasting: {
    ability: 'cha',
    cantripsMode: 'known',
    cantripCountByLevel: {
      1: 4, 2: 4, 3: 4, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 6,
      11: 6, 12: 6, 13: 6, 14: 6, 15: 6, 16: 6, 17: 6, 18: 6, 19: 6, 20: 6,
    },
    spellsMode: 'prepared',
    spellCountByLevel: {
      1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15,
      11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22,
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
      id: 'draconic-sorcery',
      classId: 'sorcerer',
      name: 'Draconic Sorcery',
      description: 'Your magic comes from draconic ancestry, granting resilience and elemental affinity.',
      features: [
        { level: 3, name: 'Draconic Resilience', description: 'Hit point maximum increases by 1 per sorcerer level. While not wearing armor, AC = 13 + Dexterity modifier.' },
        { level: 3, name: 'Draconic Affinity', description: 'Choose a dragon type. You gain resistance to its damage type and can add Charisma modifier to one damage roll of that type per turn.' },
        { level: 6, name: 'Draconic Flight', description: 'As a bonus action, sprout spectral wings for 1 hour, gaining a fly speed of 60 feet. Usable once per long rest.' },
        { level: 14, name: 'Dragon Companion', description: 'You can cast Summon Dragon (5th-level version) without a spell slot or material components. Once per long rest.' },
        { level: 18, name: 'Draconic Apotheosis', description: 'You gain immunity to your chosen damage type. As an action, spend 5 sorcery points to assume a dragon form for 1 hour (fly 60 ft, breath weapon, frightful presence).' },
      ],
    },
    {
      id: 'wild-magic',
      classId: 'sorcerer',
      name: 'Wild Magic',
      description: 'Your magic surges unpredictably, triggering random magical effects.',
      features: [
        { level: 3, name: 'Wild Magic Surge', description: 'After casting a sorcerer spell of 1st level or higher, roll a d20. On a 1, roll on the Wild Magic Surge table for a random effect.' },
        { level: 3, name: 'Tides of Chaos', description: 'Gain advantage on one attack roll, ability check, or saving throw. Once used, the DM may have you roll on the Wild Magic Surge table to recharge it.' },
        { level: 6, name: 'Bend Luck', description: 'When a creature you see makes a roll, spend 1 sorcery point and roll a d4 to apply as a bonus or penalty. Usable once per turn.' },
        { level: 14, name: 'Controlled Chaos', description: 'When you roll on the Wild Magic Surge table, roll twice and choose either result.' },
        { level: 18, name: 'Spell Burn', description: 'When you take damage, spend sorcery points (1 per 2 damage) to reduce it. When you cast a spell, spend sorcery points to increase its save DC by 2.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      { id: 'spellcasting', name: 'Spellcasting', description: 'You know 4 cantrips and prepare spells from the sorcerer list. Charisma is your spellcasting ability.' },
      { id: 'innate-sorcery', name: 'Innate Sorcery', description: 'As a bonus action, activate for 1 minute: your spell save DC and spell attack rolls gain +1, and you can use Metamagic without spending sorcery points once per turn. Once per long rest.' },
    ],
    2: [
      { id: 'font-of-magic', name: 'Font of Magic', description: 'You have sorcery points equal to your sorcerer level. As a bonus action, convert a spell slot to sorcery points (1 per slot level) or spend sorcery points to create a spell slot (1st: 2 pts, 2nd: 3 pts, 3rd: 5 pts, 4th: 6 pts, 5th: 7 pts). Max slot level created: proficiency bonus - 1.' },
      { id: 'metamagic', name: 'Metamagic', description: 'Gain 2 Metamagic options (Careful, Distant, Empowered, Extended, Heightened, Quickened, Seeking, Subtle, Transmuted, Twinned). You gain more at levels 10 and 17. Spend sorcery points to apply them when casting.' },
    ],
    3: [
      { id: 'sorcerer-subclass', name: 'Sorcerous Origin', description: 'Choose a Sorcerous Origin (subclass). It grants features at levels 3, 6, 14, and 18.' },
    ],
    4: [
      { id: 'ability-score-improvement', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
    ],
    5: [
      { id: 'sorcerous-restoration', name: 'Sorcerous Restoration', description: 'When you finish a short rest, regain sorcery points equal to half your proficiency bonus (rounded down).' },
    ],
    8: [
      { id: 'ability-score-improvement-2', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
    ],
    10: [
      { id: 'metamagic-2', name: 'Metamagic', description: 'Gain 1 additional Metamagic option.' },
    ],
    12: [
      { id: 'ability-score-improvement-3', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
    ],
    16: [
      { id: 'ability-score-improvement-4', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
    ],
    17: [
      { id: 'metamagic-3', name: 'Metamagic', description: 'Gain 1 additional Metamagic option.' },
    ],
    19: [
      { id: 'epic-boon', name: 'Epic Boon', description: 'Gain an Epic Boon feat or another Ability Score Improvement.' },
    ],
    20: [
      { id: 'ability-score-improvement-5', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
      { id: 'arcane-apotheosis', name: 'Arcane Apotheosis', description: 'While Innate Sorcery is active, you can use Metamagic options without spending sorcery points.' },
    ],
  },
  multiclassGains: [
    'Two cantrips from the sorcerer spell list',
    'Spellcasting (prepared spells from sorcerer list, Cha-based)',
    'Font of Magic (sorcery points equal to sorcerer level)',
    'Metamagic (2 options)',
  ],
  asiLevels: [4, 8, 12, 16],
  sourceNote: 'SRD 5.2',
};