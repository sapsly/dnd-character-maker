import type { ClassDef } from '../../types/character';

export const monk: ClassDef = {
  id: 'monk',
  name: 'Monk',
  hitDie: 8,
  savingThrowProficiencies: ['str', 'dex'],
  armorProficiencies: [],
  weaponProficiencies: ['Simple weapons and Martial weapons that have the Light property'],
  toolProficiencies: ['Choose one type of Artisan\'s Tools or Musical Instrument'],
  skills: {
    granted: [],
    choices: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
    choiceCount: 2,
  },
  subclassLevel: 3,
  subclasses: [
    {
      id: 'warrior-of-mercy',
      classId: 'monk',
      name: 'Warrior of Mercy',
      description: 'Manipulate Forces of Life and Death Warriors of Mercy manipulate the life force of others. These Monks are wandering physicians, but they bring a swift end to their enemies. They often wear masks, presenting themselves as faceless bringers of life and death.',
      features: [
        { level: 3, name: 'Hand of Harm', description: 'Once per turn when you hit a creature with an Unarmed Strike and deal damage, you can expend 1 Focus Point to deal extra Necrotic damage equal to one roll of your Martial Arts die plus your Wisdom modifier.' },
        { level: 3, name: 'Hand of Healing', description: 'As a Magic action, you can expend 1 Focus Point to touch a creature and restore a number of Hit Points equal to a roll of your Martial Arts die plus your Wisdom modifier. When you use your Flurry of Blows, you can replace one of the Unarmed Strikes with a use of this feature without expending a Focus Point for the healing.' },
        { level: 3, name: 'Implements of Mercy', description: 'You gain proficiency in the Insight and Medicine skills and proficiency with the Herbalism Kit.' },
        { level: 6, name: 'Physician\'s Touch', description: 'Your Hand of Harm and Hand of Healing improve, as detailed below. Hand of Harm. When you use Hand of Harm on a creature, you can also give that creature the Poisoned condition until the end of your next turn. Hand of Healing. When you use Hand of Healing, you can also end one of the following conditions on the creature you heal: Blinded, Deafened, Paralyzed, Poisoned, or Stunned.' },
        { level: 11, name: 'Flurry of Healing and Harm', description: 'When you use Flurry of Blows, you can replace each of the Unarmed Strikes with a use of Hand of Healing without expending Focus Points for the healing. In addition, when you make an Unarmed Strike with Flurry of Blows and deal damage, you can use Hand of Harm with that strike without expending a Focus Point for Hand of Harm. You can still use Hand of Harm only once per turn. You can use these benefits a total number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Long Rest.' },
        { level: 17, name: 'Hand of Ultimate Mercy', description: 'Your mastery of life energy opens the door to the ultimate mercy. As a Magic action, you can touch the corpse of a creature that died within the past 24 hours and expend 5 Focus Points. The creature then returns to life with a number of Hit Points equal to 4d10 plus your Wisdom modifier. If the creature died with any of the following conditions, the creature revives with the conditions removed: Blinded, Deafened, Paralyzed, Poisoned, and Stunned. Once you use this feature, you can\'t use it again until you finish a Long Rest.' },
      ],
    },
    {
      id: 'warrior-of-shadow',
      classId: 'monk',
      name: 'Warrior of Shadow',
      description: 'Harness Shadow Power for Stealth and Subterfuge Warriors of Shadow practice stealth and subterfuge, harnessing the power of the Shadowfell. They are at home in darkness, able to draw gloom around themselves to hide, leap from shadow to shadow, and take on a wraithlike form.',
      features: [
        { level: 3, name: 'Shadow Arts', description: 'You have learned to draw on the power of the Shadowfell, gaining the following benefits. Darkness. You can expend 1 Focus Point to cast the Darkness spell without spell components. You can see within the spell\'s area when you cast it with this feature. While the spell persists, you can move its area of Darkness to a space within 60 feet of yourself at the start of each of your turns. Darkvision. You gain Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet. Shadowy Figments. You know the Minor Illusion spell. Wisdom is your spellcasting ability for it.' },
        { level: 6, name: 'Shadow Step', description: 'While entirely within Dim Light or Darkness, you can use a Bonus Action to teleport up to 60 feet to an unoccupied space you can see that is also in Dim Light or Darkness. You then have Advantage on the next melee attack you make before the end of the current turn.' },
        { level: 11, name: 'Improved Shadow Step', description: 'You can draw on your Shadowfell connection to empower your teleportation. When you use your Shadow Step, you can expend 1 Focus Point to remove the requirement that you must start and end in Dim Light or Darkness for that use of the feature. As part of this Bonus Action, you can make an Unarmed Strike immediately after you teleport.' },
        { level: 17, name: 'Cloak of Shadows', description: 'As a Magic action while entirely within Dim Light or Darkness, you can expend 3 Focus Points to shroud yourself with shadows for 1 minute, until you have the Incapacitated condition, or until you end your turn in Bright Light. While shrouded by these shadows, you gain the following benefits. Invisibility. You have the Invisible condition. Partially Incorporeal. You can move through occupied spaces as if they were Difficult Terrain. If you end your turn in such a space, you are shunted to the last unoccupied space you were in. Shadow Flurry. You can use your Flurry of Blows without expending any Focus Points.' },
      ],
    },
    {
      id: 'warrior-of-the-elements',
      classId: 'monk',
      name: 'Warrior of the Elements',
      description: 'Wield Strikes and Bursts of Elemental Power Warriors of the Elements tap into the power of the Elemental Planes. Harnessing their supernatural focus, these Monks momentarily tame the energy of the Elemental Chaos to empower themselves in and out of battle.',
      features: [
        { level: 3, name: 'Elemental Attunement', description: 'At the start of your turn, you can expend 1 Focus Point to imbue yourself with elemental energy. The energy lasts for 10 minutes or until you have the Incapacitated condition. You gain the following benefits while this feature is active. Reach. When you make an Unarmed Strike, your reach is 10 feet greater than normal, as elemental energy extends from you. Elemental Strikes. Whenever you hit with your Unarmed Strike, you can cause it to deal your choice of Acid, Cold, Fire, Lightning, or Thunder damage rather than its normal damage type. When you deal one of these types with it, you can also force the target to make a Strength saving throw. On a failed save, you can move the target up to 10 feet toward or away from you, as elemental energy swirls around it.' },
        { level: 3, name: 'Manipulate Elements', description: 'You know the Elementalism spell. Wisdom is your spellcasting ability for it.' },
        { level: 6, name: 'Elemental Burst', description: 'As a Magic action, you can expend 2 Focus Points to cause elemental energy to burst in a 20-foot-radius Sphere centered on a point within 120 feet of yourself. Choose a damage type: Acid, Cold, Fire, Lightning, or Thunder. Each creature in the Sphere must make a Dexterity saving throw. On a failed save, a creature takes damage of the chosen type equal to three rolls of your Martial Arts die. On a successful save, a creature takes half as much damage.' },
        { level: 11, name: 'Stride of the Elements', description: 'While your Elemental Attunement is active, you also have a Fly Speed and a Swim Speed equal to your Speed.' },
        { level: 17, name: 'Elemental Epitome', description: 'While your Elemental Attunement is active, you also gain the following benefits. Damage Resistance. You gain Resistance to one of the following damage types of your choice: Acid, Cold, Fire, Lightning, or Thunder. At the start of each of your turns, you can change this choice. Destructive Stride. When you use your Step of the Wind, your Speed increases by 20 feet until the end of the turn. For that duration, any creature of your choice takes damage equal to one roll of your Martial Arts die when you enter a space within 5 feet of it. The damage type is your choice of Acid, Cold, Fire, Lightning, or Thunder. A creature can take this damage only once per turn. Empowered Strikes. Once on each of your turns, you can deal extra damage to a target equal to one roll of your Martial Arts die when you hit it with an Unarmed Strike. The extra damage is the same type dealt by that strike.' },
      ],
    },
    {
      id: 'warrior-of-the-mystic-arts',
      classId: 'monk',
      name: 'Warrior of the Mystic Arts',
      description: 'Weave Martial and Mystic Arts Warriors of the Mystic Arts wield magic to supplement their martial skill. They harness mystical focus to enhance their magical and physical abilities.',
      features: [
        { level: 3, name: 'Spellcasting', description: 'You have learned to cast spells. See the Player\'s Handbook for the rules on spellcasting. The information below details how you use those rules as a Warrior of the Mystic Arts. Cantrips. You know two cantrips of your choice from the Sorcerer spell list. Blade Ward and Thunderclap are recommended. Whenever you gain a Monk level, you can replace one of these cantrips with another cantrip of your choice from the Sorcerer spell list. When you reach Monk level 10, you learn another Sorcerer cantrip of your choice. Spell Slots. The Warrior of the Mystic Arts Spellcasting table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest.' },
        { level: 6, name: 'Mystic Fighting Style', description: 'When you take the Attack action on your turn, you can replace one Unarmed Strike with a casting of one of your Sorcerer cantrips that has a casting time of an action.' },
        { level: 6, name: 'Mystic Focus', description: 'You keep your magical power and martial focus in perfect balance, allowing you to convert spell slots into Focus Points, or convert Focus Points into spell slots. Converting Spell Slots to Focus Points. You can expend a spell slot to regain a number of expended Focus Points equal to the slot\'s level (no action required). Recovering Spell Slots. When you finish a Short Rest or use Uncanny Metabolism, you can transform unexpended Focus Points to recover one expended spell slot. The Recovering Spell Slots table shows the cost of recovering a spell slot of a given level, and it lists the minimum Monk level you must be to recover a slot. You can recover a spell slot no higher than level 4.' },
        { level: 11, name: 'Focused Strike', description: 'When you use your Stunning Strike, whether the target succeeds or fails on the saving throw, the target has Disadvantage on saving throws against your spells until the start of your next turn.' },
        { level: 17, name: 'Improved Mystic Fighting Style', description: 'When you use Flurry of Blows, you can replace two of the Unarmed Strikes with a casting of one of your level 1 or 2 Sorcerer spells that has a casting time of an action, and you cast it as part of the same Bonus Action you use to activate Flurry of Blows.' },
      ],
    },
    {
      id: 'warrior-of-the-open-hand',
      classId: 'monk',
      name: 'Warrior of the Open Hand',
      description: 'Master Unarmed Combat Techniques Warriors of the Open Hand are masters of unarmed combat. They learn techniques to push and trip their opponents and manipulate their own energy to protect themselves from harm.',
      features: [
        { level: 3, name: 'Open Hand Technique', description: 'Whenever you hit a creature with an attack granted by your Flurry of Blows, you can impose one of the following effects on that target. Addle. The target can\'t make Opportunity Attacks until the start of its next turn. Push. The target must succeed on a Strength saving throw or be pushed up to 15 feet away from you. Topple. The target must succeed on a Dexterity saving throw or have the Prone condition.' },
        { level: 6, name: 'Wholeness of Body', description: 'You gain the ability to heal yourself. As a Bonus Action, you can roll your Martial Arts die. You regain a number of Hit Points equal to the number rolled plus your Wisdom modifier (minimum of 1 Hit Point regained). You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 11, name: 'Fleet Step', description: 'When you take a Bonus Action other than Step of the Wind, you can also use Step of the Wind immediately after that Bonus Action.' },
        { level: 17, name: 'Quivering Palm', description: 'You gain the ability to set up lethal vibrations in someone\'s body. When you hit a creature with an Unarmed Strike, you can expend 4 Focus Points to start these imperceptible vibrations, which last for a number of days equal to your Monk level. The vibrations are harmless unless you take an action to end them. Alternatively, when you take the Attack action on your turn, you can forgo one of the attacks to end the vibrations. To end them, you and the target must be on the same plane of existence. When you end them, the target must make a Constitution saving throw, taking 10d12 Force damage on a failed save or half as much damage on a successful one. You can have only one creature under the effect of this feature at a time. You can end the vibrations harmlessly (no action required).' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'martial-arts',
        name: 'Martial Arts',
        description: 'Your practice of martial arts gives you mastery of combat styles that use your Unarmed Strike and Monk weapons, which are the following: You gain the following benefits while you are unarmed or wielding only Monk weapons and you aren\'t wearing armor or wielding a Shield. Bonus Unarmed Strike. You can make an Unarmed Strike as a Bonus Action. Martial Arts Die. You can roll 1d6 in place of the normal damage of your Unarmed Strike or Monk weapons. This die changes as you gain Monk levels, as shown in the Martial Arts column of the Monk Features table. Dexterous Attacks. You can use your Dexterity modifier instead of your Strength modifier for the attack and damage rolls of your Unarmed Strikes and Monk weapons. In addition, when you use the Grapple or Shove option of your Unarmed Strike, you can use your Dexterity modifier instead of your Strength modifier to determine the save DC.'
      },
      {
        id: 'unarmored-defense',
        name: 'Unarmored Defense',
        description: 'While you aren\'t wearing armor or wielding a Shield, your base Armor Class equals 10 plus your Dexterity and Wisdom modifiers.'
      },
    ],
    2: [
      {
        id: 'monks-focus',
        name: 'Monk\'s Focus',
        description: 'Your focus and martial training allow you to harness a well of extraordinary energy within yourself. This energy is represented by Focus Points. Your Monk level determines the number of points you have, as shown in the Focus Points column of the Monk Features table. You can expend these points to enhance or fuel certain Monk features. You start knowing three such features: Flurry of Blows, Patient Defense, and Step of the Wind, each of which is detailed below. When you expend a Focus Point, it is unavailable until you finish a Short or Long Rest, at the end of which you regain all your expended points. Some features that use Focus Points require your target to make a saving throw. The save DC equals 8 plus your Wisdom modifier and Proficiency Bonus. Flurry of Blows. You can expend 1 Focus Point to make two Unarmed Strikes as a Bonus Action. Patient Defense. You can take the Disengage action as a Bonus Action. Alternatively, you can expend 1 Focus Point to take both the Disengage and the Dodge actions as a Bonus Action. Step of the Wind. You can take the Dash action as a Bonus Action. Alternatively, you can expend 1 Focus Point to take both the Disengage and Dash actions as a Bonus Action, and your jump distance is doubled for the turn.'
      },
      {
        id: 'unarmored-movement',
        name: 'Unarmored Movement',
        description: 'Your speed increases by 10 feet while you aren\'t wearing armor or wielding a Shield. This bonus increases when you reach certain Monk levels, as shown on the Monk Features table.'
      },
      {
        id: 'uncanny-metabolism',
        name: 'Uncanny Metabolism',
        description: 'When you roll Initiative, you can regain all expended Focus Points. When you do so, roll your Martial Arts die, and regain a number of Hit Points equal to your Monk level plus the number rolled. Once you use this feature, you can\'t use it again until you finish a Long Rest.'
      },
    ],
    3: [
      {
        id: 'deflect-attacks',
        name: 'Deflect Attacks',
        description: 'When an attack roll hits you and its damage includes Bludgeoning, Piercing, or Slashing damage, you can take a Reaction to reduce the attack\'s total damage against you. The reduction equals 1d10 plus your Dexterity modifier and Monk level. If you reduce the damage to 0, you can expend 1 Focus Point to redirect some of the attack\'s force. If you do so, choose a creature you can see within 5 feet of yourself if the attack was a melee attack or a creature you can see within 60 feet of yourself that isn\'t behind Total Cover if the attack was a ranged attack. That creature must succeed on a Dexterity saving throw or take damage equal to two rolls of your Martial Arts die plus your Dexterity modifier. The damage is the same type dealt by the attack.'
      },
      {
        id: 'monk-subclass',
        name: 'Monk Subclass',
        description: 'You gain a Monk subclass of your choice. The Warrior of Mercy, Warrior of Shadow, Warrior of the Elements, and Warrior of the Open Hand subclasses are detailed after this class\'s description. A subclass is a specialization that grants you features at certain Monk levels. For the rest of your career, you gain each of your subclass\'s features that are of your Monk level or lower.'
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Monk levels 8, 12, and 16.'
      },
      {
        id: 'slow-fall',
        name: 'Slow Fall',
        description: 'You can take a Reaction when you fall to reduce any damage you take from the fall by an amount equal to five times your Monk level.'
      },
    ],
    5: [
      {
        id: 'extra-attack',
        name: 'Extra Attack',
        description: 'You can attack twice instead of once whenever you take the Attack action on your turn.'
      },
      {
        id: 'stunning-strike',
        name: 'Stunning Strike',
        description: 'Once per turn when you hit a creature with a Monk weapon or an Unarmed Strike, you can expend 1 Focus Point to attempt a stunning strike. The target must make a Constitution saving throw. On a failed save, the target has the Stunned condition until the start of your next turn. On a successful save, the target\'s Speed is halved until the start of your next turn, and the next attack roll made against the target before then has Advantage.'
      },
    ],
    6: [
      {
        id: 'empowered-strikes',
        name: 'Empowered Strikes',
        description: 'Whenever you deal damage with your Unarmed Strike, it can deal your choice of Force damage or its normal damage type.'
      },
      {
        id: 'subclass-feature-6',
        name: 'Subclass Feature',
        description: 'You gain a feature from your Monk subclass.'
      },
    ],
    7: [
      {
        id: 'evasion',
        name: 'Evasion',
        description: 'When you\'re subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. You don\'t benefit from this feature if you have the Incapacitated condition.'
      },
    ],
    8: [
      {
        id: 'ability-score-improvement-8',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Monk levels 12 and 16.'
      },
    ],
    9: [
      {
        id: 'acrobatic-movement',
        name: 'Acrobatic Movement',
        description: 'While you aren\'t wearing armor or wielding a Shield, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the movement.'
      },
    ],
    10: [
      {
        id: 'heightened-focus',
        name: 'Heightened Focus',
        description: 'Your Flurry of Blows, Patient Defense, and Step of the Wind gain the following benefits. Flurry of Blows. You can expend 1 Focus Point to use Flurry of Blows and make three Unarmed Strikes with it instead of two. Patient Defense. When you expend a Focus Point to use Patient Defense, you gain a number of Temporary Hit Points equal to two rolls of your Martial Arts die. Step of the Wind. When you expend a Focus Point to use Step of the Wind, you can choose a willing creature within 5 feet of yourself that is Large or smaller. You move the creature with you until the end of your turn. The creature\'s movement doesn\'t provoke Opportunity Attacks.'
      },
      {
        id: 'self-restoration',
        name: 'Self-Restoration',
        description: 'Through sheer force of will, you can remove one of the following conditions from yourself at the end of each of your turns: Charmed, Frightened, or Poisoned. In addition, forgoing food and drink doesn\'t give you levels of Exhaustion.'
      },
    ],
    11: [
      {
        id: 'subclass-feature-11',
        name: 'Subclass Feature',
        description: 'You gain a feature from your Monk subclass.'
      },
    ],
    12: [
      {
        id: 'ability-score-improvement-12',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Monk level 16.'
      },
    ],
    13: [
      {
        id: 'deflect-energy',
        name: 'Deflect Energy',
        description: 'You can now use your Deflect Attacks feature against attacks that deal any damage type, not just Bludgeoning, Piercing, or Slashing.'
      },
    ],
    14: [
      {
        id: 'disciplined-survivor',
        name: 'Disciplined Survivor',
        description: 'Your physical and mental discipline grant you proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can expend 1 Focus Point to reroll it, and you must use the new roll.'
      },
    ],
    15: [
      {
        id: 'perfect-focus',
        name: 'Perfect Focus',
        description: 'When you roll Initiative and don\'t use Uncanny Metabolism, you regain expended Focus Points until you have 4 if you have 3 or fewer.'
      },
    ],
    16: [
      {
        id: 'ability-score-improvement-16',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.'
      },
    ],
    17: [
      {
        id: 'subclass-feature-17',
        name: 'Subclass Feature',
        description: 'You gain a feature from your Monk subclass.'
      },
    ],
    18: [
      {
        id: 'superior-defense',
        name: 'Superior Defense',
        description: 'At the start of your turn, you can expend 3 Focus Points to bolster yourself against harm for 1 minute or until you have the Incapacitated condition. During that time, you have Resistance to all damage except Force damage.'
      },
    ],
    19: [
      {
        id: 'epic-boon',
        name: 'Epic Boon',
        description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Irresistible Offense is recommended.'
      },
    ],
    20: [
      {
        id: 'body-and-mind',
        name: 'Body and Mind',
        description: 'You have developed your body and mind to new heights. Your Dexterity and Wisdom scores increase by 4, to a maximum of 25.'
      },
    ],
  },
  multiclassGains: ['Simple weapons, Martial weapons that have the Light property', 'Choose one type of Artisan\'s Tools or Musical Instrument', 'One skill from the Monk list'],
  asiLevels: [4, 8, 12, 16],
};