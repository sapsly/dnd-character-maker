import type { BackgroundDef } from '../types/character';

/**
 * The 16 backgrounds of the 2024 Player's Handbook (SRD 5.2).
 *
 * ## Provenance
 *
 * Only FOUR of these backgrounds appear in the SRD 5.2 free-rules document:
 * Acolyte, Criminal, Sage and Soldier. Those four are tagged `source: 'srd'`
 * and were verified line-by-line against `srd/character-origins.md`.
 *
 * The other twelve (Artisan, Charlatan, Entertainer, Farmer, Guard, Guide,
 * Hermit, Merchant, Noble, Sailor, Scribe, Wayfarer) come from the 2024
 * Player's Handbook, which is a broader source than the SRD. They are tagged
 * `source: 'phb'` and the UI renders a PHB badge so the player is never shown
 * PHB-only content without knowing it is PHB-only.
 *
 * Sources used for the PHB entries:
 *  - D&D Beyond, "The Backgrounds and Origin Feats in the 2024 Player's
 *    Handbook" (Riley Silverman, 2024-07-25) — official rules article;
 *    supplied every ability spread, origin feat, skill pair, tool proficiency,
 *    flavour description, and all ten Origin feat benefit texts below.
 *    https://www.dndbeyond.com/posts/1785-the-backgrounds-and-origin-feats-in-the-2024
 *  - D&D Beyond, "Updates in the Player's Handbook (2024)" — confirms the
 *    2024 PHB contains sixteen backgrounds and names the six brand new ones.
 *  - Roll20 Compendium / Arcane Eye / wastedwizardgames — used only to
 *    cross-check the tool proficiencies.
 *
 * ## No background features
 *
 * 2024 deleted background features; Origin feats replaced them. See the
 * `BackgroundDef` doc comment in types/character.ts for the citation. There is
 * no `featureName` field here on purpose.
 *
 * ## Two field conventions worth knowing
 *
 * 1. `skillsGranted` uses the CANONICAL skill keys from `lib/rules/skillList.ts`
 *    — camelCase, e.g. `sleightOfHand`, `animalHandling`. These are looked up
 *    via `skillName()` / `skillAbility()`, so a wrong key silently degrades to
 *    displaying the raw key and falling back to Strength.
 * 2. `toolsGranted` / `toolChoices` hold DISPLAY-READY strings (e.g.
 *    `"Calligrapher's Supplies"`), not slugs. There is no tool catalog in this
 *    codebase and the UI renders them with `.join(', ')`, so raw slugs such as
 *    `calligraphers-supplies` would be shown to the player verbatim. This
 *    matches how class data stores `toolProficiencies`.
 */
