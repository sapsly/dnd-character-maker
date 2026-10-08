import type { ClassDef } from '../../types/character';

export const fighter: ClassDef = {
  id: 'fighter',
  name: 'Fighter',
  hitDie: 10,
  savingThrowProficiencies: ['str', 'con'],
  armorProficiencies: ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'],
  weaponProficiencies: ['Simple and Martial weapons'],
  toolProficiencies: [],
  skills: {
    granted: [],
    choices: ['acrobatics', 'animalHandling', 'athletics', 'history', 'insight', 'intimidation', 'persuasion', 'perception', 'survival'],
    choiceCount: 2,
  },
  subclassLevel: 3,
  subclasses: [
    {
      id: 'arcane-archer',
      classId: 'fighter',
      name: 'Arcane Archer',
      description: 'Deploy Magical Effects Through Enchanted Ammunition An Arcane Archer studies a unique elven method of archery that weaves magic into attacks to produce supernatural effects. Over the centuries, other folk have learned this technique and broadened it so it applies to ranged weapons of many kinds and to aspects of adventuring life outside of combat.',
      features: [
        { level: 3, name: 'Arcane Archer Lore', description: 'You learn magical theory and secrets of nature, granting you the following benefits. Cantrip. You know either the Druidcraft or the Prestidigitation cantrip. Intelligence is your spellcasting ability for it. Skills. You gain proficiency in the Arcana and Nature skills. If you already have one of these proficiencies, you instead gain proficiency in a different skill of your choice from the skills available to Fighters at level 1 (or in two skills available to Fighters at level 1 if you have both).' },
        { level: 3, name: 'Arcane Shot', description: 'You learn to unleash special magical effects with your shots. Arcane Shot Options. You learn two Arcane Shot options of your choice from the "Arcane Shot Options" section later in this subclass\'s description. You learn an additional Arcane Shot option of your choice when you reach Fighter levels 7, 10, 15, and 18. Each time you learn a new Arcane Shot option, you can also replace one option you know with a different one. Using Arcane Shot. Once per turn when you make a ranged attack using a weapon with the Ammunition property, you can apply one of your Arcane Shot options to that attack. You decide to use the option when you hit a creature and deal damage to it unless the option doesn\'t involve an attack roll. You can use this feature a number of times equal to your Intelligence modifier (minimum of once). You regain all expended uses when you finish a Short or Long Rest. Arcane Shot Die. Arcane Shot options refer to your Arcane Shot Die. Your Arcane Shot Die is a d6. Saving Throws. If an Arcane Shot option requires a saving throw, the DC equals 8 plus your Intelligence modifier and Proficiency Bonus. At Higher Levels. Your Arcane Shot Die changes when you reach certain Fighter levels. The die becomes a d8 at level 10, a d10 at level 15, and a d12 at level 18.' },
        { level: 7, name: 'Curving Shot', description: 'You learn how to direct an errant shot toward a new target. If you make a ranged attack roll with a weapon with the Ammunition property and miss, you can cause the shot to ricochet toward a new target as a Bonus Action immediately after the attack misses. The new target must be a creature you can see within the weapon\'s range and within 60 feet of the attack\'s original target. Make an attack roll against the new target.' },
        { level: 7, name: 'Magical Ammunition', description: 'You learn to imbue your ammunition with magical properties. As a Magic action, you can imbue a piece of nonmagical ammunition with one of the following magical properties and fire it at a solid surface you can see within the weapon\'s range. When the ammunition hits the surface, the ammunition\'s effect activates, and the ammunition attaches to the surface it hit for the duration of the effect; you can remove an attached piece of ammunition as a Magic action, ending the effect early. When the effect ends, the ammunition is destroyed. Once you use this feature, you can\'t do so again until you finish a Short or Long Rest. You can also restore your use of this feature by expending a use of your Second Wind (no action required). Darkening Ammunition. Magical shadows fill a 15-foot Emanation originating from the ammunition for 1 minute. Nonmagical flames in the Emanation are extinguished, and creatures in the Emanation have a −5 penalty to Wisdom (Perception) checks and Passive Perception. Unlocking Ammunition. A burst of magic fills a 15-foot Emanation originating from the ammunition. The ammunition also emits a loud knocking sound, audible up to 300 feet away. Any object in the Emanation that is held shut by a nonmagical lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If such an object has multiple locks, only one of them is unlocked. Vine Ammunition. A 120-foot-long vine grows from the ammunition. You and other creatures can then climb it. The vine withers away after 10 minutes.' },
        { level: 10, name: 'Ever-Ready Shot', description: 'When you roll Initiative, you can regain one expended use of Arcane Shot.' },
        { level: 15, name: 'Indomitable Teleport', description: 'Your magical mastery lets you escape dire situations. When you use your Indomitable feature and succeed on the saving throw, you can teleport up to 60 feet to an unoccupied space you can see.' },
        { level: 18, name: 'Masterful Shots', description: 'You employ agility in your sharpshooting. When a creature you can see misses you with an attack roll, you can take a Reaction to move up to half your Speed away from the attacker without provoking Opportunity Attacks. You can then make a ranged attack roll against the attacker as part of this Reaction if the attacker is within the weapon\'s range.' },
      ],
    },
    {
      id: 'banneret',
      classId: 'fighter',
      name: 'Banneret',
      description: 'Rally Fellow Heroes with Inspiring Leadership Bannerets are paragons of valor and leadership who protect the innocent and rally fellow adventurers to the causes of justice and freedom. Many are knights serving in Cormyr, the Silver Marches, Damara, Chessenta, or other lands across Faerûn. They wander the realms as knights errant, taking the fight against evil beyond their kingdom\'s borders. A Banneret relies on judgment, bravery, and fidelity to the code of chivalry to guide them in defeating evildoers. A lone Banneret is a skilled warrior, but when leading a band of allies one of these warriors can transform even a poorly equipped militia into a ferocious war band.',
      features: [
        { level: 3, name: 'Knightly Envoy', description: 'You know how to conduct yourself with grace as a noble ambassador. You gain the following benefits. Comprehension. You can cast the Comprehend Languages spell but only as a Ritual. Charisma is your spellcasting ability for it. Polyglot. You learn one language from the language tables in the Player\'s Handbook or chapter 2 of this book. When you finish a Long Rest, you can replace a language learned from this benefit with another language you have heard, seen signed, or read in the past 24 hours. Well Spoken. You gain proficiency in one of the following skills of your choice: Insight, Intimidation, Persuasion, or Performance.' },
        { level: 3, name: 'Group Recovery', description: 'When you use your Second Wind to regain Hit Points, you can choose a number of allies within a 30-foot Emanation originating from yourself, up to a number of allies equal to your Charisma modifier (minimum of one). Each of those allies regains Hit Points equal to 1d4 plus your Fighter level. Once you use this ability, you can\'t use it again until you finish a Short or Long Rest.' },
        { level: 7, name: 'Team Tactics', description: 'When you use Group Recovery, each chosen ally has Advantage on D20 Tests until the start of your next turn.' },
        { level: 10, name: 'Rallying Surge', description: 'When you use your Action Surge, you can choose allies within a 30-foot Emanation originating from yourself, up to a number of allies equal to your Charisma modifier (minimum of one). Each of those allies can immediately take a Reaction to use one of the following options. Attack. The ally makes one attack with a weapon or an Unarmed Strike. Move. The ally moves up to half its Speed without provoking Opportunity Attacks.' },
        { level: 15, name: 'Shared Resilience', description: 'When an ally you can see within 60 feet of yourself fails a saving throw, you can take a Reaction to expend a use of your Indomitable feature. The ally can immediately reroll the saving throw with a bonus equal to your Fighter level; the ally must use the new roll.' },
        { level: 18, name: 'Inspiring Commander', description: 'You gain the following benefits. Bolstered Rally. The area of effect for both Group Recovery and Rallying Surge is now a 60-foot Emanation. Unshakable Bravery. You have Immunity to the Charmed and Frightened conditions.' },
      ],
    },
    {
      id: 'battle-master',
      classId: 'fighter',
      name: 'Battle Master',
      description: 'Master Sophisticated Battle Maneuvers Battle Masters are students of the art of battle, learning martial techniques passed down through generations. The most accomplished Battle Masters are well-rounded figures who combine their carefully honed combat skills with academic study in the fields of history, theory, and the arts.',
      features: [
        { level: 3, name: 'Combat Superiority', description: 'Your experience on the battlefield has refined your fighting techniques. You learn maneuvers that are fueled by special dice called Superiority Dice. Maneuvers. You learn three maneuvers of your choice from the "Maneuver Options" section later in this subclass\'s description. Many maneuvers enhance an attack in some way. You can use only one maneuver per attack. You learn two additional maneuvers of your choice when you reach Fighter levels 7, 10, and 15. Each time you learn new maneuvers, you can also replace one maneuver you know with a different one. Superiority Dice. You have four Superiority Dice, which are d8s. A Superiority Die is expended when you use it. You regain all expended Superiority Dice when you finish a Short or Long Rest. You gain an additional Superiority Die when you reach Fighter levels 7 (five dice total) and 15 (six dice total). Saving Throws. If a maneuver requires a saving throw, the DC equals 8 plus your Strength or Dexterity modifier (your choice) and Proficiency Bonus.' },
        { level: 3, name: 'Student of War', description: 'You gain proficiency with one type of Artisan\'s Tools of your choice, and you gain proficiency in one skill of your choice from the skills available to Fighters at level 1.' },
        { level: 7, name: 'Know Your Enemy', description: 'As a Bonus Action, you can discern certain strengths and weaknesses of a creature you can see within 30 feet of yourself; you know whether that creature has any Immunities, Resistances, or Vulnerabilities, and if the creature has any, you know what they are. Once you use this feature, you can\'t do so again until you finish a Long Rest. You can also restore a use of the feature by expending one Superiority Die (no action required).' },
        { level: 10, name: 'Improved Combat Superiority', description: 'Your Superiority Die becomes a d10.' },
        { level: 15, name: 'Relentless', description: 'Once per turn, when you use a maneuver, you can roll 1d8 and use the number rolled instead of expending a Superiority Die.' },
        { level: 18, name: 'Ultimate Combat Superiority', description: 'Your Superiority Die becomes a d12.' },
      ],
    },
    {
      id: 'champion',
      classId: 'fighter',
      name: 'Champion',
      description: 'Pursue Physical Excellence in Combat A Champion focuses on the development of martial prowess in a relentless pursuit of victory. Champions combine rigorous training with physical excellence to deal devastating blows, withstand peril, and garner glory. Whether in athletic contests or bloody battle, Champions strive for the crown of the victor.',
      features: [
        { level: 3, name: 'Improved Critical', description: 'Your attack rolls with weapons and Unarmed Strikes can score a Critical Hit on a roll of 19 or 20 on the d20.' },
        { level: 3, name: 'Remarkable Athlete', description: 'Thanks to your athleticism, you have Advantage on Initiative rolls and Strength (Athletics) checks. In addition, immediately after you score a Critical Hit, you can move up to half your Speed without provoking Opportunity Attacks.' },
        { level: 7, name: 'Additional Fighting Style', description: 'You gain another Fighting Style feat of your choice.' },
        { level: 10, name: 'Heroic Warrior', description: 'The thrill of battle drives you toward victory. During combat, you can give yourself Heroic Inspiration whenever you start your turn without it.' },
        { level: 15, name: 'Superior Critical', description: 'Your attack rolls with weapons and Unarmed Strikes can now score a Critical Hit on a roll of 18-20 on the d20.' },
        { level: 18, name: 'Survivor', description: 'You attain the pinnacle of resilience in battle, giving you these benefits. Defy Death. You have Advantage on Death Saving Throws. Moreover, when you roll 18-20 on a Death Saving Throw, you gain the benefit of rolling a 20 on it. Heroic Rally. At the start of each of your turns, you regain Hit Points equal to 5 plus your Constitution modifier if you are Bloodied and have at least 1 Hit Point.' },
      ],
    },
    {
      id: 'eldritch-knight',
      classId: 'fighter',
      name: 'Eldritch Knight',
      description: 'Support Combat Skills with Arcane Magic Eldritch Knights combine the martial mastery common to all Fighters with a careful study of magic. Their spells both complement and extend their combat skills, providing additional protection to shore up their armor and also allowing them to engage many foes at once with explosive magic.',
      features: [
        { level: 3, name: 'Spellcasting', description: 'You have learned to cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules as an Eldritch Knight. Cantrips. You know two cantrips of your choice from the Wizard spell list (see that class\'s section for its list). Ray of Frost and Shocking Grasp are recommended. Whenever you gain a Fighter level, you can replace one of these cantrips with another cantrip of your choice from the Wizard spell list. When you reach Fighter level 10, you learn another Wizard cantrip of your choice. Spell Slots. The Eldritch Knight Spellcasting table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose three level 1 spells from the Wizard spell list. Burning Hands, Jump, and Shield are recommended. The number of spells on your list increases as you gain Fighter levels, as shown in the Prepared Spells column of the Eldritch Knight Spellcasting table. Whenever that number increases, choose additional spells from the Wizard spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 7 Fighter, your list of prepared spells can include five Wizard spells of levels 1 and 2 in any combination. Changing Your Prepared Spells. Whenever you gain a Fighter level, you can replace one spell on your list with another Wizard spell for which you have spell slots. Spellcasting Ability. Intelligence is your spellcasting ability for your Wizard spells. Spellcasting Focus. You can use an Arcane Focus as a Spellcasting Focus for your Wizard spells.' },
        { level: 3, name: 'War Bond', description: 'You learn a ritual that creates a magical bond between yourself and one weapon. You perform the ritual over the course of 1 hour, which can be done during a Short Rest. The weapon must be within your reach throughout the ritual, at the conclusion of which you touch the weapon and forge the bond. The bond fails if another Fighter is bonded to the weapon or if the weapon is a magic item to which someone else is attuned. Once you have bonded a weapon to yourself, you can\'t be disarmed of that weapon unless you have the Incapacitated condition. If it is on the same plane of existence, you can summon that weapon as a Bonus Action, causing it to teleport instantly to your hand. You can have up to two bonded weapons, but you can summon only one at a time with a Bonus Action. If you attempt to bond with a third weapon, you must break the bond with one of the other two.' },
        { level: 7, name: 'War Magic', description: 'When you take the Attack action on your turn, you can replace one of the attacks with a casting of one of your Wizard cantrips that has a casting time of an action.' },
        { level: 10, name: 'Eldritch Strike', description: 'You learn how to make your weapon strikes undercut a creature\'s ability to withstand your spells. When you hit a creature with an attack using a weapon, that creature has Disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.' },
        { level: 15, name: 'Arcane Charge', description: 'When you use your Action Surge, you can teleport up to 30 feet to an unoccupied space you can see. You can teleport before or after the additional action.' },
        { level: 18, name: 'Improved War Magic', description: 'When you take the Attack action on your turn, you can replace two of the attacks with a casting of one of your level 1 or level 2 Wizard spells that has a casting time of an action.' },
      ],
    },
    {
      id: 'psi-warrior',
      classId: 'fighter',
      name: 'Psi Warrior',
      description: 'Augment Physical Might with Psionic Power Psi Warriors awaken the power of their minds to augment their physical might. They harness this psionic power to infuse their weapon strikes, lash out with telekinetic energy, and create barriers of mental force.',
      features: [
        { level: 3, name: 'Psionic Power', description: 'You harbor a wellspring of psionic energy within yourself. It is represented by your Psionic Energy Dice, which fuel powers you have from this subclass. The Psi Warrior Energy Dice table shows the die size and number of these dice you have when you reach certain Fighter levels. Any features in this subclass that use a Psionic Energy Die use only the dice from this subclass. Some of your powers expend the Psionic Energy Die, as specified in a power\'s description, and you can\'t use a power if it requires you to use a die when all your Psionic Energy Dice are expended. You regain one of your expended Psionic Energy Dice when you finish a Short Rest, and you regain all of them when you finish a Long Rest. Protective Field. When you or another creature you can see within 30 feet of you takes damage, you can take a Reaction to expend one Psionic Energy Die, roll the die, and reduce the damage taken by the number rolled plus your Intelligence modifier (minimum reduction of 1), as you create a momentary shield of telekinetic force. Psionic Strike. You can propel your weapons with psionic force. Once on each of your turns, immediately after you hit a target within 30 feet of yourself with an attack and deal damage to it with a weapon, you can expend one Psionic Energy Die, rolling it and dealing Force damage to the target equal to the number rolled plus your Intelligence modifier. Telekinetic Movement. You can move an object or a creature with your mind. As a Magic action, choose one target you can see within 30 feet of yourself; the target must be a loose object that is Large or smaller or one willing creature other than you. You transport the target up to 30 feet to an unoccupied space you can see. Alternatively, if the target is a Tiny object, you can transport it to or from your hand. Once you take this action, you can\'t do so again until you finish a Short or Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it.' },
        { level: 7, name: 'Telekinetic Adept', description: 'You have mastered new ways to use your telekinetic abilities, detailed below. Psi-Powered Leap. As a Bonus Action, you gain a Fly Speed equal to twice your Speed until the end of the current turn. Once you take this Bonus Action, you can\'t do so again until you finish a Short or Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it. Telekinetic Thrust. When you deal damage to a target with your Psionic Strike, you can force the target to make a Strength saving throw (DC 8 plus your Intelligence modifier and Proficiency Bonus). On a failed save, you can give the target the Prone condition or transport it up to 10 feet horizontally.' },
        { level: 10, name: 'Guarded Mind', description: 'You have Resistance to Psychic damage. Moreover, if you start your turn with the Charmed or Frightened condition, you can expend a Psionic Energy Die (no action required) and end every effect on yourself giving you those conditions.' },
        { level: 15, name: 'Bulwark of Force', description: 'You can shield yourself and others with telekinetic force. As a Bonus Action, you can choose creatures, including yourself, within 30 feet of yourself, up to a number of creatures equal to your Intelligence modifier (minimum of one creature). Each of the chosen creatures has Half Cover for 1 minute or until you have the Incapacitated condition. Once you use this feature, you can\'t do so again until you finish a Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it.' },
        { level: 18, name: 'Telekinetic Master', description: 'You always have the telekinesis spell prepared. With this feature, you can cast it without a spell slot or components, and your spellcasting ability for it is Intelligence. On each of your turns while you maintain Concentration on it, including the turn when you cast it, you can make one attack with a weapon as a Bonus Action. Once you cast the spell with this feature, you can\'t do so in this way again until you finish a Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it.' },
      ],
    },
    {
      id: 'sorrow-knight',
      classId: 'fighter',
      name: 'Sorrow Knight',
      description: 'Channel Despair and Darkness to Protect Others Sorrow knights suffuse their opponents with grief and misery from the gloomy plane called the Shadowfell. These fighters harness their past despair to forge a connection with others and protect themselves. A sorrow knight\'s intense loss - whether the loss of love, faith, or something equally profound - is the weapon they wield against their foes and their motivator to ensure that no one experiences that same pain.',
      features: [
        { level: 3, name: 'Despairing Strikes', description: 'Each sorrow knight bears an emotional wound like a deep scar, through which they channel despair against their enemies. This misery is fueled by special dice called Despairing Strike Dice. The Despairing Strike Dice table shows the die size and number of these dice you have when you reach certain Fighter levels. A Despairing Strike Die is expended when you use it. You regain all expended Despairing Strike Dice when you finish a Short or Long Rest. Despairing Strike Dice When you hit a creature with an attack roll using a weapon, you can expend a Despairing Strike Die and roll that die. You deal additional Psychic damage equal to the roll and can also add one of the following effects. You can\'t expend more than one die per attack. If a Despairing Strike effect requires a saving throw, the DC equals 8 plus your Wisdom modifier and Proficiency Bonus. Abandoned. The target must succeed on an Intelligence saving throw or have the Deafened condition until the end of your next turn. While Deafened, the target regards all creatures it can see as enemies until the end of your next turn. Dread. The target has Disadvantage on the next saving throw it makes before the start of your next turn.' },
        { level: 3, name: 'Solemn Gaze', description: 'You can see through the darkness around you and recognize the darkness in others. You gain the following benefits. Darkvision. You gain Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet. Empathetic Inquiry. As a Magic action, you can attempt to search the mind of a creature you can see within 30 feet. The target must succeed on a Wisdom saving throw (DC equals 8 plus your Wisdom modifier and Proficiency Bonus) or you learn an emotion that looms large in its mind, such as a worry, love, or hate. If the target can see you, it knows you have read its emotions. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Long Rest.' },
        { level: 7, name: 'Dreaded Appearance', description: 'When you use Tactical Shift, you can teleport to an unoccupied space you can see within 30 feet of yourself instead of moving. Immediately after you reappear, you can briefly take on the appearance of creatures\' fears, visible only to those creatures. Each creature of your choice within a 10-foot Emanation originating from you makes a Wisdom saving throw (DC equals 8 plus your Wisdom modifier and your Proficiency Bonus). On a failed save, a target takes Psychic damage equal to a roll of your Despairing Strike die and has the Frightened condition until the end of your next turn. On a successful save, it takes half damage only. Once you take on this appearance, you can\'t do so again until you finish a Short or Long Rest.' },
        { level: 10, name: 'Unsettled Strikes', description: 'You further channel the pathos of the Shadowfell through your fighting abilities. The following effects are now among your Despairing Strike options. Apathetic. The target must succeed on a Wisdom saving throw or have the Incapacitated condition until the start of your next turn. While Incapacitated in this way, the target can give only one-word responses when spoken to. Lost. The target makes a Charisma saving throw. On a failed save, the target has the Blinded condition, and its Speed is reduced to 0 until the end of its next turn. On a successful save, the target\'s Speed is halved until the end of its next turn. Weary. The target must succeed on a Constitution saving throw or gain 1 Exhaustion level. This effect can\'t increase the target\'s Exhaustion level above 2. Exhaustion levels gained from this effect are removed at the end of your next turn.' },
        { level: 15, name: 'Grim Constitution', description: 'You have Resistance to Necrotic and Psychic damage. In addition, when you are subjected to an effect that reduces your Hit Point maximum, you can make a DC 15 Constitution saving throw. If you succeed, your Hit Point maximum isn\'t decreased. Each time you make this Constitution saving throw after the first, the DC increases by 5. When you finish a Short or Long Rest, the DC resets to 15.' },
        { level: 18, name: 'Grieving Mantle', description: 'When you use your Action Surge, you attune yourself to the Shadowfell for 1 minute or until you have the Incapacitated condition. For the duration, you gain the following benefits. Shade Form. When you are hit by an attack roll, you can take a Reaction to become insubstantial for a moment and reduce the attack\'s total damage against you to 0. Unwavering Resolve. You have Immunity to the Charmed and Frightened conditions. If you\'re Charmed or Frightened when you activate your Grieving Mantle, the condition ends on you.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'fighting-style',
        name: 'Fighting Style',
        description: 'You gain a Fighting Style feat of your choice (see chapter 5). Defense is recommended. Whenever you gain a Fighter level, you can replace the feat you chose with a different Fighting Style feat.'
        ,
        options: [
          { id: 'archery', name: 'Archery', description: 'You gain a +2 bonus to attack rolls with ranged weapons.' },
          { id: 'blind-fighting', name: 'Blind Fighting', description: 'You have blindsight with a range of 10 feet.' },
          { id: 'defense', name: 'Defense', description: 'While wearing armor, you gain a +1 bonus to AC.' },
          { id: 'dueling', name: 'Dueling', description: 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
          { id: 'great-weapon-fighting', name: 'Great Weapon Fighting', description: 'When you roll a 1 or 2 on a damage die for a two-handed or versatile melee weapon attack, reroll the die and use the new roll.' },
          { id: 'interception', name: 'Interception', description: 'When a creature you can see hits a target within 10 ft of you, you can use your reaction to reduce the damage by 1d10 + proficiency (min 0). Must wield shield or simple/martial weapon.' },
          { id: 'protection', name: 'Protection', description: 'When a creature you can see attacks a target within 5 ft of you, you can use your reaction to impose disadvantage on the attack. Must wield a shield.' },
          { id: 'superior-technique', name: 'Superior Technique', description: 'Learn one Battle Master maneuver. You have 1 superiority die (d6) that refreshes on a short/long rest.' },
          { id: 'thrown-weapon-fighting', name: 'Thrown Weapon Fighting', description: 'You can draw a weapon with the Thrown property as part of the attack. You gain a +2 bonus to damage rolls with ranged weapon attacks using thrown weapons.' },
          { id: 'two-weapon-fighting', name: 'Two Weapon Fighting', description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the off-hand attack.' },
          { id: 'unarmed-fighting', name: 'Unarmed Fighting', description: 'Your unarmed strikes deal 1d6 + Str. If you have two hands free, they deal 1d8.' },
        ],
        optionCount: 2,
      },
      {
        id: 'second-wind',
        name: 'Second Wind',
        description: 'You have a limited well of physical and mental stamina that you can draw on. As a Bonus Action, you can use it to regain Hit Points equal to 1d10 plus your Fighter level. You can use this feature twice. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. When you reach certain Fighter levels, you gain more uses of this feature, as shown in the Second Wind column of the Fighter Features table.'
      },
      {
        id: 'weapon-mastery',
        name: 'Weapon Mastery',
        description: 'Your training with weapons allows you to use the mastery properties of three kinds of Simple or Martial weapons of your choice. Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices. When you reach certain Fighter levels, you gain the ability to use the mastery properties of more kinds of weapons, as shown in the Weapon Mastery column of the Fighter Features table.'
      },
    ],
    2: [
      {
        id: 'action-surge',
        name: 'Action Surge',
        description: 'You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action, except the Magic action. Once you use this feature, you can\'t do so again until you finish a Short or Long Rest. Starting at level 17, you can use it twice before a rest but only once on a turn.'
      },
      {
        id: 'tactical-mind',
        name: 'Tactical Mind',
        description: 'You have a mind for tactics on and off the battlefield. When you fail an ability check, you can expend a use of your Second Wind to push yourself toward success. Rather than regaining Hit Points, you roll 1d10 and add the number rolled to the ability check, potentially turning it into a success. If the check still fails, this use of Second Wind isn\'t expended.'
      },
    ],
    3: [
      {
        id: 'fighter-subclass',
        name: 'Fighter Subclass',
        description: 'You gain a Fighter subclass of your choice. The Arcane Archer, Banneret, Battle Master, Champion, Eldritch Knight, Psi Warrior, and Sorrow Knight subclasses are detailed after this class\'s description. A subclass is a specialization that grants you features at certain Fighter levels. For the rest of your career, you gain each of your subclass\'s features that are of your Fighter level or lower.'
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Fighter levels 6, 8, 12, 14, and 16.'
      },
    ],
    5: [
      {
        id: 'extra-attack',
        name: 'Extra Attack',
        description: 'You can attack twice instead of once whenever you take the Attack action on your turn.'
      },
      {
        id: 'tactical-shift',
        name: 'Tactical Shift',
        description: 'Whenever you activate your Second Wind with a Bonus Action, you can move up to half your Speed without provoking Opportunity Attacks.'
      },
    ],
    9: [
      {
        id: 'indomitable',
        name: 'Indomitable',
        description: 'If you fail a saving throw, you can reroll it with a bonus equal to your Fighter level. You must use the new roll, and you can\'t use this feature again until you finish a Long Rest. You can use this feature twice before a Long Rest starting at level 13 and three times before a Long Rest starting at level 17.'
      },
      {
        id: 'tactical-master',
        name: 'Tactical Master',
        description: 'When you attack with a weapon whose mastery property you can use, you can replace that property with the Push, Sap, or Slow property for that attack.'
      },
    ],
    11: [
      {
        id: 'two-extra-attacks',
        name: 'Two Extra Attacks',
        description: 'You can attack three times instead of once whenever you take the Attack action on your turn.'
      },
    ],
    13: [
      {
        id: 'studied-attacks',
        name: 'Studied Attacks',
        description: 'You study your opponents and learn from each attack you make. If you make an attack roll against a creature and miss, you have Advantage on your next attack roll against that creature before the end of your next turn.'
      },
    ],
    19: [
      {
        id: 'epic-boon',
        name: 'Epic Boon',
        description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Combat Prowess is recommended.'
      },
    ],
    20: [
      {
        id: 'three-extra-attacks',
        name: 'Three Extra Attacks',
        description: 'You can attack four times instead of once whenever you take the Attack action on your turn.'
      },
    ],
  },
  weaponMastery: {
    featureLevel: 1,
    choiceCount: 3,
    pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'],
    extraPicksAtLevels: [4, 10, 16],
  },
  multiclassGains: ['Light armor, Medium armor, Heavy armor, Shields', 'Simple weapons, Martial weapons', 'One skill from the Fighter list'],
  asiLevels: [4, 6, 8, 12, 14, 16],
};