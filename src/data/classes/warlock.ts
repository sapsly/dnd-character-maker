import type { ClassDef } from '../../types/character';

export const warlock: ClassDef = {
  id: 'warlock',
  name: 'Warlock',
  hitDie: 8,
  savingThrowProficiencies: ['wis', 'cha'],
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple'],
  toolProficiencies: ["calligrapher's supplies", 'drum', 'lute', 'flute'],
  skills: {
    granted: [],
    choices: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'],
    choiceCount: 2,
  },
  spellcasting: {
    ability: 'cha',
    cantripsMode: 'known',
    cantripCountByLevel: {
      1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4,
      11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4,
    },
    spellsMode: 'prepared',
    spellCountByLevel: {
      1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 10,
      11: 11, 12: 11, 13: 12, 14: 12, 15: 13, 16: 13, 17: 14, 18: 14, 19: 15, 20: 15,
    },
    slotTable: {
      1: [1], 2: [2], 3: [2], 4: [2], 5: [2], 6: [2], 7: [2], 8: [2], 9: [2], 10: [2],
      11: [3], 12: [3], 13: [3], 14: [3], 15: [3], 16: [3], 17: [4], 18: [4], 19: [4], 20: [4],
    },
    pactMagic: true,
  },
  subclassLevel: 1,
  subclasses: [
    {
      id: 'archfey',
      classId: 'warlock',
      name: 'Archfey',
      description: 'Your patron is a lord or lady of the Feywild, granting beguiling magic.',
      features: [
        { level: 1, name: 'Fey Presence', description: 'As an action, each creature in a 10-foot cube centered on you makes a Wisdom save or is charmed/frightened until end of your next turn. Usable once per short/long rest.' },
        { level: 3, name: 'Misty Escape', description: 'When you take damage, use reaction to turn invisible and teleport up to 60 feet. Stays invisible until start of next turn or until you attack/cast a spell. Once per short/long rest.' },
        { level: 6, name: 'Beguiling Defenses', description: 'Advantage on saves against charm. If charmed, use reaction to turn it back on the charmer (Wis save negates).' },
        { level: 10, name: 'Dark Delirium', description: 'As an action, target a creature within 60 feet. It makes a Wis save or is charmed/frightened (your choice) for 1 minute. While affected, it sees illusory terrain. Once per long rest.' },
      ],
    },
    {
      id: 'fiend',
      classId: 'warlock',
      name: 'Fiend',
      description: 'Your patron is a devil or demon, granting destructive power and resilience.',
      features: [
        { level: 1, name: 'Dark One\'s Blessing', description: 'When you reduce a hostile creature to 0 HP, gain temporary HP equal to your Charisma modifier + warlock level.' },
        { level: 3, name: 'Dark One\'s Own Luck', description: 'When you make an ability check or saving throw, add 1d10 to the roll. Once per short/long rest.' },
        { level: 6, name: 'Fiendish Resilience', description: 'Choose a damage type when you finish a short/long rest. Gain resistance to it until you choose again. Does not work against magical weapons or silver.' },
        { level: 10, name: 'Hurl Through Hell', description: 'When you hit with an attack, spend a spell slot to banish the target through the lower planes until end of your next turn. It takes 10d10 psychic damage on return. Once per long rest.' },
      ],
    },
    {
      id: 'great-old-one',
      classId: 'warlock',
      name: 'Great Old One',
      description: 'Your patron is an unknowable entity from the Far Realm, granting telepathy and mental defense.',
      features: [
        { level: 1, name: 'Awakened Mind', description: 'You can communicate telepathically with any creature you see within 30 feet, no shared language needed.' },
        { level: 3, name: 'Entropic Ward', description: 'When a creature attacks you, use reaction to impose disadvantage. If it misses, your next attack against it has advantage. Once per short/long rest.' },
        { level: 6, name: 'Thought Shield', description: 'Resistance to psychic damage. Your thoughts can\'t be read. When you take psychic damage, the dealer takes the same amount.' },
        { level: 10, name: 'Create Thrall', description: 'As an action, touch an incapacitated creature. It makes a Cha save or is charmed by you until removed or you use this again. Communicate telepathically over any distance on same plane.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      { id: 'pact-magic', name: 'Pact Magic', description: 'You have Pact Magic spell slots (see slotTable) of a single level that refresh on a short or long rest. Slot level: 1st at levels 1-2, 2nd at 3-4, 3rd at 5-6, 4th at 7-8, 5th at 9+. You know 2 cantrips and prepare spells from the warlock list.' },
      { id: 'otherworldly-patron', name: 'Otherworldly Patron', description: 'Choose a patron (Archfey, Fiend, Great Old One). It grants features at levels 1, 3, 6, and 10.' },
    ],
    2: [
      { id: 'eldritch-invocations', name: 'Eldritch Invocations', description: 'Choose 2 Eldritch Invocations. Gain more at levels 4, 6, 8, 10, 12, 14, 16, 18 (total 9 at 18). You can swap one when you gain a warlock level. The full invocation list is on the class page; options include Agonizing Blast, Armor of Shadows, Ascendant Step, Beast Speech, Beguiling Influence, Book of Ancient Secrets, Chains of Carceri, Devil\'s Sight, Dreadful Word, Eldritch Sight, Eldritch Spear, Eyes of the Rune Keeper, Fiendish Vigor, Gaze of Two Minds, Gift of the Depths, Gift of the Ever-Living Ones, Grasp of Hadar, Improved Pact Weapon, Investment of the Chain Master, Lifedrinker, Maddening Hex, Master of Myriad Forms, Minions of Chaos, Mire the Mind, Misty Visions, One with Shadows, Otherworldly Leap, Relentless Hex, Repelling Blast, Sculptor of Flesh, Sign of Ill Omen, Thief of Five Fates, Thirsting Blade, Trickster\'s Escape, Voice of the Chain Master, Whispers of the Entity, Witch Sight.' },
    ],
    3: [
      { id: 'pact-boon', name: 'Pact Boon', description: 'Choose a Pact Boon: Pact of the Blade (create a pact weapon, use Cha for attacks, gain invocations), Pact of the Chain (gain Find Familiar with enhanced options), Pact of the Tome (gain a Book of Shadows with 3 cantrips from any class).' },
    ],
    4: [
      { id: 'ability-score-improvement', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
      { id: 'eldritch-invocations-2', name: 'Eldritch Invocations', description: 'Gain 1 additional Eldritch Invocation (total 3).' },
    ],
    6: [
      { id: 'eldritch-invocations-3', name: 'Eldritch Invocations', description: 'Gain 1 additional Eldritch Invocation (total 4).' },
    ],
    8: [
      { id: 'ability-score-improvement-2', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
      { id: 'eldritch-invocations-4', name: 'Eldritch Invocations', description: 'Gain 1 additional Eldritch Invocation (total 5).' },
    ],
    10: [
      { id: 'eldritch-invocations-5', name: 'Eldritch Invocations', description: 'Gain 1 additional Eldritch Invocation (total 6).' },
    ],
    11: [
      { id: 'mystic-arcanum-6', name: 'Mystic Arcanum (6th Level)', description: 'Choose one 6th-level warlock spell. You can cast it once per long rest without a spell slot. It doesn\'t count against prepared spells.' },
    ],
    12: [
      { id: 'ability-score-improvement-3', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
      { id: 'eldritch-invocations-6', name: 'Eldritch Invocations', description: 'Gain 1 additional Eldritch Invocation (total 7).' },
    ],
    13: [
      { id: 'mystic-arcanum-7', name: 'Mystic Arcanum (7th Level)', description: 'Choose one 7th-level warlock spell. You can cast it once per long rest without a spell slot. It doesn\'t count against prepared spells.' },
    ],
    14: [
      { id: 'eldritch-invocations-7', name: 'Eldritch Invocations', description: 'Gain 1 additional Eldritch Invocation (total 8).' },
    ],
    15: [
      { id: 'mystic-arcanum-8', name: 'Mystic Arcanum (8th Level)', description: 'Choose one 8th-level warlock spell. You can cast it once per long rest without a spell slot. It doesn\'t count against prepared spells.' },
    ],
    16: [
      { id: 'ability-score-improvement-4', name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1 each, or take a feat.' },
      { id: 'eldritch-invocations-8', name: 'Eldritch Invocations', description: 'Gain 1 additional Eldritch Invocation (total 9).' },
    ],
    17: [
      { id: 'mystic-arcanum-9', name: 'Mystic Arcanum (9th Level)', description: 'Choose one 9th-level warlock spell. You can cast it once per long rest without a spell slot. It doesn\'t count against prepared spells.' },
    ],
    19: [
      { id: 'epic-boon', name: 'Epic Boon', description: 'Gain an Epic Boon feat or another Ability Score Improvement.' },
    ],
    20: [
      { id: 'eldritch-master', name: 'Eldritch Master', description: 'Once per long rest, as a Magic action, regain all expended Pact Magic spell slots.' },
    ],
  },
  multiclassGains: [
    'Two cantrips from the warlock spell list',
    'Pact Magic (1st-level spell slots, refresh on short/long rest)',
    'Eldritch Invocations (2 options)',
    'Spellcasting (prepared spells from warlock list, Cha-based)',
  ],
  asiLevels: [4, 8, 12, 16],
  sourceNote: 'SRD 5.2',
};