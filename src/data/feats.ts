/**
 * Feats catalog rebuilt from dnd2024.wikidot.com (209-feat inventory; /feat:all).
 *
 * 2024 separates feats into categories:
 *  - Origin feats (granted at 1st level by Background or species; swappable).
 *  - General feats (taken via an ASI/feat slot, typically Level 4+).
 *  - Fighting Style feats (require Fighting Style class feature).
 *  - Epic Boon feats (Level 19+).
 *  - Dragonmark, Planar Pact and Dark Gift feats (setting-specific).
 *
 * `category` mirrors the wiki's /feat:all sections; `source` preserves the
 * legacy filtering buckets ('origin' | 'general' | 'item').
 *
 * Prerequisites are stored as short human-readable strings rather than
 * structured objects: they are only ever displayed in the UI, and the SRD
 * wording varies enough that parsing them would add fragility for no gain.
 */
import type { FeatDef } from '../types/character';

export const FEATS: FeatDef[] = [
  // ---------------- Origin Feats ----------------
  {
    id: 'alert',
    name: 'Alert',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Initiative Proficiency. When you roll Initiative, you can add your Proficiency Bonus to the roll. Initiative Swap. Immediately after you roll Initiative, you can swap your Initiative with the Initiative of one willing ally in the same combat. You can\'t make this swap if you or the ally has the Incapacitated condition.',
  },

  {
    id: 'arcane-artist',
    name: 'Arcane Artist',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Cantrip. You learn the Minor Illusion cantrip. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). Inspiring Magic. When you cast a spell from the Illusion school, you can choose one ally within 30 feet of yourself who can see you. That ally gains Heroic Inspiration. Once you use this benefit, you can\'t use it again until you finish a Long Rest.',
  },

  {
    id: 'arcane-eloquence',
    name: 'Arcane Eloquence',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Cantrip. You learn the Vicious Mockery cantrip. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). Smooth Talker. When you make a Charisma (Deception, Intimidation, or Persuasion) check, you can roll 1d4 and add the number rolled to the ability check.',
  },

  {
    id: 'arcane-infiltrator',
    name: 'Arcane Infiltrator',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Cantrip. You learn the Friends cantrip. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). Cunning Diversion. You can take the Dodge action as a Bonus Action. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'arcane-omens',
    name: 'Arcane Omens',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Cantrip. You learn the Guidance cantrip. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). Helpful Premonition. When you or a creature you can see within 30 feet of yourself fails a saving throw, you can take a Reaction to roll 1d4 and add the number rolled to the save\'s total, potentially turning the failure into a success. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'arcane-overload',
    name: 'Arcane Overload',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Cantrip. You learn the Fire Bolt cantrip. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). Power Surge. When you cast an Evocation spell and deal damage with it, you can add your Proficiency Bonus to one damage roll of that spell. Once you use this benefit, you can\'t do so again until you finish a Long Rest.',
  },

  {
    id: 'arcane-safeguard',
    name: 'Arcane Safeguard',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Cantrip. You learn the Resistance cantrip. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). You can cast the Resistance cantrip as a Bonus Action. You can do so a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. Sheltering Aid. When you take the Help action to assist with an ally\'s ability check, that ally gains a number of Temporary Hit Points equal to your Proficiency Bonus.',
  },

  {
    id: 'arcane-undertaker',
    name: 'Arcane Undertaker',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Cantrip. You learn one Cleric or Wizard cantrip of your choice. The cantrip must be from the Necromancy school. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). Knowledge from the Dead. When you make an Intelligence (History) or Wisdom (Medicine) check, you can roll 1d4 and add the number rolled to the ability check. Understanding of Death. When you take the Help action to stabilize a creature with 0 Hit Points, you gain Heroic Inspiration. Once you use this benefit, you can\'t use it again until you finish a Long Rest.',
  },

  {
    id: 'crafter',
    name: 'Crafter',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Tool Proficiency. You gain proficiency with three different Artisan\'s Tools of your choice from the Fast Crafting table. Discount. Whenever you buy a nonmagical item, you receive a 20 percent discount on it. Fast Crafting. When you finish a Long Rest, you can craft one piece of gear from the Fast Crafting table, provided you have the Artisan\'s Tools associated with that item and have proficiency with those tools. The item lasts until you finish another Long Rest, at which point the item falls apart. Carpenter\'s Tools: Ladder, Torch / Leatherworker\'s Tools: Case, Pouch / Mason\'s Tools: Block and Tackle / Potter\'s Tools: Jug, Lamp / Smith\'s Tools: Ball Bearings, Bucket, Caltrops, Grappling Hook, Iron Pot / Tinker\'s Tools: Bell, Shovel, Tinder Box / Weaver\'s Tools: Basket, Rope, Net, Tent / Woodcarver\'s Tools: Club, Greatclub, Quarterstaff',
  },

  {
    id: 'familiar-friend',
    name: 'Familiar Friend',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Faithful Companion. You always have the Find Familiar spell prepared. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). You can cast it once without a spell slot or Material components, and you regain the ability to cast it in this way when you finish a Long Rest. You can also cast the spell using any spell slots you have. Fortified Familiar. When you cast the Find Familiar spell, your familiar\'s Hit Point maximum and current Hit Points are increased by an amount equal to twice your character level. Helpful Friend. When you make an ability check using a skill in which you have proficiency while your familiar is within 5 feet of you, you gain Advantage on the check. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'healer',
    name: 'Healer',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Battle Medic. If you have a Healer\'s Kit, you can expend one use of it and tend to a creature within 5 feet of yourself as a Utilize action. That creature can expend one of its Hit Point Dice, and you then roll that die. The creature regains a number of Hit Points equal to the roll plus your Proficiency Bonus. Healing Rerolls. Whenever you roll a die to determine the number of Hit Points you restore with a spell or with this feat\'s Battle Medic benefit, you can reroll the die if it rolls a 1, and you must use the new roll.',
  },

  {
    id: 'lucky',
    name: 'Lucky',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Luck Points. You have a number of Luck Points equal to your Proficiency Bonus and can spend the points on the benefits below. You regain your expended Luck Points when you finish a Long Rest. Advantage. When you roll a d20 for a D20 Test, you can spend 1 Luck Point to give yourself Advantage on the roll. Disadvantage. When a creature rolls a d20 for an attack roll against you, you can spend 1 Luck Point to impose Disadvantage on that roll.',
  },

  {
    id: 'magic-initiate',
    name: 'Magic Initiate',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Two Cantrips. You learn two cantrips of your choice from the Cleric, Druid, or Wizard spell list. Intelligence, Wisdom, or Charisma is your spellcasting ability for this feat\'s spells (choose when you select this feat). Level 1 Spell. Choose a level 1 spell from the same list you selected for this feat\'s cantrips. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have. Spell Change. Whenever you gain a new level, you can replace one of the spells you chose for this feat with a different spell of the same level from the chosen spell list. Repeatable. You can take this feat more than once, but you must choose a different spell list each time.',
  },

  {
    id: 'musician',
    name: 'Musician',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Instrument Training. You gain proficiency with three Musical Instruments of your choice. Encouraging Song. As you finish a Short or Long Rest, you can play a song on a Musical Instrument with which you have proficiency and give Heroic Inspiration to allies who hear the song. The number of allies you can affect in this way equals your Proficiency Bonus.',
  },

  {
    id: 'portal-jumper',
    name: 'Portal Jumper',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Otherworldly Resilience. You have Resistance to one of the following damage types: Necrotic, Psychic, or Radiant (choose when you select this feat). Portal Step. You can spend 15 feet of movement to teleport to an unoccupied space you can see within 15 feet of yourself. You can use this benefit a number of times equal to your Proficiency Bonus but only once per turn, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'savage-attacker',
    name: 'Savage Attacker',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'You\'ve trained to deal particularly damaging strikes. Once per turn when you hit a target with a weapon, you can roll the weapon\'s damage dice twice and use either roll against the target.',
  },

  {
    id: 'sharp-eye',
    name: 'Sharp Eye',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'When you take the Search or Study action, you can give yourself Advantage on any ability check made as part of that action. You can use this feature a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. If the check fails, the use of this feature isn\'t expended.',
  },

  {
    id: 'skilled',
    name: 'Skilled',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'You gain proficiency in any combination of three skills or tools of your choice. Repeatable. You can take this feat more than once.',
  },

  {
    id: 'survivor',
    name: 'Survivor',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'You gain the following benefits. Hypervigilance. Whenever you roll Initiative, you can reroll the d20 if the number rolled is 9 or lower. You must use the new roll. Steel Yourself. When you fail a saving throw to avoid or end the Charmed or Frightened condition, you can take a Reaction to add a bonus to the roll potentially causing it to succeed. The bonus is equal to your Proficiency Bonus. Once you take this Reaction, you can\'t do so again until you finish a Long Rest.',
  },

  {
    id: 'tavern-brawler',
    name: 'Tavern Brawler',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Enhanced Unarmed Strike. When you hit with your Unarmed Strike and deal damage, you can deal Bludgeoning damage equal to 1d4 plus your Strength modifier instead of the normal damage of an Unarmed Strike. Damage Rerolls. Whenever you roll a damage die for your Unarmed Strike, you can reroll the die if it rolls a 1, and you must use the new roll. Improvised Weaponry. You have proficiency with improvised weapons. Push. When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can deal damage to the target and also push it 5 feet away from you. You can use this benefit only once per turn.',
  },

  {
    id: 'tough',
    name: 'Tough',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Your Hit Point maximum increases by an amount equal to twice your character level when you gain this feat. Whenever you gain a character level thereafter, your Hit Point maximum increases by an additional 2 Hit Points.',
  },

  {
    id: 'transmuted-anatomy',
    name: 'Transmuted Anatomy',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Lengthened Stride. Your Speed increases by 5 feet. Resilient Anatomy. You have Advantage on saving throws against effects that would compel you to shape-shift against your will. Additionally, when you fail a Constitution saving throw, you can take a Reaction to roll 1d4 and add the number rolled to the save, potentially turning the failure into a success. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'cult-of-the-dragon-initiate',
    name: 'Cult of the Dragon Initiate',
    category: 'origin',
    source: 'faerun',
    usableAsOriginFeat: true,
    description:
      'Dragon\'s Tongue. You know Draconic. If you already know Draconic when you select this feat, you instead learn one language of your choice from the language tables in the Player\'s Handbook or chapter 2 of this book. Dragon\'s Terror. You can take a Magic action to instill terror in a creature you can see within 30 feet of yourself. The target must succeed on a Wisdom saving throw (DC 8 plus your Wisdom modifier and Proficiency Bonus) or have the Frightened condition until the end of your next turn. If the target succeeds on the save or when the effect ends for a target, the target is immune to this effect for 24 hours. Inspired by Fear. When you cause a creature to have the Frightened condition and you are the source of its fear, you can gain Heroic Inspiration if you lack it. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.',
  },

  {
    id: 'emerald-enclave-fledgling',
    name: 'Emerald Enclave Fledgling',
    category: 'origin',
    source: 'faerun',
    usableAsOriginFeat: true,
    description:
      'Speak with Animals. You always have the Speak with Animals spell prepared and can cast it with any spell slots you have. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). When you cast this spell as a Ritual, its duration is 8 hours. Tag Team. When you take the Help action, you can switch places with a willing ally within 5 feet of yourself as part of that same action. This movement doesn\'t provoke Opportunity Attacks. You can\'t use this benefit if the ally has the Incapacitated condition.',
  },

  {
    id: 'harper-agent',
    name: 'Harper Agent',
    category: 'origin',
    source: 'faerun',
    usableAsOriginFeat: true,
    description:
      'Thieves\' Cant. You know Thieves\' Cant. Instrument Training. You gain proficiency with a Musical Instrument of your choice. Distracting Melody. When you take the Help action to assist an ally\'s attack roll, the enemy you\'re distracting can be within 30 feet of you, rather than within 5 feet of you, provided the enemy can see or hear you.',
  },

  {
id: 'lords-alliance-agent',
    name: "Lords' Alliance Agent",
    category: 'origin',
    source: 'faerun',
    usableAsOriginFeat: true,
    description:
      'Inspiring Strike. Once per turn when you score a Critical Hit against a creature, you can choose an ally within 30 feet of yourself who can see or hear you and who lacks Heroic Inspiration. That ally gains Heroic Inspiration. Reassert Honor. When an enemy you can see deals damage to an ally of yours that is within 5 feet of you, you have Advantage on your next attack roll against that enemy before the end of your next turn.',
  },

  {
    id: 'purple-dragon-rook',
    name: 'Purple Dragon Rook',
    category: 'origin',
    source: 'faerun',
    usableAsOriginFeat: true,
    description:
      'Entreat. You gain proficiency in one of the following skills: Insight, Performance, or Persuasion. Rallying Cry. When you roll Initiative and don\'t have the Incapacitated condition, you can choose a number of creatures equal to your Proficiency Bonus that you can see within 30 feet of yourself. Those creatures gain Heroic Inspiration. Once you use this benefit, you can\'t do so again until you finish a Long Rest.',
  },

  {
    id: 'spellfire-spark',
    name: 'Spellfire Spark',
    category: 'origin',
    source: 'faerun',
    usableAsOriginFeat: true,
    description:
      'Magic Absorption. Once per turn, when you take damage from a spell or magical effect, you reduce the total damage taken by 1d4. You can\'t use this benefit if you have the Incapacitated condition. Spellfire Flame. You learn the Sacred Flame cantrip. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). You can also cast this cantrip as a Bonus Action a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'tyro-of-the-gauntlet',
    name: 'Tyro of the Gauntlet',
    category: 'origin',
    source: 'faerun',
    usableAsOriginFeat: true,
    description:
      'Stand as One. When an ally within 5 feet of you is subjected to an effect that would push or pull it, you can take a Reaction to prevent that ally from being pushed or pulled. To receive this benefit, the ally can\'t have the Incapacitated condition. Vigilant. When you take the Ready action, the next attack roll made against you has Disadvantage before the start of your next turn.',
  },

  {
id: 'zhentarim-ruffian',
    name: "Zhentarim Ruffian",
    category: 'origin',
    source: 'faerun',
    usableAsOriginFeat: true,
    description:
      'Exploit Opening. When you roll damage for an Opportunity Attack, you can roll the damage dice twice and use either roll against the target. Family First. If you have Heroic Inspiration when you roll Initiative, you can expend it to give yourself and your allies Advantage on that Initiative roll.',
  },

  {
    id: 'child-of-the-sun',
    name: 'Child of the Sun',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Eyes of Eirdu. You and allies within 10 feet of you have Advantage on saving throws made to avoid or end the Blinded condition. Faerie Fire. You learn the Faerie Fire spell. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have. When you cast Faerie Fire without a spell slot using this benefit, taking damage can\'t break your Concentration on the spell.',
  },

  {
    id: 'shadowmoor-hexer',
    name: 'Shadowmoor Hexer',
    category: 'origin',
    source: 'lorwyn',
    usableAsOriginFeat: true,
    description:
      'Hex. You always have the Hex spell prepared. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have. Curse Magic. When a creature that you\'ve cursed with Hex hits you with an attack roll, the creature takes Psychic damage equal to your Proficiency Bonus. A creature takes this damage only once per turn.',
  },

  {
    id: 'tireless-reveler',
    name: 'Tireless Reveler',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'When an ally you can see within 60 feet of yourself expends Heroic Inspiration, you can gain Heroic Inspiration if you lack it. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.',
  },

  {
    id: 'vampire-hunter',
    name: 'Vampire Hunter',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Adroit Escape. You have Advantage on checks to escape from nonmagical restraints or the Grappled condition. Vitality Ward. When you take Necrotic damage, you can take a Reaction to mitigate the damage. Roll a number of d6s equal to your Proficiency Bonus, and add them together. Reduce the Necrotic damage you take by this total. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.',
  },

  {
    id: 'vampire-s-plaything',
    name: 'Vampire\'s Plaything',
    category: 'origin',
    source: 'core',
    usableAsOriginFeat: true,
    description:
      'Decanting. When you finish a Long Rest, you can create one Potion of Healing or an Antitoxin, as long as you have an empty vial or flask. These liquids evaporate when you finish another Long Rest. Timely Retreat. You can take a Bonus Action to take the Dash action or the Disengage action. You can use this benefit a number of times equal to your Proficiency Bonus, and you recover all expended uses when you finish a Long Rest. Vampiric Connection. The DM determines the fate of your former vampire master. While you and your former vampire master are on the same plane of existence, the vampire can communicate with you telepathically, and you can choose to allow the vampire to perceive through your senses.',
  },

  // ---------------- General Feats ----------------
  {
    id: 'ability-score-improvement',
    name: 'Ability Score Improvement',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Increase one ability score of your choice by 2, or increase two ability scores of your choice by 1. This feat can\'t increase an ability score above 20. Repeatable. You can take this feat more than once.',
  },

  {
    id: 'abjuration-adept',
    name: 'Abjuration Adept',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Additional Spells. Your prowess allows you to always have certain spells at the ready. When you have spell slots of a level specified in the Abjuration Adept Spells table, you thereafter always have the spells listed for that level and lower prepared. Protective Ward. When you cast a spell from the Abjuration school using a spell slot, you or one creature you can see within 30 feet of yourself gains Temporary Hit Points equal to twice the level of spell slot expended. 1: Shield / 2: Lesser Restoration / 3: Protection from Energy / 4: Banishment / 5: Mass Cure Wounds',
  },

  {
    id: 'actor',
    name: 'Actor',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Charisma 13+',
    description:
      'Ability Score Increase. Increase your Charisma score by 1, to a maximum of 20. Impersonation. While you\'re disguised as a real or fictional person, you have Advantage on Charisma (Deception or Performance) checks to convince others that you are that person. Mimicry. You can mimic the sounds of other creatures, including speech. A creature that hears the mimicry must succeed on a Wisdom (Insight) check to determine the effect is faked (DC 8 plus your Charisma modifier and Proficiency Bonus).',
  },

  {
    id: 'athlete',
    name: 'Athlete',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Strength or Dexterity 13+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Climb Speed. You gain a Climb Speed equal to your Speed. Hop Up. When you have the Prone condition, you can right yourself with only 5 feet of movement. Jumping. You can make a running Long or High Jump after moving only 5 feet.',
  },

  {
    id: 'charger',
    name: 'Charger',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Strength or Dexterity 13+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Improved Dash. When you take the Dash action, your Speed increases by 10 feet for that action. Charge Attack. If you move at least 10 feet in a straight line toward a target immediately before hitting it with a melee attack roll as part of the Attack action, choose one of the following effects: gain a 1d8 bonus to the attack\'s damage roll, or push the target up to 10 feet away if it is no more than one size larger than you. You can use this benefit only once on each of your turns.',
  },

  {
    id: 'chef',
    name: 'Chef',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Constitution or Wisdom score by 1, to a maximum of 20. Cook\'s Utensils. You gain proficiency with Cook\'s Utensils if you don\'t already have it. Replenishing Meal. As part of a Short Rest, you can cook special food if you have ingredients and Cook\'s Utensils on hand. You can prepare enough of this food for a number of creatures equal to 4 plus your Proficiency Bonus. At the end of the Short Rest, any creature who eats the food and spends one or more Hit Dice to regain Hit Points regains an extra 1d8 Hit Points. Bolstering Treats. With 1 hour of work or when you finish a Long Rest, you can cook a number of treats equal to your Proficiency Bonus if you have ingredients and Cook\'s Utensils on hand. These special treats last 8 hours after being made. A creature can use a Bonus Action to eat one of those treats to gain a number of Temporary Hit Points equal to your Proficiency Bonus.',
  },

  {
    id: 'conjuration-adept',
    name: 'Conjuration Adept',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Additional Spells. Your prowess allows you to always have certain spells at the ready. When you have spell slots of a level specified in the Conjuration Adept Spells table, you thereafter always have the spells listed for that level and lower prepared. Persistent Conjuration. While maintaining Concentration on a spell from the Conjuration school, you gain a bonus to Constitution saving throws to maintain this Concentration. This bonus is equal to the ability modifier of the score increased by this feat. 1: Entangle / 2: Misty Step / 3: Conjure Animals / 4: Dimension Door / 5: Conjure Elemental',
  },

  {
    id: 'crossbow-expert',
    name: 'Crossbow Expert',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Dexterity 13+',
    description:
      'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20. Ignore Loading. You ignore the Loading property of the Hand Crossbow, Heavy Crossbow, and Light Crossbow (all called crossbows elsewhere in this feat). If you\'re holding one of them, you can load a piece of ammunition into it even if you lack a free hand. Firing in Melee. Being within 5 feet of an enemy doesn\'t impose Disadvantage on your attack rolls with crossbows. Dual Wielding. When you make the extra attack of the Light property, you can add your ability modifier to the damage of the extra attack if that attack is with a crossbow that has the Light property and you aren\'t already adding that modifier to the damage.',
  },

  {
    id: 'crusher',
    name: 'Crusher',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Strength or Constitution score by 1, to a maximum of 20. Push. Once per turn, when you hit a creature with an attack that deals Bludgeoning damage, you can move it 5 feet to an unoccupied space if the target is no more than one size larger than you. Enhanced Critical. When you score a Critical Hit that deals Bludgeoning damage to a creature, attack rolls against that creature have Advantage until the start of your next turn.',
  },

  {
    id: 'defensive-duelist',
    name: 'Defensive Duelist',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Dexterity 13+',
    description:
      'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20. Parry. If you\'re holding a Finesse weapon and another creature hits you with a melee attack, you can take a Reaction to add your Proficiency Bonus to your Armor Class, potentially causing the attack to miss you. You gain this bonus to your AC against melee attacks until the start of your next turn.',
  },

  {
    id: 'divination-adept',
    name: 'Divination Adept',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Additional Spells. Your prowess allows you to always have certain spells at the ready. When you have spell slots of a level specified in the Divination Adept Spells table, you thereafter always have the spells listed for that level and lower prepared. Prescient Intervention. When a creature you can see within 60 feet of yourself makes a D20 Test, you can take a Reaction to give that creature Advantage or Disadvantage (your choice) on that roll. Once you use this benefit, you can\'t do so again until you finish a Long Rest. You can also regain use of this feature when you cast a spell from the Divination school using a spell slot. 1: Detect Evil and Good / 2: Mind Spike / 3: Clairvoyance / 4: Divination / 5: Scrying',
  },

  {
    id: 'dual-wielder',
    name: 'Dual Wielder',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Strength or Dexterity 13+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Enhanced Dual Wielding. When you take the Attack action on your turn and attack with a weapon that has the Light property, you can make one extra attack as a Bonus Action later on the same turn with a different weapon, which must be a Melee weapon that lacks the Two-Handed property. You don\'t add your ability modifier to the extra attack\'s damage unless that modifier is negative. Quick Draw. You can draw or stow two weapons that lack the Two-Handed property when you would normally be able to draw or stow only one.',
  },

  {
    id: 'durable',
    name: 'Durable',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Constitution score by 1, to a maximum of 20. Defy Death. You have Advantage on Death Saving Throws. Speedy Recovery. As a Bonus Action, you can expend one of your Hit Point Dice, roll the die, and regain a number of Hit Points equal to the roll.',
  },

  {
    id: 'elemental-adept',
    name: 'Elemental Adept',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Energy Mastery. Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. Spells you cast ignore Resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. Repeatable. You can take this feat more than once, but you must choose a different damage type each time for Energy Mastery.',
  },

  {
    id: 'elemental-familiar',
    name: 'Elemental Familiar',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Familiar Friend Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Elemental Energy. You learn how to imbue your familiar with elemental power. When you cast the Find Familiar spell, choose Acid, Cold, Fire, Lightning, or Thunder damage. Your familiar is imbued with this energy until you cast Find Familiar again, granting it the following benefits: Elemental Resistance. Your familiar has Resistance to the chosen damage type. Energy Pulse. As a Bonus Action, you command your familiar to unleash a burst of elemental energy. Your familiar must be within 120 feet of you and take a Reaction to unleash this burst. Each creature in a 5-foot Emanation originating from your familiar makes a Dexterity saving throw (DC 8 plus your spellcasting ability modifier for the Find Familiar spell and your Proficiency Bonus). On a failed save, a creature takes 2d4 damage of the chosen type, and if the creature is Medium or smaller, it has the Prone condition.',
  },

  {
    id: 'enchantment-adept',
    name: 'Enchantment Adept',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Additional Spells. Your prowess allows you to always have certain spells at the ready. When you have spell slots of a level specified in the Enchantment Adept Spells table, you thereafter always have the spells listed for that level and lower prepared. Subtle Enchantments. When you cast a spell from the Enchantment school using a spell slot, you can cast it without any Verbal, Somatic, or Material components, except Material components that are consumed by the spell or that have a cost specified in the spell. 1: Dissonant Whispers / 2: Enthrall / 3: Hold Person / 4: Dominate Beast / 5: Modify Memory',
  },

  {
    id: 'evocation-adept',
    name: 'Evocation Adept',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Additional Spells. Your prowess allows you to always have certain spells at the ready. When you have spell slots of a level specified in the Evocation Adept Spells table, you thereafter always have the spells listed for that level and lower prepared. Fueled Evocation. Once per turn when you cast an Evocation spell and deal damage, you can roll up to two of your unexpended Hit Point Dice and add the total rolled to one of the spell\'s damage rolls. Those Hit Point Dice are then expended. 1: Chromatic Orb / 2: Shatter / 3: Fireball / 4: Vitriolic Sphere / 5: Wall of Force',
  },

  {
    id: 'fey-touched',
    name: 'Fey Touched',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Your exposure to the Feywild\'s magic grants you the following benefits. Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Fey Magic. Choose one level 1 spell from the Divination or Enchantment school of magic. You always have that spell and the Misty Step spell prepared. You can cast each of these spells without expending a spell slot. Once you cast either spell in this way, you can\'t cast that spell in this way again until you finish a Long Rest. You can also cast these spells using spell slots you have of the appropriate level. The spells\' spellcasting ability is the ability increased by this feat.',
  },

  {
    id: 'grappler',
    name: 'Grappler',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Strength or Dexterity 13+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Punch and Grab. When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can use both the Damage and the Grapple option. You can use this benefit only once per turn. Attack Advantage. You have Advantage on attack rolls against a creature Grappled by you. Fast Wrestler. You don\'t have to spend extra movement to move a creature Grappled by you if the creature is your size or smaller.',
  },

  {
    id: 'great-weapon-master',
    name: 'Great Weapon Master',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Strength 13+',
    description:
      'Ability Score Increase. Increase your Strength score by 1, to a maximum of 20. Heavy Weapon Mastery. When you hit a creature with a weapon that has the Heavy property as part of the Attack action on your turn, you can cause the weapon to deal extra damage to the target. The extra damage equals your Proficiency Bonus. Hew. Immediately after you score a Critical Hit with a Melee weapon or reduce a creature to 0 Hit Points with one, you can make one attack with the same weapon as a Bonus Action.',
  },

  {
    id: 'heavily-armored',
    name: 'Heavily Armored',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Medium Armor Training',
    description:
      'Ability Score Increase. Increase your Constitution or Strength score by 1, to a maximum of 20. Armor Training. You gain training with Heavy armor.',
  },

  {
    id: 'heavy-armor-master',
    name: 'Heavy Armor Master',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Heavy Armor Training',
    description:
      'Ability Score Increase. Increase your Constitution or Strength score by 1, to a maximum of 20. Damage Reduction. When you\'re hit by an attack while you\'re wearing Heavy armor, any Bludgeoning, Piercing, and Slashing damage dealt to you by that attack is reduced by an amount equal to your Proficiency Bonus.',
  },

  {
    id: 'illusion-adept',
    name: 'Illusion Adept',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Additional Spells. Your prowess allows you to always have certain spells at the ready. When you have spell slots of a level specified in the Illusion Adept Spells table, you thereafter always have the spells listed for that level and lower prepared. Masterful Illusions. When you cast a spell from the Illusion school using a spell slot, you can cast it without any Verbal, Somatic, or Material components, except Material components that are consumed by the spell or that have a cost specified in the spell. Additionally, creatures have Disadvantage on Intelligence (Investigation) checks made to discern the true nature of illusions created by your spells. 1: Silent Image / 2: Phantasmal Force / 3: Major Image / 4: Hallucinatory Terrain / 5: Seeming',
  },

  {
    id: 'inspiring-leader',
    name: 'Inspiring Leader',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Wisdom or Charisma 13+',
    description:
      'Ability Score Increase. Increase your Wisdom or Charisma score by 1, to a maximum of 20. Bolstering Performance. When you finish a Short or Long Rest, you can give an inspiring performance: a speech, song, or dance. When you do so, choose up to six allies (which can include yourself) within 30 feet of yourself who witness the performance. The chosen creatures each gain Temporary Hit Points equal to your character level plus the modifier of the ability you increased with this feat.',
  },

  {
    id: 'keen-mind',
    name: 'Keen Mind',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Intelligence 13+',
    description:
      'Ability Score Increase. Increase your Intelligence score by 1, to a maximum of 20. Lore Knowledge. Choose one of the following skills: Arcana, History, Investigation, Nature, or Religion. If you lack proficiency in the chosen skill, you gain proficiency in it, and if you already have proficiency in it, you gain Expertise in it. Quick Study. You can take the Study action as a Bonus Action.',
  },

  {
    id: 'lightly-armored',
    name: 'Lightly Armored',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Armor Training. You gain training with Light armor and Shields.',
  },

  {
    id: 'mage-slayer',
    name: 'Mage Slayer',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Concentration Breaker. When you damage a creature that is concentrating, it has Disadvantage on the saving throw it makes to maintain Concentration. Guarded Mind. If you fail an Intelligence, a Wisdom, or a Charisma saving throw, you can cause yourself to succeed instead. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.',
  },

  {
    id: 'magic-connoisseur',
    name: 'Magic Connoisseur',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Magic Initiate Feat',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Additional Spells. Choose a level 1 and a level 2 spell from the same list you selected for the Magic Initiate feat\'s cantrips. You always have those spells prepared. You can cast each spell once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. You can also cast those spells using any spell slots you have of the appropriate level. The spellcasting ability for these spells is the same as the spellcasting ability chosen for your Magic Initiate feat\'s spells. Spell Change. Whenever you gain a new level, you can replace one of the spells you chose for this feat with a different spell of the same level from the chosen spell list.',
  },

  {
    id: 'martial-weapon-training',
    name: 'Martial Weapon Training',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Weapon Proficiency. You gain proficiency with Martial weapons.',
  },

  {
    id: 'medium-armor-master',
    name: 'Medium Armor Master',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Medium Armor Training',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Dexterous Wearer. While you\'re wearing Medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity score of 16 or higher.',
  },

  {
    id: 'moderately-armored',
    name: 'Moderately Armored',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Light Armor Training',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Armor Training. You gain training with Medium armor.',
  },

  {
    id: 'mounted-combatant',
    name: 'Mounted Combatant',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Strength, Dexterity, or Wisdom score by 1, to a maximum of 20. Mounted Strike. While mounted, you have Advantage on attack rolls against any unmounted creature within 5 feet of your mount that is at least one size smaller than the mount. Leap Aside. If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw and only half damage if it fails. For your mount to gain this benefit, you must be riding it, and neither of you can have the Incapacitated condition. Veer. While mounted, you can force an attack that hits your mount to hit you instead if you don\'t have the Incapacitated condition.',
  },

  {
    id: 'necromancy-adept',
    name: 'Necromancy Adept',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Additional Spells. Your prowess allows you to always have certain spells at the ready. When you have spell slots of a level specified in the Necromancy Adept Spells table, you thereafter always have the spells listed for that level and lower prepared. Life Manipulation. When you cast a spell from the Necromancy school using a spell slot, you can immediately roll up to two of your unexpended Hit Point Dice. You regain Hit Points equal to the total rolled plus the level of spell slot expended. Those Hit Point Dice are then expended. 1: Inflict Wounds / 2: Ray of Enfeeblement / 3: Vampiric Touch / 4: Blight / 5: Raise Dead',
  },

  {
    id: 'observant',
    name: 'Observant',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Intelligence or Wisdom 13+',
    description:
      'Ability Score Increase. Increase your Intelligence or Wisdom score by 1, to a maximum of 20. Keen Observer. Choose one of the following skills: Insight, Investigation, or Perception. If you lack proficiency with the chosen skill, you gain proficiency in it, and if you already have proficiency in it, you gain Expertise in it. Quick Search. You can take the Search action as a Bonus Action.',
  },

  {
    id: 'otherworldly-familiar',
    name: 'Otherworldly Familiar',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Familiar Friend Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Otherworldly Power. When you cast the Find Familiar spell, you can imbue your familiar with otherworldly might, which lasts until you cast Find Familiar again. While imbued, your familiar gains the following benefits: Energy Resistance. Choose Necrotic, Poison, Psychic, Radiant, or Thunder damage. Your familiar has Resistance to the chosen damage type. Phase Walk. Your familiar can move through other creatures and objects as if they were Difficult Terrain. If your familiar ends its turn inside an object, it is shunted to the last unoccupied space it was in.',
  },

  {
    id: 'piercer',
    name: 'Piercer',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity by 1, to a maximum of 20. Puncture. Once per turn, when you hit a creature with an attack that deals Piercing damage, you can reroll one of the attack\'s damage dice, and you must use the new roll. Enhanced Critical. When you score a Critical Hit that deals Piercing damage to a creature, you can roll one additional damage die when determining the extra Piercing damage the target takes.',
  },

  {
    id: 'poisoner',
    name: 'Poisoner',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Dexterity or Intelligence score by 1, to a maximum of 20. Potent Poison. When you make a damage roll that deals Poison damage, it ignores Resistance to Poison damage. Brew Poison. You gain proficiency with the Poisoner\'s Kit. With 1 hour of work using such a kit and expending 50 GP worth of materials, you can create a number of poison doses equal to your Proficiency Bonus. As a Bonus Action, you can apply a poison dose to a weapon or piece of ammunition. Once applied, the poison retains its potency for 1 minute or until you deal damage with the poisoned item, whichever is shorter. When a creature takes damage from the poisoned item, that creature must succeed on a Constitution saving throw (DC 8 plus the modifier of the ability increased by this feat and your Proficiency Bonus) or take 2d8 Poison damage and have the Poisoned condition until the end of your next turn.',
  },

  {
    id: 'polearm-master',
    name: 'Polearm Master',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Strength or Dexterity 13+)',
    description:
      'Ability Score Increase. Increase your Dexterity or Strength score by 1, to a maximum of 20. Pole Strike. Immediately after you take the Attack action and attack with a Quarterstaff, a Spear, or a weapon that has the Heavy and Reach properties, you can use a Bonus Action to make a melee attack with the opposite end of the weapon. The weapon deals Bludgeoning damage, and the weapon\'s damage die for this attack is a d4. Reactive Strike. While you\'re holding a Quarterstaff, a Spear, or a weapon that has the Heavy and Reach properties, you can take a Reaction to make one melee attack against a creature that enters the reach you have with that weapon.',
  },

  {
    id: 'resilient',
    name: 'Resilient',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Choose one ability in which you lack saving throw proficiency. Increase the chosen ability score by 1, to a maximum of 20. Saving Throw Proficiency. You gain saving throw proficiency with the chosen ability.',
  },

  {
    id: 'ritual-caster',
    name: 'Ritual Caster',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Intelligence, Wisdom, or Charisma 13+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Ritual Spells. Choose a number of level 1 spells equal to your Proficiency Bonus that have the Ritual tag. You always have those spells prepared, and you can cast them with any spell slots you have. The spells\' spellcasting ability is the ability increased by this feat. Whenever your Proficiency Bonus increases thereafter, you can add an additional level 1 spell with the Ritual tag to the spells always prepared with this feature. Quick Ritual. With this benefit, you can cast a Ritual spell that you have prepared using its regular casting time rather than the extended time for a Ritual. Doing so doesn\'t require a spell slot. Once you cast the spell in this way, you can\'t use this benefit again until you finish a Long Rest.',
  },

  {
    id: 'sentinel',
    name: 'Sentinel',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Strength or Dexterity 13+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Guardian. Immediately after a creature within 5 feet of you takes the Disengage action or hits a target other than you with an attack, you can make an Opportunity Attack against that creature. Halt. When you hit a creature with an Opportunity Attack, the creature\'s Speed becomes 0 for the rest of the current turn.',
  },

  {
    id: 'shadow-touched',
    name: 'Shadow Touched',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Your exposure to the Shadowfell\'s magic grants you the following benefits. Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Shadow Magic. Choose one level 1 spell from the Illusion or Necromancy school of magic. You always have that spell and the Invisibility spell prepared. You can cast each of these spells without expending a spell slot. Once you cast either spell in this way, you can\'t cast that spell in this way again until you finish a Long Rest. You can also cast these spells using spell slots you have of the appropriate level. The spells\' spellcasting ability is the ability increased by this feat.',
  },

  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Dexterity 13+',
    description:
      'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20. Bypass Cover. Your ranged attacks with weapons ignore Half Cover and Three-Quarters Cover. Firing in Melee. Being within 5 feet of an enemy doesn\'t impose Disadvantage on your attack rolls with Ranged weapons. Long Shots. Attacking at long range doesn\'t impose Disadvantage on your attack rolls with Ranged weapons.',
  },

  {
    id: 'shield-master',
    name: 'Shield Master',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Shield Training',
    description:
      'Ability Score Increase. Increase your Strength score by 1, to a maximum of 20. Shield Bash. If you attack a creature within 5 feet of you as part of the Attack action and hit with a Melee weapon, you can immediately bash the target with your Shield if it\'s equipped, forcing the target to make a Strength saving throw (DC 8 plus your Strength modifier and Proficiency Bonus). On a failed save, you either push the target 5 feet from you or cause it to have the Prone condition (your choice). You can use this benefit only once on each of your turns. Interpose Shield. If you\'re subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can take a Reaction to take no damage if you succeed on the saving throw and are holding a Shield.',
  },

  {
    id: 'shifting-combatant',
    name: 'Shifting Combatant',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Weapon Mastery Feature',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Domino Strike. When you hit a creature with a weapon and activate the Push mastery property to push that creature into a space occupied by a Large or smaller creature, you can force the creatures to collide. Each creature makes a Dexterity saving throw (DC 8 plus the ability modifier of the score increased by this feat and your Proficiency Bonus), taking 1d10 Bludgeoning damage on a failed save. Fearless Leap. When you make a Long Jump, moving at least 10 feet immediately before the jump, and land in a space within 5 feet of two or more enemies, attack rolls made against you have Disadvantage until the start of your next turn.',
  },

  {
    id: 'skill-expert',
    name: 'Skill Expert',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Skill Proficiency. You gain proficiency in one skill of your choice. Expertise. Choose one skill in which you have proficiency but lack Expertise. You gain Expertise with that skill.',
  },

  {
    id: 'skulker',
    name: 'Skulker',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Dexterity 13+',
    description:
      'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20. Blindsight. You have Blindsight with a range of 10 feet. Fog of War. You exploit the distractions of battle, gaining Advantage on any Dexterity (Stealth) check you make as part of the Hide action during combat. Sniper. If you make an attack roll while hidden and the roll misses, making the attack roll doesn\'t reveal your location.',
  },

  {
    id: 'slasher',
    name: 'Slasher',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Hamstring. Once per turn when you hit a creature with an attack that deals Slashing damage, you can reduce the Speed of that creature by 10 feet until the start of your next turn. Enhanced Critical. When you score a Critical Hit that deals Slashing damage to a creature, it has Disadvantage on attack rolls until the start of your next turn.',
  },

  {
    id: 'soothing-familiar',
    name: 'Soothing Familiar',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Familiar Friend Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Healing Beacon. Positive energy fills a 5-foot Emanation originating from your familiar as long as it is within 120 feet of you. Whenever an ally in that Emanation rolls a die to determine the number of Hit Points restored to a creature, that ally can treat a roll of 1 or 2 on the die as a 3.',
  },

  {
    id: 'speedy',
    name: 'Speedy',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Dexterity or Constitution 13+',
    description:
      'Ability Score Increase. Increase your Dexterity or Constitution score by 1, to a maximum of 20. Speed Increase. Your Speed increases by 10 feet. Dash over Difficult Terrain. When you take the Dash action on your turn, Difficult Terrain doesn\'t cost you extra movement for the rest of that turn. Agile Movement. Opportunity Attacks have Disadvantage against you.',
  },

  {
    id: 'spell-resistant',
    name: 'Spell Resistant',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Dexterity or Constitution score by 1, to a maximum of 20. Magical Resilience. You have Resistance to one of the following damage types (choose when you gain this feat): Necrotic, Psychic, Radiant, or Thunder. Magic Resistant. When you would fail a saving throw against a spell or magical effect, you can roll 1d6 and add the number rolled to the save\'s total, potentially turning the failure into a success. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'spell-sniper',
    name: 'Spell Sniper',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Bypass Cover. Your attack rolls for spells ignore Half Cover and Three-Quarters Cover. Casting in Melee. Being within 5 feet of an enemy doesn\'t impose Disadvantage on your attack rolls with spells. Increased Range. When you cast a spell that has a range of at least 10 feet and requires you to make an attack roll, you can increase the spell\'s range by 60 feet.',
  },

  {
    id: 'spell-subterfuge',
    name: 'Spell Subterfuge',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Shrouding Spells. After you cast a spell that has a casting time of an action using a spell slot, you can take both the Dash and Hide actions as a Bonus Action. You can use this benefit a number of times equal to the ability modifier of the score increased by this feat, and you regain all expended uses when you finish a Long Rest. Sneaky Casting. If you have the Hide action\'s Invisible condition, casting a spell with a Verbal component or making a spell attack doesn\'t end that condition on you if you end the turn behind Three-Quarters Cover or Total Cover.',
  },

  {
    id: 'tactical-combatant',
    name: 'Tactical Combatant',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+ and Strength or Dexterity 13+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Buffering Strike. When you hit a creature with a weapon, you can gain Temporary Hit Points equal to the total number rolled on the weapon\'s damage dice. Once you use this benefit, you can\'t use it again until you roll Initiative or finish a Short or Long Rest. Honed Instincts. When you fail an ability check, you can roll 1d6 and add the number rolled to the ability check, potentially turning it into a success. Once you use this benefit, you can\'t use it again until you roll Initiative or finish a Short or Long Rest.',
  },

  {
    id: 'telekinetic',
    name: 'Telekinetic',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Minor Telekinesis. You learn the Mage Hand spell. You can cast it without Verbal or Somatic components, you can make the spectral hand Invisible, and its range and the distance it can be away from you both increase by 30 feet when you cast it. The spell\'s spellcasting ability is the ability increased by this feat. Telekinetic Shove. As a Bonus Action, you can telekinetically shove one creature you can see within 30 feet of yourself. When you do so, the target must succeed on a Strength saving throw (DC 8 plus the ability modifier of the score increased by this feat and your Proficiency Bonus) or be moved 5 feet toward or away from you.',
  },

  {
    id: 'telepathic',
    name: 'Telepathic',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Telepathic Utterance. You can speak telepathically to any creature you can see within 60 feet of yourself. Your telepathic utterances are in a language you know, and the creature understands you only if it knows that language. Your communication doesn\'t give the creature the ability to respond to you telepathically. Detect Thoughts. You always have the Detect Thoughts spell prepared. You can cast it without a spell slot or spell components, and you must finish a Long Rest before you can cast it in this way again. You can also cast it using spell slots you have of the appropriate level. Your spellcasting ability for the spell is the ability increased by this feat.',
  },

  {
    id: 'transmutation-adept',
    name: 'Transmutation Adept',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Additional Spells. Your prowess allows you to always have certain spells at the ready. When you have spell slots of a level specified in the Transmutation Adept Spells table, you thereafter always have the spells listed for that level and lower prepared. Magical Augmentation. On your turn when you cast a spell from the Transmutation school using a spell slot, your Speed increases by a number of feet equal to five times the level of spell slot expended. This increase lasts until the end of the turn. 1: Jump / 2: Spider Climb / 3: Slow / 4: Polymorph / 5: Animate Objects',
  },

  {
    id: 'war-caster',
    name: 'War Caster',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Concentration. You have Advantage on Constitution saving throws that you make to maintain Concentration. Reactive Spell. When a creature provokes an Opportunity Attack from you by leaving your reach, you can take a Reaction to cast a spell at the creature rather than making an Opportunity Attack. The spell must have a casting time of one action and must target only that creature. Somatic Components. You can perform the Somatic components of spells even when you have weapons or a Shield in one or both hands.',
  },

  {
    id: 'warlike-familiar',
    name: 'Warlike Familiar',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Familiar Friend Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Battle Familiar. You always have the Battle Familiar spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level. Your spellcasting ability for this spell is the one chosen for the Faithful Companion benefit of your Familiar Friend feat. Intercept Attack. When a creature within 5 feet of your familiar is hit by an attack roll, your familiar can take a Reaction to add a bonus to the creature\'s Armor Class against that attack, potentially causing the attack to miss. The bonus is equal to your Proficiency Bonus.',
  },

  {
    id: 'weapon-master',
    name: 'Weapon Master',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Mastery Property. Your training with weapons allows you to use the mastery property of one kind of Simple or Martial weapon of your choice, provided you have proficiency with it. Whenever you finish a Long Rest, you can change the kind of weapon to another eligible kind.',
  },

  {
    id: 'cold-caster',
    name: 'Cold Caster',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Cantrip. You learn the Ray of Frost cantrip. If you already know it, you learn a different Wizard cantrip of your choice. The spell\'s spellcasting ability is the ability increased by this feat. Frostbite. Once per turn when you hit a creature with an attack roll and deal Cold damage, you can temporarily negate the creature\'s defenses. The creature subtracts 1d4 from the next saving throw it makes before the end of your next turn.',
  },

  {
    id: 'dragonscarred',
    name: 'Dragonscarred',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Cult of the Dragon Initiate Feat',
    description:
      'Ability Score Increase. Increase your Constitution or Charisma score by 1, to a maximum of 20. Damage Resistance. When you gain this feat, choose Acid, Cold, Fire, Lightning, or Poison. You have Resistance to the chosen damage type. Fearsome Power. When you deal damage to a creature as part of the Attack or Magic action on your turn, you can use the Dragon\'s Terror benefit of the Cult of the Dragon Initiate feat as a Bonus Action this turn.',
  },

  {
    id: 'enclave-magic',
    name: 'Enclave Magic',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Emerald Enclave Fledgling Feat',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Friend to Animals. You have Advantage on ability checks when taking the Influence action with Beasts. Two Hearts, One Mind. You always have the Beast Sense spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. When you cast it without a spell slot using this feature, it doesn\'t require Concentration. You can also cast the spell using any spell slots you have of the appropriate level. The spell\'s spellcasting ability is the ability increased by this feat.',
  },

  {
    id: 'fairy-trickster',
    name: 'Fairy Trickster',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Dexterity or Charisma ability score by 1, to a maximum of 20. Faerie Trod Trotter. When you take the Disengage action on your turn, Difficult Terrain doesn\'t cost you extra movement for the rest of that turn. Flustering Strike. When you hit a creature with an attack roll, you can attempt to fluster the target. The target must succeed on a Wisdom saving throw (DC 8 plus the ability modifier of the score increased by this feat and your Proficiency Bonus) or have Disadvantage on saving throws until the end of your next turn. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'genie-magic',
    name: 'Genie Magic',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Wish Magic. As a Magic action, you can cast a level 1 spell of your choice from the Sorcerer spell list that has a casting time of an action. Once you use this benefit, you can\'t do so again until you finish a Long Rest. The spell\'s spellcasting ability is the ability increased by this feat. When you reach level 11, the spell you cast with this feat is cast as though using a level 2 spell slot. When you reach level 17, the spell is cast as though using a level 3 spell slot.',
  },

  {
    id: 'harper-teamwork',
    name: 'Harper Teamwork',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Harper Agent Feat',
    description:
      'Ability Score Increase. Increase your Dexterity or Charisma score by 1, to a maximum of 20. Withering Wordplay. When you take the Help action to assist an ally\'s attack roll against an enemy, that enemy also has Disadvantage on the first saving throw it makes before the start of your next turn. Inspiring Willpower. If you succeed on a saving throw to end the Frightened or Paralyzed condition on yourself, you can choose one ally you can see within 30 feet of yourself that has the same condition. That condition immediately ends for that ally.',
  },

  {
    id: 'lordly-resolve',
    name: 'Lordly Resolve',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Lords\' Alliance Agent Feat',
    description:
      'Ability Score Increase. Increase your Strength or Charisma score by 1, to a maximum of 20. Standard Bearer. As a Bonus Action, choose up to three creatures within 60 feet of yourself that can see you. Each target can immediately take a Reaction to right itself and end the Prone condition, provided its Speed isn\'t 0. Additionally, you bolster the targets\' resolve, which lasts for 1 minute or until you have the Incapacitated condition. While bolstered, a target can\'t be possessed or gain the Charmed or Frightened condition; if a target is already possessed, Charmed, or Frightened, the target has Advantage on any new saving throw against the relevant effect. Once you use this benefit, you can\'t do so again until you finish a Long Rest.',
  },

  {
    id: 'mythal-touched',
    name: 'Mythal Touched',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Mythal Ward. If a spell attack hits you or you fail a saving throw against a spell, you can take a Reaction to roll on the Mythal-Touched Magic table to create a magical effect. If an effect requires a saving throw, the DC equals 8 plus the modifier of the ability increased by this feat and your Proficiency Bonus. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. Mythal-Touched Magic 1-2: You and each creature within 15 feet of you make a Dexterity saving throw, taking Force damage equal to 1d8 times the level of the triggering spell on a failed save or half as much damage on a successful one. / 3-7: You and the triggering spell\'s caster form a telepathic link for 1 hour. / 8-10: Gravity is reversed in a 15-foot-radius, 60-foot-tall Cylinder centered on you for 1 minute, per the Reverse Gravity spell. / 11-13: You and the triggering spell\'s caster each make a Constitution saving throw. On a failed save, the creature has the Stunned condition until the end of its next turn. / 14-17: You gain a +2 bonus to AC for 1 minute, potentially turning the triggering spell into a miss if it was a spell attack. / 18-19: Any flammable, nonmagical object within 10 feet of the triggering spell\'s caster that isn\'t being worn or carried by another creature bursts into flame, takes 1d4 Fire damage, and is burning. / 20: The triggering spell dissipates with no effect, and the action, Bonus Action, or Reaction used to cast it is wasted. If that spell was cast with a spell slot, the slot isn\'t expended.',
  },

  {
    id: 'order-s-resilience',
    name: 'Order\'s Resilience',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Tyro of the Gauntlet Feat',
    description:
      'Ability Score Increase. Increase your Strength, Wisdom, or Charisma score by 1, to a maximum of 20. Resurge. When you have the Prone condition, you can right yourself with only 5 feet of movement. Stronger Together. If you are within 5 feet of an ally that doesn\'t have the Incapacitated condition, you and that ally have Advantage on Strength saving throws. You can\'t use this benefit while you have the Incapacitated condition.',
  },

  {
    id: 'purple-dragon-commandant',
    name: 'Purple Dragon Commandant',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Purple Dragon Rook Feat or Martial Weapon Proficiency',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Encourage Ally. As a Bonus Action, you bolster one ally you can see within 30 feet. The ally gains Temporary Hit Points equal to 2d6 plus the modifier of the ability score increased by this feat. You can take this Bonus Action a number of times equal to your Proficiency Bonus, and you regain all uses when you finish a Long Rest. Last Stand. You have Advantage on attack rolls while Bloodied.',
  },

  {
    id: 'spellfire-adept',
    name: 'Spellfire Adept',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Spellfire Spark Feat or the Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Fueled Spellfire. Once per turn, when a spell you cast deals Radiant damage, you can expend up to two Hit Point Dice, roll them, and add the total rolled to one damage roll of the spell. Searing Spellfire. When you make a damage roll that deals Radiant damage, it ignores Resistance to Radiant damage.',
  },

  {
    id: 'street-justice',
    name: 'Street Justice',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20. Headlock. Your allies have Advantage on attack rolls against a creature Grappled by you. Sturdy Knot. When you use Chain, Manacles, or Rope to bind a creature, add your Proficiency Bonus to the DC to escape or burst the Chain, Manacles, or Rope. Tough Talk. A creature\'s Hostile attitude doesn\'t impose Disadvantage on your Charisma (Intimidation) checks to influence that creature.',
  },

  {
    id: 'zhentarim-tactics',
    name: 'Zhentarim Tactics',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+, Zhentarim Ruffian Feat',
    description:
      'Ability Score Increase. Increase your Dexterity or Charisma score by 1, to a maximum of 20. Retaliate. Immediately after a creature within 5 feet of you hits you with a melee attack, you can make an Opportunity Attack against that creature. Versatile Merc. When you finish a Long Rest, choose a skill in which you have proficiency. You have Expertise in that skill until you finish your next Long Rest.',
  },

  {
    id: 'bloodlust',
    name: 'Bloodlust',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Strength, Dexterity, or Constitution score by 1, to a maximum of 20. Powerful Recovery. When you roll a Hit Point Die to regain Hit Points, you can treat any roll of 1 or 2 as a 3. Sanguine Feast. Once per turn when you hit a Bloodied creature that isn\'t a Construct or Undead with an attack roll, you can expend a Hit Point Die, roll it, and regain a number of Hit Points equal to the number rolled plus your Constitution modifier. You can use this feature a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'bomber',
    name: 'Bomber',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20. Far Lobber. When you use the Attack action to throw a vial or flask, you can target an object or creature you can see within 40 feet of yourself. Long Shots. Attacking at long range doesn\'t impose Disadvantage on your attack rolls with Thrown weapons.',
  },

  {
    id: 'cloying-mists',
    name: 'Cloying Mists',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Arise, Fog. You always have the Fog Cloud spell prepared. You can cast it without a spell slot, and you must finish a Long Rest before you can cast it in this way again. You can also cast it using spell slots you have of the appropriate level. Your spellcasting ability for the spell is the ability increased by this feat. Grasping Mist. Whenever you cast Fog Cloud, nonmagical flames in the spell\'s Sphere are extinguished, and creatures other than you and your allies have their Speed reduced by 5 feet while in the spell\'s Sphere.',
  },

  {
    id: 'delicious-pain',
    name: 'Delicious Pain',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Toughened Flesh. Immediately after you take Bludgeoning, Piercing, or Slashing damage, you can take a Reaction to gain Resistance to Bludgeoning, Piercing, and Slashing damage until the start of your next turn. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.',
  },

  {
    id: 'light-bringer',
    name: 'Light Bringer',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Sacred Magic. You learn the Light spell and can cast it without Material components. If you already know that cantrip, you learn a different Cleric cantrip of your choice. The spell\'s spellcasting ability is the ability increased by this feat. Solar Luminance. When you cast Light, you can have the light from the spell be sunlight. Once you use this benefit, you can\'t use it again until you finish a Long Rest. Sun\'s Healing. As a Bonus Action while within sunlight, you can expend one of your Hit Point Dice, roll the die, and regain a number of Hit Points equal to the roll. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.',
  },

  {
    id: 'love-bites',
    name: 'Love Bites',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Endearing Pain. Immediately after you damage a creature with a Melee weapon or an Unarmed Strike, you can take a Bonus Action to give the target the Charmed condition until the start of your next turn or until you or your allies damage it. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.',
  },

  {
    id: 'putrefy',
    name: 'Putrefy',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Necrosis. When you make a damage roll that deals Necrotic damage, you can cause one creature taking that damage to have the Poisoned condition until the start of your next turn. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.',
  },

  {
    id: 'rebuke',
    name: 'Rebuke',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Radiant Strike. When you make a damage roll that deals Radiant damage, you can cause one Huge or smaller creature taking the damage to have the Prone condition. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.',
  },

  {
    id: 'treacherous-allure',
    name: 'Treacherous Allure',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Enchanting Presence. You always have the Charm Person spell prepared. You can cast it without a spell slot, and you must finish a Long Rest before you can cast it in this way again. You can also cast it using spell slots you have of the appropriate level. Your spellcasting ability for the spell is the ability increased by this feat. Inevitable Betrayal. You have Advantage on attack rolls against creatures with the Charmed condition.',
  },

  {
    id: 'vampire-touched',
    name: 'Vampire Touched',
    category: 'general',
    source: 'general',
    prerequisites: 'Level 4+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Vampire Magic. Choose one level 1 spell from the Enchantment or Illusion school of magic. You always have that spell and the Spider Climb spell prepared. You can cast each of these spells without expending a spell slot, but when you cast Spider Climb this way, you must target yourself, and you must finish a Long Rest before you can cast each spell in this way again. You can also cast either spell using spell slots you have of the appropriate level. Your spellcasting ability for the spells is the ability increased by this feat.',
  },

  // ---------------- Fighting Style Feats ----------------
  {
    id: 'arcane-warrior',
    name: 'Arcane Warrior',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'You learn two Wizard cantrips of your choice. Mage Hand and Ray of Frost are recommended. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). Whenever you gain a level, you can replace one of these cantrips with another Wizard cantrip.',
  },

  {
    id: 'archery',
    name: 'Archery',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'You gain a +2 bonus to attack rolls you make with Ranged weapons.',
  },

  {
    id: 'blind-fighting',
    name: 'Blind Fighting',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'You have Blindsight with a range of 10 feet.',
  },

  {
    id: 'defense',
    name: 'Defense',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'While you\'re wearing Light, Medium, or Heavy armor, you gain a +1 bonus to Armor Class.',
  },

  {
    id: 'dueling',
    name: 'Dueling',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'When you\'re holding a Melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
  },

  {
    id: 'great-weapon-fighting',
    name: 'Great Weapon Fighting',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'When you roll damage for an attack you make with a Melee weapon that you are holding with two hands, you can treat any 1 or 2 on a damage die as a 3. The weapon must have the Two-Handed or Versatile property to gain this benefit.',
  },

  {
    id: 'interception',
    name: 'Interception',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'When a creature you can see hits another creature within 5 feet of you with an attack roll, you can take a Reaction to reduce the damage dealt to the target by 1d10 plus your Proficiency Bonus. You must be holding a Shield or a Simple or Martial weapon to use this Reaction.',
  },

  {
    id: 'pack-fighting',
    name: 'Pack Fighting',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'When you make a melee attack with a weapon or an Unarmed Strike against a creature, you gain a +1 bonus to the damage roll if at least one of your allies is within 5 feet of the creature and the ally doesn\'t have the Incapacitated condition. If at least one ally within 5 feet of the creature also has this feat and doesn\'t have the Incapacitated condition, this bonus increases to +2.',
  },

  {
    id: 'prone-fighting',
    name: 'Prone Fighting',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'While you have the Prone condition, you don\'t have Disadvantage due to the Prone condition on attack rolls, and the Prone condition doesn\'t grant Advantage on attack rolls made against you.',
  },

  {
    id: 'protection',
    name: 'Protection',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'When a creature you can see attacks a target other than you that is within 5 feet of you, you can take a Reaction to interpose your Shield if you\'re holding one. You impose Disadvantage on the triggering attack roll and all other attack rolls against the target until the start of your next turn if you remain within 5 feet of the target.',
  },

  {
    id: 'thrown-weapon-fighting',
    name: 'Thrown Weapon Fighting',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'When you hit with a ranged attack roll using a weapon that has the Thrown property, you gain a +2 bonus to the damage roll.',
  },

  {
    id: 'two-weapon-fighting',
    name: 'Two Weapon Fighting',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'When you make an extra attack as a result of using a weapon that has the Light property, you can add your ability modifier to the damage of that attack if you aren\'t already adding it to the damage.',
  },

  {
    id: 'unarmed-fighting',
    name: 'Unarmed Fighting',
    category: 'fighting-style',
    source: 'general',
    prerequisites: 'Fighting Style Feature',
    description:
      'When you hit with your Unarmed Strike and deal damage, you can deal Bludgeoning damage equal to 1d6 plus your Strength modifier instead of the normal damage of an Unarmed Strike. If you aren\'t holding any weapons or a Shield when you make the attack roll, the d6 becomes a d8. At the start of each of your turns, you can deal 1d4 Bludgeoning damage to one creature Grappled by you.',
  },

  // ---------------- Epic Boon Feats ----------------
  {
    id: 'boon-of-combat-prowess',
    name: 'Boon of Combat Prowess',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Peerless Aim. When you miss with an attack roll, you can hit instead. Once you use this benefit, you can\'t use it again until the start of your next turn.',
  },

  {
    id: 'boon-of-dimensional-travel',
    name: 'Boon of Dimensional Travel',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Blink Steps. Immediately after you take the Attack action or the Magic action, you can teleport up to 30 feet to an unoccupied space you can see.',
  },

  {
    id: 'boon-of-energy-resistance',
    name: 'Boon of Energy Resistance',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Energy Resistances. You gain Resistance to two of the following damage types of your choice: Acid, Cold, Fire, Lightning, Necrotic, Poison, Psychic, Radiant, or Thunder. Whenever you finish a Long Rest, you can change your choices. Energy Redirection. When you take damage of one of the types chosen for the Energy Resistances benefit, you can take a Reaction to direct damage of the same type toward another creature you can see within 60 feet of yourself that isn\'\'t behind Total Cover. If you do so, that creature must succeed on a Dexterity saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus) or take damage equal to 2d12 plus your Constitution modifier.',
  },

  {
    id: 'boon-of-erupting-spellpower',
    name: 'Boon of Erupting Spellpower',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 30. Spell Overload. When you cast a spell that deals damage using a spell slot, you can cause its magical energy to surge. You can treat any 1 or 2 on a damage die rolled for the spell as a 3, and creatures that took damage from the spell also have the Prone condition. Once you use this benefit, you can\'t do so again until you roll Initiative or finish a Long or Short rest.',
  },

  {
    id: 'boon-of-fate',
    name: 'Boon of Fate',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Improve Fate. When you or another creature within 60 feet of you succeeds on or fails a D20 Test, you can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once you use this benefit, you can\'t use it again until you roll Initiative or finish a Short or Long Rest.',
  },

  {
    id: 'boon-of-fortitude',
    name: 'Boon of Fortitude',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Fortified Health. Your Hit Point maximum increases by 40. In addition, whenever you regain Hit Points, you can regain additional Hit Points equal to your Constitution modifier. Once you\'ve regained these additional Hit Points, you can\'t do so again until the start of your next turn.',
  },

  {
    id: 'boon-of-irresistible-offense',
    name: 'Boon of Irresistible Offense',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 30. Overcome Defenses. The Bludgeoning, Piercing, and Slashing damage you deal always ignores Resistance. Overwhelming Strike. When you roll a 20 on the d20 for an attack roll, you can deal extra damage to the target equal to the ability score increased by this feat. The extra damage\'s type is the same as the attack\'s type.',
  },

  {
    id: 'boon-of-magic-school-mastery',
    name: 'Boon of Magic School Mastery',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 30. Mastered School. Choose one of the eight schools of magic: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, or Transmutation. Your choice grants you the following features: Rote Casting. Choose a level 1 spell from the chosen school that appears on your class\'s spell list. You always have that spell prepared and can cast it without a spell slot or spell components. Signature Arcanum. Choose a level 7 or lower spell from the chosen school. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. You can also cast these prepared spells using any spell slots you have of the appropriate level. Repeatable. You can take this feat more than once, but you must choose a different school of magic each time.',
  },

  {
    id: 'boon-of-recovery',
    name: 'Boon of Recovery',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Last Stand. When you would be reduced to 0 Hit Points, you can drop to 1 Hit Point instead and regain a number of Hit Points equal to half your Hit Point maximum. Once you use this benefit, you can\'t use it again until you finish a Long Rest. Recover Vitality. You have a pool of ten d10s. As a Bonus Action, you can expend dice from the pool, roll those dice, and regain a number of Hit Points equal to the roll\'s total. You regain all the expended dice when you finish a Long Rest.',
  },

  {
    id: 'boon-of-skill',
    name: 'Boon of Skill',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. All-Around Adept. You gain proficiency in all skills. Expertise. Choose one skill in which you lack Expertise. You gain Expertise in that skill.',
  },

  {
    id: 'boon-of-speed',
    name: 'Boon of Speed',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Escape Artist. As a Bonus Action, you can take the Disengage action, which also ends the Grappled condition on you. Quickness. Your Speed increases by 30 feet.',
  },

  {
    id: 'boon-of-spell-recall',
    name: 'Boon of Spell Recall',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 30. Free Casting. Whenever you cast a spell with a level 1-4 spell slot, roll 1d4. If the number you roll is the same as the slot\'s level, the slot isn\'t expended.',
  },

  {
    id: 'boon-of-the-iron-mind',
    name: 'Boon of the Iron Mind',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Unshakable Focus. When you are maintaining Concentration on an effect, you lose Concentration only if you cast a spell or activate another effect that requires Concentration, if you have the Petrified or Unconscious condition, or if you die.',
  },

  {
    id: 'boon-of-the-night-spirit',
    name: 'Boon of the Night Spirit',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Merge with Shadows. While within Dim Light or Darkness, you can give yourself the Invisible condition as a Bonus Action. The condition ends on you immediately after you take an action, a Bonus Action, or a Reaction. Shadowy Form. While within Dim Light or Darkness, you have Resistance to all damage except Psychic and Radiant.',
  },

  {
    id: 'boon-of-truesight',
    name: 'Boon of Truesight',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Truesight. You have Truesight with a range of 60 feet.',
  },

  {
    id: 'boon-of-siberys',
    name: 'Boon of Siberys',
    category: 'epic-boon',
    source: 'eberron',
    prerequisites: 'Level 19+, Eberron Campaign',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Aberrant Magic. Choose a level 8 or lower spell from the Sorcerer spell list or a spell from the Siberys Dragonmark Spells table (the table includes dragonmark suggestions if you\'d like to associate a spell with one of the marks). You always have that spell prepared. You can cast it once without a spell slot or spell components, and you regain the ability to cast it in that way when you finish a Short or Long Rest. You can also cast this spell using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you gain this feat). Siberys Dragonmark Spells Animal Shapes: Handling / Control Weather: Storm / Demiplane: Making / Heroes\' Feast: Hospitality / Maze: Warding / Mind Blank: Sentinel / Plane Shift: Passage / Project Image: Shadow / Regenerate: Healing / Symbol: Scribing / Teleport: Finding / True Seeing: Detection',
  },

  {
    id: 'boon-of-bloodshed',
    name: 'Boon of Bloodshed',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Killer\'s Fortune. When an enemy you can see is reduced to 0 Hit Points, you gain Advantage on the next attack roll you make before the end of your next turn. Power from Pain. Once per turn, when you make an attack roll while Bloodied, you can deal extra damage to the target equal to your Proficiency Bonus. The extra damage\'s type is the same as the attack\'s type.',
  },

  {
    id: 'boon-of-bountiful-health',
    name: 'Boon of Bountiful Health',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Augmented Health. When you gain Temporary Hit Points, increase the number of Temporary Hit Points you gain by 5. Superior Recuperation. When you spend one or more Hit Point Dice to regain Hit Points, you can instead use the highest number possible for each die.',
  },

  {
    id: 'boon-of-communication',
    name: 'Boon of Communication',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 30. Cunning Speaker. You don\'t have Disadvantage on ability checks to influence Hostile creatures. Gifted Interpreter. You understand the literal meaning of any language you hear or see signed, and you can understand the literal meaning of any written language you see. Mental Communication. You gain telepathy with a range of 120 feet.',
  },

  {
    id: 'boon-of-desperate-resilience',
    name: 'Boon of Desperate Resilience',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase your Strength or Constitution score by 1, to a maximum of 30. Defense of Body and Mind. While you are Bloodied, you have Resistance to every damage type except Force.',
  },

  {
    id: 'boon-of-exquisite-radiance',
    name: 'Boon of Exquisite Radiance',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Eternal Rest. Creatures you reduce to 0 Hit Points can\'t become Undead. Powerful Radiance. When you make a damage roll that deals Radiant damage, you can instead use the highest number possible for each damage die. Once you use this benefit, you can\'t do so again until you finish a Long Rest.',
  },

  {
    id: 'boon-of-fluid-forms',
    name: 'Boon of Fluid Forms',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 30. Shapechanger. You can take a Magic action to shape-shift into a Beast, Humanoid, or Monstrosity with a Challenge Rating no higher than 10. When you shape-shift, you gain a number of Temporary Hit Points equal to the Hit Points of the form. The shape-shifting effect lasts for 1 hour, and it ends early if you have no Temporary Hit Points left or if you take a Magic action to return to your true form. Your game statistics are replaced by the stat block of the chosen form, but you retain your creature type; alignment; personality; Intelligence, Wisdom, and Charisma scores; Hit Points; Hit Point Dice; proficiencies; and ability to communicate. If you have the Spellcasting or Pact Magic feature, you retain it too. Upon shape-shifting, you determine whether your equipment drops to the ground or changes in size and shape to fit the new form while you\'re in it. Once you use this benefit, you can\'t do so again until you finish a Long Rest. Hardy Transformation. When you gain Temporary Hit Points when you shape-shift, increase that number of Temporary Hit Points by 20.',
  },

  {
    id: 'boon-of-fortune-s-favor',
    name: 'Boon of Fortune\'s Favor',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Saving Throw Reroll. When you fail a saving throw, you can reroll it and must use the new roll. Once you use this benefit, you can\'t do so again until the start of your next turn.',
  },

  {
    id: 'boon-of-poison-mastery',
    name: 'Boon of Poison Mastery',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Antitoxic. You have Immunity to Poison damage and the Poisoned condition. Perfect Poisoner. Once per turn, when you roll dice to determine Poison damage a creature takes from your attack, spell, or feature, you can instead use the highest number possible for each die.',
  },

  {
    id: 'boon-of-revelry',
    name: 'Boon of Revelry',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 30. Inspire Dance. You always have the Otto\'s Irresistible Dance spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it that way when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level. When you cast the spell, it requires no spell components, and taking damage doesn\'t break your Concentration on it. Sing Out. While a creature that failed its saving throw against your Otto\'s Irresistible Dance has the Charmed condition from that spell, it can\'t cast spells with Verbal components, and it sings delightful nonsense if it can sing.',
  },

  {
    id: 'boon-of-terror',
    name: 'Boon of Terror',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase your Charisma score by 1, to a maximum of 30. Fearless. You have Immunity to the Frightened condition. Flee, Fools! When a creature with the Frightened condition starts its turn within 60 feet of you, you can take a Reaction to stoke its terror, provided you can see the creature and it isn\'t behind Total Cover. If you do so, the creature must succeed on a Wisdom saving throw (DC 8 plus your Charisma modifier and your Proficiency Bonus) or spend its turn moving away from you by the fastest available means. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest. Intimidating. You gain Proficiency in the Intimidation skill if you don\'t already have it. You also gain Expertise in Intimidation.',
  },

  {
    id: 'boon-of-the-bright-sun',
    name: 'Boon of the Bright Sun',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase your Constitution, Wisdom, or Charisma score by 1, to a maximum of 30. Daylight Presence. As a Bonus Action, you radiate a 30-foot Emanation of Bright Light that is sunlight. If any of the Emanation\'s area overlaps with an area of Darkness created by a spell, that spell is dispelled. The Emanation lasts until you dismiss it (no action required), die, or have the Incapacitated condition. Fortifying Light. When your Daylight Presence is active, at the start of each of your turns, you and allies you can see in your Daylight Presence gain 10 Temporary Hit Points.',
  },

  {
    id: 'boon-of-the-furious-storm',
    name: 'Boon of the Furious Storm',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+, Spellcasting or Pact Magic Feature',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 30. Eye of the Storm. You have Resistance to Lightning and Thunder damage. While you are Bloodied, you have Immunity to Lightning and Thunder damage. Storm\'s Strength. Creatures have Disadvantage on saving throws against your spells that deal Lightning or Thunder damage.',
  },

  {
    id: 'boon-of-the-soul-drinker',
    name: 'Boon of the Soul Drinker',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Grave Resistance. You have Resistance to Cold damage and Necrotic damage. Siphon Life. When an enemy within 120 feet of you is reduced to 0 Hit Points, you can take a Reaction to regain 50 Hit Points. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.',
  },

  {
    id: 'boon-of-blazing-dawn',
    name: 'Boon of Blazing Dawn',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Beloved of the Sun. You have Immunity to Radiant damage. Blazing Strike. When you hit a creature with a weapon attack, the damage can be Radiant or the weapon\'s normal damage type (your choice). Burst of Sunlight. Once per turn when you hit a creature with an attack that deals Radiant damage, you can emit Bright Light in a 30-foot radius from yourself and Dim Light for an additional 30 feet until the start of your next turn. This light is sunlight.',
  },

  {
    id: 'boon-of-looming-shadows',
    name: 'Boon of Looming Shadows',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 30. Shadowy Stretch. When you take the Attack action, your reach for your Melee weapon attacks increases by 10 feet until the end of your turn. Dancing Silhouette. You can take the Dodge action as a Bonus Action.',
  },

  {
    id: 'boon-of-misty-escape',
    name: 'Boon of Misty Escape',
    category: 'epic-boon',
    source: 'item',
    prerequisites: 'Level 19+',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 30. Gaseous Form. If you drop to 0 Hit Points but aren\'t killed outright, you can instead drop to 1 Hit Point and cast Gaseous Form without expending a spell slot (no action required). When you cast this spell this way, you can target only yourself, your Fly Speed is 20 feet, and you regain 10 Hit Points at the start of each of your turns for the spell\'s duration. The spell\'s spellcasting ability is the ability increased by this feat. Once you use this benefit, you can\'t do so again until you finish a Long Rest.',
  },

  // ---------------- Dragonmark Feats ----------------
  {
    id: 'aberrant-dragonmark',
    name: 'Aberrant Dragonmark',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t Have Another Dragonmark Feat',
    description:
      'Aberrant Fortitude. When you fail a Constitution saving throw, you can take a Reaction to roll 1d4 and add the number rolled to the save, potentially turning the failure into a success. Once you\'ve used this benefit, you can\'t use it again until you finish a Long Rest. Aberrant Magic. You know one cantrip of your choice from the Sorcerer spell list. Also, choose a level 1 spell from that spell list. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Short or Long Rest. You can also cast this spell using any spell slots you have. Constitution is your spellcasting ability for this spell. Aberrant Surge. When you cast the level 1 spell from this feat, you can expend one of your Hit Point Dice and roll it. If you roll an even number, you gain a number of Temporary Hit Points equal to the number rolled. If you roll an odd number, one creature within 30 feet of you (not including you) takes Force damage equal to the number rolled. If no other creatures are in range, you take the damage.',
  },

  {
    id: 'mark-of-detection',
    name: 'Mark of Detection',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t have another Dragonmark Feat',
    description:
      'Deductive Intuition. When you make an Intelligence (Investigation) or Wisdom (Insight) check, you can roll 1d4 and add the number rolled to the ability check. Magical Detection. You always have the Detect Magic and Detect Poison and Disease spells prepared. You can cast each spell once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast these spells using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). When you reach character level 3, you also always have the See Invisibility spell prepared and can cast it the same way. Spells of the Mark. If you have the Spellcasting or Pact Magic feature, the spells on the Mark of Detection Spells table are added to that feature\'s spell list. Mark of Detection Spells 1: Detect Evil and Good, Identify / 2: Detect Thoughts, Find Traps / 3: Clairvoyance, Nondetection / 4: Arcane Eye, Divination / 5: Legend Lore',
  },

  {
    id: 'mark-of-finding',
    name: 'Mark of Finding',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t have another Dragonmark Feat',
    description:
      'Hunter\'s Intuition. When you make a Wisdom (Perception or Survival) check, you can roll 1d4 and add the number rolled to the ability check. Finder\'s Magic. You always have the Hunter\'s Mark spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast it using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). When you reach character level 3, you also always have the Locate Object spell prepared and can cast it the same way. Spells of the Mark. If you have the Spellcasting or Pact Magic feature, the spells on the Mark of Finding Spells table are added to that feature\'s spell list. Mark of Finding Spells 1: Faerie Fire, Longstrider / 2: Locate Animals or Plants, Mind Spike / 3: Clairvoyance, Speak with Plants / 4: Divination, Locate Creature / 5: Commune with Nature',
  },

  {
    id: 'mark-of-handling',
    name: 'Mark of Handling',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t have another Dragonmark Feat',
    description:
      'Wild Intuition. When you make an Intelligence (Nature) or Wisdom (Animal Handling) check, you can roll 1d4 and add the number rolled to the ability check. Primal Connection. You always have the Animal Friendship and Speak with Animals spells prepared. You can cast each spell once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast these spells using any spell slots you have. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). Monstrous Connections. When you reach character level 3, you can target a Monstrosity when you cast Animal Friendship or Speak with Animals if the creature\'s Intelligence score is 3 or lower. Spells of the Mark. If you have the Spellcasting or Pact Magic feature, the spells on the Mark of Handling Spells table are added to that feature\'s spell list. Mark of Handling Spells 1: Command, Find Familiar / 2: Beast Sense, Calm Emotions / 3: Beacon of Hope, Conjure Animals / 4: Aura of Life, Dominate Beast / 5: Awaken',
  },

  {
    id: 'mark-of-healing',
    name: 'Mark of Healing',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t have another Dragonmark Feat',
    description:
      'Medical Intuition. When you make a Wisdom (Medicine) check or an ability check using a Herbalism Kit, you can roll 1d4 and add the number rolled to the ability check. Healing Touch. You always have the Cure Wounds spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast it using any spell slots you have you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). When you reach character level 3, you also always have the Lesser Restoration spell prepared and can cast it the same way. Spells of the Mark. If you have the Spellcasting or Pact Magic feature, the spells on the Mark of Healing Spells table are added to that feature\'s spell list. Mark of Healing Spells 1: False Life, Healing Word / 2: Arcane Vigor, Prayer of Healing / 3: Aura of Vitality, Mass Healing Word / 4: Aura of Life, Aura of Purity / 5: Greater Restoration',
  },

  {
    id: 'mark-of-hospitality',
    name: 'Mark of Hospitality',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t have another Dragonmark Feat',
    description:
      'Ever Hospitable. When you make a Charisma (Persuasion) check or an ability check using Brewer\'s Supplies or Cook\'s Utensils, you can roll 1d4 and add the number rolled to the ability check. Innkeeper\'s Magic. You always have the Purify Food and Drink and Unseen Servant spells prepared. You can cast each spell once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast these spells using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). When you reach character level 3, you also always have the Calm Emotions spell prepared and can cast it the same way. Spells of the Mark. If you have the Spellcasting or Pact Magic feature, the spells on the Mark of Hospitality Spells table are added to that feature\'s spell list. Mark of Hospitality Spells 1: Goodberry, Sleep / 2: Aid, Enhance Ability / 3: Create Food and Water, Leomund\'s Tiny Hut / 4: Aura of Purity, Mordenkainen\'s Private Sanctum / 5: Hallow',
  },

  {
    id: 'mark-of-making',
    name: 'Mark of Making',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t Have Another Dragonmark Feat',
    description:
      'Artisan\'s Intuition. When you make an Intelligence (Arcana) check or an ability check using Artisan\'s Tools, you can roll 1d4 and add the number rolled to the ability check. Spellsmith. You know the Mending cantrip. You also always have the Magic Weapon spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast it using any spell slots you have. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). Spells of the Mark. If you have the Spellcasting or Pact Magic class feature, the spells on the Mark of Making Spells table are added to that feature\'s spell list. 1: Identify, Tenser\'s Floating Disk / 2: Continual Flame, Spiritual Weapon / 3: Conjure Barrage, Elemental Weapon / 4: Fabricate, Stone Shape / 5: Creation',
  },

  {
    id: 'mark-of-passage',
    name: 'Mark of Passage',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    description:
      'Dragonmark Feat (Prerequisite: Eberron Campaign, Can\'t have another Dragonmark Feat) Courier\'s Speed. Your Speed increases by 5 feet. Intuitive Motion. When you make a Strength (Athletics) or Dexterity (Acrobatics) check, you can roll 1d4 and add the number rolled to the ability check. Magical Passage. You always have the Misty Step spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast it using any spell slots you have. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). Spells of the Mark. If you have the Spellcasting or Pact Magic feature, the spells on the Mark of Passage Spells table are added to that feature\'s spell list. Mark of Passage Spells 1: Expeditious Retreat, Jump / 2: Find Steed, Pass without Trace / 3: Blink, Phantom Steed / 4: Dimension Door, Freedom of Movement / 5: Teleportation Circle',
  },

  {
    id: 'mark-of-scribing',
    name: 'Mark of Scribing',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t Have Another Dragonmark Feat',
    description:
      'Gifted Scribe. When you make an Intelligence (History) check or an ability check using Calligrapher\'s Supplies, you can roll 1d4 and add the number rolled to the ability check. Scribe\'s Insight. You know the Message cantrip. You also always have the Comprehend Languages spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast it using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). When you reach character level 3, you also always have the Magic Mouth spell prepared and can cast it the same way. Spells of the Mark. If you have the Spellcasting or Pact Magic class feature, the spells on the Mark of Scribing Spells table are added to that feature\'s spell list. Mark of Scribing Spells 1: Command, Illusory Script / 2: Animal Messenger, Silence / 3: Sending, Tongues / 4: Arcane Eye, Confusion / 5: Dream',
  },

  {
    id: 'mark-of-sentinel',
    name: 'Mark of Sentinel',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t Have Another Dragonmark Feat',
    description:
      'Sentinel\'s Intuition. When you make a Wisdom (Insight or Perception) check, you can roll 1d4 and add the number rolled to the ability check. Guardian\'s Shield. You always have the Shield spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast it using any spell slots you have. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). Vigilant Guardian. When a creature you can see within 5 feet of you is hit by an attack roll, you can take a Reaction to swap places with that creature, and you are hit by the attack instead. You can use this feature a number of times equal to your Proficiency Bonus and regain all expended uses when you finish a Long Rest. Spells of the Mark. If you have the Spellcasting or Pact Magic class feature, the spells on the Mark of Sentinel Spells table are added to that feature\'s spell list. Mark of Sentinel Spells 1: Compelled Duel, Shield of Faith / 2: Warding Bond, Zone of Truth / 3: Counterspell, Protection from Energy / 4: Death Ward, Guardian-of-Faith / 5: Bigby\'s Hand',
  },

  {
    id: 'mark-of-shadow',
    name: 'Mark of Shadow',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t Have Another Dragonmark Feat',
    description:
      'Cunning Intuition. When you make a Dexterity (Stealth) or Charisma (Performance) check, you can roll 1d4 and add the number rolled to the ability check. Shape Shadows. You know the Minor Illusion cantrip. You also always have the Invisibility spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast it using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). Spells of the Mark. If you have the Spellcasting or Pact Magic feature, the spells on the Mark of Shadow Spells table are added to that feature\'s spell list. Mark of Shadow Spells 1: Disguise Self, Silent Image / 2: Darkness, Pass without Trace / 3: Clairvoyance, Major Image / 4: Greater Invisibility, Hallucinatory Terrain / 5: Mislead',
  },

  {
    id: 'mark-of-storm',
    name: 'Mark of Storm',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t Have Another Dragonmark Feat',
    description:
      'Windwright\'s Intuition. When you make a Dexterity (Acrobatics) check or an ability check using Navigator\'s Tools, you can roll 1d4 and add the number rolled to the ability check. Storm\'s Boon. You have Resistance to Lightning damage. Storm Magic. You know the Thunderclap cantrip. When you reach character level 3, you also always have the Gust of Wind spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast it using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). Spells of the Mark. If you have the Spellcasting or Pact Magic feature, the spells on the Mark of Storm Spells table are added to that feature\'s spell list. Mark of Storm Spells 1: Feather Fall, Fog Cloud / 2: Levitate, Shatter / 3: Sleet Storm, Wind Wall / 4: Conjure Minor Elementals, Control Water / 5: Conjure Elemental',
  },

  {
    id: 'mark-of-warding',
    name: 'Mark of Warding',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Eberron Campaign, Can\'t Have Another Dragonmark Feat',
    description:
      'Warder\'s Intuition. When you make an Intelligence (Investigation) check or an ability check using Thieves\' Tools, you can roll 1d4 and add the number rolled to the ability check. Wards and Seals. You always have the Alarm and Mage Armor spells prepared. You can cast each spell once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast these spells using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). When you reach character level 3, you also always have the Arcane Lock spell prepared and can cast it the same way. Spells of the Mark. If you have the Spellcasting or Pact Magic feature, the spells on the Mark of Warding Spells table are added to that feature\'s spell list. Mark of Warding Spells 1: Armor of Agathys, Sanctuary / 2: Knock, Nystul\'s Magic Aura / 3: Glyph of Warding, Magic Circle / 4: Leomund\'s Secret Chest, Mordenkainen\'s Faithful Hound / 5: Antilife Shell',
  },

  {
    id: 'greater-aberrant-mark',
    name: 'Greater Aberrant Mark',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Aberrant Dragonmark Feat',
    description:
      'Ability Score Increase. Increase your Constitution score by 1, to a maximum of 20. Improved Fortitude. When you use the Aberrant Fortitude benefit of your Aberrant Dragonmark feat, you can roll 1d6 instead of 1d4. You also now regain your use of Aberrant Fortitude whenever you finish a Short or Long Rest. Mark of Inspiration. When you cast a cantrip, you can roll one or two of your unexpended Hit Point Dice. You gain a number of Temporary Hit Points equal to the number rolled plus your Constitution modifier, and one creature of your choice within 30 feet of you (not including you) takes Force damage equal to the number rolled. Those dice are then expended. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'greater-mark-of-detection',
    name: 'Greater Mark of Detection',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Detection Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Deductive Intuition benefit of your Mark of Detection feat, you can roll 1d6 instead of 1d4. Shared Detection. When you use the Magical Detection benefit of your Mark of Detection feat to cast See Invisibility without a spell slot, you can choose one creature you can see within 30 feet of yourself. That creature also gains the benefits of the spell for its duration.',
  },

  {
    id: 'greater-mark-of-finding',
    name: 'Greater Mark of Finding',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Finding Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Hunter\'s Intuition benefit of your Mark of Finding feat, you can roll 1d6 instead of 1d4. Improved Finding. When you use the Finder\'s Magic benefit of your Mark of Finding to cast Hunter\'s Mark without a spell slot, the range of the spell is doubled, and you can modify the spell so that the target can\'t benefit from the Invisible condition for the duration.',
  },

  {
    id: 'greater-mark-of-handling',
    name: 'Greater Mark of Handling',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Handling Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Wild Intuition benefit of your Mark of Handling feat, you can roll 1d6 instead of 1d4. Improved Handling. While you are mounted, immediately after you hit a target within 5 feet of your mount with a melee attack roll, your mount can take a Reaction to move up to its Speed or take the Attack action to make one attack only (your choice). Subdue Animal. As a Magic action, you exert command over one Beast or Monstrosity you can see within 30 feet of yourself. The target must succeed on a Wisdom saving throw (DC 8 plus your Wisdom modifier and Proficiency Bonus) or have the Frightened condition until the start of your next turn. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'greater-mark-of-healing',
    name: 'Greater Mark of Healing',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Healing Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Medical Intuition benefit of your Mark of Healing feat, you can roll 1d6 instead of 1d4. Improved Healing. You can now use the Healing Touch benefit of your Mark of Healing feat to cast Cure Wounds without using a spell slot a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. Additionally, when you cast Cure Wounds and roll dice to determine the number of Hit Points restored, you can treat any 1 or 2 on a roll as a 3.',
  },

  {
    id: 'greater-mark-of-hospitality',
    name: 'Greater Mark of Hospitality',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Hospitality Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Ever Hospitable benefit of your Mark of Hospitality feat, you can roll 1d6 instead of 1d4. Inspired Hospitality. When you cast Purify Food and Drink, you can modify the spell so that instead of its normal effect, each creature of your choice within 30 feet of you is refreshed. Each affected creature\'s Exhaustion level is reduced by 1, and the creature gains Temporary Hit Points equal to your Proficiency Bonus plus your Intelligence, Wisdom, or Charisma modifier (choose when you select this feat). Once you modify the spell with this benefit, you can\'t do so again until you finish a Long Rest.',
  },

  {
    id: 'greater-mark-of-making',
    name: 'Greater Mark of Making',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Making Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Artisan\'s Intuition benefit of your Mark of Making feat, you can roll 1d6 instead of 1d4. Improved Making. When you use the Spellsmith benefit of your Mark of Making feat to cast Magic Weapon without a spell slot, you cast the spell as its level 3 version.',
  },

  {
    id: 'greater-mark-of-passage',
    name: 'Greater Mark of Passage',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Passage Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Intuitive Motion benefit of your Mark of Passage feat, you can roll 1d6 instead of 1d4. Inspired Passage. When you use the Magical Passage benefit of your Mark of Passage feat to cast Misty Step without a spell slot, you can also choose up to two willing creatures you can see within 30 feet of yourself before you teleport. Each target can then take a Reaction to also teleport up to 30 feet to an unoccupied space it can see.',
  },

  {
    id: 'greater-mark-of-scribing',
    name: 'Greater Mark of Scribing',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Scribing Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Gifted Scribe benefit of your Mark of Scribing feat, you can roll 1d6 instead of 1d4. Inspired Scribing. When you cast Comprehend Languages, you can modify the spell to encompass up to three willing creatures you can see within 30 feet of yourself. Each chosen creature also gains the benefits of the spell for the duration. In addition, for the duration of the spell, you and the chosen creatures can communicate telepathically with each other while within 1 mile of each other. Once you modify the spell with this benefit, you can\'t do so again until you finish a Long Rest.',
  },

  {
    id: 'greater-mark-of-sentinel',
    name: 'Greater Mark of Sentinel',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Sentinel Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Sentinel\'s Intuition benefit of your Mark of Sentinel feat, you can roll 1d6 instead of 1d4. Improved Sentinel. When you use the Vigilant Guardian benefit of your Mark of Sentinel feat, you can also make one attack with a weapon or an Unarmed Strike as part of that same Reaction.',
  },

  {
    id: 'greater-mark-of-shadow',
    name: 'Greater Mark of Shadow',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Shadow Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Cunning Intuition benefit of your Mark of Shadow feat, you can roll 1d6 instead of 1d4. Improved Shadow. When you use the Shape Shadows benefit of your Mark of Shadow feat to cast Invisibility without a spell slot, you cast the spell as its level 3 version.',
  },

  {
    id: 'greater-mark-of-storm',
    name: 'Greater Mark of Storm',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Storm Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Windwright\'s Intuition benefit of your Mark of Storm feat, you can roll 1d6 instead of 1d4. Improved Storm. When you use the Storm Magic benefit of your Mark of Storm feat to cast Gust of Wind without a spell slot, you also gain a Fly Speed of 60 feet for the duration of the spell.',
  },

  {
    id: 'greater-mark-of-warding',
    name: 'Greater Mark of Warding',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Mark of Warding Feat',
    description:
      'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20. Improved Intuition. When you use the Warder\'s Intuition benefit of your Mark of Warding feat, you can roll 1d6 instead of 1d4. Improved Warding. When a creature makes an attack roll against you or a creature you can see within 30 feet of yourself, you can take a Reaction to impose Disadvantage on that roll. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'potent-dragonmark',
    name: 'Potent Dragonmark',
    category: 'dragonmark',
    source: 'eberron',
    usableAsOriginFeat: true,
    prerequisites: 'Level 4+, Any Dragonmark Feat',
    description:
      'Ability Score Increase. Increase the spellcasting ability score used by your Dragonmark feat by 1, to a maximum of 20. Dragonmark Preparation. You always have the spells on your Spells of the Mark list (if any) prepared. Dragonmark Spellcasting. You have one extra spell slot to cast the spells granted by your Dragonmark feat. The spell slot\'s level is half your level (round up), to a maximum of level 5. You regain the expended slot when you finish a Short or Long Rest. You can use this spell slot to cast only a spell you have prepared because of your Dragonmark feat or the Dragonmark Preparation benefit of this feat.',
  },

  // ---------------- Planar Pact Feats ----------------
  {
    id: 'fey-pact',
    name: 'Fey Pact',
    category: 'planar-pact',
    source: 'general',
    prerequisites: 'Can\'t Have Another Planar Pact Feat',
    description:
      'Fey Bond. You know Sylvan. If you already know Sylvan when you select this feat, you instead learn one language of your choice from the language tables in the Player\'s Handbook. You also gain Proficiency in the Nature skill. Fey Cantrips. You know the Druidcraft cantrip and learn one other cantrip of your choice from the Divination or Enchantment school of magic. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). Honeyed Words. When you fail a Charisma (Deception or Persuasion) check, you can reroll the check, and you must use the new roll. Once this benefit turns a failure into a success, you can\'t use it again until you finish a Long Rest.',
  },

  {
    id: 'infernal-pact',
    name: 'Infernal Pact',
    category: 'planar-pact',
    source: 'general',
    prerequisites: 'Can\'t Have Another Planar Pact Feat',
    description:
      'Infernal Resistance. You have Resistance to Fire damage or Poison damage. Infernal Sight. You gain Darkvision with a range of 30 feet. This Darkvision is unimpeded by magical Darkness. Silver-Tongued. You gain proficiency in the Deception skill.',
  },

  {
    id: 'shadow-pact',
    name: 'Shadow Pact',
    category: 'planar-pact',
    source: 'general',
    prerequisites: 'Can\'t Have Another Planar Pact Feat',
    description:
      'Darkvision. You gain Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 30 feet. Shadow Blood. Whenever you roll a die to determine the number of Hit Points you regain, you can reroll the die if it rolls a 1 while you\'re entirely within Dim Light or Darkness, and you must use the new roll. Shroud of Shadows. You can take a Bonus Action to radiate a 5-foot Emanation of Dim Light around you for 1 minute. It ends early if you dismiss it (no action required) or you have the Incapacitated condition. Once you use this benefit, you can\'t use it again until you finish a Short or Long Rest.',
  },

  {
    id: 'fey-sentinel',
    name: 'Fey Sentinel',
    category: 'planar-pact',
    source: 'general',
    prerequisites: 'Level 4+, Fey Pact Feat',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Fading Target. When an enemy misses you with an attack roll, you can take a Reaction to gain the Invisible condition until the start of your next turn or until immediately after you make an attack roll, deal damage, or cast a spell. Once you use this benefit, you can\'t do so again until you finish a Long Rest. Fey Shift. When you take the Dash action, you can forgo the extra movement to teleport to an unoccupied space you can see within a distance equal to half your Speed instead. Nature\'s Roots. You always have the Entangle spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast it using any spell slots you have. The spell\'s spellcasting ability is the ability increased by this feat. When you reach character level 5, you also always have the Plant Growth spell prepared and can cast it the same way.',
  },

  {
    id: 'fey-tormentor',
    name: 'Fey Tormentor',
    category: 'planar-pact',
    source: 'general',
    prerequisites: 'Level 4+, Fey Pact Feat)',
    description:
      'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Faerie Time Warp. As a Bonus Action, choose up to three creatures you can see within 60 feet of yourself. Each target makes a Wisdom saving throw (DC 8 plus the ability modifier of the score increased by this feat and your Proficiency Bonus). On a failed save, the target\'s Speed is reduced by 10 feet, and it takes a −2 penalty to AC until the end of your next turn. Once you use this benefit, you can\'t use it again until you finish a Long Rest. Hag\'s Hex. You always have the Hex spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast it using any spell slots you have. The spell\'s spellcasting ability is the ability increased by this feat. When you reach character level 5, you also have the Bestow Curse spell prepared and can cast it in the same way.',
  },

  {
    id: 'infernal-bulwark',
    name: 'Infernal Bulwark',
    category: 'planar-pact',
    source: 'general',
    prerequisites: 'Level 4+, Infernal Pact Feat',
    description:
      'Ability Score Increase. Increase your Constitution or Charisma score by 1, to a maximum of 20. Devil\'s Flesh. Your skin thickens and assumes a scaled, leathery texture. While you aren\'t wearing armor or wielding a Shield, your base Armor Class equals 10 plus your Dexterity modifier plus the modifier of the ability increased by this feat. Infernal Protection. You always have the Armor of Agathys spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. When you cast it without a spell slot using this feature, you cast this spell as its level 2 version, and it deals Fire damage instead of Cold damage. You can also cast the spell using any spell slots you have of the appropriate level. Charisma is your spellcasting ability for this spell. Vengeful Surge. Whenever a creature you can see within 60 feet of yourself forces you to make a saving throw and you succeed, you can take a Reaction to deal 1d10 Fire damage to that creature. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
  },

  {
    id: 'infernal-dragoon',
    name: 'Infernal Dragoon',
    category: 'planar-pact',
    source: 'general',
    prerequisites: 'Level 4+, Infernal Pact Feat',
    description:
      'Ability Score Increase. Increase your Constitution or Charisma score by 1, to a maximum of 20. Devilish Aura. Your close association with diabolic powers unsettles others. You can take a Magic action to manifest an aura of fear in a 30-foot Emanation originating from yourself. Each creature of your choice in that area makes a Charisma saving throw (DC 8 plus the modifier of the ability increased by this feat plus your Proficiency Bonus). On a failed save, it has the Frightened condition until the end of its next turn. On a successful save, a creature is unaffected, and it is immune to this ability for 24 hours. Devil\'s Favor. You can call on your infernal patron to aid you. When you make a D20 Test, you can add a +2 bonus to the roll. Once you use this benefit, you can\'t do so again until you finish a Long Rest. Diabolic Empowerment. You always have the Magic Weapon spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. When you cast it without a spell slot using this feature, the spell\'s duration becomes 8 hours for that casting. You can also cast the spell using any spell slots you have of the appropriate level. Charisma is your spellcasting ability for this spell.',
  },

  {
    id: 'shadow-trapper',
    name: 'Shadow Trapper',
    category: 'planar-pact',
    source: 'general',
    prerequisites: 'Level 4+, Shadow Pact Feat',
    description:
      'Your affinity with the Shadowfell\'s melancholy grants you the following benefits. Ability Score Increase. Increase your Strength or Wisdom score by 1, to a maximum of 20. Dangerous Shroud. You have Advantage on attack rolls against creatures within the Emanation of your Shroud of Shadows. Sorrowful Embrace. At the start of its turn, a creature Grappled by you must succeed on a Wisdom saving throw (DC equals 8 plus the ability modifier of the score increased by this feat and your Proficiency Bonus) or take Psychic damage equal to 1d4 plus the ability modifier of the score increased by this feat.',
  },

  {
    id: 'shadow-weaver',
    name: 'Shadow Weaver',
    category: 'planar-pact',
    source: 'general',
    prerequisites: 'Level 4+, Shadow Pact Feat',
    description:
      'Your commitment to your planar pact grants you the following benefits. Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Create Shadow. You always have the Darkness spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level. The spell\'s spellcasting ability is the ability increased by this feat. Manipulate Shadow. You can take a Bonus Action to increase or decrease the radius of a Darkness spell you cast by 5 feet (minimum 5 feet, maximum 25 feet) or move the area of Darkness to a space within 60 feet of you.',
  },

  // ---------------- Dark Gift Feats ----------------
  {
    id: 'aberrant-anatomy',
    name: 'Aberrant Anatomy',
    category: 'dark-gift',
    source: 'ravenloft',
    usableAsOriginFeat: true,
    prerequisites: 'Ravenloft Campaign',
    description:
      'Exposure to alien horrors like those of the Far Realm has warmed your physical form in supernatural ways. You gain the following features. Breathless. You can hold your breath for 1 hour. Extrasensory Perception. You have proficiency in the Perception skill, if you lack it. You also gain Expertise in that skill. In addition, you have Blindsight with a range of 15 feet. Warping Flesh. Immediately after you make a D20 Test and roll a 1 on the d20, the aberrant influence infecting your form flares, wrenching control of your flesh. Make a Constitution saving throw (DC 13 plus your Proficiency Bonus). On a failed save, you have the Stunned condition until the end of your next turn.',
  },

  {
    id: 'echoing-soul',
    name: 'Echoing Soul',
    category: 'dark-gift',
    source: 'ravenloft',
    usableAsOriginFeat: true,
    prerequisites: 'Ravenloft Campaign',
    description:
      'You experience echoes from a past or alternate life. You gain the following features. Channelled Prowess. You have proficiency in two skills of your choice. In addition, choose one skill you have proficiency in. You gain Expertise in that skill. Whenever you finish a Long Rest you can change your choice of for this benefit. Inherent Tongues. You know one additional language of your choice, which you choose from the language tables in the Player\'s Handbook. Intrusive Echoes. Immediately after you make a D20 Test and roll a 1 on the d20, memories and sensations from your soul\'s other life threaten to overtake you. Make a Constitution saving throw (DC 13 plus your Proficiency Bonus). On a failed save, you have the Incapacitated condition until the end of your next turn. While you are Incapacitated in this way, your Speed is halved.',
  },

  {
    id: 'gathered-whispers',
    name: 'Gathered Whispers',
    category: 'dark-gift',
    source: 'ravenloft',
    usableAsOriginFeat: true,
    prerequisites: 'Ravenloft Campaign',
    description:
      'You are haunted by a cacophony of whispering spirits only you can hear. You gain the following features. Spirit Whispers. You learn the Message spell and can cast it without Material components. Additionally, you always have the Augury spell prepared. You can cast it without a spell slot or spell components, and you must finish a Long Rest before you can cast it in this way again. You can also cast the spell using any spell slots you have. Intelligence, Wisdom, or Charisma is your spellcasting ability for this benefit (choose when you select this feat). Unearthly Scream. When you are hit by an attack roll, you can take a Reaction to channel your haunting spirits into a protective, otherworldly scream. You can add your Proficiency Bonus to your AC against that attack, potentially causing it to miss. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. Voices from Beyond. Immediately after you make a D20 Test and roll a 1 on the d20, the haunting whispers rise to a ghastly volume. Make a Wisdom saving throw (DC 13 plus your Proficiency Bonus). On a failed save, you have the Deafened condition until the end of your next turn. While Deafened, you have Disadvantage on ability checks and attack rolls.',
  },

  {
    id: 'living-shadow',
    name: 'Living Shadow',
    category: 'dark-gift',
    source: 'ravenloft',
    usableAsOriginFeat: true,
    prerequisites: 'Ravenloft Campaign',
    description:
      'The shadow you cast is animate and ever-present - sometimes it even acts according to its own will. You gain the following features. Grasping Shadow. You learn the Mage Hand spell and can cast it without spell components. Intelligence, Wisdom or Charisma is your spellcasting ability for this spell (choose when you select this feat). Lengthened Strike. When you make a melee attack roll as part of the Attack or Magic action on your turn, you can increase your reach for that attack by 10 feet, as your shadow stretches to aid you. You can use this feature a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. Ominous Will. Immediately after you make a D20 Test and roll a 1 on the d20, your shadow attempts to exert its will. Make a Wisdom saving throw (DC 13 plus your Proficiency Bonus). On a failed save, you have the Incapacitated condition until the start of your next turn, at which point you must roll on the Shadow\'s Will table to determine what you do during that turn. 1: You don\'t take any action or a Bonus Action, and you use all your movement to move. Roll 1d4 for the direction 1, north: 2, east; 3, south; 4, west. / 2-6: You don\'t move or take a Bonus Action, and you take the Attack action to make one melee attack against a random creature within reach. If none are within reach, you take no action. / 7-8: You have the Prone condition, and your turn ends.',
  },

  {
    id: 'mist-walker',
    name: 'Mist Walker',
    category: 'dark-gift',
    source: 'ravenloft',
    usableAsOriginFeat: true,
    prerequisites: 'Ravenloft Campaign',
    description:
      'You know how to slip through the Mists\' grasp, but this freedom comes at a price: If you remain in one area for too long, the Mists find you and drain your life force. You gain the following features. Domain Traveler. When you enter the Mists intent on reaching a specific domain, you are treated as if you possess a Mist talisman keyed to that domain. To use this feature, you must know the name of the domain you have chosen as your destination, but you don\'t need to have previously visited that land. This trait doesn\'t allow you to bypass domain borders closed by a Darklord\'s will. Mist Walk. When you take damage or fail a saving throw to avoid or end the Grappled or Restrained condition, you can take a Reaction and teleport up to 15 feet to an unoccupied space you can see. You can use this feature a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. Poisoned Roots. When you finish a Long Rest, the world around you in a 10-mile radius becomes a siphon that leeches away at your vitality. Whenever you finish a Short Rest in that area, make a Constitution saving throw (DC 13 plus your Proficiency Bonus). On a failed save, you get no benefits from finishing that rest.',
  },

  {
    id: 'second-skin',
    name: 'Second Skin',
    category: 'dark-gift',
    source: 'ravenloft',
    usableAsOriginFeat: true,
    prerequisites: 'Ravenloft Campaign',
    description:
      'There is another side of you that most people never see: a beast, a terrifying avenger, or a walking nightmare. You gain the following features. Alternate Form. You always have the Alter Self spell prepared. You can cast it without a spell slot or spell components, and you must finish a Long Rest before you can cast it in this way again. You can also cast it using spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). When you cast Alter Self without a spell slot using this feature, it doesn\'t require Concentration. Involuntary Change. Certain circumstances can involuntarily trigger your transformation. When you select this feat, roll on the Change Catalyst table to determine what triggers your change. After you experience the catalyst, at the start of your next turn, make a Charisma saving throw (DC 13 plus your Proficiency Bonus). On a failed save, you immediately use Alternate Form to cast Alter Self without a spell slot. If you\'ve already expended the use of that feature, you instead have the Stunned condition until the start of your next turn. 1: Seeing a particular phase of the moon / 2: Smelling the scent of a certain type of flower / 3: Hearing temple bells ringing / 4: Hearing a particular melody / 5: Touching pure silver with your bare skin / 6: Seeing someone who resembles a specific individual',
  },

  {
    id: 'symbiotic-being',
    name: 'Symbiotic Being',
    category: 'dark-gift',
    source: 'ravenloft',
    usableAsOriginFeat: true,
    prerequisites: 'Ravenloft Campaign',
    description:
      'A second being resides within your body, offering knowledge and assistance while furthering its own agenda. You gain the following features. Entwined Existence. The symbiote can\'t be targeted. If you die, so does your symbiote. If you are returned to life, your symbiote also revives. Second Mind. You gain proficiency in one of the following skills: Arcana, Deception, History, Intimidation, Insight, Investigation, Nature, Religion, Perception, or Persuasion. You also know one additional language of your choice, chosen from the language tables in the Player\'s Handbook. Sustained Symbiosis. When you fail a saving throw, you can take a Reaction and expend one of your Hit Dice. Roll the die and add the number rolled to the saving throw, potentially turning the failure into a success. You can use this feature a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. Symbiotic Agenda. Immediately after you make a D20 Test and roll a 1 on the d20, your symbiote attempts to assert control. Make a Charisma saving throw (DC 13 plus your Proficiency Bonus). On a failed save, you have the Charmed condition for 1d12 hours. While Charmed, you must try to follow the symbiote\'s commands and further its goals, as determined by the DM. Whenever you take damage, you can repeat this save, ending the effect on a success. At the DM\'s discretion, you might make this saving throw whenever you act contrary to the symbiote\'s agenda.',
  },

  {
    id: 'touch-of-death',
    name: 'Touch of Death',
    category: 'dark-gift',
    source: 'ravenloft',
    usableAsOriginFeat: true,
    prerequisites: 'Ravenloft Campaign',
    description:
      'Deathly power resides within you, bursting out at the slightest provocation. You gain the following features. Death Touch. You learn the Chill Touch spell and can cast it without spell components. Necrotic damage you deal with this spell ignores Resistance. Intelligence, Wisdom, or Charisma is your spellcasting ability for this spell (choose when you select this feat). Pull of the Grave. You have Disadvantage on Death Saving Throws.',
  },

  {
    id: 'watchers',
    name: 'Watchers',
    category: 'dark-gift',
    source: 'ravenloft',
    usableAsOriginFeat: true,
    prerequisites: 'Ravenloft Campaign',
    description:
      'Something unnatural is always watching you, taking the form of scurrying vermin and other eerie creatures. You gain the following features. Borrowed Eyes. You always have the Beast Sense and Speak with Animals spells prepared. You can cast each spell without a spell slot, and you must finish a Long Rest before you can cast it in this way again. You can also cast these spells using spell slots you have of the appropriate level. Heightened Suspicion. Whenever you take the Search action, you can roll 1d4 and add the number rolled to any ability check made as part of that action. Incessant Watchers. You have Disadvantage on saving throws made against the Scrying spell. In addition, immediately after you make a D20 Test and roll a 1 on the d20, paranoia threatens to overwhelm you. Make a Wisdom saving throw (DC 13 plus your Proficiency Bonus). On a failed save, you have Disadvantage on D20 Tests for 1 minute. You can repeat the save at the end of each of your turns, ending the effect early on a success.',
  },

];

export const FEATS_BY_ID: Record<string, FeatDef> = Object.fromEntries(
  FEATS.map((f) => [f.id, f]),
);

export const ORIGIN_FEATS: FeatDef[] = FEATS.filter((f) => f.source === 'origin');
export const GENERAL_FEATS: FeatDef[] = FEATS.filter((f) => f.source === 'general');
