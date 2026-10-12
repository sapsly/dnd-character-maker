import type { ClassDef } from '../../types/character';

export const sorcerer: ClassDef = {
  id: 'sorcerer',
  name: 'Sorcerer',
  hitDie: 6,
  savingThrowProficiencies: ['con', 'cha'],
  armorProficiencies: [],
  weaponProficiencies: ['Simple weapons'],
  toolProficiencies: [],
  skills: {
    granted: [],
    choices: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
    choiceCount: 2,
  },
  spellcasting: {
    ability: 'cha',
    cantripsMode: 'known',
    cantripCountByLevel: {1: 4, 2: 4, 3: 4, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 6, 11: 6, 12: 6, 13: 6, 14: 6, 15: 6, 16: 6, 17: 6, 18: 6, 19: 6, 20: 6},
    spellsMode: 'prepared',
    spellCountByLevel: {1: 2, 2: 4, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22},
    slotTable: {1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1], 15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1], 18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1]},
  },
  subclassLevel: 3,
  subclasses: [
    {
      id: 'aberrant-sorcery',
      classId: 'sorcerer',
      name: 'Aberrant Sorcery',
      description: 'Wield Unnatural Psionic Power An alien influence has wrapped its tendrils around your mind, giving you psionic power. You can now touch other minds with that power and alter the world around you. Will this power shine from you as a hopeful beacon to others? Or will you be a terror to those who feel the stab of your mind? Perhaps a psychic wind from the Astral Plane carried psionic energy to you, or you were exposed to the Far Realm\'s warping influence. Alternatively, you were implanted with a mind flayer tadpole, but your transformation into a mind flayer never occurred; now the tadpole\'s psionic power is yours. However you acquired this power, your mind is aflame with it.',
      features: [
        { level: 3, name: 'Psionic Spells', description: 'When you reach a Sorcerer level specified in the Psionic Spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Telepathic Speech', description: 'You can form a telepathic connection between your mind and the mind of another. As a Bonus Action, choose one creature you can see within 30 feet of yourself. You and the chosen creature can communicate telepathically with each other while the two of you are within a number of miles of each other equal to your Charisma modifier (minimum of 1 mile). To understand each other, you each must mentally use a language the other knows. The telepathic connection lasts for a number of minutes equal to your Sorcerer level. It ends early if you use this ability to form a connection with a different creature.' },
        { level: 6, name: 'Psionic Sorcery', description: 'When you cast any level 1+ spell from your Psionic Spells feature, you can cast it by expending a spell slot as normal or by spending a number of Sorcery Points equal to the spell\'s level. If you cast the spell using Sorcery Points, it requires no Verbal or Somatic components, and it requires no Material components unless they are consumed by the spell or have a cost specified in it.' },
        { level: 6, name: 'Psychic Defenses', description: 'You have Resistance to Psychic damage, and you have Advantage on saving throws to avoid or end the Charmed or Frightened condition.' },
        { level: 14, name: 'Revelation in Flesh', description: 'You can unleash the aberrant truth hidden within yourself. As a Bonus Action, you can spend 1 Sorcery Point or more to magically alter your body for 10 minutes. For each Sorcery Point you spend, you gain one of the following benefits of your choice, the effects of which last until the alteration ends. Aquatic Adaptation. You gain a Swim Speed equal to twice your Speed, and you can breathe underwater. Gills grow from your neck or flare behind your ears, and your fingers become webbed or you grow wriggling cilia. Glistening Flight. You gain a Fly Speed equal to your Speed, and you can hover. As you fly, your skin glistens with mucus or otherworldly light. See the Invisible. You can see any Invisible creature within 60 feet of yourself that isn\'t behind Total Cover. Your eyes also turn black or become writhing sensory tendrils. Wormlike Movement. Your body, along with any equipment you are wearing or carrying, becomes slimy and pliable. You can move through any space as narrow as 1 inch, and you can spend 5 feet of movement to escape from nonmagical restraints or the Grappled condition.' },
        { level: 18, name: 'Warping Implosion', description: 'You can unleash a space-warping anomaly. As a Magic action, you teleport to an unoccupied space you can see within 120 feet of yourself. Immediately after you disappear, each creature within 30 feet of the space you left must make a Strength saving throw against your spell save DC. On a failed save, a creature takes 3d10 Force damage and is pulled straight toward the space you left, ending in an unoccupied space as close to your former space as possible. On a successful save, the creature takes half as much damage only. Once you use this feature, you can\'t do so again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it.' },
      ],
    },
    {
      id: 'clockwork-sorcery',
      classId: 'sorcerer',
      name: 'Clockwork Sorcery',
      description: 'Channel Cosmic Forces of Order The cosmic force of order has suffused you with magic. That power arises from Mechanus or a realm like it-a plane of existence shaped entirely by clockwork efficiency. You or someone from your lineage might have become entangled in the machinations of modrons, the orderly beings who inhabit Mechanus. Perhaps your ancestor even took part in the Great Modron March. Whatever its origin within you, the power of order can seem strange to others, but for you, it\'s part of a vast and glorious system.',
      features: [
        { level: 3, name: 'Clockwork Spells', description: 'When you reach a Sorcerer level specified in the Clockwork Spells table, you thereafter always have the listed spells prepared. In addition, consult the Manifestations of Order table and choose or randomly determine a way your connection to order manifests while you are casting any of your Sorcerer spells.' },
        { level: 3, name: 'Restore Balance', description: 'Your connection to the plane of absolute order allows you to equalize chaotic moments. When a creature you can see within 60 feet of yourself is about to roll a d20 with Advantage or Disadvantage, you can take a Reaction to prevent the roll from being affected by Advantage and Disadvantage. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 6, name: 'Bastion of Law', description: 'You can tap into the grand equation of existence to imbue a creature with a shimmering shield of order. As a Magic action, you can expend 1 to 5 Sorcery Points to create a magical ward around yourself or another creature you can see within 30 feet of yourself. The ward is represented by a number of d8s equal to the number of Sorcery Points spent to create it. When the warded creature takes damage, it can expend a number of those dice, roll them, and reduce the damage taken by the total rolled on those dice. The ward lasts until you finish a Long Rest or until you use this feature again.' },
        { level: 14, name: 'Trance of Order', description: 'You gain the ability to align your consciousness with the endless calculations of Mechanus. As a Bonus Action, you can enter this state for 1 minute. For the duration, attack rolls against you can\'t benefit from Advantage, and whenever you make a D20 Test, you can treat a roll of 9 or lower on the d20 as a 10. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it.' },
        { level: 18, name: 'Clockwork Cavalcade', description: 'You momentarily summon spirits of order to expunge disorder around you. As a Magic action, you summon the spirits in a 30-foot Cube originating from you. The spirits look like modrons or other Constructs of your choice. The spirits are intangible and invulnerable, and they create the effects below within the Cube before vanishing. Once you use this action, you can\'t use it again until you finish a Long Rest unless you spend 7 Sorcery Points (no action required) to restore your use of it. Heal. The spirits restore up to 100 Hit Points, divided as you choose among any number of creatures of your choice in the Cube. Repair. Any damaged objects entirely in the Cube are repaired instantly. Dispel. Every spell of level 6 and lower ends on creatures and objects of your choice in the Cube.' },
      ],
    },
    {
      id: 'draconic-sorcery',
      classId: 'sorcerer',
      name: 'Draconic Sorcery',
      description: 'Breathe the Magic of Dragons Your innate magic comes from the gift of a dragon. Perhaps an ancient dragon facing death bequeathed some of its magical power to you or your ancestor. You might have absorbed magic from a site infused with dragons\' power. Or perhaps you handled a treasure taken from a dragon\'s hoard that was steeped in draconic power. Or you might have a dragon for an ancestor.',
      features: [
        { level: 3, name: 'Draconic Resilience', description: 'The magic in your body manifests physical traits of your draconic gift. Your Hit Point maximum increases by 3, and it increases by 1 whenever you gain another Sorcerer level. Parts of you are also covered by dragon-like scales. While you aren\'t wearing armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers.' },
        { level: 3, name: 'Draconic Spells', description: 'When you reach a Sorcerer level specified in the Draconic Spells table, you thereafter always have the listed spells prepared.' },
        { level: 6, name: 'Elemental Affinity', description: 'Your draconic magic has an affinity with a damage type associated with dragons. Choose one of those types: Acid, Cold, Fire, Lightning, or Poison. You have Resistance to that damage type, and when you cast a spell that deals damage of that type, you can add your Charisma modifier to one damage roll of that spell.' },
        { level: 14, name: 'Dragon Wings', description: 'As a Bonus Action, you can cause draconic wings to appear on your back. The wings last for 1 hour or until you dismiss them (no action required). For the duration, you have a Fly Speed of 60 feet. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you spend 3 Sorcery Points (no action required) to restore your use of it.' },
        { level: 18, name: 'Dragon Companion', description: 'You can cast Summon Dragon without a Material component. You can also cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. Whenever you start casting the spell, you can modify it so that it doesn\'t require Concentration. If you do so, the spell\'s duration becomes 1 minute for that casting.' },
      ],
    },
    {
      id: 'shadow-sorcery',
      classId: 'sorcerer',
      name: 'Shadow Sorcery',
      description: 'Bend Doom and Darkness to Your Will Your innate magic comes from the most nebulous and inscrutable forces of the Shadowfell or from other regions of supernatural darkness. You might trace your lineage to an entity from such a place, or perhaps you were exposed to the sinister energy of a shadow dragon and were transformed by it. Your shadowy magic allows you to command darkness, undeath, and woe.',
      features: [
        { level: 3, name: 'Shadow Spells', description: 'When you reach a Sorcerer level specified in the Shadow Spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Power of Shadow', description: 'You gain the following benefits. Eyes of the Dark. You have Darkvision with a range of 120 feet and Blindsight with a range of 10 feet. In addition, if a spell you cast creates an area of Darkness, you can see normally through that spell\'s Darkness. Strength of the Grave. If you would drop to 0 Hit Points and not die outright, you can make a Charisma saving throw (DC 5 plus the damage taken). On a successful save, your Hit Points instead change to a number equal to your Charisma modifier plus your Sorcerer level. After you succeed on this save, you can\'t use this benefit again until you finish a Long Rest.' },
        { level: 6, name: 'Beasts of Ill Omen', description: 'You can call forth a howling creature of shadow to hound your foes. You can spend 3 Sorcery Points to cast Summon Beast as a Bonus Action without expending a spell slot, without preparing the spell, and without Material components. The summoned creature appears as a beast made of shadow, and enemies within 5 feet of the summoned creature have Disadvantage on saving throws against spells you cast. Whenever you cast the spell, you can modify it so that it doesn\'t require Concentration. If you do so, the spell\'s duration becomes 1 minute for that casting, and the spell ends early if you cast the spell again.' },
        { level: 14, name: 'Shadow Walk', description: 'While you are in Dim Light or Darkness, you can take a Bonus Action to teleport up to 120 feet to an unoccupied space you can see that is also in Dim Light or Darkness.' },
        { level: 18, name: 'Umbral Form', description: 'When you use Innate Sorcery, you can adopt a shadowy form, gaining the benefits below while your Innate Sorcery is active or until you end the form (no action required). Once you use this feature, you can\'t use it again until you finish a Long Rest unless you spend 6 Sorcery Points (no action required) to restore your use of it. Incorporeal Movement. You can move through creatures and objects as if they were Difficult Terrain, but you take 1d10 Force damage if you end your turn inside a creature or an object. Shadow Resilience. You have Resistance to all damage except Force and Radiant damage.' },
      ],
    },
    {
      id: 'spellfire-sorcery',
      classId: 'sorcerer',
      name: 'Spellfire Sorcery',
      description: 'Wield Raw Magic Your innate power stems from the source of magic itself: the Weave. This connection manifests as a rare ability known as spellfire, and you surge with radiant bursts of this raw magic. Your talent with spellfire allows you to heal allies, sear enemies, and absorb powerful spells. Wielders of spellfire tend to have a penchant for wandering. Many travel between cosmopolitan settlements, such as those along the Sword Coast, and wield their magic in service of the common good. Others realize their own strange powers by roaming equally strange lands, from the magic-blasted wastes of the desert of Anauroch to the god-touched wilds of the Old Empires. Wherever they go in the Realms, spellfire Sorcerers are courted by factions with interests in the arcane arts, such as the Harpers, Cult of the Dragon, and Red Wizards.',
      source: 'faerun',
      features: [
        { level: 3, name: 'Spellfire Burst', description: 'When you spend at least 1 Sorcery Point as part of a Magic action or a Bonus Action on your turn, you can unleash one of the following magical effects of your choice. You can do so only once per turn. Bolstering Flames. You or one creature you can see within 30 feet of yourself gains Temporary Hit Points equal to 1d4 plus your Charisma modifier. Radiant Fire. One creature you can see within 30 feet of yourself takes 1d4 Fire or Radiant damage (your choice).' },
        { level: 3, name: 'Spellfire Spells', description: 'When you reach a Sorcerer level specified in the Spellfire Spells table, you thereafter always have the listed spells prepared.' },
        { level: 6, name: 'Absorb Spells', description: 'You always have Counterspell prepared. Additionally, whenever a target fails the saving throw against a Counterspell you cast, you regain 1d4 Sorcery Points.' },
        { level: 14, name: 'Honed Spellfire', description: 'Your Spellfire Burst improves. You add your Sorcerer level to the Temporary Hit Points gained from Bolstering Flames, and the damage of your Radiant Fire increases to 1d8.' },
        { level: 18, name: 'Crown of Spellfire', description: 'When you use Innate Sorcery, you can alter it and infuse yourself with the essence of spellfire, gaining the following benefits while this use of Innate Sorcery is active. Once you use this feature to alter Innate Sorcery, you can\'t use it again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it. Burning Life Force. Once per turn when you are hit by an attack roll, you can expend a number of Hit Point Dice, up to a maximum equal to your Charisma modifier (minimum of one). Roll the expended dice, and reduce the amount of damage from that attack equal to the total rolled. Flight. You gain a Fly Speed of 60 feet and can hover. Spell Avoidance. When you\'re subjected to a spell or magical effect that allows you to make a saving throw to take only half damage, you instead take no damage if you succeed on the save and only half damage if you fail. You can\'t use this benefit if you have the Incapacitated condition.' },
      ],
    },
    {
      id: 'wild-magic-sorcery',
      classId: 'sorcerer',
      name: 'Wild Magic Sorcery',
      description: 'Unleash Chaotic Magic Your innate magic stems from the forces of chaos that underlie the order of creation. You or an ancestor might have endured exposure to raw magic, perhaps through a planar portal leading to Limbo or the Elemental Planes. Perhaps you were blessed by a fey being or marked by a demon. Or your magic could be a fluke with no apparent cause. Whatever its source, this magic churns within you, waiting for any outlet.',
      features: [
        { level: 3, name: 'Wild Magic Surge', description: 'Your spellcasting can unleash surges of untamed magic. Once per turn, you can roll 1d20 immediately after you cast a Sorcerer spell with a spell slot. If you roll a 20, roll on the Wild Magic Surge table to create a magical effect. If the magical effect is a spell, it is too wild to be affected by your Metamagic.' },
        { level: 3, name: 'Tides of Chaos', description: 'You can manipulate chaos itself to give yourself Advantage on one D20 Test before you roll the d20. Once you do so, you must cast a Sorcerer spell with a spell slot or finish a Long Rest before you can use this feature again. If you do cast a Sorcerer spell with a spell slot before you finish a Long Rest, you automatically roll on the Wild Magic Surge table.' },
        { level: 6, name: 'Bend Luck', description: 'You have the ability to twist fate using your wild magic. Immediately after another creature you can see rolls the d20 for a D20 Test, you can take a Reaction and spend 1 Sorcery Point to roll 1d4 and apply the number rolled as a bonus or penalty (your choice) to the d20 roll.' },
        { level: 14, name: 'Controlled Chaos', description: 'You gain a modicum of control over the surges of your wild magic. Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number.' },
        { level: 18, name: 'Tamed Surge', description: 'Immediately after you cast a Sorcerer spell with a spell slot, you can create an effect of your choice from the Wild Magic Surge table instead of rolling on that table. You can choose any effect in the table except for the final row, and if the chosen effect involves a roll, you must make it. Once you use this feature, you can\'t do so again until you finish a Long Rest.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'Drawing from your innate magic, you can cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Sorcerer spells, which appear in the Sorcerer spell list later in the class\'s description. Cantrips. You know four Sorcerer cantrips of your choice. Light, Prestidigitation, Shocking Grasp, and Sorcerous Burst are recommended. Whenever you gain a Sorcerer level, you can replace one of your cantrips from this feature with another Sorcerer cantrip of your choice. When you reach Sorcerer levels 4 and 10, you learn another Sorcerer cantrip of your choice, as shown in the Cantrips column of the Sorcerer Features table. Spell Slots. The Sorcerer Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Sorcerer spells. Burning Hands and Detect Magic are recommended. The number of spells on your list increases as you gain Sorcerer levels, as shown in the Prepared Spells column of the Sorcerer Features table. Whenever that number increases, choose additional Sorcerer spells until the number of spells on your list matches the number in the Sorcerer Features table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 3 Sorcerer, your list of prepared spells can include six Sorcerer spells of level 1 or 2 in any combination. If another Sorcerer feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Sorcerer spells for you. Changing Your Prepared Spells. Whenever you gain a Sorcerer level, you can replace one spell on your list with another Sorcerer spell for which you have spell slots. Spellcasting Ability. Charisma is your spellcasting ability for your Sorcerer spells. Spellcasting Focus. You can use an Arcane Focus as a Spellcasting Focus for your Sorcerer spells.'
      },
      {
        id: 'innate-sorcery',
        name: 'Innate Sorcery',
        description: 'An event in your past left an indelible mark on you, infusing you with simmering magic. As a Bonus Action, you can unleash that magic for 1 minute, during which you gain the following benefits:\n- The spell save DC of your Sorcerer spells increases by 1.\n- You have Advantage on the attack rolls of Sorcerer spells you cast.\nYou can use this feature twice, and you regain all expended uses of it when you finish a Long Rest.'
      },
    ],
    2: [
      {
        id: 'font-of-magic',
        name: 'Font of Magic',
        description: 'You can tap into the wellspring of magic within yourself. This wellspring is represented by Sorcery Points, which allow you to create a variety of magical effects. You have 2 Sorcery Points, and you gain more as you reach higher levels, as shown in the Sorcery Points column of the Sorcerer Features table. You can\'t have more Sorcery Points than the number shown in the table for your level. You regain all expended Sorcery Points when you finish a Long Rest. You can use your Sorcery Points to fuel the options below, along with other features, such as Metamagic, that use those points. Converting Spell Slots to Sorcery Points. You can expend a spell slot to gain a number of Sorcery Points equal to the slot\'s level (no action required). Creating Spell Slots. As a Bonus Action, you can transform unexpended Sorcery Points into one spell slot. The Creating Spell Slots table shows the cost of creating a spell slot of a given level, and it lists the minimum Sorcerer level you must be to create a slot. You can create a spell slot no higher than level 5. Any spell slot you create with this feature vanishes when you finish a Long Rest.'
      },
      {
        id: 'metamagic',
        name: 'Metamagic',
        description: 'Because your magic flows from within, you can alter your spells to suit your needs; you gain two Metamagic options of your choice from "Metamagic Options" later in this class\'s description. You use the chosen options to temporarily modify spells you cast. To use an option, you must spend the number of Sorcery Points that it costs. You can use only one Metamagic option on a spell when you cast it unless otherwise noted in one of those options. Whenever you gain a Sorcerer level, you can replace one of your Metamagic options with one you don\'t know. You gain two more options at Sorcerer level 10 and two more at Sorcerer level 17.'
      },
    ],
    3: [
      {
        id: 'sorcerer-subclass',
        name: 'Sorcerer Subclass',
        description: 'You gain a Sorcerer subclass of your choice. The Aberrant Sorcery, Clockwork Sorcery, Draconic Sorcery, Shadow Sorcery, Spellfire Sorcery, and Wild Magic Sorcery subclasses are detailed after this class\'s description. A subclass is a specialization that grants you features at certain Sorcerer levels. For the rest of your career, you gain each of your subclass\'s features that are of your Sorcerer level or lower.'
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Sorcerer levels 8, 12, and 16.'
      },
    ],
    5: [
      {
        id: 'sorcerous-restoration',
        name: 'Sorcerous Restoration',
        description: 'When you finish a Short Rest, you can regain expended Sorcery Points, but no more than a number equal to half your Sorcerer level (round down). Once you use this feature, you can\'t do so again until you finish a Long Rest.'
      },
    ],
    7: [
      {
        id: 'sorcery-incarnate',
        name: 'Sorcery Incarnate',
        description: 'If you have no uses of Innate Sorcery left, you can use it if you spend 2 Sorcery Points when you take the Bonus Action to activate it. In addition, while your Innate Sorcery feature is active, you can use up to two of your Metamagic options on each spell you cast.'
      },
    ],
    10: [
      {
        id: 'metamagic',
        name: 'Metamagic',
        description: 'You gain two additional Metamagic options of your choice from "Metamagic Options" later in this class\'s description. Whenever you gain a Sorcerer level, you can replace one of your Metamagic options with one you don\'t know.'
      },
    ],
    17: [
      {
        id: 'metamagic',
        name: 'Metamagic',
        description: 'You gain two additional Metamagic options of your choice from "Metamagic Options" later in this class\'s description. Whenever you gain a Sorcerer level, you can replace one of your Metamagic options with one you don\'t know.'
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
        id: 'arcane-apotheosis',
        name: 'Arcane Apotheosis',
        description: 'While your Innate Sorcery feature is active, you can use one Metamagic option on each of your turns without spending Sorcery Points on it.'
      },
    ],
  },
  multiclassGains: ['Two cantrips from the sorcerer spell list', 'Spellcasting (prepared spells from sorcerer list, Cha-based)', 'Font of Magic (sorcery points equal to sorcerer level)', 'Metamagic (2 options)'],
  asiLevels: [4, 8, 12, 16],
};