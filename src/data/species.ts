import type { SpeciesDef } from '../types/character';

/**
 * All 25 species from dnd2024.wikidot.com ("Species - D&D 5e (2024)").
 *
 * Rebuilt from the site index + per-species pages. Tabs: Common (10), Eberron (5),
 * Lorwyn (5), Ravenloft (4), Exotic (2, incl. a site-side duplicate Dhampir row; the
 * only new entry there is Duskling).
 *
 * 2024 rules: a species grants traits, size and speed only — ability-score
 * increases come from the Background. The site's verbose size text ("Medium
 * (about 4–7 feet tall) or Small (about 2–4 feet tall), chosen when you select
 * this species") is normalized onto the four CreatureSize values.
 *
 * Only Human grants an Origin feat, so only it carries featLevels: [1].
 */
export const SPECIES: SpeciesDef[] = [
  {
    id: 'aasimar',
    name: 'Aasimar',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Celestial Resistance', description: 'You have Resistance to Necrotic damage and Radiant damage.' },
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      { name: 'Healing Hands', description: 'As a Magic action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains a number of Hit Points equal to the total rolled. Once you use this trait, you can\'t use it again until you finish a Long Rest.' },
      { name: 'Light Bearer', description: 'You know the Light cantrip. Charisma is your spellcasting ability for it.' },
      { name: 'Celestial Revelation', description: 'When you reach character level 3, you can transform as a Bonus Action using one of the options below (choose the option each time you transform). The transformation lasts for 1 minute or until you end it (no action required). Once you transform, you can\'t do so again until you finish a Long Rest. Once on each of your turns before the transformation ends, you can deal extra damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your Proficiency Bonus, and the extra damage\'s type is either Necrotic for Necrotic Shroud or Radiant for Heavenly Wings and Inner Radiance. Here are the transformation options: Heavenly Wings. Two spectral wings sprout from your back temporarily. Until the transformation ends, you have a Fly Speed equal to your Speed.' },
      { name: 'Inner Radiance', description: 'Searing light temporarily radiates from your eyes and mouth. For the duration, you shed Bright Light in a 10-foot radius and Dim Light for an additional 10 feet, and at the end of each of your turns, each creature within 10 feet of you takes Radiant damage equal to your Proficiency Bonus.' },
      { name: 'Necrotic Shroud', description: 'Your eyes briefly become pools of darkness, and flightless wings sprout from your back temporarily. Creatures other than your allies within 10 feet of you must succeed on a Charisma saving throw (DC 8 plus your Charisma modifier and Proficiency Bonus) or have the Frightened condition until the end of your next turn.' },
    ],
    description: 'Aasimar (pronounced AH-sih-mar) are mortals who carry a spark of the Upper Planes within their souls. Whether descended from an angelic being or infused with celestial power, they can fan that spark to bring light, healing, and heavenly fury. Aasimar can arise among any population of mortals. They resemble their parents, but they live for up to 160 years and have features that hint at their celestial heritage, such as metallic freckles, luminous eyes, a halo, or the skin color of an angel (silver, opalescent green, or coppery red). These features start subtle and become obvious when the aasimar learns to reveal their full celestial nature. Creature Type: Humanoid Size: Medium (about 4-7 feet tall) or Small (about 2-4 feet tall), chosen when you select this species Speed: 30 feet As an Aasimar, you have these special traits. Celestial Resistance. You have Resistance to Necrotic damage and Radiant damage. Darkvision. You have Darkvision with a range of 60 feet. Healing Hands. As a Magic action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains a number of Hit Points equal to the total rolled. Once you use this trait, you can\'t use it again until you finish a Long Rest. Light Bearer. You know the Light cantrip. Charisma is your spellcasting ability for it. Celestial Revelation. When you reach character level 3, you can transform as a Bonus Action using one of the options below (choose the option each time you transform). The transformation lasts for 1 minute or until you end it (no action required). Once you transform, you can\'t do so again until you finish a Long Rest. Once on each of your turns before the transformation ends, you can deal extra damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your Proficiency Bonus, and the extra damage\'s type is either Necrotic for Necrotic Shroud or Radiant for Heavenly Wings and Inner Radiance. Here are the transformation options: Heavenly Wings. Two spectral wings sprout from your back temporarily. Until the transformation ends, you have a Fly Speed equal to your Speed. Inner Radiance. Searing light temporarily radiates from your eyes and mouth. For the duration, you shed Bright Light in a 10-foot radius and Dim Light for an additional 10 feet, and at the end of each of your turns, each creature within 10 feet of you takes Radiant damage equal to your Proficiency Bonus. Necrotic Shroud. Your eyes briefly become pools of darkness, and flightless wings sprout from your back temporarily. Creatures other than your allies within 10 feet of you must succeed on a Charisma saving throw (DC 8 plus your Charisma modifier and Proficiency Bonus) or have the Frightened condition until the end of your next turn.',
  },

  {
    id: 'dragonborn',
    name: 'Dragonborn',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Draconic Ancestry', description: 'Your lineage stems from a dragon progenitor. Choose the kind of dragon from the Draconic Ancestors table. Your choice affects your Breath Weapon and Damage Resistance traits as well as your appearance.' },
    ],
    description: 'The ancestors of dragonborn hatched from the eggs of chromatic and metallic dragons. One story holds that these eggs were blessed by the dragon gods Bahamut and Tiamat, who wanted to populate the multiverse with people created in their image. Another story claims that dragons created the first dragonborn without the gods\' blessings. Whatever their origin, dragonborn have made homes for themselves on the Material Plane. Dragonborn look like wingless, bipedal dragons - scaly, bright-eyed, and thick-boned with horns on their heads - and their coloration and other features are reminiscent of their draconic ancestors.',
  },

  {
    id: 'dwarf',
    name: 'Dwarf',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: 'You have Darkvision with a range of 120 feet.' },
      { name: 'Dwarven Resilience', description: 'You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition.' },
      { name: 'Dwarven Toughness', description: 'Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level.' },
      { name: 'Stonecunning', description: 'As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes. You must be on a stone surface or touching a stone surface to use this Tremorsense. The stone can be natural or worked. You can use this Bonus Action a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.' },
    ],
    description: 'Dwarves were raised from the earth in the elder days by a deity of the forge. Called by various names on different worlds - Moradin, Reorx, and others - that god gave dwarves an affinity for stone and metal and for living underground. The god also made them resilient like the mountains, with a life span of about 350 years. Squat and often bearded, the original dwarves carved cities and strongholds into mountainsides and under the earth. Their oldest legends tell of conflicts with the monsters of mountaintops and the Underdark, whether those monsters were towering giants or subterranean horrors. Inspired by those tales, dwarves of any culture often sing of valorous deeds - especially of the little overcoming the mighty. On some worlds in the multiverse, the first settlements of dwarves were built in hills or mountains, and the families who trace their ancestry to those settlements call themselves hill dwarves or mountain dwarves, respectively. The Greyhawk and Dragonlance settings have such communities.',
  },

  {
    id: 'elf',
    name: 'Elf',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      { name: 'Elven Lineage', description: 'You are part of a lineage that grants you supernatural abilities. Choose a lineage from the Elven Lineages table. You gain the level 1 benefit of that lineage. When you reach character levels 3 and 5, you learn a higher-level spell, as shown on the table. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait (choose the ability when you select the lineage).' },
      { name: 'Fey Ancestry', description: 'You have Advantage on saving throws you make to avoid or end the Charmed condition.' },
      { name: 'Keen Senses', description: 'You have proficiency in the Insight, Perception, or Survival skill.' },
      { name: 'Trance', description: 'You don\'t need to sleep, and magic can\'t put you to sleep. You can finish a Long Rest in 4 hours if you spend those hours in a trancelike meditation, during which you retain consciousness.' },
    ],
    description: 'Created by the god Corellon, the first elves could change their forms at will. They lost this ability when Corellon cursed them for plotting with the deity Lolth, who tried and failed to usurp Corellon\'s dominion. When Lolth was cast into the Abyss, most elves renounced her and earned Corellon\'s forgiveness, but that which Corellon had taken from them was lost forever. No longer able to shape-shift at will, the elves retreated to the Feywild, where their sorrow was deepened by that plane\'s influence. Over time, curiosity led many of them to explore other planes of existence, including worlds in the Material Plane. Elves have pointed ears and lack facial and body hair. They live for around 750 years, and they don\'t sleep but instead enter a trance when they need to rest. In that state, they remain aware of their surroundings while immersing themselves in memories and meditations. An environment subtly transforms elves after they inhabit it for a millennium or more, and it grants them certain kinds of magic. Drow, high elves, and wood elves are examples of elves who have been transformed thus.',
  },

  {
    id: 'gnome',
    name: 'Gnome',
    size: 'Small',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      { name: 'Gnomish Cunning', description: 'You have Advantage on Intelligence, Wisdom, and Charisma saving throws.' },
      { name: 'Gnomish Lineage', description: 'You are part of a lineage that grants you supernatural abilities. Choose one of the following options; whichever one you choose, Intelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait (choose the ability when you select the lineage):' },
    ],
    description: 'Gnomes are magical folk created by gods of invention, illusions, and life underground. The earliest gnomes were seldom seen by other folk due to the gnomes\' secretive nature and their propensity for living in forests and burrows. What they lacked in size, they made up for in cleverness. They confounded predators with traps and labyrinthine tunnels. They also learned magic from gods like Garl Glittergold, Baervan Wildwanderer, and Baravar Cloakshadow, who visited them in disguise. That magic eventually created the lineages of forest gnomes and rock gnomes. Gnomes are petite folk with big eyes and pointed ears, who live around 425 years. Many gnomes like the feeling of a roof over their head, even if that "roof" is nothing more than a hat.',
  },

  {
    id: 'goliath',
    name: 'Goliath',
    size: 'Medium',
    speed: 35,
    abilityBonuses: {},
    traits: [
      { name: 'Giant Ancestry', description: 'You are descended from Giants. Choose one of the following benefits - a supernatural boon from your ancestry; you can use the chosen benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest:' },
      { name: 'Large Form', description: 'Starting at character level 5, you can change your size to Large as a Bonus Action if you\'re in a big enough space. This transformation lasts for 10 minutes or until you end it (no action required). For that duration, you have Advantage on Strength checks, and your Speed increases by 10 feet. Once you use this trait, you can\'t use it again until you finish a Long Rest.' },
      { name: 'Powerful Build', description: 'You have Advantage on any ability check you make to end the Grappled condition. You also count as one size larger when determining your carrying capacity.' },
    ],
    description: 'Towering over most folk, goliaths are distant descendants of giants. Each goliath bears the favors of the first giants - favors that manifest in various supernatural boons, including the ability to quickly grow and temporarily approach the height of goliaths\' gigantic kin. Goliaths have physical characteristics that are reminiscent of the giants in their family lines. For example, some goliaths look like stone giants, while others resemble fire giants. Whatever giants they count as kin, goliaths have forged their own path in the multiverse - unencumbered by the internecine conflicts that have ravaged giantkind for ages - and seek heights above those reached by their ancestors.',
  },

  {
    id: 'halfling',
    name: 'Halfling',
    size: 'Small',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Brave', description: 'You have Advantage on saving throws you make to avoid or end the Frightened condition.' },
      { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is a size larger than you, but you can\'t stop in the same space.' },
      { name: 'Luck', description: 'When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll.' },
      { name: 'Naturally Stealthy', description: 'You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.' },
    ],
    description: 'Cherished and guided by gods who value life, home, and hearth, halflings gravitate toward bucolic havens where family and community help shape their lives. That said, many halflings possess a brave and adventurous spirit that leads them on journeys of discovery, affording them the chance to explore a bigger world and make new friends along the way. Their size - similar to that of a human child -helps them pass through crowds unnoticed and slip through tight spaces. Anyone who has spent time around halflings, particularly halfling adventurers, has likely witnessed the storied "luck of the halflings" in action. When a halfling is in mortal danger, an unseen force seems to intervene on the halfling\'s behalf. Many halflings believe in the power of luck, and they attribute their unusual gift to one or more of their benevolent gods, including Yondalla, Brandobaris, and Charmalaine. The same gift might contribute to their robust life spans (about 150 years). Halfling communities come in all varieties. For every sequestered shire tucked away in an unspoiled part of the world, there\'s a crime syndicate like the Boromar Clan in the Eberron setting or a territorial mob of halflings like those in the Dark Sun setting. Halflings who prefer to live underground are sometimes called strongheart halflings or stouts. Nomadic halflings, as well as those who live among humans and other tall folk, are sometimes called lightfoot halflings or tallfellows.',
  },

  {
    id: 'human',
    name: 'Human',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Resourceful', description: 'You gain Heroic Inspiration whenever you finish a Long Rest.' },
      { name: 'Skillful', description: 'You gain proficiency in one skill of your choice.' },
      { name: 'Versatile', description: 'You gain an Origin feat of your choice. Skilled is recommended.' },
    ],
    featLevels: [1],
    description: 'Found throughout the multiverse, humans are as varied as they are numerous, and they endeavor to achieve as much as they can in the years they are given. Their ambition and resourcefulness are commended, respected, and feared on many worlds. Humans are as diverse in appearance as the people of Earth, and they have many gods. Scholars dispute the origin of humanity, but one of the earliest known human gatherings is said to have occurred in Sigil, the torus-shaped city at the center of the multiverse and the place where the Common language was born. From there, humans could have spread to every part of the multiverse, bringing the City of Doors\' cosmopolitanism with them.',
  },

  {
    id: 'orc',
    name: 'Orc',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Adrenaline Rush', description: 'You can take the Dash action as a Bonus Action. When you do so, you gain a number of Temporary Hit Points equal to your Proficiency Bonus. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.' },
      { name: 'Darkvision', description: 'You have Darkvision with a range of 120 feet.' },
      { name: 'Relentless Endurance', description: 'When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you can\'t do so again until you finish a Long Rest.' },
    ],
    description: 'Orcs trace their creation to Gruumsh, a powerful god who roamed the wide open spaces of the Material Plane. Gruumsh equipped his children with gifts to help them wander great plains, vast caverns, and churning seas and to face the monsters that lurk there. Even when they turn their devotion to other gods, orcs retain Gruumsh\'s gifts: endurance, determination, and the ability to see in darkness. Orcs are, on average, tall and broad. They have gray skin, ears that are sharply pointed, and prominent lower canines that resemble small tusks. Orc youths on some worlds are told about their ancestors\' great travels and travails. Inspired by those tales, many of those orcs wonder when Gruumsh will call on them to match the heroic deeds of old and if they will prove worthy of his favor. Other orcs are happy to leave old tales in the past and find their own way.',
  },

  {
    id: 'tiefling',
    name: 'Tiefling',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      { name: 'Fiendish Legacy', description: 'You are the recipient of a legacy that grants you supernatural abilities. Choose a legacy from the Fiendish Legacies table. You gain the level 1 benefit of the chosen legacy. When you reach character levels 3 and 5, you learn a higher-level spell, as shown on the table. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait (choose the ability when you select the legacy).' },
      { name: 'Otherworldly Presence', description: 'You know the Thaumaturgy cantrip. When you cast it with this trait, the spell uses the same spellcasting ability you use for your Fiendish Legacy trait.' },
    ],
    description: 'Tieflings are either born in the Lower Planes or have fiendish ancestors who originated there. A tiefling (pronounced TEE-fling) is linked by blood to a devil, a demon, or some other Fiend. This connection to the Lower Planes is the tiefling\'s fiendish legacy, which comes with the promise of power yet has no effect on the tiefling\'s moral outlook. A tiefling chooses whether to embrace or lament their fiendish legacy. The three legacies are described below.',
  },

  {
    id: 'changeling',
    name: 'Changeling',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Changeling Instincts', description: 'Thanks to your connection to the fey realm, you gain proficiency in two of the following skills of your choice: Deception, Insight, Intimidation, Performance, or Persuasion.' },
      { name: 'Shape-Shifter', description: 'As an action, you can shape-shift to change your appearance and your voice. You determine the specifics of the changes, including your coloration, hair length, and sex. You can also adjust your height and weight and can change your size between Medium and Small. You can make yourself appear as a member of another playable species, though none of your game statistics change. You can\'t duplicate the appearance of an individual you\'ve never seen, and you must adopt a form that has the same basic arrangement of limbs that you have. This trait doesn\'t change your clothing and equipment. While shape-shifted with this trait, you have Advantage on Charisma checks. You stay in the new form until you take an action to revert to your true form.' },
    ],
    description: 'With ever-changing appearances, changelings reside in many societies undetected. Each changeling can supernaturally adopt any face they like. For some changelings, a new face may reveal an aspect of their soul. The first changelings in the multiverse appeared in the Feywild, and the wondrous, mutable essence of that plane lingers in changelings today - even in those who have never set foot in the fey realm. In their true form, changelings appear faded, their features almost devoid of detail. It is rare to see one in that form, for a typical changeling alters their shape the way others might change clothes. However, many changelings develop identities with more depth, crafting a persona complete with history and beliefs to go with each shape. A changeling adventurer might have personas for many situations, including negotiation, investigation, and combat. Multiple changelings can share a persona. Personas can even pass down through a family, allowing a younger changeling to take advantage of contacts established by the persona\'s previous users.',
  },

  {
    id: 'kalashtar',
    name: 'Kalashtar',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Dual Mind', description: 'You have Advantage on Wisdom and Charisma saving throws.' },
      { name: 'Mental Discipline', description: 'You have Resistance to Psychic damage.' },
      { name: 'Mind Link', description: 'You have telepathy with a range in feet equal to 10 times your level. When you\'re using this trait to speak telepathically to a creature, you can take a Magic action to give that creature the ability to speak telepathically with you for 1 hour or until you take another Magic action to end this effect.' },
      { name: 'Severed from Dreams', description: 'You can\'t be the target of the Dream spell. In addition, when you finish a Long Rest, you gain proficiency in one skill of your choice. This proficiency lasts until you finish another Long Rest.' },
    ],
    description: 'Kalashtar (pronounced kal-ASH-tar) are created from the union of humanity and renegade spirits called quori from the plane of dreams. Kalashtar appear human, but their spiritual connection affects them in a variety of ways. They have symmetrical, slightly angular features, and their eyes often glow when they are concentrating or expressing strong emotions. Kalashtar can\'t communicate directly with their quori spirits. Rather, kalashtar might experience them as a source of instinct and inspiration, drawing on the spirits\' memories when the kalashtar sleep. This connection grants kalashtar minor psionic abilities, as well as protection from psionic attacks.',
  },

  {
    id: 'khoravar',
    name: 'Khoravar',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      { name: 'Fey Ancestry', description: 'You have Advantage on saving throws you make to avoid or end the Charmed condition.' },
      { name: 'Fey Gift', description: 'You know the Friends cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Cleric, Druid, or Wizard spell list. Intelligence, Wisdom, or Charisma is your spellcasting ability for the spell you cast with this trait (chosen when you select this species).' },
      { name: 'Lethargy Resilience', description: 'When you fail a saving throw to avoid or end the Unconscious condition, you can succeed instead. Once you use this trait, you can\'t do so again until you finish 1d4 Long Rests.' },
      { name: 'Skill Versatility', description: 'You gain proficiency in one skill or with one tool of your choice. Whenever you finish a Long Rest, you can replace it with another skill or tool proficiency.' },
    ],
    description: 'Over the course of centuries, those descended from both humans and elves have developed their own communities and traditions in Khorvaire. The rise of House Lyrandar and House Medani has strengthened this identity. Members of these communities call themselves Khoravar, an Elvish term meaning "children of Khorvaire," as they dislike the term "half-elf." Many Khoravar espouse the idea of being "the bridge between," believing they are called to facilitate communication and cooperation between members of different cultures or species. Khoravar who follow this philosophy often become bards, diplomats, mediators, or translators. Others, fascinated by their distant connection to the Fey, seek to build bridges between the Material Plane and the Feywild of Thelanis. These Khoravar often become druids or warlocks with archfey patrons.',
  },

  {
    id: 'shifter',
    name: 'Shifter',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Bestial Instincts', description: 'Channeling the beast within, you gain proficiency in one of the following skills of your choice: Acrobatics, Athletics, Intimidation, or Survival.' },
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      { name: 'Shifting', description: 'As a Bonus Action, you can shape-shift to assume a more bestial appearance. This transformation lasts for 1 minute or until you revert to your normal appearance as a Bonus Action. When you shift, you gain Temporary Hit Points equal to 2 times your Proficiency Bonus. You can shift a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. Whenever you shift, you gain the benefit of one of the following options (choose when you select this species):' },
      { name: 'Beasthide', description: 'You gain 1d6 additional Temporary Hit Points. While shifted, you have a +1 bonus to your Armor Class.' },
      { name: 'Longtooth', description: 'When you shift and as a Bonus Action on your other turns while shifted, you can use your elongated fangs to make an Unarmed Strike. If you hit with this Unarmed Strike and deal damage, you can deal Piercing damage equal to 1d6 plus your Strength modifier, instead of the normal damage of an Unarmed Strike.' },
      { name: 'Swiftstride', description: 'While you are shifted, your Speed increases by 10 feet. Additionally, you can move up to 10 feet as a Reaction when a creature ends its turn within 5 feet of you. This reactive movement doesn\'t provoke Opportunity Attack action.' },
      { name: 'Wildhunt', description: 'While shifted, you have Advantage on Wisdom checks. Additionally, no creature within 30 feet of you can have Advantage on an attack roll against you unless you have the Incapacitated condition.' },
    ],
    description: 'Shifters - sometimes called "weretouched" - descend from people who contracted full or partial lycanthropy. Humanoids with a bestial aspect, shifters can\'t change shape fully, but they can enhance their animalistic features temporarily in a process they call "shifting." Shifters resemble humans in height and build but are typically more lithe and flexible. Their facial features have a bestial cast, often with large eyes and pointed ears; most shifters also possess prominent canine teeth. They grow fur-like hair on nearly every part of their bodies. While a shifter\'s appearance might remind an onlooker of an animal, the shifter remains clearly identifiable as a Humanoid even when at their most feral.',
  },

  {
    id: 'warforged',
    name: 'Warforged',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Construct Resilience', description: 'You have Resistance to Poison damage. You also have Advantage on saving throws to avoid or end the Poisoned condition.' },
      { name: 'Integrated Protection', description: 'You gain a +1 bonus to your Armor Class. In addition, armor you have donned can\'t be removed against your will while you\'re alive.' },
      { name: 'Sentry\'s Rest', description: 'You don\'t need to sleep, and magic can\'t put you to sleep. You can finish a Long Rest in 6 hours if you spend those hours in an inactive, motionless state. During this time, you appear inert but remain conscious.' },
      { name: 'Specialized Design', description: 'You gain one skill proficiency and one tool proficiency of your choice.' },
      { name: 'Tireless', description: 'You don\'t gain Exhaustion levels from dehydration, malnutrition, or suffocation.' },
    ],
    description: 'Warforged are mechanical beings built as weapons to fight in the Last War. An unexpected breakthrough produced sentient beings made from wood and metal that nevertheless can feel pain and emotion. Warforged comprise a blend of organic and inorganic materials. Rootlike cords infused with alchemical fluids serve as their muscles, wrapped around a framework of steel, darkwood, or stone. Armored plates form a protective outer shell and reinforce joints. The more a warforged cultivates their individuality, the more likely they are to modify their body, seeking out an artificer to customize the look of their face, limbs, and plating.',
  },

  {
    id: 'boggart',
    name: 'Boggart',
    size: 'Small',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws you make to avoid or end the charmed condition on yourself.' },
      { name: 'Fury of the Small', description: 'When you damage a creature with an attack or a spell and the creature\'s size is larger than yours, you can cause the attack or spell to deal extra damage to the creature. The extra damage equals your proficiency bonus. You can use this trait a number of times equal to your proficiency bonus, regaining all expended uses when you finish a long rest, and you can use it no more than once per turn.' },
      { name: 'Nimble Escape', description: 'You can take the Disengage or Hide action as a bonus action on each of your turns.' },
    ],
    description: 'Boggarts are Small, squat goblinoids found in the realm of Lorwyn-Shadowmoor. They possess bestial physical features, including horns and animal-like snouts. Beyond these commonalities, boggart appearances vary widely. One boggart may look like a hedgehog, with spiky fur and beady eyes, while another might sport the snout and fleshy ears of a swine. Boggarts tend to love crafting potions and commonly gravitate to specific areas of expertise, as noted in the sections below.',
  },

  {
    id: 'faerie',
    name: 'Faerie',
    size: 'Small',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Fairy Magic', description: 'You know the Druidcraft cantrip. Starting at 3rd level, you can cast the Faerie Fire spell with this trait. Starting at 5th level, you can also cast the Enlarge/Reduce spell with this trait. Once you cast Faerie Fire or Enlarge/Reduce with this trait, you can\'t cast that spell with it again until you finish a long rest. You can also cast either of those spells using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells when you cast them with this trait (choose when you select this race).' },
      { name: 'Flight', description: 'Because of your wings, you have a flying speed equal to your walking speed. You can\'t use this flying speed if you\'re wearing medium or heavy armor. In addition, Shadowmoor faeries have Darkvision with a range of 120 feet.' },
    ],
    description: 'Known for their mischief, faeries resemble insects with humanoid features. Their size and shape may vary, but all have antennae, black eyes, chitinous skin, and insectoid legs and wings. Every faerie is born from a flower and possesses innate magic, which many use to play pranks. Some Lorwyn faeries serve Queen Oura, who has proclaimed herself the faeries\' ruler. Not all faeries recognize Oura\'s authority, however. In Shadowmoor, faeries might instead worship Queen Maralen, the elf who overthrew the previous faerie queen and, some say, ushered in the clashing of Lorwyn and Shadowmoor.',
  },

  {
    id: 'flamekin',
    name: 'Flamekin',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray.' },
      { name: 'Fire Resistance', description: 'You have resistance to fire damage.' },
      { name: 'Reach to the Blaze', description: 'You know the Produce Flame cantrip. Starting at 3rd level, you can cast the Burning Hands spell with this trait. Starting at 5th level, you can also cast the Flame Blade spell with this trait, without requiring a material component. Once you cast Burning Hands or Flame Blade with this trait, you can\'t cast that spell with it again until you finish a long rest. You can also cast either of those spells using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells when you cast them with this trait (choose when you select this race).' },
    ],
    description: 'Flamekin are people made from two key elements of creation: fire and stone. As a result, many flamekin feel a strong connection to the natural world. Flamekin\'s bodies radiate harmless magical flames, though they possess innate magic that allows them to create burning flames in a multitude of forms. Flamekin view self-discovery and self-expression the noblest of aspirations and believe that self-realization is the most important thing an individual can do with their life. Flamekin call this lifelong pursuit the Path of Flame. Flamekin dwell in either Lorwyn or Shadowmoor. Physically and culturally, they are similar in both lands.',
  },

  {
    id: 'lorwyn-changeling',
    name: 'Lorwyn Changeling',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Shape Self', description: 'As an action, you can reshape your body to a two-legged Humanoid shape or to a four-legged Beast shape. While you have a Humanoid shape, you can wear clothing and armor made for a Humanoid of your size.' },
      { name: 'Darkvision', description: 'You have Darkvision with a range of 120 feet.' },
      { name: 'Delightful Imitator', description: 'You have proficiency in the Performance skill.' },
      { name: 'Unpredictable Movement', description: 'When you roll Initiative and don\'t have Disadvantage on that roll, you can take the Dash action as a Reaction.' },
    ],
    description: 'The changelings of Lorwyn are charismatic shapeshifters able to crudely mimic the forms of creatures and plants. Unlike most shapeshifters, however, their innate powers don\'t allow them to truly disguise themselves; rather, their transformations are purely surface level. No matter their form, Lorwyn changelings keep their key traits: blue-green skin, tufts of tentacle-like fur, and bulbous yellow eyes with slitted pupils. The true changeling identity of a bug-eyed tree, teal elk, or furry boulder is always easy to spot. These counterfeits are so plain that many Lorwyn denizens find the effect inexplicably charming. Changelings from Lorwyn live in a vast, mystical cave called Velis Vel Grotto. Once per year, many changelings make a pilgrimage to the grotto to contemplate their past deeds.',
  },

  {
    id: 'rimekin',
    name: 'Rimekin',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Cold Fire Magic', description: 'You know the Ray of Frost cantrip. When you reach character levels 3 and 5, you learn the Ice Knife spell and the Flame Blade spell, respectively. You always have those spells prepared. You can cast each once without a spell slot, and you regain the ability to cast these spells in this way when you finish a Long Rest. You can also cast the spells using any spell slots you have of the appropriate level. When you cast Flame Blade using this trait, the spell deals Cold damage instead of Fire damage. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose the ability when you select this species).' },
      { name: 'Cold Resistance', description: 'You have Resistance to Cold damage.' },
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
    ],
    description: 'Rimekin hail from both Lorwyn and Shadowmoor, though the first rimekin arose from flamekin during the Phyrexian invasion. These flamekin approached their problems with cold logic and rejected reactionary responses. As a result, the magical flames that engulfed their bodies took on a frigid air, and they became rimekin. Like flamekin, rimekin possess innate magic, but the flames they conjure burn icy blue rather than red hot. Further, these "flames" emanate a chilling cold rather than blazing heat. This effect extends, superficially, to the items rimekin touch. Any armor worn or weapons wielded by rimekin become coated in layers of spiky yet harmless hoarfrost.',
  },

  {
    id: 'dhampir',
    name: 'Dhampir',
    size: 'Small or Medium',
    speed: 35,
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      { name: 'Spider Climb', description: 'You have a Climb Speed equal to your Speed. When you reach character level 3, you can move up, down, and across vertical surfaces and along ceilings while leaving your hands free.' },
      { name: 'Trace of Undeath', description: 'You have Resistance to Necrotic damage.' },
      { name: 'Vampiric Bite', description: 'When you use your Unarmed Strike and deal damage, you can choose to bite with your fangs. You deal Piercing damage equal to 1d4 plus your Constitution modifier instead of the normal damage of an Unarmed Strike. In addition, when you deal this damage to a creature that isn\'t a Construct or an Undead, you can empower yourself in one of the following ways:' },
      { name: 'Drain', description: 'You regain Hit Points equal to the Piercing damage dealt.' },
      { name: 'Strengthen', description: 'You gain a bonus to the next ability check or attack roll you make within the next minute; the bonus is equal to the Piercing damage dealt. You can empower yourself with this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.' },
    ],
    description: 'Dhampirs are living people who possess vampiric prowess but are cursed with macabre hunger. Most dhampirs thirst for blood, but some gain sustenance from dreams, life energy, or other vital sources. Dhampirs must choose whether to fight to control their hunger or give in to predatory urges. Dhampirs often arise from encounters with vampires; some are the descendants of a powerful vampire, while others are partially transformed by a vampire\'s bite. All manner of macabre bargains and necromantic influences might also give rise to a dhampir. Regardless of their origins, dhampirs exhibit their vampiric nature in various ways, including increased speed and a life-draining bite.',
  },

  {
    id: 'hexblood',
    name: 'Hexblood',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Eerie Token', description: 'As a Bonus Action, you can create a magical token by harmlessly removing a lock of hair, detaching a nail, or using some other method. While the token exists, you gain the following benefits:' },
      { name: 'Distant Message', description: 'As a Magic action, you can send a telepathic message of 25 words or fewer to a creature holding or carrying the token, as long as you are within 10 miles of it.' },
      { name: 'Remote Viewing', description: 'If you are within 10 miles of the token, you can take a Magic action to extend your senses through the token for 1 minute, until you have the Incapacitated condition, or until you end this state (no action required). During this state, you can see and hear from the token as if you were located where it is. When this state ends, the token is harmlessly destroyed. Unless the token is destroyed early, it lasts until you finish a Long Rest. Once you create a token using this feature, you can\'t do so again until you finish a Long Rest.' },
      { name: 'Hex Magic', description: 'You always have the Disguise Self and Hex spells prepared. You can cast each spell once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait (choose the ability when you select this species).' },
    ],
    description: 'Hexbloods are individuals infused with fey magic as a result of eldritch energy or mysterious witchcraft. Many hexbloods are transformed into such beings after making a deal with a powerful hag, but other strange forces can result in the birth of a hexblood. A hexblood\'s strange fey power manifests as eerie clairvoyance and beguiling magic.',
  },

  {
    id: 'lupin',
    name: 'Lupin',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Feral Pounce', description: 'Your Unarmed Strikes deal Slashing damage instead of Bludgeoning damage. In addition, when you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can use both the Damage and the Shove options. You can use this benefit only once per turn.' },
      { name: 'Howl', description: 'As a Bonus Action, you let out an unearthly howl. Each creature of your choice within 15 feet of you must succeed on a Wisdom saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus) or have Disadvantage on attack rolls and saving throws until the start of your next turn. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.' },
      { name: 'Werewolf Instincts', description: 'You have proficiency in the Perception, Stealth, or Survival skill.' },
    ],
    description: 'With their bristling fur and snarling muzzles, lupins cast imposing shadows in the Mists. Lupins often arise from encounters with werewolves in which the curse of lycanthropy didn\'t fully take hold. Unlike true werewolves, lupins can\'t shift between wolf and humanoid form but are instead stuck as a hybrid transformation. This cursed wolflike physiology affords lupins bestial might, enhanced instincts, and a dread-inducing howl.',
  },

  {
    id: 'reborn',
    name: 'Reborn',
    size: 'Small or Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Everlasting', description: 'You don\'t gain Exhaustion levels from dehydration, malnutrition, or suffocation. You don\'t need to sleep, and magic can\'t put you to sleep. You can finish a Long Rest in 4 hours if you spend those hours in an inactive, motionless state, during which you retain consciousness.' },
      { name: 'Knowledge from a Past Life', description: 'You gain proficiency in one skill of your choice. In addition, you can temporarily peer into the past to aid you in the present. When you fail an ability check, you can roll 1d6 and add the number rolled to the d20, potentially turning the failure into a success. You can do this a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.' },
      { name: 'Strange Endurance', description: 'You have Resistance to one of the following damage types of your choice: Cold, Necrotic, or Poison.' },
    ],
    description: 'Reborn are individuals who have died yet inexplicably still live. Some reborn exhibit the scars of fatal ends, their ashen flesh or bloodless veins making it clear that they\'ve escaped death. Other reborn are marvels of magic or science, being stitched together from disparate beings or bearing mysterious minds in manufactured bodies. Whatever their origins, reborn know a new life and seek experiences and answers all their own.',
  },

  {
    id: 'duskling',
    name: 'Duskling',
    size: 'Medium',
    speed: 30,
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      { name: 'Enhanced Jump', description: 'Add 2 feet to the distance you can leap with a running High Jump and 10 feet to the distance you can leap with a running Long Jump.' },
      { name: 'Inner Magic', description: 'You have magic inside you that you can manipulate to enhance your physical or mental attributes. When you finish a Long Rest, choose one of the following benefits, which lasts until you choose a different ability. As a Bonus Action, you can switch to a different benefit. You can switch the benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.' },
      { name: 'Ardor', description: 'You have Advantage on Charisma ability checks and on saving throws to avoid or end the Frightened condition.' },
      { name: 'Mobility', description: 'Your Speed increases by 10 feet, and climbing and swimming don\'t cost you extra movement.' },
      { name: 'Vigor', description: 'You gain a number of Temporary Hit Points equal to your Proficiency Bonus, and you have Advantage on Strength (Athletics) and Dexterity (Acrobatics) checks.' },
    ],
    description: 'Dusklings are a people who\'ve left the Feywild to settle in forested lands of both the Outer Planes and the Material Plane. The inherent magic of the Feywild still runs through them, giving dusklings the ability to suffuse themselves with magical effects. Dusklings that travel the planes often live in migratory communities that follow livestock herds they tend. When the resources run out in one place, they move to another. Young dusklings play daring games that encourage them to harness and utilize their inner powers.',
  },
];

export const SPECIES_BY_ID: Record<string, SpeciesDef> = Object.fromEntries(
  SPECIES.map((s) => [s.id, s]),
);
