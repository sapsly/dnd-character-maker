import type { ClassDef } from '../../types/character';

export const paladin: ClassDef = {
  id: 'paladin',
  name: 'Paladin',
  hitDie: 10,
  savingThrowProficiencies: ['wis', 'cha'],
  armorProficiencies: ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'],
  weaponProficiencies: ['Simple and Martial weapons'],
  toolProficiencies: [],
  skills: {
    granted: [],
    choices: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
    choiceCount: 2,
  },
  spellcasting: {
    ability: 'cha',
    cantripsMode: 'known',
    cantripCountByLevel: {},
    spellsMode: 'prepared',
    spellCountByLevel: {1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6, 7: 7, 8: 7, 9: 9, 10: 9, 11: 10, 12: 10, 13: 11, 14: 11, 15: 12, 16: 12, 17: 14, 18: 14, 19: 15, 20: 15},
    slotTable: {1: [2], 2: [2], 3: [3], 4: [3], 5: [4, 2], 6: [4, 2], 7: [4, 3], 8: [4, 3], 9: [4, 3, 2], 10: [4, 3, 2], 11: [4, 3, 3], 12: [4, 3, 3], 13: [4, 3, 3, 1], 14: [4, 3, 3, 1], 15: [4, 3, 3, 2], 16: [4, 3, 3, 2], 17: [4, 3, 3, 3, 1], 18: [4, 3, 3, 3, 1], 19: [4, 3, 3, 3, 2], 20: [4, 3, 3, 3, 2]},
  },
  subclassLevel: 3,
  subclasses: [
    {
      id: 'oath-of-devotion',
      classId: 'paladin',
      name: 'Oath of Devotion',
      description: 'Uphold the Ideals of Justice and Order The Oath of Devotion binds Paladins to the ideals of Justice and Order. These Paladins meet the archetype of the knight in shining armor. They hold themselves to the highest standards of conduct, and some - for better or worse - hold the rest of the world to the same standards. Many who swear this oath are devoted to gods of law and good and use their gods\' tenets as the measure of personal devotion. Others hold angels as their ideals and incorporate images of angelic wings into their helmets or coats of arms. These Paladins share the following tenets:',
      features: [
        { level: 3, name: 'Oath of Devotion Spells', description: 'The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Devotion Spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Sacred Weapon', description: 'When you take the Attack action, you can expend one use of your Channel Divinity to imbue one Melee weapon that you are holding with positive energy. For 10 minutes or until you use this feature again, you add your Charisma modifier to attack rolls you make with that weapon (minimum bonus of +1), and each time you hit with it, you cause it to deal its normal damage type or Radiant Damage. The weapon also emits Bright Light in a 20-foot radius and Dim Light 20 feet beyond that. You can end this effect early (no action required). This effect also ends if you aren\'t carrying the weapon.' },
        { level: 7, name: 'Aura of Devotion', description: 'You and your allies have Immunity to the Charmed condition while in your Aura of Protection. If a Charmed ally enters the aura, that condition has no effect on that ally while there.' },
        { level: 15, name: 'Smite of Protection', description: 'Your magical smite now radiates protective energy. Whenever you cast Divine Smite, you and your allies have Half Cover while in your Aura of Protection. The aura has this benefit until the start of your next turn.' },
        { level: 20, name: 'Holy Nimbus', description: 'As a Bonus Action, you can imbue your Aura of Protection with holy power, granting the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can\'t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Holy Ward. You have Advantage on any saving throw you are forced to make by a Fiend or an Undead. Radiant Damage. Whenever an enemy starts its turn in the aura, that creature takes Radiant damage equal to your Charisma modifier plus your Proficiency Bonus. Sunlight. The aura is filled with Bright Light that is sunlight.' },
      ],
    },
    {
      id: 'oath-of-glory',
      classId: 'paladin',
      name: 'Oath of Glory',
      description: 'Strive for the Heights of Heroism Paladins who take the Oath of Glory believe they and their companions are destined to achieve glory through deeds of heroism. They train diligently and encourage their companions, so that they\'re all ready when destiny calls. These Paladins share the following tenets:',
      features: [
        { level: 3, name: 'Inspiring Smite', description: 'Immediately after you cast Divine Smite, you can expend one use of your Channel Divinity and distribute Temporary Hit Points to creatures of your choice within 30 feet of yourself, which can include you. The total number of Temporary Hit Points equals 2d8 plus your Paladin level, divided among the chosen creatures however you like.' },
        { level: 3, name: 'Oath of Glory Spells.', description: 'The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Glory Spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Peerless Athlete', description: 'As a Bonus Action, you can expend one use of your Channel Divinity to augment your athleticism. For 1 hour, you have Advantage on Strength (Athletics) and Dexterity (Acrobatics) checks, and the distance of your Long and High Jumps increases by 10 feet (this extra distance costs movement as normal).' },
        { level: 7, name: 'Aura of Alacrity', description: 'Your Speed increases by 10 feet. In addition, whenever an ally enters your Aura of Protection for the first time on a turn or starts their turn there, the ally\'s Speed increases by 10 feet until the end of their next turn.' },
        { level: 15, name: 'Glorious Defense', description: 'You can turn defense into a sudden strike. When you or another creature you can see within 10 feet of you is hit by an attack roll, you can take a Reaction to grant a bonus to the target\'s AC against that attack, potentially causing it to miss. The bonus equals your Charisma modifier (minimum of +1). If the attack misses, you can make one attack with a weapon against the attacker as part of this Reaction if the attacker is within your weapon\'s range. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 20, name: 'Living Legend', description: 'You can empower yourself with the legends - whether true or exaggerated - of your great deeds. As a Bonus Action, you gain the benefits below for 10 minutes. Once you use this feature, you can\'t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Charismatic. You are blessed with an otherworldly presence and have Advantage on all Charisma checks. Saving Throw Reroll. If you fail a saving throw, you can take a Reaction to reroll it. You must use this new roll. Unerring Strike. Once on each of your turns when you make an attack roll with a weapon and miss, you can cause that attack to hit instead.' },
      ],
    },
    {
      id: 'oath-of-the-ancients',
      classId: 'paladin',
      name: 'Oath of the Ancients',
      description: 'Preserve Life and Light in the World The Oath of the Ancients is as old as the first elves. Paladins who swear this oath cherish the light; they love the beautiful and life-giving things of the world more than any principles of honor, courage and justice. They often adorn their armor and clothing with images of growing things - leaves, antlers, or flowers - to reflect their commitment to preserving life and light. These Paladins share the following tenets:',
      features: [
        { level: 3, name: 'Nature\'s Wrath', description: 'As a Magic action, you can expend one of your uses of Channel Divinity to conjure spectral vines around nearby creatures. Each creature of your choice that you can see within 15 feet of yourself must succeed on a Strength saving throw or have the Restrained condition for 1 minute. A Restrained creature repeats the save at the end of each of its turns, ending the effect on a success.' },
        { level: 3, name: 'Oath of the Ancients Spells', description: 'The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of the Ancients Spells table, you thereafter always have the listed spells prepared.' },
        { level: 7, name: 'Aura of Warding', description: 'Ancient magic lies so heavily upon you that it forms an eldritch ward, blunting energy from beyond the Material Plane; you and your allies have Resistance to Necrotic, Psychic and Radiant damage while in your Aura of Protection.' },
        { level: 15, name: 'Undying Sentinel', description: 'When you are reduced to 0 Hit Points and not killed outright, you can drop to 1 Hit Point instead, and regain a number of Hit Points equal to three times your Paladin level. Once you use this feature, you can\'t do so again until you finish a Long Rest. Additionally, you can\'t be aged magically, and you cease visibly aging.' },
        { level: 20, name: 'Elder Champion', description: 'As a Bonus Action, you can imbue your Aura of Protection with primal power, granting the benefits below for 1 minute or until you end them (no action required). Once you use this feature, you can\'t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Diminish Defiance. Enemies in the aura have Disadvantage on saving throws against your spells and Channel Divinity options. Regeneration. At the start of each of your turns, you regain 10 Hit Points. Swift Spells. Whenever you cast a spell that has a casting time of an action, you can cast it using a Bonus Action instead.' },
      ],
    },
    {
      id: 'oath-of-the-noble-genies',
      classId: 'paladin',
      name: 'Oath of the Noble Genies',
      description: 'Brandish the Elemental Splendor of Genies Paladins sworn to the Oath of the Noble Genies revere the forces of the Elemental Planes. Through taking this oath, Paladins draw power from the four different types of genies-dao, masters of earth; djinn, masters of air; efreet, masters of fire; and marids, masters of water. In Faerûn, many Paladins who swear this oath hail from Calimshan, a land teeming with genies. Paladins who swear this oath often undertake quests that take them all over the Realms and across the multiverse-including the Elemental Planes. These paladins share the following tenets:',
      features: [
        { level: 3, name: 'Elemental Smite', description: 'Immediately after you cast Divine Smite, you can expend one use of your Channel Divinity and invoke one of the following effects. Dao\'s Crush. Earth rises up around the target of your Divine Smite. The target has the Grappled condition (escape DC equal to your spell save DC). While Grappled, the target has the Restrained condition. Djinni\'s Escape. You teleport to an unoccupied space you can see within 30 feet of yourself and take on a semi-incorporeal form, which lasts until the end of your next turn. While in this form, you have Resistance to Bludgeoning, Piercing, and Slashing damage, and you have Immunity to the Grappled, Prone, and Restrained conditions. Efreeti\'s Fury. The target of your Divine Smite takes an extra 2d4 Fire damage, and fire jumps from the target to another creature you can see within 30 feet of yourself. The second creature also takes 2d4 Fire damage. Marid\'s Surge. The target of your Divine Smite and each creature of your choice in a 10-foot Emanation originating from you make a Strength saving throw against your spell save DC. On a failed save, a creature is pushed 15 feet straight away from you and has the Prone condition.' },
        { level: 3, name: 'Genie Spells', description: 'When you reach a Paladin level specified in the Genie Spells table, you thereafter always have the listed spells prepared' },
        { level: 3, name: 'Genie\'s Splendor', description: 'When you aren\'t wearing any armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers. You can use a Shield and still gain this benefit. You also gain proficiency in one of the following skills of your choice: Acrobatics, Intimidation, Performance, or Persuasion.' },
        { level: 7, name: 'Aura of Elemental Shielding', description: 'Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. You and your allies have Resistance to that damage type while in your Aura of Protection. At the start of each of your turns, you can change the damage type affected by this feature to one of the other listed options (no action required).' },
        { level: 15, name: 'Elemental Rebuke', description: 'When you are hit by an attack roll, you can take a Reaction to halve the attack\'s damage against yourself (round down) and force the attacker to make a Dexterity saving throw against your spell save DC. On a failed save, the attacker takes damage equal to 2d10 plus your Charisma modifier of one of the following types (your choice): Acid, Cold, Fire, Lightning, or Thunder. On a successful save, the attacker takes half as much damage. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 20, name: 'Noble Scion', description: 'As a Bonus Action, you gain the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can\'t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Flight. You have a Fly Speed of 60 feet and can hover. Minor Wish. When you or an ally in your Aura of Protection fails a D20 Test, you can take a Reaction to make you or that ally succeed instead.' },
      ],
    },
    {
      id: 'oath-of-vengeance',
      classId: 'paladin',
      name: 'Oath of Vengeance',
      description: 'Punish Evildoers at Any Cost The Oath of Vengeance is a solemn commitment to punish those who have committed grievously evil acts. When evil armies slaughter helpless villagers, when a tyrant defies the will of the gods, when a thieves\' guild grows too violent, when a dragon rampages though the countryside - at times like these, Paladins arise and swear the Oath of Vengeance to set right what has gone wrong. These Paladins share the following tenets:',
      features: [
        { level: 3, name: 'Oath of Vengeance Spells', description: 'The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Vengeance Spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Vow of Enmity', description: 'When you take the Attack action, you can expend one use of your Channel Divinity to utter a vow of enmity against a creature you can see within 30 feet of yourself. You have Advantage on attack rolls against the creature for 1 minute or until you use this feature again. If the creature drops to 0 Hit Points before the vow ends, you can transfer the vow to a different creature within 30 feet of yourself (no action required).' },
        { level: 7, name: 'Relentless Avenger', description: 'Your supernatural focus helps you close off a foe\'s retreat. When you hit a creature with an Opportunity Attack, you can reduce the creature\'s Speed to 0 until the end of the current turn. You can then move up to half your Speed as part of the same Reaction. This movement doesn\'t provoke Opportunity Attacks.' },
        { level: 15, name: 'Soul of Vengeance', description: 'Immediately after a creature under the effect of your Vow of Enmity hits or misses with an attack roll, you can take a Reaction to make a melee attack against that creature if it\'s within range.' },
        { level: 20, name: 'Avenging Angel', description: 'As a Bonus Action, you gain the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can\'t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Flight. You sprout spectral wings on your back and have a Fly Speed of 60 feet, and can hover. Frightful Aura. Whenever an enemy starts its turn in your Aura of Protection, that creature must succeed on a Wisdom saving throw or have the Frightened condition for 1 minute or until it takes any damage. Attack rolls against the Frightened creature have Advantage.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'lay-on-hands',
        name: 'Lay On Hands',
        description: 'Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you finish a Long Rest. With that pool, you can restore a total number of Hit Points equal to five times your Paladin level. As a Bonus Action, you can touch a creature (which could be yourself) and draw power from the pool of healing to restore a number of Hit Points to that creature, up to the maximum amount remaining in the pool. You can also expend 5 Hit Points from the pool of healing power to remove the Poisoned condition from the creature; those points don\'t also restore Hit Points to the creature.'
      },
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'You have learned to cast spells through prayer and meditation. See Chapter 7 for the rules on Spellcasting. The Information below details how you use those rules with Paladin spells, which appear in the Paladin spell list later in the class\'s description. Spell Slots. The Paladin Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Paladin spells. Heroism and Searing Smite are recommended. The number of spells on your list increases as you gain Paladin levels, as shown in the Prepared Spells column of the Paladin Features table. Whenever that number increases, choose additional spells from the Paladin spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 5 Paladin, your list of prepared spells can include six spells of levels 1 and 2 in any combination. If another Paladin feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Paladin spells for you. Changing Your Prepared Spells. Whenever you finish a Long Rest, you can replace one spell on your list with another Paladin spell for which you have spell slots. Spellcasting Ability. Charisma is your spellcasting ability for your Paladin spells. Spellcasting Focus. You can use a Holy Symbol as a Spellcasting Focus for your Paladin spells.'
      },
      {
        id: 'weapon-mastery',
        name: 'Weapon Mastery',
        description: 'Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency, such as Longswords and Javelins. Whenever you finish a Long Rest, you can change the kinds of weapons you chose. For Example, you could switch to using the mastery properties of Halberds and Flails.'
      },
    ],
    2: [
      {
        id: 'fighting-style',
        name: 'Fighting Style',
        description: 'You gain a Fighting Style feat of your choice (see chapter 5). Instead of choosing one of those feats, you can choose the option below. Blessed Warrior. You learn two Cleric cantrips of your choice (See the Cleric class\'s section for a list of Cleric spells). Guidance and Sacred Flame are recommended. The chosen cantrips count as Paladin spells for you, and Charisma is your spellcasting ability for them. Whenever you gain a Paladin level, you can replace one of these cantrips with another Cleric cantrip.',
        options: [
          { id: 'archery', name: 'Archery', description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.' },
          { id: 'blessed-warrior', name: 'Blessed Warrior', description: 'Learn two cantrips from the Cleric list. Charisma is your spellcasting ability for them. Change one when you gain a Paladin level.' },
          { id: 'defense', name: 'Defense', description: 'While wearing armor, you gain a +1 bonus to AC.' },
          { id: 'dueling', name: 'Dueling', description: 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
          { id: 'great-weapon-fighting', name: 'Great Weapon Fighting', description: 'When you roll a 1 or 2 on a damage die for a two-handed or versatile melee weapon attack, reroll the die and use the new roll.' },
          { id: 'interception', name: 'Interception', description: 'When a creature you can see hits a target within 5 feet of you with an attack roll, you can use your reaction to reduce the damage the target takes by 1d10 plus your proficiency bonus (minimum 0 damage). You must be wielding a shield or a simple or martial weapon.' },
          { id: 'protection', name: 'Protection', description: 'When a creature you can see attacks a target within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.' },
        ],
        optionCount: 1,
      },
      {
        id: 'paladins-smite',
        name: 'Paladin\'s Smite',
        description: 'You always have the Divine Smite spell prepared. You can cast it without expending a spell slot, but you must finish a Long Rest before you can cast it this way again.'
      },
    ],
    3: [
      {
        id: 'channel-divinity',
        name: 'Channel Divinity',
        description: 'You can channel divine energy directly from the Outer Planes, using it to fuel magical effects. You start with one such effect: Divine Sense, which is described below. Other Paladin features give additional Channel Divinity effect options. Each time you use this class\'s Channel Divinity, you choose which effect from this class to create. You can use this class\'s Channel Divinity twice. You regain one of its expended uses when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. You gain an additional use when you reach Paladin level 11. If a Channel Divinity effect requires a saving throw, the DC equals the spell save DC from this class\'s Spellcasting Feature. Divine Sense. As a Bonus Action, you can open your awareness to detect Celestials, Fiends, and Undead. For the next 10 minutes or until you have the Incapacitated condition, you know the location of any creature of those types within 60 feet of yourself, and you know its creature type. Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the Hallow spell.'
      },
      {
        id: 'paladin-subclass',
        name: 'Paladin Subclass',
        description: 'You gain a Paladin Subclass of your choice. The Oath of Devotion, Oath of Glory, Oath of the Ancients and Oath of Vengeance subclasses are detailed after this class\'s description. A Subclass is a specialization that grants you features at certain Paladin levels. For the rest of your career, you gain each of your subclass\'s features that are of your Paladin level or lower. A Paladin tries to hold to the highest standards of conduct, but even the most dedicated are fallible. Sometimes a Paladin transgresses on their oath. A Paladin who has broken a vow typically seeks absolution, spending an all-night vigil as a sign of penitence or undertaking a fast. After a rite of forgiveness, the Paladin starts fresh. If your Paladin unrepentantly violates their oath, talk to your DM. Your Paladin should probably take a more appropriate subclass or even abandon the class and adopt another one.'
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Paladin levels 8, 12, and 16.'
      },
    ],
    5: [
      {
        id: 'extra-attack',
        name: 'Extra Attack',
        description: 'You can attack twice instead of once whenever you take the Attack action on your turn.'
      },
      {
        id: 'faithful-steed',
        name: 'Faithful Steed',
        description: 'You can call on the aid of an otherworldly steed. You always have the Find Steed spell prepared. You can also cast the spell once without expending a spell slot, and you regain your ability to do so when you finish a Long Rest.'
      },
    ],
    6: [
      {
        id: 'aura-of-protection',
        name: 'Aura of Protection',
        description: 'You radiate a protective, unseeable aura in a 10-foot Emanation that originates from you. The aura is inactive while you have the Incapacitated condition. You and your allies in the aura gain a bonus to saving throws equal to your Charisma modifier (minimum bonus of +1). If another Paladin is present, a creature can benefit from only one Aura of Protection at a time; the creature chooses which aura while in them.'
      },
    ],
    9: [
      {
        id: 'abjure-foes',
        name: 'Abjure Foes',
        description: 'As a Magic action, you can expend one use of this class\'s Channel Divinity to overwhelm foes with awe. As you present your Holy Symbol or weapon, you can target a number of creatures equal to your Charisma modifier (minimum of one creature) that you can see within 60 feet of yourself. Each target must succeed on a Wisdom saving throw or have the Frightened condition for 1 minute or until it takes any damage. While Frightened in this way, a target can only do one of the following on its turns: move, take an action or take a Bonus Action.'
      },
    ],
    10: [
      {
        id: 'aura-of-courage',
        name: 'Aura of Courage',
        description: 'You and your allies have Immunity to the Frightened condition while in your Aura of Protection. If a Frightened ally enters the aura, that condition has no effect on that ally while there.'
      },
    ],
    11: [
      {
        id: 'radiant-strikes',
        name: 'Radiant Strikes',
        description: 'Your strikes now carry supernatural power. When you hit a target with an attack roll using a Melee weapon or an Unarmed Strike, the target takes an extra 1d8 Radiant damage.'
      },
    ],
    14: [
      {
        id: 'restoring-touch',
        name: 'Restoring Touch',
        description: 'When you use Lay On Hands on a creature, you can also remove one or more of the following conditions from the creature: Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned. You must expend 5 Hit Points from the healing pool of Lay On Hands for each of these conditions you remove; those points don\'t also restore Hit Points to the creature.'
      },
    ],
    18: [
      {
        id: 'aura-expansion',
        name: 'Aura Expansion',
        description: 'Your Aura of Protection is now a 30-foot Emanation.'
      },
    ],
    19: [
      {
        id: 'epic-boon',
        name: 'Epic Boon',
        description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Truesight is recommended.'
      },
    ],
  },
  weaponMastery: {
    featureLevel: 2,
    choiceCount: 2,
    pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'],
    extraPicksAtLevels: [4, 6, 10, 16],
  },
  multiclassGains: ['Light armor, Medium armor, Shields, Simple weapons, Martial weapons', 'Lay on Hands, Divine Sense'],
  asiLevels: [4, 8, 12, 16],
};