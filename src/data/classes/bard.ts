import type { ClassDef } from '../../types/character';

export const bard: ClassDef = {
  id: 'bard',
  name: 'Bard',
  hitDie: 8,
  savingThrowProficiencies: ['dex', 'cha'],
  armorProficiencies: ['Light armor'],
  weaponProficiencies: ['Simple weapons'],
  toolProficiencies: ['Choose 3 Musical Instruments'],
  skills: {
    granted: [],
    choices: ['acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleightOfHand', 'stealth', 'survival'],
    choiceCount: 3,
  },
  spellcasting: {
    ability: 'cha',
    cantripsMode: 'known',
    cantripCountByLevel: {1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4, 11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4},
    spellsMode: 'prepared',
    spellCountByLevel: {1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22},
    slotTable: {1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1], 15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1], 18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1]},
  },
  subclassLevel: 3,
  subclasses: [
    {
      id: 'college-of-dance',
      classId: 'bard',
      name: 'College of Dance',
      description: 'Move in Harmony with the Cosmos Bards of the College of Dance know that the Words of Creation can\'t be contained within speech or song; the words are uttered by the movements of celestial bodies and flow through the motions of the smallest creatures. These Bards practice a way of being in harmony with the whirling cosmos that emphasizes agility, speed, and grace.',
      features: [
        { level: 3, name: 'Dazzling Footwork', description: 'While you aren\'t wearing armor or wielding a Shield, you gain the following benefits. Dance Virtuoso. You have Advantage on any Charisma (Performance) check you make that involves you dancing. Unarmored Defense. Your base Armor Class equals 10 plus your Dexterity and Charisma modifiers. Agile Strikes. When you expend a use of your Bardic Inspiration as part of an action, a Bonus Action, or a Reaction, you can make one Unarmed Strike as part of that action, Bonus Action, or Reaction. Bardic Damage. You can use Dexterity instead of Strength for the attack rolls of your Unarmed Strikes. When you deal damage with an Unarmed Strike, you can deal Bludgeoning damage equal to a roll of your Bardic Inspiration die plus your Dexterity modifier, instead of the strike\'s normal damage. This roll doesn\'t expend the die.' },
        { level: 6, name: 'Inspiring Movement', description: 'When an enemy you can see ends its turn within 5 feet of you, you can take a Reaction and expend one use of your Bardic Inspiration to move up to half your Speed. Then one ally of your choice within 30 feet of you can also move up to half their Speed using their Reaction. None of this feature\'s movement provokes Opportunity Attacks.' },
        { level: 6, name: 'Tandem Footwork', description: 'When you roll Initiative, you can expend one use of your Bardic Inspiration if you don\'t have the Incapacitated condition. When you do so, roll your Bardic Inspiration die; you and each ally within 30 feet of you who can see or hear you gains a bonus to Initiative equal to the number rolled.' },
        { level: 14, name: 'Leading Evasion', description: 'When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. If any creatures within 5 feet of you are making the same Dexterity saving throw, you can share this benefit with them for that save. You can\'t use this feature if you have the Incapacitated condition.' },
      ],
    },
    {
      id: 'college-of-glamour',
      classId: 'bard',
      name: 'College of Glamour',
      description: 'Weave Beguiling Fey Magic The College of Glamour traces its origins to the beguiling magic of the Feywild. Bards who study this magic weave threads of beauty and terror into their songs and stories, and the mightiest among them can cloak themselves in otherworldly majesty. Their performances stir up wistful longing for forgotten innocence, evoke unconscious memories of longheld fears, and tug at the emotions of even the most hard-hearted listeners.',
      features: [
        { level: 3, name: 'Beguiling Magic', description: 'You always have the Charm Person and Mirror Image spells prepared. In addition, immediately after you cast an Enchantment or Illusion spell using a spell slot, you can cause a creature you can see within 60 feet of yourself to make a Wisdom saving throw against your spell save DC. On a failed save, the target has the Charmed or Frightened condition (your choice) for 1 minute. The target repeats the save at the end of each of its turns, ending the effect on itself on a success. Once you use this benefit, you can\'t use it again until you finish a Long Rest. You can also restore your use of it by expending one use of your Bardic Inspiration (no action required).' },
        { level: 3, name: 'Mantle of Inspiration', description: 'You can weave fey magic into a song or dance to fill others with vigor. As a Bonus Action, you can expend a use of Bardic Inspiration, rolling a Bardic Inspiration die. When you do so, choose a number of other creatures within 60 feet of yourself, up to a number equal to your Charisma modifier (minimum of one creature). Each of those creatures gains a number of Temporary Hit Points equal to two times the number rolled on the Bardic Inspiration die, and then each can use its Reaction to move up to its Speed without provoking Opportunity Attacks.' },
        { level: 6, name: 'Mantle of Majesty', description: 'You always have the Command spell prepared. As a Bonus Action, you cast Command without expending a spell slot, and you take on an unearthly appearance for 1 minute or until your Concentration ends. During this time, you can cast Command as a Bonus Action without expending a spell slot, Any creature Charmed by you automatically fails its saving throw against the Command you cast with this feature. Once you use this feature, you can\'t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 3+ spell slot (no action required).' },
        { level: 14, name: 'Unbreakable Majesty', description: 'As a Bonus Action, you can assume a magically majestic presence for 1 minute or until you have the Incapacitated condition. For the duration, whenever any creature hits you with an attack roll for the first time on a turn, the attacker must succeed on a Charisma saving throw against your spell save DC, or the attack misses instead, as the creature recoils from your majesty. Once you assume this majestic presence, you can\'t do so again until you finish a Short or Long Rest.' },
      ],
    },
    {
      id: 'college-of-lore',
      classId: 'bard',
      name: 'College of Lore',
      description: 'Plumb the Depths of Magical Knowledge Bards of the College of Lore collect spells and secrets from diverse sources, such as scholarly tomes, mystical rites, and peasant tales. The college\'s members gather in libraries and universities to share their lore with one another. They also meet at festivals or affairs of state, where they can expose corruption, unravel lies, and poke fun at self-important figures of authority.',
      features: [
        { level: 3, name: 'Bonus Proficiencies', description: 'You gain proficiency with three skills of your choice.' },
        { level: 3, name: 'Cutting Words', description: 'You learn to use your wit to supernaturally distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of yourself makes a damage roll or succeeds on an ability check or attack roll, you can take a Reaction to expend one use of your Bardic Inspiration; roll your Bardic Inspiration die, and subtract the number rolled from the creature\'s roll, reducing the damage or potentially turning the success into a failure.' },
        { level: 6, name: 'Magical Discoveries', description: 'You learn two spells of your choice. These spells can come from the Cleric, Druid, or Wizard spell list or any combination thereof (see a class\'s section for its spell list). A spell you choose must be a cantrip or a spell for which you have spell slots, as shown in the Bard Features table. You always have the chosen spells prepared, and whenever you gain a Bard level, you can replace one of the spells with another spell that meets these requirements.' },
        { level: 14, name: 'Peerless Skill', description: 'When you make an ability check or attack roll and fail, you can expend one use of Bardic Inspiration; roll the Bardic Inspiration die, and add the number rolled to the d20, potentially turning a failure into a success. On a failure, the Bardic Inspiration isn\'t expended.' },
      ],
    },
    {
      id: 'college-of-spirits',
      classId: 'bard',
      name: 'College of Spirits',
      description: 'Call Forth Spirits from Beyond the Grave Bards of the College of Spirits conjure legendary spirits to change the world. But such entities are capricious, and what a Bard summons isn\'t always entirely under their control.',
      features: [
        { level: 3, name: 'Channeler', description: 'You learn how to contact spirits beyond the grave, letting their power and knowledge flow through you. You gain the following benefits. Guiding Whispers. You know the Guidance cantrip. It has a range of 60 feet when you cast it. Spiritual Focus. You employ tools that aid you in channeling spirits. You gain a Gaming Set (playing cards). You have proficiency with this Gaming Set, and you can use it or one of the following items as a Spellcasting Focus for your Bard spells: Arcane Focus (crystal or orb), Candle, or Ink Pen.' },
        { level: 3, name: 'Spirits from Beyond', description: 'You can call forth spirits of the dead to empower you and your allies. When you take a Bonus Action to give a creature a Bardic Inspiration die, you can call forth the powers of a random spirit. To determine the spirit you channel, roll the Bardic Inspiration die and refer to the Spirits from Beyond table. The spirit remains channeled until you unleash it or until you finish a Short or Long Rest. Controlled Channeling. As a Bonus Action, you can expend a use of your Bardic Inspiration and channel a specific spirit. When you do so, choose the spirit from the Spirits from Beyond table rather than rolling. The chosen spirit\'s corresponding number must be less than or equal to the highest number on your Bardic Inspiration die; for example, if your Bardic Inspiration die is a d8, you can choose to channel any spirit up to (and including) the Shade. Unleashing a Spirit. As a Magic action, you can unleash one of your channeled spirits. Choose one creature you can see within 30 feet of yourself as the spirit\'s target. The spirit then takes effect; if a spirit\'s effect requires a saving throw, the DC equals your Bard spell save DC.' },
        { level: 6, name: 'Empowered Channeling', description: 'Your ability to channel spirits improves. You gain the following benefits. Power from Beyond. Once per turn, when you cast a Bard spell with a spell slot that deals damage or restores Hit Points, roll 1d6. You gain a bonus equal to the number rolled to one of the spell\'s damage rolls or to the total Hit Points the spell restores. Spiritual Manifestation. You always have the Spirit Guardians spell prepared. You can cast the spell once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. Whenever you cast the spell, you can modify it so the spirits also guard against worldly threats. When you cast the spell in this way, you and allies within the spell\'s Emanation have Half Cover. Once you modify the spell in this way, you can\'t do so again until you finish a Short or Long Rest.' },
        { level: 14, name: 'Mystical Connection', description: 'You gain mastery over the spirits you call forth. Whenever you roll on the Spirits from Beyond table, you can roll the die twice and choose which of the two effects to bestow. If you roll the same number on both dice, you can instead choose any effect on the table.' },
      ],
    },
    {
      id: 'college-of-the-moon',
      classId: 'bard',
      name: 'College of the Moon',
      description: 'Inspire Allies with Primal Tales The College of the Moon traces its origins to the ancient druidic circles of the Moonshae Isles, who entrusted the first Bards of this tradition with chronicling the stories of the islands and their people. Bards of this college draw from the isles\' fey magic and the primal power of the moonwells to bolster their allies, protect the natural world, and inspire their bardic works.',
      features: [
        { level: 3, name: 'Moon\'s Inspiration', description: 'The primal and ever-changing power of the moon flows through you, granting you the following benefits. Inspired Eclipse. When you take a Bonus Action to give a creature a Bardic Inspiration die, you can have the Invisible condition and teleport up to 30 feet to an unoccupied space you can see as part of that Bonus Action. This invisibility lasts until the start of your next turn and ends early immediately after you make an attack roll, deal damage, or cast a spell. Lunar Vitality. Once per turn when you restore Hit Points to a creature with a spell, you can expend a Bardic Inspiration die and increase the amount of Hit Points restored by a number equal to a roll of the Bardic Inspiration die. The creature\'s Speed also increases by 10 feet until the end of its next turn.' },
        { level: 3, name: 'Primal Lore', description: 'You learn Druidic and one cantrip from the Druid spell list. It counts as a Bard spell for you but doesn\'t count against the number of cantrips you know. Whenever you gain a Bard level, you can replace this cantrip with another cantrip of your choice from the Druid spell list. Additionally, choose one of the following skills: Animal Handling, Insight, Medicine, Nature, Perception, or Survival. You have proficiency in that skill.' },
        { level: 6, name: 'Blessing of Moonlight', description: 'You always have the Moonbeam spell prepared. When you cast Moonbeam, you can modify the spell so that you glow faintly while the spell is active. While glowing, you shed Dim Light out to 5 feet, and whenever a creature fails its saving throw against the effects of this Moonbeam, another creature of your choice that you can see within 60 feet of yourself regains 2d4 Hit Points. Once you use this feature to modify a casting of Moonbeam, you can\'t use it again until you finish a Long Rest.' },
        { level: 14, name: 'Eventide\'s Splendor', description: 'You become suffused with the might of the moon, improving your Moon\'s Inspiration in the following ways. Shadow of the New Moon. When you use Inspired Eclipse, the creature who received the Bardic Inspiration die can also have the Invisible condition and immediately take a Reaction to teleport up to 30 feet to an unoccupied space it can see. The creature remains Invisible until the start of its next turn. Vibrance of the Full Moon. When you use Lunar Vitality, you can roll 1d6 and use the number rolled in place of expending a Bardic Inspiration die.' },
      ],
    },
    {
      id: 'college-of-valor',
      classId: 'bard',
      name: 'College of Valor',
      description: 'Sing the Deeds of Ancient Heroes Bards of the College of Valor are daring storytellers whose tales preserve the memory of the great heroes of the past. These Bards sing the deeds of the mighty in vaulted halls or to crowds gathered around great bonfires. They travel to witness great events firsthand and to ensure that the memory of these events doesn\'t pass away. With their songs, they inspire new generations to reach the same heights of accomplishment as the heroes of old.',
      features: [
        { level: 3, name: 'Combat Inspiration', description: 'You can use your wit to turn the tide of battle. A creature that has a Bardic Inspiration die from you can use it for one of the following effects. Defense. When the creature is hit by an attack roll, that creature can use its Reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, potentially causing the attack to miss. Offense. Immediately after the creature hits a target with an attack roll, the creature can roll the Bardic Inspiration die and add the number rolled to the attack\'s damage against the target.' },
        { level: 3, name: 'Martial Training', description: 'You gain proficiency with Martial weapons and training with Medium armor and Shields. In addition, you can use a Simple or Martial weapon as a Spellcasting Focus to cast spells from your Bard spell list.' },
        { level: 6, name: 'Extra Attack', description: 'You can attack twice instead of once whenever you take the Attack action on your turn. In addition, you can cast one of your cantrips that has a casting time of an action in place of one of those attacks.' },
        { level: 14, name: 'Battle Magic', description: 'After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'bardic-inspiration',
        name: 'Bardic Inspiration',
        description: 'You can supernaturally inspire others through words, music, or dance. This inspiration is represented by your Bardic Inspiration die, which is a d6. Using Bardic Inspiration. As a Bonus Action, you can inspire another creature within 60 feet of yourself who can see or hear you. That creature gains one of your Bardic Inspiration dice. A creature can have only one Bardic Inspiration die at a time. Once within the next hour when the creature fails a D20 Test, the creature can roll the Bardic Inspiration die and add the number rolled to the d20, potentially turning the failure into a success. A Bardic Inspiration die is expended when it\'s rolled. Number of Uses. You can confer a Bardic Inspiration die a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. At Higher Levels. Your Bardic Inspiration die changes when you reach certain Bard levels, as shown in the Bardic Die column of the Bard Features table. The die becomes a d8 at level 5, a d10 at level 10, and a d12 at level 15.'
      },
{
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'You have learned to cast spells through your bardic arts. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Bard spells, which appear in the Bard spell list later in the class\'s description. Cantrips. You know two cantrips of your choice from the Bard spell list. Dancing Lights and Vicious Mockery are recommended. Whenever you gain a Bard level, you can replace one of your cantrips with another cantrip of your choice from the Bard spell list. When you reach Bard levels 4 and 10, you learn another cantrip of your choice from the Bard spell list, as shown in the Cantrips column of the Bard Features table. Spell Slots. The Bard Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose four level 1 spells from the Bard spell list. Charm Person, Color Spray, Dissonant Whispers, and Healing Word are recommended. The number of spells on your list increases as you gain Bard levels, as shown in the Prepared Spells column of the Bard Features table. Whenever that number increases, choose additional spells from the Bard spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 3 Bard, your list of prepared spells can include six spells of levels 1 and 2 in any combination. If another Bard feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Bard spells for you. Changing Your Prepared Spells. Whenever you gain a Bard level, you can replace one spell on your list with another Bard spell for which you have spell slots. Spellcasting Ability. Charisma is your spellcasting ability for your Bard spells. Spellcasting Focus. You can use a Musical Instrument as a Spellcasting Focus for your Bard spells.'
      },
    ],
    2: [
      {
        id: 'expertise',
        name: 'Expertise',
        description: 'You gain Expertise (see the rules glossary) in two of your skill proficiencies of your choice. Performance and Persuasion are recommended if you have proficiency in them. At Bard level 9, you gain Expertise in two more of your skill proficiencies of your choice.'
        ,
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
        skillChoices: ['acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleightOfHand', 'stealth', 'survival'],
        skillChoiceCount: 2,
      },
      {
        id: 'jack-of-all-trades',
        name: 'Jack of all Trades',
        description: 'You can add half your Proficiency Bonus (round down) to any ability check you make that uses a skill proficiency you lack and that doesn\'t otherwise use your Proficiency Bonus. For example, if you make a Strength (Athletics) check and lack Athletics proficiency, you can add half your Proficiency Bonus to the check.'
      },
    ],
    3: [
      {
        id: 'bard-subclass',
        name: 'Bard Subclass',
        description: 'You gain a Bard subclass of your choice. The College of Dance, College of Glamour, College of Lore, and College of Valor subclasses are detailed after this class\'s description. A subclass is a specialization that grants you features at certain Bard levels. For the rest of your career, you gain each of your subclass\'s features that are of your Bard level or lower.'
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Bard levels 8, 12, and 16.'
      },
    ],
    5: [
      {
        id: 'font-of-inspiration',
        name: 'Font of Inspiration',
        description: 'You now regain all your expended uses of Bardic Inspiration when you finish a Short or Long Rest. In addition, you can expend a spell slot (no action required) to regain one expended use of Bardic Inspiration.'
      },
    ],
    7: [
      {
        id: 'countercharm',
        name: 'Countercharm',
        description: 'You can use musical notes or words of power to disrupt mind-influencing effects. If you or a creature within 30 feet of you fails a saving throw against an effect that applies the Charmed or Frightened condition, you can take a Reaction to cause the save to be rerolled, and the new roll has Advantage.'
      },
    ],
    8: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Bard levels 12 and 16.'
      },
    ],
    9: [
      {
        id: 'expertise-2',
        name: 'Expertise',
        description: 'You gain Expertise (see the rules glossary) in two of your skill proficiencies of your choice.',
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
        skillChoices: ['acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleightOfHand', 'stealth', 'survival'],
        skillChoiceCount: 2,
      },
    ],
    10: [
      {
        id: 'magical-secrets',
        name: 'Magical Secrets',
        description: 'You\'ve learned secrets from various magical traditions. Whenever you reach a Bard level (including this level) and the Prepared Spells number in the Bard Features table increases, you can choose any of your new prepared spells from the Bard, Cleric, Druid, and Wizard spell lists, and the chosen spells count as Bard spells for you (see a class\'s section for its spell list). In addition, whenever you replace a spell prepared for this class, you can replace it with a spell from those lists.'
      },
    ],
    12: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Bard level 16.'
      },
    ],
    16: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.'
      },
    ],
    18: [
      {
        id: 'superior-inspiration',
        name: 'Superior Inspiration',
        description: 'When you roll Initiative, you regain expended uses of Bardic Inspiration until you have two if you have fewer than that.'
      },
    ],
    19: [
      {
        id: 'epic-boon',
        name: 'Epic Boon',
        description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Spell Recall is recommended.'
      },
    ],
    20: [
      {
        id: 'words-of-creation',
        name: 'Words of Creation',
        description: 'You have mastered two of the Words of Creation: the words of life and death. You therefore always have the Power Word: Heal and Power Word: Kill spells prepared. When you cast either spell, you can target a second creature with it if that creature is within 10 feet of the first target.'
      },
    ],
  },
  multiclassGains: ['Light armor', 'Simple weapons, Hand crossbows, Longswords, Rapiers, Shortswords', 'Three musical instruments (e.g., lute, flute, drum)', 'One skill of your choice'],
  asiLevels: [4, 8, 12, 16],
};