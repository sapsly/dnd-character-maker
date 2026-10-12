import type { ClassDef } from '../../types/character';

export const wizard: ClassDef = {
  id: 'wizard',
  name: 'Wizard',
  hitDie: 6,
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: ['Simple weapons'],
  toolProficiencies: [],
  skills: {
    granted: [],
    choices: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'nature', 'religion'],
    choiceCount: 2,
  },
  spellcasting: {
    ability: 'int',
    cantripsMode: 'known',
    cantripCountByLevel: {1: 3, 2: 3, 3: 3, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5},
    spellsMode: 'prepared',
    spellCountByLevel: {1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 18, 15: 19, 16: 21, 17: 22, 18: 23, 19: 24, 20: 25},
    slotTable: {1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1], 15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1], 18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1]},
  },
  subclassLevel: 3,
  subclasses: [
    {
      id: 'abjurer',
      classId: 'wizard',
      name: 'Abjurer',
      description: 'Shield Companions and Banish Foes Your study of magic is focused on spells that block, banish, or protect-ending harmful effects, banishing evil influences, and protecting the weak. Abjurers are sought when baleful spirits require exorcism, when locations must be guarded against magical spying, and when portals to other planes of existence must be closed. Adventuring parties value Abjurers for the protection they provide against a variety of hostile magic and other attacks.',
      features: [
        { level: 3, name: 'Abjuration Savant', description: 'Choose two Wizard spells from the Abjuration school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Abjuration school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.' },
        { level: 3, name: 'Arcane ward', description: 'You can weave magic around yourself for protection. When you cast an Abjuration spell with a spell slot, you can simultaneously use a strand of the spell\'s magic to create a magical ward on yourself that lasts until you finish a Long Rest. The ward has a Hit Point maximum equal to twice your Wizard level plus your Intelligence modifier. Whenever you take damage, the ward takes the damage instead, and if you have any Resistances or Vulnerabilities, apply them before reducing the ward\'s Hit Points. If the damage reduces the ward to 0 Hit Points, you take any remaining damage. While the ward has 0 Hit Points, it can\'t absorb damage, but its magic remains. Whenever you cast an Abjuration spell with a spell slot, the ward regains a number of Hit Points equal to twice the level of the spell slot. Alternatively, as a Bonus Action, you can expend a spell slot, and the ward regains a number of Hit Points equal to twice the level of the spell slot expended. Once you create the ward, you can\'t create it again until you finish a Long Rest.' },
        { level: 6, name: 'Projected Ward', description: 'When a creature that you can see within 30 feet of yourself takes damage, you can take a Reaction to cause your Arcane Ward to absorb that damage. If this damage reduces the ward to 0 Hit Points, the warded creature takes any remaining damage. If that creature has any Resistances or Vulnerabilities, apply them before reducing the ward\'s Hit Points.' },
        { level: 10, name: 'Spell Breaker', description: 'You always have the Counterspell and Dispel Magic spells prepared. In addition, you can cast Dispel Magic as a Bonus Action, and you can add your Proficiency Bonus to its ability check. When you cast either spell with a spell slot, that slot isn\'t expended if the spell fails to stop a spell.' },
        { level: 14, name: 'Spell Resistance', description: 'You have Advantage on saving throws against spells, and you have Resistance to the damage of spells.' },
      ],
    },
    {
      id: 'bladesinger',
      classId: 'wizard',
      name: 'Bladesinger',
      description: 'Wield Weapon and Wizardry in Elegant Tandem Bladesingers master a tradition of wizardry that incorporates swordplay and dance. In combat, a Bladesinger uses intricate, elegant maneuvers that fend off harm and allow the Bladesinger to channel magic into devastating attacks and a cunning defense. Many who have observed a Bladesinger at work remember the display as one of the more beautiful experiences in their life-a glorious dance accompanied by a singing blade. Bladesinging is associated with the ancient elven societies that first mastered the art and coined the term. Even today, most Bladesingers still hail from old elven realms, such as Myth Drannor, or from non-elven societies that share land and history with elves, such as the Silver Marches. Wherever they hail from, Bladesingers take their talents all across the Realms to help common people and perform heroic deeds. Most communities greet the arrival of a Bladesinger as a good omen.',
      source: 'faerun',
      features: [
        { level: 3, name: 'Bladesong', description: 'As a Bonus Action, you invoke an elven magic called the Bladesong, provided you aren\'t wearing armor or using a Shield. The Bladesong lasts for 1 minute and ends early if you have the Incapacitated condition, if you don armor or a Shield, or if you use two hands to make an attack with a weapon. You can dismiss the Bladesong at any time (no action required). While the Bladesong is active, you gain the following benefits. You can invoke the Bladesong a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. You regain one expended use when you use Arcane Recovery. Agility. You gain a bonus to your AC equal to your Intelligence modifier (minimum of +1), and your Speed increases by 10 feet. In addition, you have Advantage on Dexterity (Acrobatics) checks. Bladework. Whenever you attack with a weapon with which you have proficiency, you can use your Intelligence modifier for the attack and damage rolls instead of using Strength or Dexterity. Focus. When you make a Constitution saving throw to maintain Concentration, you can add your Intelligence modifier to the total.' },
        { level: 3, name: 'Training in War and Song', description: 'You gain proficiency with all Melee Martial weapons that don\'t have the Two-Handed or Heavy property. You can use a Melee weapon with which you have proficiency as a Spellcasting Focus for your Wizard spells. You also gain proficiency in one of the following skills of your choice: Acrobatics, Athletics, Performance, or Persuasion.' },
        { level: 6, name: 'Extra Attack', description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn. Moreover, you can cast one of your Wizard cantrips that has a casting time of an action in place of one of those attacks.' },
        { level: 10, name: 'Song of Defense', description: 'When you take damage while your Bladesong is active, you can take a Reaction to expend one spell slot and reduce the damage taken by an amount equal to five times the spell slot\'s level.' },
        { level: 14, name: 'Song of Victory', description: 'After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.' },
      ],
    },
    {
      id: 'conjurer',
      classId: 'wizard',
      name: 'Conjurer',
      description: 'Step Across Space and Call Creatures from Thin Air A Conjurer considers distance and matter to be flexible guidelines rather than physical laws. Conjurers master magic that moves creatures instantly through space and summons creatures to fight on their behalf.',
      features: [
        { level: 3, name: 'Benign Transposition', description: 'As a Bonus Action, you teleport up to 30 feet to an unoccupied space that you can see. Alternatively, you can choose a space within range that is occupied by a Medium or smaller creature. If that creature is willing, you both teleport, swapping places. You can use this feature a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 3, name: 'Conjuration Savant', description: 'Choose two Wizard spells from the Conjuration school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Conjuration school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.' },
        { level: 6, name: 'Distant Transposition', description: 'The range of your Benign Transposition feature increases to 60 feet. Additionally, you can restore one use of it by expending a level 3+ spell slot (no action required).' },
        { level: 6, name: 'Durable Summons', description: 'When you cast a Conjuration spell to summon or create a creature using a spell slot, that creature gains Temporary Hit Points equal to twice your Wizard level when it first appears. While it has these Temporary Hit Points, the creature has Resistance to every damage type except Force, Necrotic, Psychic, and Radiant.' },
        { level: 10, name: 'Focused Conjuration', description: 'Taking damage can\'t break your Concentration on Conjuration spells.' },
        { level: 14, name: 'Splintered Summons', description: 'When you use a spell slot to cast a Conjuration spell that summons a spirit whose stat block is included in the spell description, such as Summon Aberration, you can modify the spell to summon two creatures with the spell instead of one. Each creature is of the same kind, uses the stat block and rules denoted by the spell, and manifests in a different unoccupied space of your choice within the spell\'s range, but the summoned creatures\' Hit Point maximums and current Hit Points are halved. If you lose Concentration on the spell, both creatures disappear. Once you use this feature to modify a spell in this way, you must finish a Long Rest before you can do so again. You can also restore your use of it by expending a level 5+ spell slot (no action required).' },
      ],
    },
    {
      id: 'diviner',
      classId: 'wizard',
      name: 'Diviner',
      description: 'Learn the Secrets of the Multiverse The counsel of a Diviner is sought by those who want a clearer understanding of the past, present, and future. As a Diviner, you strive to part the veils of space, time, and consciousness. You work to master spells of discernment, remote viewing, supernatural knowledge, and foresight.',
      features: [
        { level: 3, name: 'Divination Savant', description: 'Choose two Wizard spells from the Divination school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Divination school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.' },
        { level: 3, name: 'Portent', description: 'Glimpses of the future begin to press on your awareness. Whenever you finish a Long Rest, roll two d20s and record the numbers rolled. You can replace any D20 Test made by you or a creature that you can see with one of these foretelling rolls. You must choose to do so before the roll, and you can replace a roll in this way only once per turn. Each foretelling roll can be used only once. When you finish a Long Rest, you lose any unused foretelling rolls.' },
        { level: 6, name: 'Expert Divination', description: 'Casting Divination spells comes so easily to you that it expends only a fraction of your spellcasting efforts. When you cast a Divination spell using a level 2+ spell slot, you regain one expended spell slot. The slot you regain must be of a level lower than the slot you expended and can\'t be higher than level 5.' },
        { level: 10, name: 'The Third Eye', description: 'You can increase your powers of perception. As a Bonus Action, choose one of the following benefits, which lasts until you start a Short or Long Rest. You can\'t use this feature again until you finish a Short or Long Rest. Darkvision. You gain Darkvision with a range of 120 feet. Greater Comprehension. You can read any language. See Invisibility. You can cast See Invisibility without expending a spell slot.' },
        { level: 14, name: 'Greater Portent', description: 'The visions in your dreams intensify and paint a more accurate picture in your mind of what is to come. Roll three d20s for your Portent feature rather than two.' },
      ],
    },
    {
      id: 'enchanter',
      classId: 'wizard',
      name: 'Enchanter',
      description: 'Entrance and Beguile Others An Enchanter\'s magic clouds or captivates minds. Some Enchanters use their abilities to encourage peace and soften cruelty, while others use their mind-altering magic for selfish ends.',
      features: [
        { level: 3, name: 'Enchanting Conversationalist', description: 'You gain proficiency in one of the following skills of your choice: Deception, Intimidation, or Persuasion. In addition, when you make an ability check with the chosen skill, you gain a bonus to the check equal to your Intelligence modifier (minimum of +1).' },
        { level: 3, name: 'Enchantment Savant', description: 'Choose two Wizard spells from the Enchantment school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Enchantment school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.' },
        { level: 3, name: 'Hypnotic Presence', description: 'Your charming words and enchanting gaze can enthrall another creature. As a Magic action, choose one creature that you can see within 10 feet of yourself. If the target can see or hear you, it must succeed on a Wisdom saving throw against your spell save DC or have the Charmed condition for 1 minute or until the target is more than 10 feet away from you, the target can neither see nor hear you, or the target takes damage. While Charmed, the target has the Incapacitated condition and a Speed of 0. You can use this feature a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 6, name: 'Split Enchantment', description: 'When you use a spell slot to cast an Enchantment spell, such as Charm Person, that can be cast with a higher-level spell slot to target an additional creature, you can increase the spell\'s effective level by 1. You can use this feature a number of times equal to your Intelligence modifier, and you regain all expended uses when you finish a Long Rest.' },
        { level: 10, name: 'Instinctive Charm', description: 'When a creature within 30 feet of you that you can see hits you with an attack roll, you can take a Reaction to force the attacker to make a Wisdom saving throw against your spell save DC. On a failed save, the attack misses instead, and if there is another creature within range of the attack other than the attacker, the attacker targets that creature with the triggering attack, using the same attack roll. If multiple creatures are within the attack\'s range, you choose which one to target. Once you take this Reaction, you can\'t do so again until you finish a Long Rest. You can also restore your use of it by casting an Enchantment spell with a spell slot.' },
        { level: 14, name: 'Alter Memories', description: 'You can make a creature unaware of your magical influence. When you cast an Enchantment spell that imposes the Charmed condition using a spell slot, you can choose one creature targeted by the spell. That creature remains unaware of being Charmed by you. In addition, once before the spell ends, you can take a Magic action to force the chosen creature to make an Intelligence saving throw against your spell save DC. On a failed save, you can make the creature lose a number of hours of its memories equal to 1 plus your Intelligence modifier (minimum of 1 hour lost). You can make the creature forget less time, and the amount of time can\'t exceed the duration of your Enchantment spell.' },
      ],
    },
    {
      id: 'evoker',
      classId: 'wizard',
      name: 'Evoker',
      description: 'Create Explosive Elemental Effects Your studies focus on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid. Some Evokers find employment in military forces, serving as artillery to blast armies from afar. Others use their power to protect others, while some seek their own gain.',
      features: [
        { level: 3, name: 'Evocation Savant', description: 'Choose two Wizard spells from the Evocation school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Evocation school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.' },
        { level: 3, name: 'Potent Cantrip', description: 'Your damaging cantrips affect even creatures that avoid the brunt of the effect. When you cast a cantrip at a creature and you miss with the attack roll or the target succeeds on a saving throw against the cantrip, the target takes half the cantrip\'s damage (if any) but suffers no additional effect from the cantrip.' },
        { level: 6, name: 'Sculpt Spells', description: 'You can create pockets of relative safety within the effects of your evocations. When you cast an Evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 plus the spell\'s level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.' },
        { level: 10, name: 'Empowered Evocation', description: 'Whenever you cast a Wizard spell from the Evocation school, you can add your Intelligence modifier to one damage roll of that spell.' },
        { level: 14, name: 'Overchannel', description: 'You can increase the power of your spells. When you cast a Wizard spell with a spell slot of levels 1-5 that deals damage, you can deal maximum damage with that spell on the turn you cast it. The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a Long Rest, you take 2d12 Necrotic damage for each level of the spell slot immediately after you cast it. This damage ignores Resistance and Immunity. Each time you use this feature again before finishing a Long Rest, the Necrotic damage per spell level increases by 1d12.' },
      ],
    },
    {
      id: 'illusionist',
      classId: 'wizard',
      name: 'Illusionist',
      description: 'Weave Subtle Spells of Deception You specialize in magic that dazzles the senses and tricks the mind, and the illusions you craft make the impossible seem real.',
      features: [
        { level: 3, name: 'Illusion Savant', description: 'Choose two Wizard spells from the Illusion school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Illusion school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.' },
        { level: 3, name: 'Improved Illusions', description: 'You can cast Illusion spells without providing Verbal components, and if an Illusion spell you cast has a range of 10+ feet, the range increases by 60 feet. You also know the Minor Illusion cantrip. If you already know it, you learn a different Wizard cantrip of your choice. The cantrip doesn\'t count against your number of cantrips known. You can create both a sound and an image with a single casting of Minor Illusion, and you can cast it as a Bonus Action.' },
        { level: 6, name: 'Phantasmal Creatures', description: 'You always have the Summon Beast and Summon Fey spells prepared. Whenever you cast either spell, you can change its school to Illusion, which causes the summoned creature to appear spectral. You can cast the Illusion version of each spell without expending a spell slot, but casting it without a slot halves the creature\'s Hit Points. Once you cast either spell without a spell slot, you must finish a Long Rest before you can cast the spell in that way again.' },
        { level: 10, name: 'Illusory Self', description: 'When a creature hits you with an attack roll, you can take a Reaction to interpose an illusory duplicate of yourself between the attacker and yourself. The attack automatically misses you, then the illusion dissipates. Once you use this feature, you can\'t use it again until you finish a Short or Long Rest. You can also restore your use of it by expending a level 2+ spell slot (no action required).' },
        { level: 14, name: 'Illusory Reality', description: 'You have learned to weave shadow magic into your illusions to give them a semi-reality. When you cast an Illusion spell with a spell slot, you can choose one inanimate, nonmagical object that is part of the illusion and make that object real. You can do this on your turn as a Bonus Action while the spell is ongoing. The object remains real for 1 minute, during which it can\'t deal damage or give any conditions. For example, you can create an illusion of a bridge over a chasm and then make it real and cross it.' },
      ],
    },
    {
      id: 'necromancer',
      classId: 'wizard',
      name: 'Necromancer',
      description: 'Command the Powers of Death and Undeath You explore the forces of life, death, and undeath. As a necromancer, you learn to manipulate the energy that animates all creatures, and you draw increasing power from the forbidden secrets in your spellbook. Though many see Necromancers as menacing or villainous, not all Necromancers are evil.',
      features: [
        { level: 3, name: 'Necromancy Savant', description: 'Choose two Wizard spells from the Necromancy school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Necromancy school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.' },
        { level: 3, name: 'Necromancy Spellbook', description: 'Your spellbook\'s necromantic secrets grant you additional powers. You gain the following benefits. Necrotic Resistance. You have Resistance to Necrotic damage. Undead Familiar. The Find Familiar spell appears in your spellbook. When you cast the spell, you choose one of the normal forms for your familiar or one of the following special forms: Skeleton or Zombie (see appendix B of the Player\'s Handbook for the familiar\'s stat block). When you choose one of the normal forms, you can choose Undead as its creature type. Additionally, when you take the Attack action, you can forgo one of your own attacks to allow your familiar to make one attack of its own with its Reaction. Undead Vitality. When you cast a Necromancy spell using a spell slot, you can choose an Undead creature you can see within 60 feet of yourself to regain a number of Hit Points equal to the level of the spell slot expended plus your Wizard level.' },
        { level: 6, name: 'Grave Power', description: 'You have discovered more necromantic insights and inscribed them in your spellbook. While holding your spellbook, you gain the following benefits. Grave Resilience. When you use Arcane Recovery, your Exhaustion level, if any, decreases by 1. Overwhelming Necrosis. Damage from your Wizard spells and Wizard features ignores Resistance to Necrotic damage.' },
        { level: 6, name: 'Undead Thralls', description: 'You always have Animate Dead prepared and can cast it without expending a spell slot, but you must finish a Long Rest before you can cast it in this way again. Whenever you start casting the spell, you can increase the spell\'s effective level by 1. In addition, while holding your spellbook, you gain the following benefits. Undead Fortitude. Whenever you cast a Necromancy spell that creates or summons an Undead, the Undead\'s Hit Point maximum and current Hit Points increase by a number equal to your Intelligence modifier plus half your Wizard level (round down). Withering Strike. Whenever an Undead you control within 60 feet of you hits a creature with an attack roll, the Undead deals extra Necrotic damage equal to your Intelligence modifier (minimum of 1 Necrotic damage).' },
        { level: 10, name: 'Harvest Undead', description: 'You have learned more secrets about the nuances of life and death. Immediately after you become Bloodied but aren\'t reduced to 0 Hit Points from taking damage, you can take a Reaction to reduce an Undead creature under your control that you can see to 0 Hit Points. You then immediately regain a number of Hit Points equal to your Wizard level.' },
        { level: 14, name: 'Death\'s Master', description: 'Abstruse rituals within your spellbook allow you mastery over undeath. While holding your spellbook, you gain the following benefits. Bolster Undead. As a Bonus Action, choose any number of Undead you have created or summoned with a Necromancy spell that are within 60 feet of you. Those Undead each gain Temporary Hit Points equal to your Wizard level. Once you use this Bonus Action, you can\'t do so again until you finish a Long Rest. Extinguish Undead. When an Undead creature you can see is reduced to 0 Hit Points, you can cause it to explode with necrotic energy. Roll a number of d6s equal to half the creature\'s unexpended Hit Dice (round up, minimum of 1d6), and add them together. Each creature in a 10-foot Emanation originating from the Undead makes a Dexterity saving throw. On a failed save, a target takes Necrotic damage equal to the number rolled and can\'t take Reactions until the start of its next turn. On a successful save, a target takes half as much damage only. When you use this feature to explode an Undead creature you don\'t control, you must take a Reaction and expend a level 5+ spell slot to do so.' },
      ],
    },
    {
      id: 'transmuter',
      classId: 'wizard',
      name: 'Transmuter',
      description: 'Transform Energy and Matter You study spells that modify energy and matter-to you, the world is eminently mutable. Using your magic, you become a smith at reality\'s forge. Some Transmuters are tinkerers and pranksters. Others seek the power to make and destroy worlds.',
      features: [
        { level: 3, name: 'Transmutation Savant', description: 'Choose two Wizard spells from the Transmutation school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Transmutation school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.' },
        { level: 3, name: 'Transmuter\'s Stone', description: 'When you finish a Long Rest, you can create a magic stone that lasts until you use this feature again. The stone is a Tiny object, and you can use it as a Spellcasting Focus for your Wizard spells. A creature with the stone in its possession gains proficiency in Constitution saving throws and one of the following benefits, which you choose when you create the stone. You can change the stone\'s benefit when you cast a Transmutation spell using a spell slot. Darkvision. The bearer gains Darkvision with a range of 60 feet or increases the range of its Darkvision by 60 feet. Resistance. The bearer gains Resistance to Acid, Cold, Fire, Lightning, Poison, or Thunder damage (your choice each time you choose this benefit). Speed. The bearer\'s Speed increases by 10 feet.' },
        { level: 3, name: 'Wondrous Alteration', description: 'You always have the Alter Self spell prepared and can cast it once without expending a spell slot. You regain the ability to cast it in this way when you finish a Long Rest. While under the effects of Alter Self, you gain an additional benefit for each of its options. Aquatic Adaptation. While underwater, you can take the Dash action as a Bonus Action. Change Appearance. You have Advantage on Charisma (Deception) checks. Natural Weapons. The damage of your new growth increases to 2d6 damage of the type associated with the growth. You also have Advantage on Constitution saving throws to maintain Concentration.' },
        { level: 6, name: 'Empowered Transmutation', description: 'When you use a spell slot to cast a Transmutation spell that doesn\'t make an attack roll or force a saving throw, such as Fly or Magic Weapon, you can increase the spell\'s effective level by 1. You can use this feature a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
        { level: 10, name: 'Potent Stone', description: 'Your Transmuter\'s Stone is more versatile. When you create your Transmuter\'s Stone, you can choose up to two benefits. You can choose each option other than Resistance only once. If you choose Resistance twice, you must choose different damage types. You can change either or both benefits when you cast a Transmutation spell using a spell slot. In addition, the following are now among your benefit options for Transmuter\'s Stone. Mighty Build. The bearer has Advantage on Strength saving throws. The bearer also counts as one size larger when determining its carrying capacity. Tremorsense. The bearer gains Tremorsense with a range of 30 feet.' },
        { level: 10, name: 'Shape-Shifter', description: 'You always have the Polymorph spell prepared and can cast it once without expending a spell slot. You regain the ability to cast it in this way when you finish a Long Rest. In addition, when you target yourself with the spell, you can modify the spell to gain the benefits below. Once you modify the spell using this feature, you can\'t do so again until you finish a Long Rest. Game Statistics. In addition to retaining the features specified in the spell, you retain your memories and ability to communicate. You also retain your Intelligence, Wisdom, and Charisma scores; proficiencies; class features; and feats. Transmute Spells. While shape-shifted, you can cast spells, but only Transmutation spells that don\'t have a Material component that has a specified cost or that is consumed by the spell.' },
        { level: 14, name: 'Master Transmuter', description: 'While you carry your Transmuter\'s Stone, you can take a Magic action to consume the reserve of transmutation magic stored inside and choose one of the following benefits. After you use the stone in this way, it crumbles to dust. You can prevent the stone from crumbling by expending a level 7+ spell slot as part of the Magic action you take using this feature. Major Transformation. You can transmute one nonmagical object - no larger than a 10-foot Cube or eight connected 5-foot Cubes - into another nonmagical object of similar size and mass and of equal or lesser value. You must spend 10 minutes handling the object to transform it. Panacea. You touch a creature as part of this Magic action, and the target regains a number of Hit Points equal to half its Hit Point maximum (round down). The target is cured of all magical contagions, and any curses affecting the target are lifted, including the target\'s Attunement to a cursed item. If the target has the Poisoned or Petrified condition, those conditions end. Restore Life. You cast the Raise Dead spell without expending a spell slot, using the stone in place of the required Material components. Restore Youth. You touch one willing creature as part of this Magic action, and the target\'s Exhaustion level, if any, decreases to 0, and it permanently appears 3d10 years younger, to a minimum of young adulthood.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
{
        id: 'spellcasting',
        name: 'Spellcasting',
        description: 'As a student of arcane magic, you have learned to cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Wizard spells, which appear in the Wizard spell list later in the class\'s description. Cantrips. You know three Wizard cantrips of your choice. Light, Mage Hand, and Ray of Frost are recommended. Whenever you finish a Long Rest, you can replace one of your cantrips from this feature with another Wizard cantrip of your choice. When you reach Wizard levels 4 and 10, you learn another Wizard cantrip of your choice, as shown in the Cantrips column of the Wizard Features table. Spellbook. Your wizardly apprenticeship culminated in the creation of a unique book: your spellbook. It is a Tiny object that weighs 3 pounds, contains 100 pages, and can be read only by you or someone casting Identify. You determine the book\'s appearance and materials, such as a gilt-edged tome or a collection of vellum bound with twine. The book contains the level 1+ spells you know. It starts with six level 1 Wizard spells of your choice. Detect Magic, Feather Fall, Mage Armor, Magic Missile, Sleep, and Thunderwave are recommended. Whenever you gain a Wizard level after 1, add two Wizard spells of your choice to your spellbook. Each of these spells must be of a level for which you have spell slots, as shown in the Wizard Features table. The spells are the culmination of arcane research you do regularly. Spell Slots. The Wizard Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To do so, choose four spells from your spellbook. The chosen spells must be of a level for which you have spell slots. The number of spells on your list increases as you gain Wizard levels, as shown in the Prepared Spells column of the Wizard Features table. Whenever that number increases, choose additional Wizard spells until the number of spells on your list matches the number in the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 3 Wizard, your list of prepared spells can include six spells of levels 1 and 2 in any combination, chosen from your spellbook. If another Wizard feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Wizard spells for you. Changing Your Prepared Spells. Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells there with spells from your spellbook. Spellcasting Ability. Intelligence is your spellcasting ability for your Wizard spells. Spellcasting Focus. You can use an Arcane Focus or your spellbook as a Spellcasting Focus for your Wizard spells. Expanding and Replacing a Spellbook. The spells you add to your spellbook as you gain levels reflect your ongoing magical research, but you might find other spells during your adventures that you can add to the book. You could discover a Wizard spell on a Spell Scroll, for example, and then copy it into your spellbook. Copying a Spell into the Book. When you find a level 1+ Wizard spell, you can copy it into your spellbook if it\'s of a level you can prepare and if you have time to copy it. For each level of the spell, the transcription takes 2 hours and costs 50 GP. Afterward you can prepare the spell like the other spells in your spellbook. Copying the Book. You can copy a spell from your spellbook into another book. This is like copying a new spell into your spellbook but faster, since you already know how to cast the spell. You need spend only 1 hour and 10 GP for each level of the copied spell. If you lose your spellbook, you can use the same procedure to transcribe the Wizard spells that you have prepared into a new spellbook. Filling out the remainder of the new book requires you to find new spells to do so. For this reason, many wizards keep a backup spellbook.'
      },
      {
        id: 'ritual-adept',
        name: 'Ritual Adept',
        description: 'You can cast any spell as a Ritual if that spell has the Ritual tag and the spell is in your spellbook. You needn\'t have the spell prepared, but you must read from the book to cast a spell in this way.'
      },
      {
        id: 'arcane-recovery',
        name: 'Arcane Recovery',
        description: 'You can regain some of your magical energy by studying your spellbook. When you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level equal to no more than half your Wizard level (round up), and none of the slots can be level 6 or higher. For example, if you\'re a level 4 Wizard, you can recover up to two levels\' worth of spell slots, regaining either one level 2 spell slot or two level 1 spell slots. Once you use this feature, you can\'t do so again until you finish a Long Rest.'
      },
    ],
    2: [
      {
        id: 'scholar',
        name: 'Scholar',
        description: 'While studying magic, you also specialized in another field of study. Choose one of the following skills in which you have proficiency: Arcana, History, Investigation, Medicine, Nature, or Religion. You have Expertise in the chosen skill.'
      },
    ],
    3: [
      {
        id: 'arcane-tradition',
        name: 'Arcane Tradition',
        description: 'You gain a Wizard subclass of your choice. The Abjurer, Diviner, Evoker, and Illusionist subclasses are detailed after this class\'s description. A subclass is a specialization that grants you features at certain Wizard levels. For the rest of your career, you gain each of your subclass\'s features that are of your Wizard level or lower.'
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Wizard levels 8, 12, and 16.'
      },
    ],
    5: [
      {
        id: 'memorize-spell',
        name: 'Memorize Spell',
        description: 'Whenever you finish a Short Rest, you can study your spellbook and replace one of the level 1+ Wizard spells you have prepared for your Spellcasting feature with another level 1+ spell from the book.'
      },
    ],
    18: [
      {
        id: 'spell-mastery',
        name: 'Spell Mastery',
        description: 'You have achieved such mastery over certain spells that you can cast them at will. Choose a level 1 and a level 2 spell in your spellbook that have a casting time of an action. You always have those spells prepared, and you can cast them at their lowest level without expending a spell slot. To cast either spell at a higher level, you must expend a spell slot. Whenever you finish a Long Rest, you can study your spellbook and replace one of those spells with an eligible spell of the same level from the book.'
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
        id: 'signature-spells',
        name: 'Signature Spells',
        description: 'Choose two level 3 spells in your spellbook as your signature spells. You always have these spells prepared, and you can cast each of them once at level 3 without expending a spell slot. When you do so, you can\'t cast them in this way again until you finish a Short or Long Rest. To cast either spell at a higher level, you must expend a spell slot.'
      },
    ],
  },
  multiclassGains: ['Simple weapons', 'Spellbook, Arcane Focus', 'Two skills from the Wizard list'],
  asiLevels: [4, 8, 12, 16],
};