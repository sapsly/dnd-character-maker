import type { ClassDef } from '../../types/character';

export const druid: ClassDef = {
  id: 'druid',
  name: 'Druid',
  hitDie: 8,
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: ['Light armor', 'Shields'],
  weaponProficiencies: ['Simple weapons'],
  toolProficiencies: ['Herbalism Kit'],
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
      11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4
    },
    spellsMode: 'prepared',
    spellCountByLevel: {
      1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15,
      11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22
    },
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
  subclasses: [
    {
      id: 'circle-of-the-land',
      classId: 'druid',
      name: 'Circle of the Land',
      description: 'Celebrate Connection to the Natural World The Circle of the Land comprises mystics and sages who safeguard ancient knowledge and rites. These Druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle\'s wisest members preside as the chief priests of their communities.',
      features: [
        { level: 3, name: 'Circle of the Land Spells', description: 'Whenever you finish a Long Rest, choose one type of land: arid, polar, temperate, or tropical. Consult the table below that corresponds to the chosen type; you have the spells listed for your Druid level and lower prepared.' },
        { level: 3, name: 'Land\'s Aid', description: 'As a Magic action, you can expend a use of your Wild Shape and choose a point within 60 feet of yourself. Vitality-giving flowers and life-draining thorns appear for a moment in a 10-foot-radius Sphere centered on that point. Each creature of your choice in the Sphere must make a Constitution saving throw against your spell save DC, taking 2d6 Necrotic damage on a failed save or half as much damage on a successful one. One creature of your choice in that area regains 2d6 Hit Points. The damage and healing increase by 1d6 when you reach Druid levels 10 (3d6) and 14 (4d6).' },
        { level: 6, name: 'Natural Recovery', description: 'You can cast one of the level 1+ spells that you have prepared from your Circle Spells feature without expending a spell slot, and you must finish a Long Rest before you do so again. In addition, when you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your Druid level (round up), and none of them can be level 6+. For example, if you\'re a level 6 Druid, you can recover up to three levels\' worth of spell slots. You can recover a level 3 spell slot, a level 2 and a level 1 spell slot, or three level 1 spell slots. Once you recover spell slots with this feature, you can\'t do so again until you finish a Long Rest.' },
        { level: 10, name: 'Nature\'s Ward', description: 'You are immune to the Poisoned condition, and you have Resistance to a damage type associated with your current land choice in the Circle Spells feature, as shown in the Nature\'s Ward table.' },
        { level: 14, name: 'Nature\'s Sanctuary', description: 'As a Magic action, you can expend a use of your Wild Shape and cause spectral trees and vines to appear in a 15-foot Cube on the ground within 120 feet of yourself. They last there for 1 minute or until you have the Incapacitated condition or die. You and your allies have Half Cover while in that area, and your allies gain the current Resistance of your Nature\'s Ward while there. As a Bonus Action, you can move the Cube up to 60 feet to ground within 120 feet of yourself.' },
      ],
    },
    {
      id: 'circle-of-the-moon',
      classId: 'druid',
      name: 'Circle of the Moon',
      description: 'Adopt Animal Forms to Guard the Wilds Druids of the Circle of the Moon draw on lunar magic to transform themselves. Their order gathers under the moon to share news and perform rituals. Changeable as the moon, a Druid of this circle might prowl as a great cat one night, soar over the treetops as an eagle the next day, and then crash through undergrowth as a bear to drive off a trespassing monster. The wild is in the Druid\'s blood.',
      features: [
        { level: 3, name: 'Circle Forms', description: 'You can channel lunar magic when you assume a Wild Shape form, granting you the benefits below. Challenge Rating. The maximum Challenge Rating for the form equals your Druid level divided by 3 (round down). Armor Class. Until you leave the form, your AC equals 13 plus your Wisdom modifier if that total is higher than the Beast\'s AC. Temporary Hit Points. You gain a number of Temporary Hit Points equal to three times your Druid level.' },
        { level: 3, name: 'Circle of the Moon Spells', description: 'When you reach a Druid level specified in the Circle of the Moon Spells table, you thereafter always have the listed spells prepared. In addition, you can cast the spells from this feature while you\'re in a Wild Shape form.' },
        { level: 6, name: 'Improved Circle Forms', description: 'While in a Wild Shape form, you gain the following benefits. Lunar Radiance. Each of your attacks in a Wild Shape form can deal its normal damage type or Radiant damage. You make this choice each time you hit with those attacks. Increased Toughness. You can add your Wisdom modifier to your Constitution saving throws.' },
        { level: 10, name: 'Moonlight Step', description: 'You magically transport yourself, reappearing amid a burst of moonlight. As a Bonus Action, you teleport up to 30 feet to an unoccupied space you can see, and you have Advantage on the next attack roll you make before the end of this turn. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. You can also regain uses by expending a level 2+ spell slot for each use you want to restore (no action required).' },
        { level: 14, name: 'Lunar Form', description: 'The power of the moon suffuses you, granting you the following benefits. Improved Lunar Radiance. Once per turn, you can deal an extra 2d10 Radiant damage to a target you hit with a Wild Shape form\'s attack. Shared Moonlight. Whenever you use Moonlight Step, you can also teleport one willing creature. That creature must be within 10 feet of you, and you teleport it to an unoccupied space you can see within 10 feet of your destination space.' },
      ],
    },
    {
      id: 'circle-of-the-sea',
      classId: 'druid',
      name: 'Circle of the Sea',
      description: 'Become One with Tides and Storms Druids of the Circle of the Sea draw on the tempestuous forces of oceans and storms. Some view themselves as embodiments of nature\'s wrath, seeking vengeance against those who despoil nature. Others seek mystical unity with nature by attuning themselves to the ebb and flow of the tides, following the rush of currents and waves and listening to the inscrutable whispers and roars of the winds.',
      features: [
        { level: 3, name: 'Circle of the Sea Spells', description: 'When you reach a Druid level specified in the Circle of the Sea Spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Wrath of the Sea', description: 'As a Bonus Action, you can expend a use of your Wild Shape to manifest a 5-foot Emanation that takes the form of ocean spray that surrounds you for 10 minutes. It ends early if you dismiss it (no action required), manifest it again, or have the Incapacitated condition. When you manifest the Emanation and as a Bonus Action on your subsequent turns, you can choose another creature you can see in the Emanation. The target must succeed on a Constitution saving throw against your spell save DC or take Cold damage and, if the creature is Large or smaller, be pushed up to 15 feet away from you. To determine this damage, roll a number of d6s equal to your Wisdom modifier (minimum of one die).' },
        { level: 6, name: 'Aquatic Affinity', description: 'The size of the Emanation created by your Wrath of the Sea increases to 10 feet. In addition, you gain a Swim Speed equal to your Speed.' },
        { level: 10, name: 'Stormborn', description: 'Your Wrath of the Sea confers two more benefits while active, as detailed below. Flight. You gain a Fly Speed equal to your Speed. Resistance. You have Resistance to Cold, Lightning, and Thunder damage.' },
        { level: 14, name: 'Oceanic Gift', description: 'Instead of manifesting the Emanation of Wrath of the Sea around yourself, you can manifest it around one willing creature within 60 feet of yourself. That creature gains all the benefits of the Emanation and uses your spell save DC and Wisdom modifier for it. In addition, you can manifest the Emanation around both the other creature and yourself if you expend two uses of your Wild Shape instead of one when manifesting it.' },
      ],
    },
    {
      id: 'circle-of-the-stars',
      classId: 'druid',
      name: 'Circle of the Stars',
      description: 'Harness Secrets Hidden in Constellations The Circle of the Stars has tracked heavenly patterns since time immemorial, discovering secrets hidden amid the constellations. By understanding these secrets, the Druids of this circle seek to harness the powers of the cosmos.',
      features: [
        { level: 3, name: 'Star Map', description: 'You\'ve created a star chart as part of your heavenly studies. It is a Tiny object, and you can use it as a Spellcasting Focus for your Druid spells. You determine its form by rolling on the Star Map table or by choosing one. While holding the map, you have the Guidance and Guiding Bolt spells prepared, and you can cast Guiding Bolt without expending a spell slot. You can cast it in that way a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. If you lose the map, you can perform a 1-hour ceremony to magically create a replacement. This ceremony can be performed during a Short or Long Rest, and it destroys the previous map.' },
        { level: 3, name: 'Starry Form', description: 'As a Bonus Action, you can expend a use of your Wild Shape feature to take on a starry form rather than shape-shifting. While in your starry form, you retain your game statistics, but your body becomes luminous, your joints glimmer like stars, and glowing lines connect them as on a star chart. This form sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. The form lasts for 10 minutes. It ends early if you dismiss it (no action required), have the Incapacitated condition, or use this feature again. Whenever you assume your starry form, choose which of the following constellations glimmers on your body; your choice gives you certain benefits while in the form. Archer. A constellation of an archer appears on you. When you activate this form and as a Bonus Action on your subsequent turns while it lasts, you can make a ranged spell attack, hurling a luminous arrow that targets one creature within 60 feet of yourself. On a hit, the attack deals Radiant damage equal to 1d8 plus your Wisdom modifier. Chalice. A constellation of a life-giving goblet appears on you. Whenever you cast a spell using a spell slot that restores Hit Points to a creature, you or another creature within 30 feet of you can regain Hit Points equal to 1d8 plus your Wisdom modifier. Dragon. A constellation of a wise dragon appears on you. When you make an Intelligence or a Wisdom check or a Constitution saving throw to maintain Concentration, you can treat a roll of 9 or lower on the d20 as a 10.' },
        { level: 6, name: 'Cosmic Omen', description: 'Whenever you finish a Long Rest, you can consult your Star Map for omens and roll a die. Until you finish your next Long Rest, you gain access to a special Reaction based on whether you rolled an even or an odd number on the die: Weal (Even). Whenever a creature you can see within 30 feet of you is about to make a D20 Test, you can take a Reaction to roll 1d6 and add the number rolled to the total. Woe (Odd). Whenever a creature you can see within 30 feet of you is about to make a D20 Test, you can take a Reaction to roll 1d6 and subtract the number rolled from the total. You can use this Reaction a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 10, name: 'Twinkling Constellations', description: 'The constellations of your Starry Form improve. The 1d8 of the Archer and the Chalice becomes 2d8, and while the Dragon is active, you have a Fly Speed of 20 feet and can hover. Moreover, at the start of each of your turns while in your Starry Form, you can change which constellation glimmers on your body.' },
        { level: 14, name: 'Full of Stars', description: 'While in your Starry Form, you become partially incorporeal, giving you Resistance to Bludgeoning, Piercing, and Slashing damage.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'You have learned to cast spells through studying the mystical forces of nature. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Druid spells, which appear on the Druid spell list later in the class\'s description. Cantrips. You know two cantrips of your choice from the Druid spell list. Druidcraft and Produce Flame are recommended. Whenever you gain a Druid level, you can replace one of your cantrips with another cantrip of your choice from the Druid spell list. When you reach Druid levels 4 and 10, you learn another cantrip of your choice from the Druid spell list, as shown in the Cantrips column of the Druid Features table. Spell Slots. The Druid Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose four level 1 spells from the Druid spell list. Animal Friendship, Cure Wounds, Faerie Fire, and Thunderwave are recommended. The number of spells on your list increases as you gain Druid levels, as shown in the Prepared Spells column of the Druid Features table. Whenever that number increases, choose additional spells from the Druid spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 3 Druid, your list of prepared spells can include six spells of levels 1 and 2 in any combination. If another Druid feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Druid spells for you. Changing Your Prepared Spells. Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells with other Druid spells for which you have spell slots. Spellcasting Ability. Wisdom is your spellcasting ability for your Druid spells. Spellcasting Focus. You can use a Druidic Focus as a Spellcasting Focus for your Druid spells.'
      },
      {
        id: 'druidic',
        name: 'Druidic',
        description: 'You know Druidic, the secret language of Druids. While learning this ancient tongue, you also unlocked the magic of communicating with animals; you always have the Speak with Animals spell prepared. You can use Druidic to leave hidden messages. You and others who know Druidic automatically spot such a message. Others spot the message\'s presence with a successful DC 15 Intelligence (Investigation) check but can\'t decipher it without magic.'
      },
      {
        id: 'primal-order',
        name: 'Primal Order',
        description: 'You have dedicated yourself to one of the following sacred roles of your choice. Magician. You know one extra cantrip from the Druid spell list. In addition, your mystical connection to nature gives you a bonus to your Intelligence (Arcana or Nature) checks. The bonus equals your Wisdom modifier (minimum bonus of +1). Warden. Trained for battle, you gain proficiency with Martial weapons and training with Medium armor.'
      },
    ],
    2: [
      {
        id: 'wild-shape',
        name: 'Wild Shape',
        description: 'The power of nature allows you to assume the form of an animal. As a Bonus Action, you shape-shift into a Beast form that you have learned for this feature (see "Known Forms" below). You stay in that form for a number of hours equal to half your Druid level or until you use Wild Shape again, have the Incapacitated condition, or die. You can also leave the form early as a Bonus Action. Number of Uses. You can use Wild Shape twice. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. You gain additional uses when you reach certain Druid levels, as shown in the Wild Shape column of the Druid Features table. Known Forms. You know four Beast forms for this feature, chosen from among Beast stat blocks that have a maximum Challenge Rating of 1/4 and that lack a Fly Speed (see appendix B for stat block options). The Rat, Riding Horse, Spider, and Wolf are recommended. Whenever you finish a Long Rest, you can replace one of your known forms with another eligible form. When you reach certain Druid levels, your number of known forms and the maximum Challenge Rating for those forms increases, as shown in the Beast Shapes table. In addition, starting at level 8, you can adopt a form that has a Fly Speed. When choosing known forms, you may look in the Monster Manual or elsewhere for eligible Beasts if the Dungeon Master permits you to do so. Rules While Shape-Shifted. While in a form, you retain your personality, memories, and ability to speak, and the following rules apply: Temporary Hit Points. When you assume a Wild Shape form, you gain a number of Temporary Hit Points equal to your Druid level. Game Statistics. Your game statistics are replaced by the Beast\'s stat block, but you retain your creature type; Hit Points; Hit Point Dice; Intelligence, Wisdom, and Charisma scores; class features; languages; and feats. You also retain your skill and saving throw proficiencies and use your Proficiency Bonus for them, in addition to gaining the proficiencies of the creature. If a skill or saving throw modifier in the Beast\'s stat block is higher than yours, use the one in the stat block. No Spellcasting. You can\'t cast spells, but shape-shifting doesn\'t break your Concentration or otherwise interfere with a spell you\'ve already cast. Objects. Your ability to handle objects is determined by the form\'s limbs rather than your own. In addition, you choose whether your equipment falls in your space, merges into your new form, or is worn by it. Worn equipment functions as normal, but the DM decides whether it\'s practical for the new form to wear a piece of equipment based on the creature\'s size and shape. Your equipment doesn\'t change size or shape to match the new form, and any equipment that the new form can\'t wear must either fall to the ground or merge with the form. Equipment that merges with the form has no effect while you\'re in that form.'
      },
      {
        id: 'wild-companion',
        name: 'Wild Companion',
        description: 'You can summon a nature spirit that assumes an animal form to aid you. As a Magic action, you can expend a spell slot or a use of Wild Shape to cast the Find Familiar spell without Material components. When you cast the spell in this way, the familiar is Fey and disappears when you finish a Long Rest.'
      },
    ],
    3: [
      {
        id: 'druid-subclass',
        name: 'Druid Subclass',
        description: 'You gain a Druid subclass of your choice. The Circle of the Land, Circle of the Moon, Circle of the Sea, and Circle of the Stars subclasses are detailed after this class\'s description. A subclass is a specialization that grants you features at certain Druid levels. For the rest of your career, you gain each of your subclass\'s features that are of your Druid level or lower.'
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Druid levels 8, 12, and 16.'
      },
    ],
    5: [
      {
        id: 'wild-resurgence',
        name: 'Wild Resurgence',
        description: 'Once on each of your turns, if you have no uses of Wild Shape left, you can give yourself one use by expending a spell slot (no action required). In addition, you can expend one use of Wild Shape (no action required) to give yourself a level 1 spell slot, but you can\'t do so again until you finish a Long Rest.'
      },
    ],
    7: [
      {
        id: 'elemental-fury',
        name: 'Elemental Fury',
        description: 'The might of the elements flows through you. You gain one of the following options of your choice. Potent Spellcasting. Add your Wisdom modifier to the damage you deal with any Druid cantrip. Primal Strike. Once on each of your turns when you hit a creature with an attack roll using a weapon or a Beast form\'s attack in Wild Shape, you can cause the target to take an extra 1d8 Cold, Fire, Lightning, or Thunder damage (choose when you hit).'
      },
    ],
    15: [
      {
        id: 'improved-elemental-fury',
        name: 'Improved Elemental Fury',
        description: 'The option you chose for Elemental Fury grows more powerful, as detailed below. Potent Spellcasting. When you cast a Druid cantrip with a range of 10 feet or greater, the spell\'s range increases by 300 feet. Primal Strike. The extra damage of your Primal Strike increases to 2d8.'
      },
    ],
    18: [
      {
        id: 'beast-spells',
        name: 'Beast Spells',
        description: 'While using Wild Shape, you can cast spells in Beast form, except for any spell that has a Material component with a cost specified or that consumes its Material component.'
      },
    ],
    19: [
      {
        id: 'epic-boon',
        name: 'Epic Boon',
        description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Dimensional Travel is recommended.'
      },
    ],
    20: [
      {
        id: 'archdruid',
        name: 'Archdruid',
        description: 'The vitality of nature constantly blooms within you, granting you the following benefits. Evergreen Wild Shape. Whenever you roll Initiative and have no uses of Wild Shape left, you regain one expended use of it. Nature Magician. You can convert uses of Wild Shape into a spell slot (no action required). Choose a number of your unexpended uses of Wild Shape and convert them into a single spell slot, with each use contributing 2 spell levels. For example, if you convert two uses of Wild Shape, you produce a level 4 spell slot. Once you use this benefit, you can\'t do so again until you finish a Long Rest. Longevity. The primal magic that you wield causes you to age more slowly. For every ten years that pass, your body ages only one year.'
      },
    ],
  },
  multiclassGains: ['Light armor, Shields (nonmetal)', 'Simple weapons, Herbalism Kit', 'Two skills from the Druid list'],
  asiLevels: [4, 8, 12, 16],
};