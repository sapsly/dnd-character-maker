import type { ClassDef } from '../../types/character';

export const warlock: ClassDef = {
  id: 'warlock',
  name: 'Warlock',
  hitDie: 8,
  savingThrowProficiencies: ['wis', 'cha'],
  armorProficiencies: ['Light armor'],
  weaponProficiencies: ['Simple Weapons'],
  toolProficiencies: [],
  skills: {
    granted: [],
    choices: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'],
    choiceCount: 2,
  },
  spellcasting: {
    ability: 'cha',
    cantripsMode: 'known',
    cantripCountByLevel: {1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4, 11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4},
    spellsMode: 'prepared',
    spellCountByLevel: {1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 10, 11: 11, 12: 11, 13: 12, 14: 12, 15: 13, 16: 13, 17: 14, 18: 14, 19: 15, 20: 15},
    slotTable: {1: [1], 2: [2], 3: [0, 2], 4: [0, 2], 5: [0, 0, 2], 6: [0, 0, 2], 7: [0, 0, 0, 2], 8: [0, 0, 0, 2], 9: [0, 0, 0, 0, 2], 10: [0, 0, 0, 0, 2], 11: [0, 0, 0, 0, 3], 12: [0, 0, 0, 0, 3], 13: [0, 0, 0, 0, 3], 14: [0, 0, 0, 0, 3], 15: [0, 0, 0, 0, 3], 16: [0, 0, 0, 0, 3], 17: [0, 0, 0, 0, 4], 18: [0, 0, 0, 0, 4], 19: [0, 0, 0, 0, 4], 20: [0, 0, 0, 0, 4]},
    pactMagic: true,
  },
  subclassLevel: 3,
  subclasses: [
    {
      id: 'archfey-patron',
      classId: 'warlock',
      name: 'Archfey Patron',
      description: 'Bargain with Whimsical Fey Your pact draws on the power of the Feywild. When you choose this subclass, you might make a deal with an archfey, such as the Prince of Frost; the Queen of Air and Darkness, ruler of the Gloaming Court; Titania of the Summer Court; or an ancient hag. Or you might call on a spectrum of Fey, weaving a web of favors and debts. Whoever they are, your patron is often inscrutable and whimsical.',
      features: [
        { level: 3, name: 'Archfey Spells', description: 'The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Archfey Spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Steps of the Fey', description: 'Your patron grants you the ability to move between the boundaries of the planes. You can cast Misty Step without expending a spell slot a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. In addition, whenever you cast that spell, you can choose one of the following additional effects. Refreshing Step. Immediately after you teleport, you or one creature you can see within 10 feet of yourself gains 1d10 Temporary Hit Points. Taunting Step. Creatures within 5 feet of the space you left must succeed on a Wisdom saving throw against your spell save DC or have Disadvantage on attack rolls against creatures other than you until the start of your next turn.' },
        { level: 6, name: 'Misty Escape', description: 'You can cast Misty Step as a Reaction in response to taking damage. In addition, the following effects are now among your Steps of the Fey options. Disappearing Step. You have the Invisible condition until the start of your next turn or until immediately after you make an attack roll, deal damage, or cast a spell. Dreadful Step. Creatures within 5 feet of the space you left or the space you appear in (your choice) must succeed on a Wisdom saving throw against your spell save DC or take 2d10 Psychic damage.' },
        { level: 10, name: 'Beguiling Defenses', description: 'Your patron teaches you how to guard your mind and body. You are immune to the Charmed condition. In addition, immediately after a creature you can see hits you with an attack roll, you can take a Reaction to reduce the damage you take by half (round down), and you can force the attacker to make a Wisdom saving throw against your spell save DC. On a failed save, the attacker takes Psychic damage equal to the damage you take. Once you use this Reaction, you can\'t use it again until you finish a Long Rest unless you expend a Pact Magic spell slot (no action required) to restore your use of it.' },
        { level: 14, name: 'Bewitching Magic', description: 'Your patron grants you the ability to weave your magic with teleportation. Immediately after you cast an Enchantment or Illusion spell using an action and a spell slot, you can cast Misty Step as part of the same action and without expending a spell slot.' },
      ],
    },
    {
      id: 'celestial-patron',
      classId: 'warlock',
      name: 'Celestial Patron',
      description: 'Call on the Power of the Heavens Your pact draws on the Upper Planes, the realms of everlasting bliss. You might enter an agreement with an empyrean, a couatl, a sphinx, a unicorn, or another heavenly entity. Or you might call on numerous such beings as you pursue goals aligned with theirs. Your pact allows you to experience a hint of the holy light that illuminates the multiverse.',
      features: [
        { level: 3, name: 'Celestial Spells', description: 'The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Celestial Spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Healing Light', description: 'You gain the ability to channel celestial energy to heal wounds. You have a pool of d6s to fuel this healing. The number of dice in the pool equals 1 plus your Warlock level. As a Bonus Action, you can heal yourself or one creature you can see within 60 feet of yourself, expending dice from the pool. The maximum number of dice you can expend at once equals your Charisma modifier (minimum of one die). Roll the dice you expend, and restore a number of Hit Points equal to the roll\'s total. Your pool regains all expended dice when you finish a Long Rest.' },
        { level: 6, name: 'Radiant Soul', description: 'Your link to your patron allows you to serve as a conduit for radiant energy. You have Resistance to Radiant damage. Once per turn, when a spell you cast deals Radiant or Fire damage, you can add your Charisma modifier to that spell\'s damage against one of the spell\'s targets.' },
        { level: 10, name: 'Celestial Resilience', description: 'You gain Temporary Hit Points whenever you use your Magical Cunning feature or finish a Short or Long Rest. These Temporary Hit Points equal your Warlock level plus your Charisma modifier. Additionally, choose up to five creatures you can see when you gain the points. Those creatures each gain Temporary Hit Points equal to half your Warlock level plus your Charisma modifier.' },
        { level: 14, name: 'Searing Vengeance', description: 'When you or an ally within 60 feet of you is about to make a Death Saving Throw, you can unleash radiant energy to save the creature. The creature regains Hit Points equal to half its Hit Point maximum and can end the Prone condition on itself. Each creature of your choice that is within 30 feet of the creature takes Radiant damage equal to 2d8 plus your Charisma modifier, and each has the Blinded condition until the end of the current turn. Once you use this feature, you can\'t use it again until you finish a Long Rest.' },
      ],
    },
    {
      id: 'fiend-patron',
      classId: 'warlock',
      name: 'Fiend Patron',
      description: 'Make a Deal with the Lower Planes Your pact draws on the Lower Planes, the realms of perdition. You might forge a bargain with a demon lord such as Demogorgon or Orcus; an archdevil such as Asmodeus; or a pit fiend, balor, yugoloth, or night hag that is especially mighty. That patron\'s aims are evil-the corruption or destruction of all things, ultimately including you-and your path is defined by the extent to which you strive against those aims.',
      features: [
        { level: 3, name: 'Dark One\'s Blessing', description: 'When you reduce an enemy to 0 Hit Points, you gain Temporary Hit Points equal to your Charisma modifier plus your Warlock level (minimum of 1 Temporary Hit Point). You also gain this benefit if someone else reduces an enemy within 10 feet of you to 0 Hit Points.' },
        { level: 3, name: 'Fiend Spells', description: 'The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Fiend Spells table, you thereafter always have the listed spells prepared.' },
        { level: 6, name: 'Dark One\'s Own Luck', description: 'You can call on your fiendish patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add 1d10 to your roll. You can do so after seeing the roll but before any of the roll\'s effects occur. You can use this feature a number of times equal to your Charisma modifier (minimum of once), but you can use it no more than once per roll. You regain all expended uses when you finish a Long Rest.' },
        { level: 10, name: 'Fiendish Resilience', description: 'Choose one damage type, other than Force, whenever you finish a Short or Long Rest. You have Resistance to that damage type until you choose a different one with this feature.' },
        { level: 14, name: 'Hurl Through Hell', description: 'Once per turn when you hit a creature with an attack roll, you can try to instantly transport the target through the Lower Planes. The target must succeed on a Charisma saving throw against your spell save DC, or the target disappears and hurtles through a nightmare landscape. The target takes 8d10 Psychic damage if it isn\'t a Fiend, and it has the Incapacitated condition until the end of your next turn, when it returns to the space it previously occupied or the nearest unoccupied space. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you expend a Pact Magic spell slot (no action required) to restore your use of it.' },
      ],
    },
    {
      id: 'great-old-one-patron',
      classId: 'warlock',
      name: 'Great Old One Patron',
      description: 'Unearth Forbidden Lore of Ineffable Beings When you choose this subclass, you might bind yourself to an unspeakable being from the Far Realm or an elder god-a being such as Tharizdun, the Chained God; Zargon, the Returner; Hadar, the Dark Hunger; or Great Cthulhu. Or you might invoke several entities without yoking yourself to one. The motives of these beings are incomprehensible, and the Great Old One might be indifferent to your existence. But the secrets you\'ve learned nevertheless allow you to draw strange magic from it.',
      features: [
        { level: 3, name: 'Awakened Mind', description: 'You can form a telepathic connection between your mind and the mind of another. As a Bonus Action, choose one creature you can see within 30 feet of yourself. You and the chosen creature can communicate telepathically with each other while the two of you are within a number of miles of each other equal to your Charisma modifier (minimum of 1 mile). To understand each other, you each must mentally use a language the other knows. The telepathic connection lasts for a number of minutes equal to your Warlock level. It ends early if you use this feature to connect with a different creature.' },
        { level: 3, name: 'Great Old One Spells', description: 'The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Great Old One Spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Psychic Spells', description: 'When you cast a Warlock spell that deals damage, you can change its damage type to Psychic. In addition, when you cast a Warlock spell that is an Enchantment or Illusion, you can do so without Verbal or Somatic components.' },
        { level: 6, name: 'Clairvoyant Combatant', description: 'When you form a telepathic bond with a creature using your Awakened Mind, you can force that creature to make a Wisdom saving throw against your spell save DC. On a failed save, the creature has Disadvantage on attack rolls against you, and you have Advantage on attack rolls against that creature for the duration of the bond. Once you use this feature, you can\'t use it again until you finish a Short or Long Rest unless you expend a Pact Magic spell slot (no action required) to restore your use of it.' },
        { level: 10, name: 'Eldritch Hex', description: 'Your alien patron grants you a powerful curse. You always have the Hex spell prepared. When you cast Hex and choose an ability, the target also has Disadvantage on saving throws of the chosen ability for the duration of the spell.' },
        { level: 10, name: 'Thought Shield', description: 'Your thoughts can\'t be read by telepathy or other means unless you allow it. You also have Resistance to Psychic damage, and whenever a creature deals Psychic damage to you, that creature takes the same amount of damage that you take.' },
        { level: 14, name: 'Create Thrall', description: 'When you cast Summon Aberration, you can modify it so that it doesn\'t require Concentration. If you do so, the spell\'s duration becomes 1 minute for that casting, and when summoned, the Aberration has a number of Temporary Hit Points equal to your Warlock level plus your Charisma modifier. In addition, the first time each turn the Aberration hits a creature under the effect of your Hex, the Aberration deals extra Psychic damage to the target equal to the bonus damage of that spell.' },
      ],
    },
    {
      id: 'undead-patron',
      classId: 'warlock',
      name: 'Undead Patron',
      description: 'Defy Death for Profane Power You\'ve made a pact with a creature that defies the cycle of life and death: a powerful lich, a vampire, or another entity of undeath. Having once been mortal, these ancient patrons know firsthand the paths of ambition and the routes past the doors of death. They eagerly share this profane knowledge and other secrets with those who work their will among the living.',
      features: [
        { level: 3, name: 'Form of Dread', description: 'As a Bonus Action, you transform into an avatar of your patron\'s dreadful power, gaining the benefits below for 1 minute, until you have the Incapacitated condition, or until you end the form (no action required). You can transform a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. Facsimile of Life. You gain Temporary Hit Points equal to 1d10 plus your Warlock level. Fearless Form. You have Immunity to the Frightened condition. If you are Frightened when you transform, the condition immediately ends for you. Frightful Avatar. Once per turn, when you hit a creature with an attack roll, you can force it to make a Wisdom saving throw against your spell save DC. On a failed save, the target has the Frightened condition until the end of your next turn.' },
        { level: 3, name: 'Undead Spells', description: 'The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Undead Spells table, you thereafter always have the listed spells prepared.' },
        { level: 6, name: 'Grave Touched', description: 'Your patron\'s powers have a profound effect on your body and magic, granting you the following benefits. Arcane Necrosis. Necrotic damage from your attacks, Warlock spells, and Warlock features ignores Resistance to Necrotic damage. Once per turn when you cast a spell that deals damage, you can change that spell\'s damage type to Necrotic. Dreaded Necrosis. When you hit a creature with an attack roll and deal Necrotic damage while using your Form of Dread, you can roll one additional damage die when determining the Necrotic damage the target takes. You can use this benefit only once per turn. Undead Endurance. You don\'t gain Exhaustion levels from dehydration, malnutrition, or suffocation. In addition, you don\'t need to sleep, and magic can\'t put you to sleep.' },
        { level: 10, name: 'Necrotic Husk', description: 'Your connection to undeath saturates your body. You gain the following benefits. Necrotic Resilience. You have Resistance to Necrotic damage. While using your Form of Dread, you have Immunity to Necrotic damage. Unholy Resuscitation. If you drop to 0 Hit Points and don\'t die outright, you can cause your body to erupt with deathly energy. Each creature of your choice in a 30-foot Emanation originating from you makes a Constitution saving throw against your spell save DC, taking Necrotic damage equal to 2d10 plus your Charisma modifier on a failed save or half as much damage on a successful one. Your Hit Points then change to twice your Warlock level, and you gain 1 Exhaustion level. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.' },
        { level: 14, name: 'Superior Dread', description: 'Your Form of Dread improves, granting you the following benefits while you are using it. Dread Resistance. You have Resistance to Bludgeoning, Piercing, and Slashing damage. Ghostly Flight. You have a Fly Speed equal to your Speed and can hover. You can move through creatures and objects as if they were Difficult Terrain, but you take 1d10 Force damage if you end your turn inside a creature or an object. Profane Casting. Whenever you cast a Warlock spell from the Conjuration or Necromancy school, you cast it without any Verbal, Somatic, or Material components, except Material components that are costly or consumed.' },
      ],
    },
    {
      id: 'vestige-patron',
      classId: 'warlock',
      name: 'Vestige Patron',
      description: 'Wield the Remnants of a Dying God\'s Power Your pact draws on the power of a dying god, a being once worshipped by countless followers but now abandoned and forgotten. This dying god, known as a vestige, might have been benevolent, evil, or strange and unknowable, but now it is driven to regain its former power. The vestige needs your help, and it is willing to share its remaining strength with you.',
      features: [
        { level: 3, name: 'Vestige Companion', description: 'The vestige manifests, drawing strength from your pact. It uses the Vestige Companion stat block and is a Celestial, Fiend, or Undead (choose when you gain this feature). You determine what the vestige looks like, but regardless of its form, the vestige bears features indicating its supernatural origin. For example, you might decide your vestige is an oversize floating skull etched with sigils, a circle of glowing runes, or a constantly shifting abstract shape. The vestige is Friendly to you and your allies and obeys your commands. It vanishes if you die. The Vestige in Combat. In combat, the vestige acts during your turn. It can move and use its Reaction on its own, but the only action it takes is the Dodge action unless you take a Bonus Action to command it to take an action in its stat block or some other action. You can also sacrifice one of your attacks when you take the Attack action to command the vestige to take the Vestige\'s Strike action. If you have the Incapacitated condition, the vestige acts on its own and isn\'t limited to the Dodge action. Disappearance of the Vestige. When the vestige drops to 0 Hit Points, it disappears. You can spend 1 minute performing a magical ceremony to manifest the vestige again; it reappears with its maximum Hit Points in an unoccupied space within 5 feet of you. As a Magic action, you can temporarily dismiss the vestige to a pocket dimension. As a Magic action while it is temporarily dismissed, you can cause the vestige to reappear in an unoccupied space within 30 feet of you. Whenever the vestige drops to 0 Hit Points or disappears into the pocket dimension, it leaves behind in its space anything it was wearing or carrying.' },
        { level: 3, name: 'Vestige Spells', description: 'The magic of your Vestige Companion ensures you always have certain spells ready. Select one of the following Cleric domains: Life, Light, Trickery, or War. The Domain Spells of your chosen domain are Warlock spells for you. When you reach a Warlock level equal to a Cleric level listed on the Domain Spells table for the domain you have chosen, you thereafter always have the listed spells prepared. For example, if you chose the War Domain for this feature, when you reach Warlock level 3, you would have the Guiding Bolt, Magic Weapon, Shield of Faith, and Spiritual Weapon spells prepared.' },
        { level: 6, name: 'Vestige Power', description: 'Your Vestige Companion now regains its use of Divine Power whenever you finish a Short or Long Rest or when you use your Magical Cunning feature. In addition, while within 30 feet of your Vestige Companion, you have Resistance to the same damage types as the vestige.' },
        { level: 10, name: 'Vestige Recovery', description: 'When your Vestige Companion would drop to 0 Hit Points, you can take a Reaction and expend a Pact Magic spell slot to instead change its Hit Points to its Hit Point maximum. The vestige then teleports to an unoccupied space you can see within 30 feet of it. Once you use this feature, you can\'t do so again until you finish a Long Rest.' },
        { level: 14, name: 'Semblance of Life', description: 'Your Vestige Companion continues to grow in strength, and with your assistance, it can briefly adopt a more powerful form. Depending on the vestige\'s type, you can take a Magic action while the vestige is within 90 feet of you to shape-shift it for 1 hour into one of the following forms: Celestial Spirit (Celestial vestige; see the Summon Celestial spell in the Player\'s Handbook), Fiendish Spirit (Fiend vestige; see the Summon Fiend spell in the Player\'s Handbook), or Undead Spirit (Undead vestige; see the Summon Undead spell in the Player\'s Handbook). The vestige\'s game statistics are replaced by the spirit\'s stat block, and the spell\'s level is equal to half your Warlock level (round down; maximum level 9), but the vestige retains its personality, Divine Power Bonus Action, Hit Points, and Hit Point Dice. The vestige gains a number of Temporary Hit Points equal to the Hit Points of the spirit form. These Temporary Hit Points vanish if any remain after 1 hour, and the transformation ends early if it has no Temporary Hit Points left. Once you use this feature, you can\'t do so again until you finish a Long Rest.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'eldritch-invocations',
        name: 'Eldritch Invocations',
        description: 'You have unearthed Eldritch Invocations, pieces of forbidden knowledge that imbue you with an abiding magical ability or other lessons. You gain one invocation of your choice, such as Pact of the Tome. Invocations are described in the "Eldritch Invocation Options" section later in this class\'s description. Prerequisites. If an invocation has a prerequisite, you must meet it to learn that invocation. For example, if an invocation requires you to be a level 5+ Warlock, you can select the invocation once you reach Warlock level 5. Replacing and Gaining Invocations. Whenever you gain a Warlock level, you can replace one of your invocations with another one for which you qualify. You can\'t replace an invocation if it\'s a prerequisite for another invocation that you have. When you gain certain Warlock levels, you gain more invocations of your choice, as shown in the Invocations column of the Warlock Features table. You can\'t pick the same invocation more than once unless its description says otherwise.'
      },
      {
        id: 'pact-magic',
        name: 'Pact Magic',
        description: 'Through occult ceremony, you have formed a pact with a mysterious entity to gain magical powers. The entity is a voice in the shadows-its identity unclear-but its boon to you is concrete: the ability to cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Warlock spells, which appear in the Warlock spell list later in the class\'s description. Cantrips. You know two Warlock cantrips of your choice. Eldritch Blast and Prestidigitation are recommended. Whenever you gain a Warlock level, you can replace one of your cantrips from this feature with another Warlock cantrip of your choice. When you reach Warlock levels 4 and 10, you learn another Warlock cantrip of your choice, as shown in the Cantrips column of the Warlock Features table. Spell Slots. The Warlock Features table shows how many spell slots you have to cast your Warlock spells of levels 1-5. The table also shows the level of those slots, all of which are the same level. You regain all expended Pact Magic spell slots when you finish a Short or Long Rest. For example, when you\'re a level 5 Warlock, you have two level 3 spell slots. To cast the level 1 spell Witch Bolt, you must spend one of those slots, and you cast it as a level 3 spell. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Warlock spells. Charm Person and Hex are recommended. The number of spells on your list increases as you gain Warlock levels, as shown in the Prepared Spells column of the Warlock Features table. Whenever that number increases, choose additional Warlock spells until the number of spells on your list matches the number in the table. The chosen spells must be of a level no higher than what\'s shown in the table\'s Slot Level column for your level. When you reach level 6, for example, you learn a new Warlock spell, which can be of levels 1-3. If another Warlock feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Warlock spells for you. Changing Your Prepared Spells. Whenever you gain a Warlock level, you can replace one spell on your list with another Warlock spell of an eligible level. Spellcasting Ability. Charisma is the spellcasting ability for your Warlock spells. Spellcasting Focus. You can use an Arcane Focus as a Spellcasting Focus for your Warlock spells.'
      },
    ],
    2: [
      {
        id: 'magical-cunning',
        name: 'Magical Cunning',
        description: 'You can perform an esoteric rite for 1 minute. At the end of it, you regain expended Pact Magic spell slots but no more than a number equal to half your maximum (round up). Once you use this feature, you can\'t do so again until you finish a Long Rest.'
      },
    ],
    3: [
      {
        id: 'warlock-subclass',
        name: 'Warlock Subclass',
        description: 'You gain a Warlock subclass of your choice. The Archfey Patron, Celestial Patron, Fiend Patron, and Great Old One Patron subclasses are detailed after this class\'s description. A subclass is a specialization that grants you features at certain Warlock levels. For the rest of your career, you gain each of your subclass\'s features that are of your Warlock level or lower.'
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Warlock levels 8, 12, and 16.'
      },
    ],
    9: [
      {
        id: 'contact-patron',
        name: 'Contact Patron',
        description: 'In the past, you usually contacted your patron through intermediaries. Now you can communicate directly; you always have the Contact Other Plane spell prepared. With this feature, you can cast the spell without expending a spell slot to contact your patron, and you automatically succeed on the spell\'s saving throw. Once you cast the spell with this feature, you can\'t do so in this way again until you finish a Long Rest.'
      },
    ],
    11: [
      {
        id: 'mystic-arcanum',
        name: 'Mystic Arcanum',
        description: 'Your patron grants you a magical secret called an arcanum. Choose one level 6 Warlock spell as this arcanum. You can cast your arcanum spell once without expending a spell slot, and you must finish a Long Rest before you can cast it in this way again. As shown in the Warlock Features table, you gain another Warlock spell of your choice that can be cast in this way when you reach Warlock levels 13 (level 7 spell), 15 (level 8 spell), and 17 (level 9 spell). You regain all uses of your Mystic Arcanum when you finish a Long Rest. Whenever you gain a Warlock level, you can replace one of your arcanum spells with another Warlock spell of the same level.'
      },
    ],
    19: [
      {
        id: 'epic-boon',
        name: 'Epic Boon',
        description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Fate is recommended.'
      },
    ],
    20: [
      {
        id: 'eldritch-master',
        name: 'Eldritch Master',
        description: 'When you use your Magical Cunning feature, you regain all your expended Pact Magic spell slots.'
      },
    ],
  },
  multiclassGains: ['Light armor', 'Simple weapons', 'Two cantrips from the warlock spell list', 'Pact Magic (spell slots)'],
  asiLevels: [4, 8, 12, 16],
};