export const BACKGROUNDS: BackgroundDef[] = [
  {
    id: 'acolyte',
    name: 'Acolyte',
    source: 'srd',
    originFeatId: 'magic-initiate',
    originFeatName: 'Magic Initiate (Cleric)',
    originFeatDescription:
      'You gain two cantrips and one level 1 spell from the Cleric, Druid, or Wizard spell list, and can replace them with another spell of the same level from the same list when you gain a level. You choose Wisdom, Intelligence, or Charisma as your spellcasting modifier for these spells when you take this feat. You can cast these spells once per Long Rest without expending a spell slot, and can cast them again using spell slots. This feat can be taken more than once, but you must choose a different spell list each time.',
    abilityBonusChoices: ['int', 'wis', 'cha'],
    skillsGranted: ['insight', 'religion'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ["Calligrapher's Supplies"],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'You were a devoted servant in a place of worship. You learned the rituals of your faith and how to channel divine power as part of your service.',
  },
  {
    id: 'artisan',
    name: 'Artisan',
    source: 'phb',
    originFeatId: 'crafter',
    originFeatName: 'Crafter',
    originFeatDescription:
      'Gain proficiency with three different sets of Artisan\u2019s Tools. Gain a 20 percent discount on nonmagical items. Can craft an item from a Fast Crafting table, which lasts until you finish another Long Rest.',
    abilityBonusChoices: ['str', 'dex', 'int'],
    skillsGranted: ['investigation', 'persuasion'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: [],
    toolChoices: ["Artisan's Tools (one kind of your choice)"],
    toolChoiceCount: 1,
    toolChoiceCategory: 'artisansTools',
    description:
      'You worked your way up from scrubbing floors to an apprenticeship creating your own crafts. You know how to schmooze a customer and have a keen eye for detail.',
  },
  {
    id: 'charlatan',
    name: 'Charlatan',
    source: 'phb',
    originFeatId: 'skilled',
    originFeatName: 'Skilled',
    originFeatDescription:
      'You gain proficiency in any combination of three skills or tools of your choice. You can take this feat more than once.',
    abilityBonusChoices: ['dex', 'con', 'cha'],
    skillsGranted: ['deception', 'sleightOfHand'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ['Forgery Kit'],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'You have learned to seek out a mark in taverns and pubs, and find the people most in search of less than honest goods, such as forgeries or sham magic items.',
  },
  {
    id: 'criminal',
    name: 'Criminal',
    source: 'srd',
    originFeatId: 'alert',
    originFeatName: 'Alert',
    originFeatDescription:
      'Add your Proficiency Bonus when you roll Initiative. Can also swap your Initiative with a willing ally in the same combat.',
    abilityBonusChoices: ['dex', 'con', 'int'],
    skillsGranted: ['sleightOfHand', 'stealth'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ["Thieves' Tools"],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'Whether you were a member of a criminal crew or a solo thief who only looked out for yourself, you know the best ways to slice some purse strings or how to find alternative means to enter a locked shop.',
  },
  {
    id: 'entertainer',
    name: 'Entertainer',
    source: 'phb',
    originFeatId: 'musician',
    originFeatName: 'Musician',
    originFeatDescription:
      'You gain proficiency with three musical instruments of your choice. At the end of a Short or Long Rest, you may play the instrument and grant Heroic Inspiration to a number of allies equal to your Proficiency Bonus.',
    abilityBonusChoices: ['str', 'dex', 'cha'],
    skillsGranted: ['acrobatics', 'performance'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ['Musical Instrument'],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'You\u2019ve spent your life on either a literal or proverbial stage, performing for willing audiences. You have learned how to channel your talent for creation into a crowd-pleasing art form.',
  },
  {
    id: 'farmer',
    name: 'Farmer',
    source: 'phb',
    originFeatId: 'tough',
    originFeatName: 'Tough',
    originFeatDescription:
      'When you first gain this Origin feat, your Hit Point maximum increases by twice your character level. Thereafter, your Hit Point maximum increases by 2 each time you level up.',
    abilityBonusChoices: ['str', 'con', 'wis'],
    skillsGranted: ['animalHandling', 'nature'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ["Carpenter's Tools"],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'You\u2019ve tilled the soil or raised animals as livestock or to aid you in cultivating your fields. You\u2019ve gained a healthy respect for nature, in both its bounty and its wrath.',
  },
  {
    id: 'guard',
    name: 'Guard',
    source: 'phb',
    originFeatId: 'alert',
    originFeatName: 'Alert',
    originFeatDescription:
      'Add your Proficiency Bonus when you roll Initiative. Can also swap your Initiative with a willing ally in the same combat.',
    abilityBonusChoices: ['str', 'int', 'wis'],
    skillsGranted: ['athletics', 'perception'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: [],
    toolChoices: ['Gaming Set (one kind of your choice)'],
    toolChoiceCount: 1,
    toolChoiceCategory: 'gamingSet',
    description:
      'You\u2019ve put in your time standing watch over a city or location. You\u2019ve had your head on a swivel, keeping a watchful eye on raiding enemies on one side of a wall or criminal elements on the other.',
  },
  {
    id: 'guide',
    name: 'Guide',
    source: 'phb',
    originFeatId: 'magic-initiate',
    originFeatName: 'Magic Initiate (Druid)',
    originFeatDescription:
      'You gain two cantrips and one level 1 spell from the Cleric, Druid, or Wizard spell list, and can replace them with another spell of the same level from the same list when you gain a level. You choose Wisdom, Intelligence, or Charisma as your spellcasting modifier for these spells when you take this feat. You can cast these spells once per Long Rest without expending a spell slot, and can cast them again using spell slots. This feat can be taken more than once, but you must choose a different spell list each time.',
    abilityBonusChoices: ['dex', 'con', 'wis'],
    skillsGranted: ['stealth', 'survival'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ["Cartographer's Tools"],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'Your life was mostly spent outdoors, exploring the natural wonders around you. In your travels, you learned the basics of how to channel the magic of the wild world around you.',
  },
  {
    id: 'hermit',
    name: 'Hermit',
    source: 'phb',
    originFeatId: 'healer',
    originFeatName: 'Healer',
    originFeatDescription:
      'When you Utilize a Healer\u2019s Kit as an action, a creature can expend one of its Hit Point Dice to heal. Your Proficiency Bonus is added to the roll. When you roll to determine Hit Points when healing with this feature or a spell, you can reroll the dice if it rolls a 1. You must use the new roll.',
    abilityBonusChoices: ['con', 'wis', 'cha'],
    skillsGranted: ['medicine', 'religion'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ['Herbalism Kit'],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'Whether alone in a hut or as part of a monastery, you\u2019ve spent a considerable amount of time outside the trappings of society. You\u2019ve grown comfortable pondering the wonders and mysteries of creation.',
  },
  {
    id: 'merchant',
    name: 'Merchant',
    source: 'phb',
    originFeatId: 'lucky',
    originFeatName: 'Lucky',
    originFeatDescription:
      'After finishing a Long Rest, you have a number of Luck Points equal to your Proficiency Bonus. You can expend one when you make a D20 Test to give yourself Advantage. You can also expend one to impose Disadvantage when a creature rolls a d20 to make an attack roll against you.',
    abilityBonusChoices: ['con', 'int', 'cha'],
    skillsGranted: ['animalHandling', 'persuasion'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ["Navigator's Tools"],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'As an apprentice to a trader or shopkeeper, you traveled either supplying artisans with the materials they needed or acquiring their goods to sell to your customers. You know how to make a deal and how to handle a long journey.',
  },
  {
    id: 'noble',
    name: 'Noble',
    source: 'phb',
    originFeatId: 'skilled',
    originFeatName: 'Skilled',
    originFeatDescription:
      'You gain proficiency in any combination of three skills or tools of your choice. You can take this feat more than once.',
    abilityBonusChoices: ['str', 'int', 'cha'],
    skillsGranted: ['history', 'persuasion'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: [],
    toolChoices: ['Gaming Set (one kind of your choice)'],
    toolChoiceCount: 1,
    toolChoiceCategory: 'gamingSet',
    description:
      'You grew up in the opulence and structure of wealth and societal privilege. You may have bristled against the restrictions and expectations of your role, but you learned a lot about courtly intrigue and the skills of leadership.',
  },
  {
    id: 'sage',
    name: 'Sage',
    source: 'srd',
    originFeatId: 'magic-initiate',
    originFeatName: 'Magic Initiate (Wizard)',
    originFeatDescription:
      'You gain two cantrips and one level 1 spell from the Cleric, Druid, or Wizard spell list, and can replace them with another spell of the same level from the same list when you gain a level. You choose Wisdom, Intelligence, or Charisma as your spellcasting modifier for these spells when you take this feat. You can cast these spells once per Long Rest without expending a spell slot, and can cast them again using spell slots. This feat can be taken more than once, but you must choose a different spell list each time.',
    abilityBonusChoices: ['con', 'int', 'wis'],
    skillsGranted: ['arcana', 'history'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ["Calligrapher's Supplies"],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'Your thirst for knowledge drew you to some of the greatest libraries and archives in the world. You\u2019ve got a knack for research and perhaps a rudimentary knowledge of magic gleaned from a book or two.',
  },
  {
    id: 'sailor',
    name: 'Sailor',
    source: 'phb',
    originFeatId: 'tavern-brawler',
    originFeatName: 'Tavern Brawler',
    originFeatDescription:
      'When you hit with an Unarmed Strike and deal damage, you can deal 1d4 + your Strength modifier. If the damage dice for your Unarmed Strikes roll is a 1, you can reroll it and must use the new roll. You have proficiency with improvised weapons. Once per turn, when you hit a creature with an Unarmed Strike as part of the Attack action, in addition to dealing damage, you can push the target 5 feet away from you.',
    abilityBonusChoices: ['str', 'dex', 'wis'],
    skillsGranted: ['acrobatics', 'perception'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ["Navigator's Tools"],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'You called the open water your home, survived some of the sea\u2019s harshest storms. You\u2019ve swapped stories with the best of them, whether that\u2019s on the barstool of a random port or the denizens of the world beneath the waves.',
  },
  {
    id: 'scribe',
    name: 'Scribe',
    source: 'phb',
    originFeatId: 'skilled',
    originFeatName: 'Skilled',
    originFeatDescription:
      'You gain proficiency in any combination of three skills or tools of your choice. You can take this feat more than once.',
    abilityBonusChoices: ['dex', 'int', 'wis'],
    skillsGranted: ['investigation', 'perception'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ["Calligrapher's Supplies"],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'The written word has been your domain, either copying tomes, crafting government documents, or producing your own texts. Your eye for detail and ability to catch errors and mistakes is finely honed.',
  },
  {
    id: 'soldier',
    name: 'Soldier',
    source: 'srd',
    originFeatId: 'savage-attacker',
    originFeatName: 'Savage Attacker',
    originFeatDescription:
      'Once per turn, when you hit a target with a weapon attack, you can roll the weapon damage dice twice and use either roll against the target.',
    abilityBonusChoices: ['str', 'dex', 'con'],
    skillsGranted: ['athletics', 'intimidation'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: [],
    toolChoices: ['Gaming Set (one kind of your choice)'],
    toolChoiceCount: 1,
    toolChoiceCategory: 'gamingSet',
    description:
      'You can hardly remember a time when you didn\u2019t wield a weapon. You\u2019re well-versed in the ways of battle and war to protect the realm, and you have the muscle memory to prove it.',
  },
  {
    id: 'wayfarer',
    name: 'Wayfarer',
    source: 'phb',
    originFeatId: 'lucky',
    originFeatName: 'Lucky',
    originFeatDescription:
      'After finishing a Long Rest, you have a number of Luck Points equal to your Proficiency Bonus. You can expend one when you make a D20 Test to give yourself Advantage. You can also expend one to impose Disadvantage when a creature rolls a d20 to make an attack roll against you.',
    abilityBonusChoices: ['dex', 'wis', 'cha'],
    skillsGranted: ['insight', 'stealth'],
    skillChoices: [],
    skillChoiceCount: 0,
    toolsGranted: ["Thieves' Tools"],
    toolChoices: [],
    toolChoiceCount: 0,
    description:
      'An urchin or societal castoff, you learned to survive. Forging your own path on the streets and possibly turning to crime when needed, you\u2019ve managed to keep your pride and hope that destiny has more for you yet.',
  },
];

export const BACKGROUNDS_BY_ID: Record<string, BackgroundDef> = Object.fromEntries(
  BACKGROUNDS.map((b) => [b.id, b]),
);
