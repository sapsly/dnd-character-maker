import type { ClassDef } from '../../types/character';

export const rogue: ClassDef = {
  id: 'rogue',
  name: 'Rogue',
  hitDie: 8,
  savingThrowProficiencies: ['dex', 'int'],
  armorProficiencies: ['Light armor'],
  weaponProficiencies: ['Simple weapons and Martial weapons that have the Finesse or Light property'],
  toolProficiencies: ['Thieves\' Tools'],
  skills: {
    granted: [],
    choices: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'persuasion', 'sleightOfHand', 'stealth'],
    choiceCount: 4,
  },
  subclassLevel: 3,
  subclasses: [
    {
      id: 'arcane-trickster',
      classId: 'rogue',
      name: 'Arcane Trickster',
      description: 'Enhance Stealth with Arcane Spells Some Rogues enhance their fine-honed skills of stealth and agility with spells, learning magical tricks to aid them in their trade. Some Arcane Tricksters use their talents as pickpockets and burglars, while others are pranksters.',
      features: [
        { level: 3, name: 'Spellcasting', description: 'You have learned to cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules as an Arcane Trickster. Cantrips. You know three cantrips: Mage Hand and two other cantrips of your choice from the Wizard spell list (See that class\'s section for its list). Mind Sliver and Minor Illusion are recommended. Whenever you gain a Rogue level, you can replace one of your cantrips, except Mage Hand, with another Wizard cantrip of your choice. When you reach Rogue level 10, you learn another Wizard cantrip of your choice. Spell Slots. The Arcane Trickster Spellcasting table shows how many spell slots you have to cast your level 1+ spells. You regain all expended spell slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare a list of the level 1+ spells that are available for you to cast with this feature. To start, choose three level 1 Wizard spells. Charm Person, Disguise Self and Fog Cloud are recommended. The number of spells on your list increases as you gain Rogue levels, as shown in the Prepared Spells column of the Arcane Trickster Spellcasting table. Whenever that number increases, choose additional Wizard spells until the number of spells on your list matches the number in the Arcane Trickster Spellcasting table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 7 Rogue, your list of prepared spells can include five Wizard spells of level 1 or 2 in any combination. Changing Your Prepared Spells. Whenever you gain a Rogue level, you can replace one spell on your list with another Wizard spell for which you have spell slots. Spellcasting Ability. Intelligence is your Spellcasting ability for your Wizard Spells. Spellcasting Focus. You can use an Arcane Focus as a Spellcasting Focus for your Wizard Spells.' },
        { level: 3, name: 'Mage Hand Legerdemain', description: 'When you cast Mage Hand, you can cast it as a Bonus Action, and you can make the spectral hand Invisible. You can control the hand as a Bonus Action, and through it, you can make Dexterity (Sleight of Hand) checks.' },
        { level: 9, name: 'Magical Ambush', description: 'If you have the Invisible condition when you cast a spell on a creature, it has Disadvantage on any saving throw it makes against the spell on the same turn.' },
        { level: 13, name: 'Versatile Trickster', description: 'You gain the ability to distract targets with your Mage Hand. When you use the Trip option of your Cunning Strike on a creature, you can also use that option on another creature within 5 feet of the spectral hand.' },
        { level: 17, name: 'Spell Thief', description: 'You gain the ability to magically steal the knowledge of how to cast a spell from another spellcaster. Immediately after a creature casts a spell that targets you or includes you in its area of effect, you can take a Reaction to force the creature to make an Intelligence saving throw. The DC equals your spell save DC. On a failed save, you negate the spell\'s effect against you, and you steal the knowledge of the spell if it is at least level 1 and of a level you can cast (it doesn\'t need to be a Wizard spell). For the next 8 hours, you have the spell prepared. The creature can\'t cast it until 8 hours have passed. Once you steal a spell with this feature, you can\'t use this feature again until you finish a Long Rest.' },
      ],
    },
    {
      id: 'assassin',
      classId: 'rogue',
      name: 'Assassin',
      description: 'Practice the Grim Art of Death An Assassin\'s training focuses on using stealth, poison, and disguise to eliminate foes with deadly efficiency. While some Rogues who follow this path are hired killers, spies, or bounty hunters, the capabilities of this subclass are equally useful for adventurers facing a variety of monstrous enemies.',
      features: [
        { level: 3, name: 'Assassinate', description: 'You\'re adept at ambushing a target, granting you the following benefits. Initiative. You have Advantage on Initiative rolls. Surprising Strikes. During the first round of each combat, you have Advantage on attack rolls against any creature that hasn\'t taken a turn. If your Sneak Attack hits any target during that round, the target takes extra damage of the weapon\'s type equal to your Rogue level.' },
        { level: 3, name: 'Assassin\'s Tools', description: 'You gain a Disguise Kit and a Poisoner\'s Kit, and you have proficiency with them.' },
        { level: 9, name: 'Infiltration Expertise', description: 'You are an expert at the following techniques that aid your infiltrations. Masterful Mimicry. You can unerringly mimic another person\'s speech, handwriting or both if you have spent at least 1 hour studying them. Roving Aim. Your speed isn\'t reduced to 0 by using Steady Aim.' },
        { level: 13, name: 'Envenom Weapons', description: 'When you use the Poison option of your Cunning Strike, the target also takes 2d6 Poison damage whenever it fails the saving throw. This damage ignores Resistance to Poison damage.' },
        { level: 17, name: 'Death Strike', description: 'When you hit with your Sneak Attack on the first round of a combat, the target must succeed on a Constitution saving throw (DC 8 plus your Dexterity modifier and Proficiency Bonus), or the attack\'s damage is doubled against the target.' },
      ],
    },
    {
      id: 'phantom',
      classId: 'rogue',
      name: 'Phantom',
      description: 'Embrace Death and Wield Ghostly Power Some Rogues traverse the veil between life and death, shepherding opponents to the grave and slipping through the world as undetectable as a spirit. In these pursuits, a Rogue might discover a mystical connection to death itself. Such an individual becomes immersed in negative energy, infusing their strikes with deathly energy and stealing knowledge from souls who have passed on. Thieves\' guilds value Rogues of this persuasion as highly effective information gatherers and spies.',
      features: [
        { level: 3, name: 'Wails from the Grave', description: 'Immediately after you deal Sneak Attack damage to a creature on your turn, you can target a second creature that you can see within 30 feet of the first creature. Roll half the number of Sneak Attack damage dice for your level (round up), and the second creature takes Necrotic damage equal to the roll\'s total as wails of the dead sound around it. You can use this feature a number of times equal to your Dexterity modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 3, name: 'Whispers of the Dead', description: 'Whenever you finish a Short or Long Rest, you can choose one skill or tool proficiency that you lack and gain it, as a ghostly presence shares its knowledge with you. You lose this proficiency when you use this benefit again to choose a different proficiency.' },
        { level: 9, name: 'Tokens of the Departed', description: 'The spirits of the dead are drawn to you, and echoes of their past lives magically manifest as strange curios with resonant power. You gain two soul trinkets. A soul trinket is a Tiny object (the DM determines the trinket\'s form or has you roll on the Trinkets table in the Player\'s Handbook to generate it). If you move more than 30 feet from a trinket, the trinket immediately teleports to you, appearing somewhere on your person. Using Soul Trinkets. You can use soul trinkets in the following ways: Death\'s Knell. When you deal Sneak Attack damage on your turn, you can destroy one soul trinket and immediately use Wails from the Grave without expending a use of that feature. Life Essence. While you have at least one soul trinket, you have Advantage on Death Saving Throws and Constitution saving throws. Spirit Query. You can take a Magic action to destroy one soul trinket and immediately cast the Augury spell, requiring no spell components and using Constitution as the spellcasting modifier. If you know the creature with which the trinket is associated, you can ask the creature\'s spirit one question instead of casting the spell. In this case, the spirit appears to you and answers as concisely as possible in a language it knew in life. Gaining Additional Soul Trinkets. When a creature you can see within 30 feet of you dies, you can take a Reaction to gain another soul trinket, claiming a sliver of that creature\'s departing spirit. The new trinket appears somewhere on your person. You can have a maximum of two soul trinkets at a time. If you try to gain a soul trinket while at your maximum, one of your existing trinkets is immediately destroyed and replaced by the new trinket. The maximum number of soul trinkets you can have increases when you reach Rogue levels 13 (three trinkets) and 17 (four trinkets). Whenever you finish a Long Rest with fewer than two soul trinkets, you gain soul trinkets until you have two.' },
        { level: 9, name: 'Voice of Death', description: 'You can cast Speak with Dead once without a spell slot, requiring no spell components and using Dexterity as the spellcasting modifier. You regain the ability to cast it this way when you finish a Short or Long Rest. When you cast the spell, you can target one of your soul trinkets from Tokens of the Departed instead of a corpse, allowing the spirit of the creature associated with the trinket to answer.' },
        { level: 13, name: 'Ghost Walk', description: 'As a Bonus Action, you assume a spectral form, gaining the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can\'t use it again until you finish a Long Rest unless you destroy one of your soul trinkets from Tokens of the Departed (no action required) to restore your use of it. Flight. You gain a Fly Speed of 10 feet and can hover. Hazy Form. Attack rolls have Disadvantage against you. Incorporeal Movement. You can move through creatures and objects as if they were Difficult Terrain, but you take 1d10 Force damage if you end your turn inside a creature or an object.' },
        { level: 17, name: 'Death\'s Friend', description: 'Your association with death has become so close that you gain the following benefits. Death\'s Lament. When you use Wails from the Grave, you can deal the feature\'s Necrotic damage to both the first and the second creature. Draw of Death. When you roll Initiative, you gain one soul trinket for your Tokens of the Departed if you have none remaining.' },
      ],
    },
    {
      id: 'scion-of-the-three',
      classId: 'rogue',
      name: 'Scion of the Three',
      description: 'Become a Gruesome Agent of Malice A Scion of the Three draws power from a group of malevolent gods known in Baldur\'s Gate as the Dead Three: Bane, a god of tyranny; Bhaal, a god of violence and murder; and Myrkul, a god of death. While some Rogues of this subclass pledge themselves ardently to those three macabre gods, others are thrust on this path by a curse. Either way, a scion\'s power manifests as various occult gifts, as well as an uncanny talent for striking and terrifying foes. Scions of the Three are most common in Baldur\'s Gate, where the Dead Three lived as mortals before ascending to godhood. Underground cults to Bane, Bhaal, and Myrkul often count Scions of the Three among their most useful agents. Outside Baldur\'s Gate, secular thieves\' guilds such as the Shadow Thieves of Amn or the Xanathar Guild in Waterdeep might call on a Scion of the Three to undertake an especially violent contract.',
      source: 'faerun',
      features: [
        { level: 3, name: 'Bloodthirst', description: 'When an enemy you can see within 30 feet of yourself takes damage and is Bloodied after taking that damage but not killed outright, you can take a Reaction and teleport to an unoccupied space you can see within 5 feet of that enemy. You can then make one melee attack. You can use this feature a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 3, name: 'Dread Allegiance', description: 'Choose one of the Dead Three: Bane, Bhaal, or Myrkul. You gain Resistance to one type of damage and the ability to cast a cantrip, as detailed in the table below; Intelligence is your spellcasting ability for this cantrip. When you finish a Long Rest, you can change your choice.' },
        { level: 9, name: 'Strike Fear', description: 'You gain the following Cunning Strike option. Terrify (Cost: 1d6). The target must succeed on a Wisdom saving throw, or it has the Frightened condition for 1 minute. While the target is Frightened in this way, you have Advantage on attack rolls against the target. The Frightened target repeats the save at the end of each of its turns, ending the effect on itself on a success.' },
        { level: 13, name: 'Aura of Malevolence', description: 'You radiate malignant power associated with one of the Dead Three. When you use Bloodthirst and teleport, each creature of your choice within 10 feet of either the space you left or your destination space (your choice) takes damage equal to your Intelligence modifier; the damage type is the same as the damage Resistance granted by your choice in the Dread Allegiance feature. Damage dealt by this feature ignores Resistance.' },
        { level: 17, name: 'Dread Incarnate', description: 'You gain the following benefits. Cutthroat. You regain one expended use of Bloodthirst when you finish a Short Rest. Murderous Intent. When you roll for your Sneak Attack damage, you can treat a roll of a 1 or 2 on the die as a 3.' },
      ],
    },
    {
      id: 'soulknife',
      classId: 'rogue',
      name: 'Soulknife',
      description: 'Strike Foes with Psionic Blades A Soulknife strikes with the mind, cutting through barriers both physical and psychic. These Rogues discover psionic power within themselves and channel it to do their roguish work. As a Soulknife your psionic abilities might have haunted you since childhood, revealing their full potential only as you experienced the stress of adventure. Or you might have sought out an order of psychic adepts and spent years learning how to manifest your power.',
      features: [
        { level: 3, name: 'Psionic Power', description: 'You harbor a wellspring of psionic energy within yourself. It is represented by your Psionic Energy Dice, which fuel certain powers you have from this subclass. The Soulknife Energy Dice table shows the number of these dice you have when you reach certain Rogue levels, and the table shows the die size. Any features in this subclass that use a Psionic Energy Die use only the dice from this subclass. Some of your powers expend a Psionic Energy Die, as specified in the power\'s description, and you can\'t use the power if it requires you to use a die when your Psionic Energy Dice are all expended. You regain one of your expended Psionic Energy Dice when you finish a Short Rest, and you regain all of them when you finish a Long Rest. Psi-Bolstered Knack. If you fail an ability check using a skill or tool with which you have proficiency, you can roll one Psionic Energy Die and add the number rolled to the check, potentially turning failure into success. The die is expended only if the roll then succeeds. Psychic Whispers. You can establish telepathic communication between yourself and others. As a Magic action, choose one or more creatures you can see, up to a number of creatures equal to your Proficiency Bonus, and then roll one Psionic Energy Die. For a number of hours equal to the number rolled, the chosen creatures can speak telepathically to you, and you can speak telepathically with them. To send or receive a message (no action required), you and the other creature must be within 1 mile of each other. A creature can end the telepathic connection at any time (no action required).' },
        { level: 3, name: 'Psychic Blades', description: 'You can manifest shimmering blades of psychic energy. Whenever you take the Attack action or make an Opportunity Attack, you can manifest a Psychic Blade in your free hand and make the attack with that blade. The magic blade has the following traits: Weapon Category: Simple Melee Damage on a Hit: 1d6 Psychic plus the ability modifier used for the attack roll Properties: Finesse, Thrown (range 60/120 feet) Mastery: Vex (you can use this property, and it doesn\'t count against the number of properties you can use with Weapon Mastery) The blade vanishes immediately after it hits or misses its target, and it leaves no mark if it deals damage. After you attack with the blade on your turn, you can make a melee or ranged attack with a second psychic blade as a Bonus Action on the same turn if your other hand is free to create it. The damage die of this bonus attack is 1d4 instead of 1d6.' },
        { level: 9, name: 'Soul Blades', description: 'You can now use the following powers with your Psychic Blades. Homing Strikes. If you make an attack roll with your Psychic Blade and miss the target, you can roll one Psionic Energy Die and add the number rolled to the attack roll. If this causes the attack to hit, the die is expended. Psychic Teleportation. As a Bonus Action, you manifest a Psychic Blade, expend one Psionic Energy Die and roll it, and throw the blade at an unoccupied space you can see up to a number of feet away equal to 10 times the number rolled. You then teleport to that space, and the blade vanishes.' },
        { level: 13, name: 'Psychic Veil', description: 'You can weave a veil of psychic static to mask yourself. As a Magic action, you gain the Invisible condition for 1 hour or until you dismiss the effect (no action required). This invisibility ends early immediately after you deal damage to a creature or you force a creature to make a saving throw. Once you use this feature, you can\'t do so again until you finish a Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it.' },
        { level: 17, name: 'Rend Mind', description: 'You can sweep your Psychic Blades through a creature\'s mind. When you use you Psychic Blades to deal Sneak Attack damage to a creature, you can force that target to make a Wisdom saving throw (DC 8 plus your Dexterity modifier and Proficiency Bonus). If the save fails, the target has the Stunned condition for 1 minute. The Stunned target repeats the save at the end of each of its turns, ending the effect on itself with a success. Once you use this feature, you can\'t do so again until you finish a Long Rest unless you expend three Psionic Energy Dice (no action required) to restore your use of it.' },
      ],
    },
    {
      id: 'thief',
      classId: 'rogue',
      name: 'Thief',
      description: 'Hunt for Treasure as a Classic Adventurer A mix of burglar, treasure hunter, and explorer, you are the epitome of an adventurer. In addition to improving your agility and stealth, you gain abilities useful for delving into ruins and getting maximum benefit from the magic items you find there.',
      features: [
        { level: 3, name: 'Fast Hands', description: 'As a Bonus Action, you can do one of the following. Sleight of Hand. Make a Dexterity (Sleight of Hand) check to pick a lock or disarm a trap with Thieves\' Tools or to pick a pocket. Use an Object. Take the Utilize action, or take the Magic action to use a magic item that requires that action.' },
        { level: 3, name: 'Second Story Work', description: 'You\'ve trained to get into especially hard-to-reach places, granting you these benefits. Climber. You gain a Climb Speed equal to your Speed. Jumper. You can determine your jump distance using your Dexterity rather than your Strength.' },
        { level: 9, name: 'Supreme Sneak', description: 'You gain the following Cunning Strike option. Stealth Attack (Cost: 1d6). If you have the Hide action\'s Invisible condition, this attack doesn\'t end that condition on you if you end the turn behind Three-Quarters Cover or Total Cover.' },
        { level: 13, name: 'Use Magic Device', description: 'You\'ve learned how to maximize use of magic items, granting you the following benefits. Attunement. You can attune to up to four magic items at once. Charges. Whenever you use a magic item property that expends charges, roll 1d6. On a roll of 6, you use the property without expending the charges. Scrolls. You can use any Spell Scroll, using Intelligence as your spellcasting ability for the spell. If the spell is a cantrip or a level 1 spell, you can cast it reliably. If the scroll contains a higher-level spell, you must first succeed on an Intelligence (Arcana) check (DC 10 plus the spell\'s level). On a successful check, you cast the spell from the scroll. On a failed check, the scroll disintegrates.' },
        { level: 17, name: 'Thief\'s Reflexes', description: 'You are adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal Initiative and your second turn at your Initiative minus 10.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'expertise',
        name: 'Expertise',
        description: 'You gain Expertise in two of your skill proficiencies of your choice. Sleight of Hand and Stealth are recommended if you have proficiency in them. At Rogue Level 6, you gain Expertise in two more of your skill proficiencies of your Choice.'
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
        id: 'sneak-attack',
        name: 'Sneak Attack',
        description: 'You know how to strike subtly and exploit a foe\'s distraction. Once per turn you can deal an extra 1d6 damage to one creature you hit with an attack roll if you have Advantage on the roll and the attack uses a Finesse or a Ranged weapon. The extra damage\'s type is the same as the weapon\'s type. You don\'t need Advantage on the attack roll if at least one of your allies is within 5 feet of the target, the ally doesn\'t have the Incapacitated condition and you don\'t have Disadvantage on the attack roll. The extra damage increases as you gain Rogue levels, as shown in the Sneak Attack column of the Rogue Features table.'
      },
      {
        id: 'thieves-cant',
        name: 'Thieves\' Cant',
        description: 'You picked up various languages in the communities where you plied your roguish talents. You know Thieves\' Cant and one other language of your choice, which you choose from the language tables in Chapter 2.'
      },
      {
        id: 'weapon-mastery',
        name: 'Weapon Mastery',
        description: 'Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency, such as Daggers and Shortbows. Whenever you finish a Long Rest, you can change the kinds of weapons you chose. For example, you could switch to using the mastery properties of Scimitars and Shortswords.'
      },
    ],
    2: [
      {
        id: 'cunning-action',
        name: 'Cunning Action',
        description: 'Your quick thinking and agility allow you to move and act quickly. On your turn, you can take one of the following actions as a Bonus Action: Dash, Disengage, or Hide.'
      },
    ],
    3: [
      {
        id: 'rogue-subclass',
        name: 'Rogue Subclass',
        description: 'You gain a Rogue subclass of your choice. The Arcane Trickster, Assassin, Soulknife, and the Thief subclasses are detailed after this class\'s description. A Subclass is a specialization that grants you features at certain Rogue levels. For the rest of your career, you gain each of your subclass\'s features that are of your Rogue level or lower.'
      },
      {
        id: 'steady-aim',
        name: 'Steady Aim',
        description: 'As a Bonus Action, you give yourself Advantage on your next attack roll on your current turn. You can use this feature only if you haven\'t moved during this turn, and after you use it, your Speed is 0 until the end of the current turn.'
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Rogue levels 8, 10, 12, and 16.'
      },
    ],
    5: [
      {
        id: 'cunning-strike',
        name: 'Cunning Strike',
        description: 'You\'ve developed cunning ways to use your Sneak Attack. When you deal Sneak Attack damage, you can add one of the following Cunning Strike effects. Each effect has a die cost, which is the number of Sneak Attack dice you must forgo to add the effect. You remove the die before rolling, and the effect occurs immediately after the attack\'s damage is dealt. For example, if you add the Poison effect, remove 1d6 from the Sneak Attack\'s damage before rolling. If a Cunning Strike requires a saving throw, the DC equals 8 plus your Dexterity modifier and Proficiency Bonus. Poison (Cost: 1d6). You add a toxin to your strike, forcing the target to make a Constitution saving throw. On a failed save, the target has the Poisoned condition for 1 minute. At the end of each of its turns, the poisoned target repeats the save, ending the effect on a success. To use this effect, you must have a Poisoner\'s Kit on your person. Trip (Cost: 1d6). If the target is Large or smaller, it must succeed on a Dexterity saving throw or have the Prone condition. Withdraw (Cost: 1d6). Immediately after the attack, you move up to half your speed without provoking Opportunity Attacks.'
      },
      {
        id: 'uncanny-dodge',
        name: 'Uncanny Dodge',
        description: 'When an attacker that you can see hits you with an attack roll, you can take a Reaction to halve the attack\'s damage against you (round down).'
      },
    ],
    7: [
      {
        id: 'evasion',
        name: 'Evasion',
        description: 'You can nimbly dodge out of the way of certain dangers. When you\'re subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. You can\'t use this feature if you have the Incapacitated condition.'
      },
      {
        id: 'reliable-talent',
        name: 'Reliable Talent',
        description: 'Whenever you make an ability check that uses one of your skill or tool proficiencies, you can treat a d20 roll of 9 or lower as a 10.'
      },
    ],
    11: [
      {
        id: 'improved-cunning-strike',
        name: 'Improved Cunning Strike',
        description: 'You can use up to two Cunning Strike effects when you deal Sneak Attack damage, paying the die cost for each effect.'
      },
    ],
    14: [
      {
        id: 'devious-strikes',
        name: 'Devious Strikes',
        description: 'You\'ve practiced new ways to use your Sneak Attack deviously. The following effects are now among your Cunning Strike options. Daze (Cost: 2d6). The target must succeed on a Constitution saving throw, or on its next turn, it can do only one of the following: move or take an action or a Bonus Action. Knock Out (Cost: 6d6). The target must succeed on a Constitution saving throw, or it has the Unconscious condition for 1 minute or until it takes any damage. The Unconscious target repeats the save at the end of its turns, ending the effect on itself on a success. Obscure (Cost: 3d6). The target must succeed on a Dexterity saving throw, or it has the Blinded condition until the end of its next turn.'
      },
    ],
    15: [
      {
        id: 'slippery-mind',
        name: 'Slippery Mind',
        description: 'Your mind is exceptionally difficult to control. You gain proficiency in Wisdom and Charisma saving throws.'
      },
    ],
    18: [
      {
        id: 'elusive',
        name: 'Elusive',
        description: 'You\'re so evasive that attackers rarely gain the upper hand against you. No attack roll can have advantage against you unless you have the Incapacitated condition.'
      },
    ],
    19: [
      {
        id: 'epic-boon',
        name: 'Epic Boon',
        description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of the Night Spirit is recommended.'
      },
    ],
    20: [
      {
        id: 'stroke-of-luck',
        name: 'Stroke of Luck',
        description: 'You have a marvelous knack for succeeding when you need to. If you fail a d20 Test, you can turn the roll into a 20. Once you use this feature, you can\'t use it again until you finish a Short or Long Rest.'
      },
    ],
  },
  weaponMastery: {
    featureLevel: 1,
    choiceCount: 2,
    pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'],
    extraPicksAtLevels: [4, 6, 10, 16],
  },
  multiclassGains: ['Light armor, Simple weapons, Hand crossbows, Longswords, Rapiers, Shortswords, Daggers (two)', 'Thieves\' tools, Expertise (two skills/thieves\' tools), Sneak Attack, Thieves\' Cant'],
  asiLevels: [4, 8, 10, 12, 16],
};