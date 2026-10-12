import type { ClassDef } from '../../types/character';

export const ranger: ClassDef = {
  id: 'ranger',
  name: 'Ranger',
  hitDie: 10,
  savingThrowProficiencies: ['str', 'dex'],
  armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
  weaponProficiencies: ['Simple and Martial weapons'],
  toolProficiencies: [],
  skills: {
    granted: [],
    choices: ['animalHandling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
    choiceCount: 3,
  },
  spellcasting: {
    ability: 'wis',
    cantripsMode: 'known',
    cantripCountByLevel: {},
    spellsMode: 'prepared',
    spellCountByLevel: {1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6, 7: 7, 8: 7, 9: 9, 10: 9, 11: 10, 12: 10, 13: 11, 14: 11, 15: 12, 16: 12, 17: 14, 18: 14, 19: 15, 20: 15},
    slotTable: {1: [2], 2: [2], 3: [3], 4: [3], 5: [4, 2], 6: [4, 2], 7: [4, 3], 8: [4, 3], 9: [4, 3, 2], 10: [4, 3, 2], 11: [4, 3, 3], 12: [4, 3, 3], 13: [4, 3, 3, 1], 14: [4, 3, 3, 1], 15: [4, 3, 3, 2], 16: [4, 3, 3, 2], 17: [4, 3, 3, 3, 1], 18: [4, 3, 3, 3, 1], 19: [4, 3, 3, 3, 2], 20: [4, 3, 3, 3, 2]},
  },
  subclassLevel: 3,
  subclasses: [
    {
      id: 'beast-master',
      classId: 'ranger',
      name: 'Beast Master',
      description: 'Bond with a Primal Beast A Beast Master forms a mystical bond with a special animal, drawing on primal magic and a deep connection to the natural world.',
      features: [
        { level: 3, name: 'Primal Companion', description: 'You magically summon a primal beast, which draws strength from your bond with nature. Choose its stat block: Beast of the Land, Beast of the Sea or Beast of the Sky. You also determine the kind of animal it is, choosing a kind appropriate for the stat block. Whatever beast you choose, it bears primal markings indicating its supernatural origin. The beast is Friendly to you and your allies and obeys your commands. It vanishes if you die. The Beast in Combat. In Combat, the beast acts during your turn. It can move and use its Reaction on its own, but the only action it takes is the Dodge action unless you take a Bonus Action to command it to take an action in its stat block or some other action. You can also sacrifice one of your attacks when you take the Attack action to command the beast to take the Beast\'s Strike action. If you have the Incapacitated condition, the beast acts on its own and isn\'t limited to the dodge action. Restoring or Replacing the Beast. If the beast has died within the last hour, you can take a Magic action to touch it and expend a spell slot. The beast returns to life after 1 minute with all its Hit Points restored. Whenever you finish a Long Rest, you can summon a different primal beast, which appears in an unoccupied space within 5 feet of you. You choose its stat block and appearance. If you already have a beast from this feature, the old one vanishes when the new one appears.' },
        { level: 7, name: 'Exceptional Training', description: 'When you take a Bonus Action to command your Primal Companion beast to take an action, you can also command it to take the Dash, Disengage, Dodge, or Help action using its Bonus Action. In addition, whenever it hits with an attack roll and deals damage, it can deal your choice of Force damage or its normal damage type.' },
        { level: 11, name: 'Bestial Fury', description: 'When you command your Primal Companion beast to take the Beast\'s Strike action, the beast can use it twice. In addition, the first time each turn it hits a creature under the effect of your Hunter\'s Mark spell, the beast deals extra Force damage equal to the bonus damage of that spell.' },
        { level: 15, name: 'Share Spells', description: 'When you cast a spell targeting yourself, you can also affect your Primal Companion beast with the spell if the beast is within 30 feet of you.' },
      ],
    },
    {
      id: 'fey-wanderer',
      classId: 'ranger',
      name: 'Fey Wanderer',
      description: 'Wield Fey Mirth and Fury A fey mystique surrounds you, thanks to the boon of an archfey or a location in the Feywild that transformed you. However you gained fey magic, you are now a Fey Wanderer. Your joyful laughter brightens the hearts of the downtrodden, and your martial prowess strikes terror in your foes, for great is the mirth of the fey and dreadful is their fury.',
      features: [
        { level: 3, name: 'Dreadful Strikes', description: 'You can augment your weapon strikes with mind-scarring magic drawn from the murky hollows of the Feywild. When you hit a creature with a weapon, you can deal an extra 1d4 Psychic damage to the target, which can take this extra damage only once per turn. The extra damage increases to 1d6 when you reach Ranger level 11.' },
        { level: 3, name: 'Fey Wanderer Spells', description: 'When you reach a Ranger level specified in the Fey Wanderer spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Otherworldly Glamour.', description: 'Whenever you make a Charisma check, you gain a bonus to the check equal to your Wisdom modifier (Minimum of +1). You also gain proficiency in one of these skills of your choice: Deception, Performance, or Persuasion.' },
        { level: 7, name: 'Beguiling Twist', description: 'The magic of the Feywild guards your mind. You have advantage on saving throws to avoid or end the Charmed or Frightened condition. In addition, whenever you or a creature you can see within 120 feet of you succeeds on a saving throw to avoid or end the Charmed or Frightened condition, you can take a Reaction to force a different creature you can see within 120 feet of yourself to make a Wisdom save against your spell save DC. On a failed save, the target is charmed or frightened (your choice) for 1 minute. The target repeats the save at the end of each of its turns, ending the effect on itself on a success.' },
        { level: 11, name: 'Fey Reinforcements', description: 'You can cast Summon Fey without a Material component. You can also cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. Whenever you start casting the spell, you can modify it so that it doesn\'t require Concentration. If you do so, the spell\'s duration becomes 1 minute for the casting.' },
        { level: 15, name: 'Misty Wanderer', description: 'You can cast Misty Step without expending a spell slot. You can do so a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. In addition, whenever you cast Misty Step, you can bring along one willing creature you can see within 5 feet of yourself. That creature teleports to an unoccupied space of your choice within 5 feet of your destination space.' },
      ],
    },
    {
      id: 'gloom-stalker',
      classId: 'ranger',
      name: 'Gloom Stalker',
      description: 'Draw on Shadow Magic to Fight Your Foes Gloom Stalkers are at home in the darkest places, wielding magic drawn from the Shadowfell to combat enemies that lurk in darkness.',
      features: [
        { level: 3, name: 'Dread Ambusher', description: 'You have mastered the art of creating fearsome ambushes, granting you the following benefits. Ambusher\'s Leap. At the start of your first turn of each combat, your speed increases by 10 feet until the end of that turn. Dreadful Strike. When you attack a creature and hit it with a weapon, you can deal an extra 2d6 Psychic damage. You can use this benefit only once per turn, you can use it a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. Initiative Bonus. When you roll Initiative, you can add your Wisdom modifier to the roll.' },
        { level: 3, name: 'Gloom Stalker Spells', description: 'When you reach a Ranger level specified in the Gloom Stalker spells table, you thereafter always have the listed spells prepared.' },
        { level: 3, name: 'Umbral Sight', description: 'You gain Darkvision with a range of 60 feet. If you already have Darkvision when you gain this feature, its range increases by 60 feet. You are also adept at evading creatures that rely on Darkvision. While entirely in Darkness, you have the Invisible condition to any creature that relies on Darkvision to see you in that Darkness.' },
        { level: 7, name: 'Iron Mind', description: 'You have honed your ability to resist mind-altering powers. You gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).' },
        { level: 11, name: 'Stalker\'s Flurry', description: 'The Psychic damage of your Dreadful Strike becomes 2d8. In addition, when you use the Dreadful Strike effect of your Dread Ambusher feature, you can use one of the following additional effects. Sudden Strike. You can make another attack with the same weapon against a different creature that is within 5 feet of the original target and that is within the weapon\'s range. Mass Fear. The target and each creature within 10 feet of it must make a wisdom saving throw against your spell save DC. On a failed save, a creature has the Frightened condition until the start of your next turn.' },
        { level: 15, name: 'Shadowy Dodge', description: 'When a creature makes an attack roll against you, you can take a Reaction to impose Disadvantage on that roll. Whether the attack hits or misses, you can teleport up to 30 feet to an unoccupied space that you can see.' },
      ],
    },
    {
      id: 'hollow-warden',
      classId: 'ranger',
      name: 'Hollow Warden',
      description: 'Draw on the Might of Ancient Wild Terrors Legends tell that the most ancient and bloodthirsty terrors lurk deep within the old places of the earth. Hollow Wardens venerate and draw power from such beings, transforming themselves into merciless and monstrous guardians that stalk jagged coastlines, steep mountain crags, and other dark and wild places.',
      features: [
        { level: 3, name: 'Hollow Warden Spells', description: 'When you reach a Ranger level specified in the Hollow Warden Spells table, you thereafter always have the listed spell prepared.' },
        { level: 3, name: 'Wrath of the Wild', description: 'You draw power from the strange and ancient horrors of the land, causing you to sprout unnatural growths, such as bloody antlers or putrid fangs, or causing your shadow to lengthen or twist around you. As a Bonus Action, you can expend a use of Favored Enemy to transform into a ghastly form, gaining the following benefits for 1 minute or until you have the Incapacitated condition, die, or end the transformation (no action required). Ancient Armor. You gain a +1 bonus to AC, as your body is wreathed in rotten bark and beastly bristles. This bonus increases to +2 when you reach Ranger level 11. Prowling Retribution. Immediately after a creature you can see within 5 feet of yourself deals damage to you or one of your allies, you can make an Opportunity Attack against that creature. Unnerving Aura. When you transform and at the start of each of your subsequent turns, each creature of your choice in a 10-foot Emanation originating from you makes a Wisdom saving throw against your spell save DC. On a failed save, a creature has the Frightened condition until the start of your next turn.' },
        { level: 7, name: 'Hungering Might', description: 'You gain a bonus to Constitution saving throws equal to your Wisdom modifier (minimum of +1). In addition, once per turn when you hit a creature with an attack roll while you are transformed using Wrath of the Wild, you regain a number of Hit Points equal to 1d10 plus your Wisdom modifier, provided you are Bloodied when you hit.' },
        { level: 11, name: 'Rot and Violence', description: 'Your dedication to wild eldritch beings alters you further. When transformed using Wrath of the Wild, you gain the following additional benefits. Menacing Aura. When a creature fails its saving throw against your Unnerving Aura, it also can\'t regain Hit Points or take Reactions until the start of your next turn. Strangling Roots. When you hit a creature with an attack roll using a weapon, you can activate the Sap or Slow mastery property in addition to a different mastery property you\'re using with that weapon.' },
        { level: 15, name: 'Ancient Might', description: 'You become wholly suffused with the wild\'s ancient and terrible power, granting you the following benefits. Ominous Strikes. When you hit a creature that has the Frightened condition with an attack roll, that attack deals extra damage equal to your Wisdom modifier. Persistent Wrath. If you\'re reduced to 0 Hit Points but not killed outright while transformed using Wrath of the Wild, you can surge with wild power. Your Hit Points instead change to a number equal to twice your Ranger level. Once you use this feature, you can\'t do so again until you finish a Long Rest. You can also expend a level 4+ spell slot (no action required) to restore your use of this feature. Timeless. You have Immunity to the Exhaustion condition.' },
      ],
    },
    {
      id: 'hunter',
      classId: 'ranger',
      name: 'Hunter',
      description: 'Protect Nature and People from Destruction You stalk prey in the wilds and elsewhere, using your abilities as a Hunter to protect nature and people everywhere from forces that would destroy them.',
      features: [
        { level: 3, name: 'Hunter\'s Lore', description: 'You can call upon the forces of nature to reveal certain strengths and weaknesses of your prey. While a creature is marked by your Hunter\'s Mark, you know whether the creature has any Immunities, Resistances, or Vulnerabilities, and if the creature has any, you know what they are.' },
        { level: 3, name: 'Hunter\'s Prey', description: 'You gain one of the following feature options of your choice. Whenever you finish a Short or Long Rest, you can replace the chosen option with the other one. Colossus Slayer. Your tenacity can wear down even the most resilient foes. When you hit a creature with a weapon, the weapon deals an extra 1d8 damage to the target if it\'s missing any of its Hit Points. You can deal this extra damage only once per turn. Horde Breaker. Once on each of your turns when you make an attack with a weapon, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target, that is within the weapon\'s range, and that you haven\'t attacked this turn.' },
        { level: 7, name: 'Defensive Tactics', description: 'You gain one of the following feature options of your choice. Whenever you finish a Short or Long Rest, you can replace the chosen option with the other one. Escape the Horde. Opportunity Attacks have Disadvantage against you. Multiattack Defense. When a creature hits you with an attack roll, that creature has Disadvantage on all other attack rolls against you this turn.' },
        { level: 11, name: 'Superior Hunter\'s Prey', description: 'Once per turn when you deal damage to a creature marked by your Hunter\'s Mark, you can also deal that spell\'s extra damage to a different creature that you can see within 30 feet of the first creature.' },
        { level: 15, name: 'Superior Hunter\'s Defense', description: 'When you take damage, you can take a Reaction to give yourself Resistance to that damage and any other damage of the same type until the end of the current turn.' },
      ],
    },
    {
      id: 'winter-walker',
      classId: 'ranger',
      name: 'Winter Walker',
      description: 'Withstand the Horrors of Frigid Wastelands Winter Walkers hone their craft in the bleak and frozen wilds of places like Icewind Dale. These ruthless, rimed Rangers hunt monsters that haunt arctic wastelands, eventually becoming frigid terrors themselves. Winter Walkers are well versed in the phenomena of Icewind Dale, including the latent magic of fallen Netherese cities, endemic monsters like yetis and crag cats, and the rising threat of Underdark invaders. Due to their cold pragmatism, terrifying magic, and mastery of the region, Winter Walkers are regarded with equal parts respect and fear. Ten-Towns citizens say that Winter Walkers\' frequent exposure to malignant entities gives them their fearsome powers. Many Reghed nomads, on the other hand, believe that nature spirits bestow on Winter Walkers a unique curse.',
      source: 'faerun',
      features: [
        { level: 3, name: 'Frigid Explorer', description: 'You gain the following benefits. Biting Cold. Damage from your weapon attacks, Ranger spells, and Ranger features ignores Resistance to Cold damage. Frost Resistance. You have Resistance to Cold damage. Polar Strikes. When you hit a creature with an attack roll using a weapon, you can deal an extra 1d4 Cold damage to the target, which can take this extra damage only once per turn. When you reach Ranger level 11, this extra damage increases to 1d6.' },
        { level: 3, name: 'Hunter\'s Rime', description: 'Ice rimes you and your prey, protecting you and hindering them. When you cast Hunter\'s Mark, you gain Temporary Hit Points equal to 1d10 plus your Ranger level. Additionally, while a creature is marked by your Hunter\'s Mark, it can\'t take the Disengage action.' },
        { level: 3, name: 'Winter Walker Spells', description: 'When you reach a Ranger level specified in the Winter Walker Spells table, you thereafter always have the listed spells prepared.' },
        { level: 7, name: 'Fortifying Soul', description: 'Your experience surviving harrowing environments allows you to bolster your allies in addition to yourself. As a Magic action, choose a number of creatures you can see equal to your Wisdom modifier (minimum of one). Each chosen creature regains Hit Points equal to 1d10 plus your Ranger level and has Advantage on saving throws to avoid or end the Frightened condition for 1 hour. Once you use this feature, you can\'t use it again until you finish a Long Rest.' },
        { level: 11, name: 'Chilling Retribution', description: 'When a creature hits you with an attack roll, you can take a Reaction to force the creature to make a Wisdom saving throw against your spell save DC. On a failed save, the target has the Stunned condition until the end of your next turn. While the target is Stunned, its Speed is reduced to 0 feet. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 15, name: 'Frozen Haunt', description: 'When you cast Hunter\'s Mark, you can adopt a ghostly, snowy form. This form lasts until the spell ends, and while you are in this form, you gain the following benefits. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you expend a level 4+ spell slot (no action required). Frozen Soul. You have Immunity to Cold damage. When you first adopt this form and at the start of each of your subsequent turns, each creature of your choice in a 15-foot Emanation originating from you takes 2d4 Cold damage. Partially Incorporeal. You have Immunity to the Grappled, Prone, and Restrained conditions. You can move through creatures and objects as if they were Difficult Terrain, but you take 1d10 Force damage if you end your turn inside a creature or an object. If the form ends while you are inside a creature or an object, you are shunted to the nearest unoccupied space.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'You have learned to channel the magical essence of nature to cast spells. See Chapter 7 for the rules on Spellcasting. The Information below details how you use those rules with Ranger spells, which appear in the Ranger spell list later in the class\'s description. Spell Slots. The Ranger Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Ranger spells Cure Wounds and Ensnaring Strike are recommended. The number of spells on your list increases as you gain Ranger levels, as shown in the Prepared Spells column of the Ranger Features table. Whenever that number increases, choose additional spells from the Ranger spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 5 Ranger, your list of prepared spells can include six spells of levels 1 and 2 in any combination. If another Ranger feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Ranger spells for you. Changing Your Prepared Spells. Whenever you finish a Long Rest, you can replace one spell on your list with another Ranger spell for which you have spell slots. Spellcasting Ability. Wisdom is your spellcasting ability for your Ranger spells. Spellcasting Focus. You can use a Druidic Focus as a Spellcasting Focus for your Ranger spells.'
      },
      {
        id: 'favored-enemy',
        name: 'Favored Enemy',
        description: 'You always have the Hunter\'s Mark spell prepared. You can cast it twice without expending a spell slot, and you regain all expended uses of this ability when you finish a Long Rest. The number of times you can cast the spell without a spell slot increases when you reach certain Ranger Levels, as shown in the Favored Enemy column of the Ranger Features table.'
      },
      {
        id: 'weapon-mastery',
        name: 'Weapon Mastery',
        description: 'Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency, such as Longbows and Shortswords. Whenever you finish a Long Rest, you can change the kinds of weapons you chose. For Example, you could switch to using the mastery properties of Scimitars and Longswords.'
      },
    ],
    2: [
      {
        id: 'deft-explorer',
        name: 'Deft Explorer',
        description: 'Thanks to your travels, you gain the following benefits. Expertise.: Choose one of your skill proficiencies with which you lack Expertise. You gain Expertise in that skill. Languages.: You know two languages of your choice from the language tables in chapter 2.'
      },
      {
        id: 'fighting-style',
        name: 'Fighting Style',
        description: 'You gain a Fighting Style feat of your choice (see chapter 5). Instead of choosing one of those feats, you can choose the option below. Druidic Warrior. You learn two Druid cantrips of your choice (See the Druid class\'s section for a list of Druid spells). Guidance and Starry Wisp are recommended. The chosen cantrips count as Ranger spells for you, and Wisdom is your spellcasting ability for them. Whenever you gain a Ranger level, you can replace one of these cantrips with another Druid cantrip.',
        options: [
          { id: 'archery', name: 'Archery', description: 'You gain a +2 bonus to attack rolls with ranged weapons.' },
          { id: 'defense', name: 'Defense', description: 'While wearing armor, you gain a +1 bonus to AC.' },
          { id: 'druidic-warrior', name: 'Druidic Warrior', description: 'Learn two cantrips from the Druid list. Wisdom is your spellcasting ability for them. You can change one when you gain a Ranger level. These are Druid cantrips, not Ranger cantrips.' },
          { id: 'dueling', name: 'Dueling', description: 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
          { id: 'great-weapon-fighting', name: 'Great Weapon Fighting', description: 'When you roll a 1 or 2 on a damage die for a two-handed or versatile melee weapon attack, reroll the die and use the new roll.' },
          { id: 'two-weapon-fighting', name: 'Two-Weapon Fighting', description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the off-hand attack.' },
        ],
        optionCount: 1,
      },
    ],
    3: [
      {
        id: 'ranger-subclass',
        name: 'Ranger Subclass',
        description: 'You gain a Ranger Subclass of your choice. The Beast Master, Fey Wanderer, Gloom Stalker and Hunter subclasses are detailed after this class\'s description. A Subclass is a specialization that grants you features at certain Ranger levels. For the rest of your career, you gain each of your subclass\'s features that are of your Ranger level or lower.'
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Ranger levels 8, 12, and 16.'
      },
    ],
    5: [
      {
        id: 'extra-attack',
        name: 'Extra Attack',
        description: 'You can attack twice instead of once whenever you take the Attack action on your turn.'
      },
    ],
    6: [
      {
        id: 'roving',
        name: 'Roving',
        description: 'Your speed increases by 10 feet while you aren\'t wearing Heavy Armor. You also have a Climb speed and a Swim Speed equal to your Speed.'
      },
    ],
    7: [
      {
        id: 'subclass-feature-7',
        name: 'Subclass Feature',
        description: 'See the Ranger subclass you chose at level 3.'
      },
    ],
    9: [
      {
        id: 'expertise',
        name: 'Expertise',
        description: 'Choose two of your skill proficiencies with which you lack Expertise. You gain Expertise in those skills.'
      },
    ],
    10: [
      {
        id: 'tireless',
        name: 'Tireless',
        description: 'Primal forces now help fuel you on your journeys, granting you the following benefits. Temporary Hit Points. As a Magic Action, you can give yourself a number of Temporary Hit Points equal to 1d8 plus your Wisdom modifier (minimum of 1). You can use this action a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. Decrease Exhaustion. Whenever you finish a Short Rest, your Exhaustion level, if any, decreases by 1.'
      },
    ],
    11: [
      {
        id: 'subclass-feature-11',
        name: 'Subclass Feature',
        description: 'See the Ranger subclass you chose at level 3.'
      },
    ],
    13: [
      {
        id: 'relentless-hunter',
        name: 'Relentless Hunter',
        description: 'Taking damage can\'t break your Concentration on Hunter\'s Mark.'
      },
    ],
    14: [
      {
        id: 'natures-veil',
        name: 'Nature\'s Veil',
        description: 'You invoke spirits of nature to magically hide yourself. As a Bonus Action you can give yourself the Invisible condition until the end of your next turn. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.'
      },
    ],
    15: [
      {
        id: 'subclass-feature-15',
        name: 'Subclass Feature',
        description: 'See the Ranger subclass you chose at level 3.'
      },
    ],
    17: [
      {
        id: 'precise-hunter',
        name: 'Precise Hunter',
        description: 'You have Advantage on attack rolls against the creature currently marked by your Hunter\'s Mark.'
      },
    ],
    18: [
      {
        id: 'feral-senses',
        name: 'Feral Senses',
        description: 'Your connection to the forces of nature grants you Blindsight with a range of 30 feet.'
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
        id: 'foe-slayer',
        name: 'Foe Slayer',
        description: 'The damage die of your Hunter\'s Mark is a d10 rather than a d6.'
      },
    ],
  },
  weaponMastery: {
    featureLevel: 2,
    choiceCount: 2,
    pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'],
    extraPicksAtLevels: [4, 6, 10, 16],
  },
  multiclassGains: ['Light armor, Medium armor, Shields, Simple weapons, Martial weapons', 'Favored Enemy, Natural Explorer'],
  asiLevels: [4, 8, 12, 16],
};