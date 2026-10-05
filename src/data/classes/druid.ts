import type { ClassDef } from '../../types/character';

export const druid: ClassDef = {
  id: 'druid',
  name: 'Druid',
  hitDie: 8,
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
  weaponProficiencies: ['Simple weapons'],
  toolProficiencies: ["herbalism kit or druidic focus (choose one)"],
  skills: {
    granted: [],
    choices: ['arcana', 'animalHandling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'],
    choiceCount: 2,
  },
  spellcasting: {
    ability: 'wis',
    cantripsMode: 'known',
    cantripCountByLevel: {
      1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4,
      11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4,
    },
    spellsMode: 'prepared',
    spellCountByLevel: {
      1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15,
      11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22,
    },
    slotTable: {
      1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2],
      9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1],
      13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1], 15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1],
      17: [4, 3, 3, 3, 2, 1, 1, 1, 1], 18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
    },
    pactMagic: false,
    grantsFromSubclass: false,
  },
  subclassLevel: 3,
  extraFeatLevel: 4,
  sourceNote: 'SRD 5.2',
  asiLevels: [4, 8, 12, 16],
  multiclassGains: [
    'Light armor, Medium armor, Shields',
    'Simple weapons',
    'Herbalism kit or Druidic focus (choose one)',
    'Two skills from the Druid list',
  ],
  subclasses: [
    {
      id: 'circle-of-the-land',
      classId: 'druid',
      name: 'Circle of the Land',
      description: 'Draws power from a chosen terrain, granting bonus spells and recovery of spell slots on short rests.',
      features: [
        { level: 3, name: 'Circle Spells', description: 'You always have certain spells prepared based on your chosen land (Arctic, Coast, Desert, Forest, Grassland, Mountain, Swamp, or Underdark). These don\'t count against your prepared spell limit.' },
        { level: 3, name: 'Natural Recovery', description: 'Once per long rest during a short rest, recover expended spell slots with a combined level up to half your druid level (rounded up), none higher than 6th level.' },
        { level: 6, name: 'Land\'s Stride', description: 'Movement ignores difficult terrain from nonmagical plants. You have advantage on saves vs. plants and effects that would restrain you from plants.' },
        { level: 10, name: 'Nature\'s Ward', description: 'You can\'t be charmed or frightened by elementals or fey. You are immune to poison and disease.' },
        { level: 14, name: 'Nature\'s Sanctuary', description: 'As an action, expend a spell slot to create a 30-foot radius sanctuary for 1 minute. You and allies in it gain half cover, and enemies have disadvantage on attack rolls against you.' },
      ],
    },
    {
      id: 'circle-of-the-moon',
      classId: 'druid',
      name: 'Circle of the Moon',
      description: 'Masters of wild shape, shifting into more powerful beasts and elementals to fight on the front lines.',
      features: [
        { level: 3, name: 'Combat Wild Shape', description: 'Wild Shape as a bonus action. While transformed, you can expend a spell slot to regain 1d8 HP per slot level as a bonus action. AC in beast form = 13 + Wisdom modifier (if higher).' },
        { level: 3, name: 'Circle Forms', description: 'Wild Shape into beasts of CR up to 1/3 your druid level (rounded down, min 1). At level 6, CR up to your druid level / 3. You can Wild Shape into elementals at level 10.' },
        { level: 6, name: 'Primal Strike', description: 'Your attacks in beast form count as magical for overcoming resistance and immunity.' },
        { level: 10, name: 'Elemental Wild Shape', description: 'Expend two Wild Shape uses to transform into an air, earth, fire, or water elemental. You retain your hit points and Hit Dice.' },
        { level: 14, name: 'Thousand Forms', description: 'Cast alter self at will without a spell slot. You can change appearance as an action.' },
      ],
    },
    {
      id: 'circle-of-the-sea',
      classId: 'druid',
      name: 'Circle of the Sea',
      description: 'Channels oceanic power, gaining a watery aura that damages foes and grants a swim/fly speed.',
      features: [
        { level: 3, name: 'Wrath of the Sea', description: 'As a bonus action, activate a 10-foot emanation of water for 10 minutes (once per long rest, or spend a spell slot). Creatures you choose in the aura take cold damage equal to your Wisdom modifier when they enter or start their turn in it. You gain a swim speed and can breathe underwater.' },
        { level: 3, name: 'Circle Spells', description: 'You always have certain ocean-themed spells prepared (e.g., fog cloud, gust of wind, water breathing). They don\'t count against your prepared spell limit.' },
        { level: 6, name: 'Tidal Surge', description: 'When you deal cold damage with Wrath of the Sea, you can push the target 10 feet away. You can also fly while Wrath of the Sea is active.' },
        { level: 10, name: 'Storm Soul', description: 'You gain resistance to cold, lightning, and thunder. While Wrath of the Sea is active, you can extend its radius to 30 feet and creatures in it have resistance to those types.' },
        { level: 14, name: 'Oceanic Gift', description: 'As an action, grant Wrath of the Sea to a willing creature within 30 feet for 10 minutes. They gain the swim speed and cold resistance. Usable once per long rest, or by spending a 5th-level slot.' },
      ],
    },
    {
      id: 'circle-of-the-stars',
      classId: 'druid',
      name: 'Circle of the Stars',
      description: 'Harnesses stellar energy through a Starry Form, shifting between Archer, Chalice, and Dragon constellations.',
      features: [
        { level: 3, name: 'Starry Form', description: 'As a bonus action, expend a Wild Shape use to take a luminous form for 10 minutes. Choose: Archer (ranged spell attack, 60 ft, radiant damage = 1d8 + Wis), Chalice (heal 1d8 + Wis when you cast a healing spell), or Dragon (Concentration saves use d10, min 10 + Wis).' },
        { level: 3, name: 'Circle Spells', description: 'You always have certain divination/teleportation spells prepared (e.g., guiding bolt, detect magic, clairvoyance). They don\'t count against your prepared spell limit.' },
        { level: 6, name: 'Cosmic Omen', description: 'After a long rest, roll a d6. When you or a creature within 30 ft. makes an attack roll, save, or ability check, use your reaction to add (even) or subtract (odd) the roll. Usable proficiency bonus times per long rest.' },
        { level: 10, name: 'Twinkling Constellations', description: 'While in Starry Form, you can change your constellation as a bonus action. Archer and Chalice damage/healing increases to 2d8 + Wis.' },
        { level: 14, name: 'Full of Stars', description: 'While in Starry Form, you gain resistance to bludgeoning, piercing, and slashing damage. You can also teleport 30 feet as a bonus action while in this form.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'druidic',
        name: 'Druidic',
        description: 'You know the secret language of druids. You can leave hidden messages that only druids and those who succeed on a DC 15 Wisdom (Perception) check can notice.',
      },
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'You know 2 cantrips and prepare spells from the druid list. Wisdom is your spellcasting ability. You can use a druidic focus as a spellcasting focus.',
      },
    ],
    2: [
      {
        id: 'wild-shape',
        name: 'Wild Shape',
        description: 'As an action (bonus action for Circle of the Moon), assume the form of a beast you have seen (CR 1/4, no fly/swim speed at level 2). Usable twice per short/long rest. You retain alignment, personality, Int/Wis/Cha, skills, and saves. HP and HD become the beast\'s. Gear merges or falls.',
      },
      {
        id: 'wild-companion',
        name: 'Wild Companion',
        description: 'Expend a Wild Shape use to cast find familiar without material components. The familiar is a fey. Lasts until you finish a long rest or use this feature again.',
      },
    ],
    3: [
      { id: 'subclass-feature-3', name: 'Druid Circle', description: 'Choose a Druid Circle: Circle of the Land, Circle of the Moon, Circle of the Sea, or Circle of the Stars. Each grants features at 3rd, 6th, 10th, and 14th level.' },
    ],
    4: [
      { id: 'ability-score-improvement', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
      { id: 'feat', name: 'Feat', description: 'Choose one General Feat for which you qualify. This is in addition to the ASI at this level.' },
    ],
    5: [
      { id: 'wild-resurgence', name: 'Wild Resurgence', description: 'When you roll initiative and have no Wild Shape uses left, regain one. When you finish a short rest, regain one expended spell slot of level up to half your druid level (rounded up).' },
    ],
    6: [
      { id: 'subclass-feature-6', name: 'Druid Circle Feature', description: 'Gain your Druid Circle\'s 6th-level feature.' },
    ],
    8: [
      { id: 'ability-score-improvement-8', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    10: [
      { id: 'subclass-feature-10', name: 'Druid Circle Feature', description: 'Gain your Druid Circle\'s 10th-level feature.' },
    ],
    12: [
      { id: 'ability-score-improvement-12', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    14: [
      { id: 'subclass-feature-14', name: 'Druid Circle Feature', description: 'Gain your Druid Circle\'s 14th-level feature.' },
    ],
    16: [
      { id: 'ability-score-improvement-16', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    18: [
      { id: 'timeless-body', name: 'Timeless Body', description: 'You age 1 year for every 10 years that pass. You no longer need food or water.' },
      { id: 'beast-spells', name: 'Beast Spells', description: 'While in Wild Shape, you can cast druid spells (except those with a gold cost) using your normal spellcasting ability.' },
    ],
    20: [
      { id: 'archdruid', name: 'Archdruid', description: 'Wild Shape uses become unlimited. You can ignore the verbal and somatic components of druid spells, and material components that lack a gold cost, in both your normal and beast forms.' },
    ],
  },
};