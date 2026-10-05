import type { ClassDef } from '../../types/character';

export const cleric: ClassDef = {
  id: 'cleric',
  name: 'Cleric',
  hitDie: 8,
  savingThrowProficiencies: ['wis', 'cha'],
  armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
  weaponProficiencies: ['Simple weapons'],
  // 2024 PHB: Holy symbol (amulet, stole, or similar religious implement) plus a holy book.
  toolProficiencies: ["holy symbol", "holy book"],
  skills: {
    granted: [],
    choices: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
    choiceCount: 2,
  },
  spellcasting: {
    ability: 'wis',
    cantripsMode: 'known',
    cantripCountByLevel: { 1: 3, 2: 3, 3: 3, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5 },
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
  subclassLevel: 1,
  sourceNote: 'SRD 5.2',
  asiLevels: [4, 8, 12, 16],
  multiclassGains: [
    'Light armor, Medium armor, Shields',
    'Simple weapons',
    'Holy symbol and holy book',
    'One skill from the Cleric list',
  ],
  subclasses: [
    {
      id: 'life',
      classId: 'cleric',
      name: 'Life Domain',
      description: 'Specializes in healing and vitality, maximizing hit point restoration and gaining heavy armor proficiency.',
      features: [
        { level: 1, name: 'Bonus Proficiency', description: 'Gain proficiency with heavy armor.' },
        { level: 1, name: 'Disciple of Life', description: 'When you use a spell of 1st level or higher to restore HP, the target regains additional HP equal to 2 + spell level.' },
        { level: 2, name: 'Channel Divinity: Preserve Life', description: 'As an action, expend Channel Divinity to heal up to 5 × cleric level HP among creatures within 30 feet (no undead/constructs). Cannot heal above half HP max.' },
        { level: 6, name: 'Blessed Healer', description: 'When you cast a spell of 1st level or higher that restores HP to another creature, you regain 2 + spell level HP.' },
        { level: 8, name: 'Divine Strike', description: 'Once per turn when you hit with a weapon attack, deal extra 1d8 radiant damage (2d8 at level 14).' },
        { level: 17, name: 'Supreme Healing', description: 'When you would roll dice to restore HP, use the highest possible number for each die instead.' },
      ],
    },
    {
      id: 'light',
      classId: 'cleric',
      name: 'Light Domain',
      description: 'Wields fire and radiance, gaining ward against flames, radiant damage bursts, and potent fire spells.',
      features: [
        { level: 1, name: 'Bonus Cantrip', description: 'Learn the light cantrip if you don\'t already know it. It doesn\'t count against your cantrips known.' },
        { level: 1, name: 'Warding Flare', description: 'When attacked by a creature within 30 feet you can see, use reaction to impose disadvantage on the attack roll. Usable Wisdom modifier times per long rest (min 1). Creatures immune to blinded are immune.' },
        { level: 2, name: 'Channel Divinity: Radiance of the Dawn', description: 'As an action, present holy symbol. Each hostile creature within 30 feet takes 2d10 + cleric level radiant damage (Constitution half). Allies in range regain 1d6 + cleric level HP.' },
        { level: 6, name: 'Improved Warding Flare', description: 'When a creature you can see attacks an ally within 30 feet, you can use Warding Flare to protect the ally. Range increases to 60 feet.' },
        { level: 8, name: 'Potent Spellcasting', description: 'Add Wisdom modifier to damage of any cleric cantrip.' },
        { level: 17, name: 'Corona of Light', description: 'As an action, emit bright light 60 feet, dim light 60 feet. Enemies in bright light have disadvantage on saves vs fire/radiant spells. You and allies in bright light have resistance to fire/radiant. Lasts 1 minute or until dismissed. Usable once per long rest.' },
      ],
    },
    {
      id: 'nature',
      classId: 'cleric',
      name: 'Nature Domain',
      description: 'Masters the natural world, gaining elemental resistance, plant/animal control, and dampened elemental damage.',
      features: [
        { level: 1, name: 'Acolyte of Nature', description: 'Learn one druid cantrip. Gain proficiency with heavy armor and one skill: Animal Handling, Nature, or Survival.' },
        { level: 2, name: 'Channel Divinity: Charm Animals and Plants', description: 'As an action, present holy symbol. Beasts and plants within 30 feet make Wisdom save or are charmed for 1 minute. Charmed creatures are friendly to you and allies.' },
        { level: 6, name: 'Dampen Elements', description: 'When you or a creature within 30 feet takes acid, cold, fire, lightning, or thunder damage, use reaction to grant resistance to that damage type until end of next turn.' },
        { level: 8, name: 'Divine Strike', description: 'Once per turn when you hit with a weapon attack, deal extra 1d8 cold, fire, or lightning damage (your choice, 2d8 at level 14).' },
        { level: 17, name: 'Master of Nature', description: 'As an action, command a charmed beast or plant (from Charm Animals and Plants) to obey you for 1 hour. It follows your commands without saving throws.' },
      ],
    },
    {
      id: 'war',
      classId: 'cleric',
      name: 'War Domain',
      description: 'Excels in martial combat, gaining bonus weapon attacks, guided strikes, and resistance to damage.',
      features: [
        { level: 1, name: 'Bonus Proficiency', description: 'Gain proficiency with martial weapons and heavy armor.' },
        { level: 1, name: 'War Priest', description: 'When you take the Attack action, you can make one weapon attack as a bonus action. Usable Wisdom modifier times per long rest (min 1).' },
        { level: 2, name: 'Channel Divinity: Guided Strike', description: 'When you make an attack roll, use Channel Divinity to gain a +10 bonus to the roll. Can be used after the roll but before the result.' },
        { level: 6, name: 'Channel Divinity: War God\'s Blessing', description: 'When a creature within 30 feet makes an attack roll, use reaction and Channel Divinity to grant a +10 bonus to the roll. Can be used after the roll but before the result.' },
        { level: 8, name: 'Divine Strike', description: 'Once per turn when you hit with a weapon attack, deal extra 1d8 force damage (2d8 at level 14).' },
        { level: 17, name: 'Avatar of Battle', description: 'You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'You can cast cleric spells using Wisdom. Cantrips known and prepared spells per the Cleric table. Spell save DC = 8 + proficiency + Wisdom, spell attack = proficiency + Wisdom.',
      },
      {
        id: 'divine-order',
        name: 'Divine Order',
        description: 'Choose one: Protector (gain heavy armor proficiency) or Thaumaturge (add Wisdom modifier to cantrip damage, gain one extra cantrip).',
      },
      { id: 'subclass-feature-1', name: 'Divine Domain', description: 'Choose a Divine Domain (subclass). You gain its 1st-level features.' },
    ],
    2: [
      {
        id: 'channel-divinity',
        name: 'Channel Divinity',
        description: 'You can channel divine energy for special effects (Turn Undead + domain feature). Usable once per short/long rest (twice at 6, three times at 18).',
      },
      { id: 'subclass-feature-2', name: 'Divine Domain Feature', description: 'Gain your Divine Domain\'s Channel Divinity option.' },
    ],
    4: [
      { id: 'ability-score-improvement', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    5: [
      { id: 'destroy-undead-1', name: 'Destroy Undead (CR 1/2)', description: 'When you Turn Undead, undead of CR 1/2 or lower that fail their save are instantly destroyed.' },
    ],
    6: [
      { id: 'channel-divinity-2', name: 'Channel Divinity (2 uses)', description: 'Channel Divinity uses increase to two per short/long rest.' },
      { id: 'subclass-feature-6', name: 'Divine Domain Feature', description: 'Gain your Divine Domain\'s 6th-level feature.' },
    ],
    8: [
      { id: 'ability-score-improvement-8', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
      { id: 'divine-strike', name: 'Divine Strike', description: 'Once per turn when you hit with a weapon attack, deal extra 1d8 damage of your domain\'s type (2d8 at level 14).' },
    ],
    10: [
      { id: 'divine-intervention', name: 'Divine Intervention', description: 'As an action, call on your deity for aid (DM determines effect, approximating a cleric spell). Usable once per 7 days. At level 20, it succeeds automatically with no cooldown.' },
    ],
    11: [
      { id: 'destroy-undead-2', name: 'Destroy Undead (CR 1)', description: 'When you Turn Undead, undead of CR 1 or lower that fail their save are instantly destroyed.' },
    ],
    12: [
      { id: 'ability-score-improvement-12', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    14: [
      { id: 'destroy-undead-3', name: 'Destroy Undead (CR 2)', description: 'When you Turn Undead, undead of CR 2 or lower that fail their save are instantly destroyed.' },
      { id: 'divine-strike-2', name: 'Divine Strike (2d8)', description: 'Divine Strike damage increases to 2d8.' },
    ],
    16: [
      { id: 'ability-score-improvement-16', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    17: [
      { id: 'destroy-undead-4', name: 'Destroy Undead (CR 3)', description: 'When you Turn Undead, undead of CR 3 or lower that fail their save are instantly destroyed.' },
      { id: 'subclass-feature-17', name: 'Divine Domain Feature', description: 'Gain your Divine Domain\'s 17th-level feature.' },
    ],
    18: [
      { id: 'channel-divinity-3', name: 'Channel Divinity (3 uses)', description: 'Channel Divinity uses increase to three per short/long rest.' },
    ],
    20: [
      { id: 'divine-intervention-mastery', name: 'Divine Intervention Mastery', description: 'Divine Intervention succeeds automatically and can be used again after a long rest instead of 7 days.' },
    ],
  },
};