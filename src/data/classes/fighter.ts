import type { ClassDef } from '../../types/character';

export const fighter: ClassDef = {
  id: 'fighter',
  name: 'Fighter',
  hitDie: 10,
  savingThrowProficiencies: ['str', 'con'],
  armorProficiencies: ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'],
  weaponProficiencies: ['Simple weapons', 'Martial weapons'],
  toolProficiencies: ["heritage of adopted tradition (choose one: baker, tailor, calligrapher, cartographer, weaver, stonecutter, woodcarver, etc.)"],
  skills: {
    granted: [],
    choices: [
      'acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception',
      'history', 'insight', 'intimidation', 'investigation', 'medicine',
      'nature', 'perception', 'performance', 'persuasion', 'religion',
      'sleightOfHand', 'stealth', 'survival',
    ],
    choiceCount: 2,
  },
  subclassLevel: 3,
  extraFeatLevel: 4,
  sourceNote: 'SRD 5.2',
  /** Six ASI levels, per SRD 5.2 Fighter: "You gain this feature again at Fighter levels 6, 8, 12, 14, and 16." No ASI at 20. */
  asiLevels: [4, 6, 8, 12, 14, 16],
  weaponMastery: {
    featureLevel: 2,
    choiceCount: 2,
    pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'],
    extraPicksAtLevels: [4, 6, 10, 16],
  },
  multiclassGains: [
    'Light armor, Medium armor, Heavy armor, Shields',
    'Simple weapons, Martial weapons',
    'One skill from the Fighter list',
    'Heritage of adopted tradition (choose one: baker, tailor, calligrapher, cartographer, weaver, stonecutter, woodcarver, etc.)',
  ],
  subclasses: [
    {
      id: 'battle-master',
      classId: 'fighter',
      name: 'Battle Master',
      description: 'Commands combat with superiority dice, learning maneuvers that enhance attacks and control the battlefield.',
      features: [
        { level: 3, name: 'Combat Superiority', description: 'Learn 3 maneuvers (Ambush, Bait and Switch, Commander\'s Strike, Disarming Attack, Distracting Strike, Evasive Footwork, Feinting Attack, Goading Attack, Lunging Attack, Maneuvering Attack, Menacing Attack, Parry, Precision Attack, Pushing Attack, Rally, Riposte, Sweeping Attack, Tactical Assessment, Trip Attack). You have 4 superiority dice (d8), gain one more at 7 and 15. Dice refresh on short/long rest. Save DC = 8 + proficiency + Strength/Dexterity.' },
        { level: 3, name: 'Student of War', description: 'Gain proficiency with one type of artisan\'s tools.' },
        { level: 7, name: 'Know Your Enemy', description: 'Spend 1 minute observing a creature outside combat to learn two of its characteristics (Strength/Dexterity/Constitution score, AC, HP, class levels, Fighter levels) relative to yours.' },
        { level: 10, name: 'Improved Combat Superiority', description: 'Superiority dice become d10. Learn 2 more maneuvers.' },
        { level: 15, name: 'Relentless', description: 'When you roll initiative and have no superiority dice, regain 1.' },
        { level: 18, name: 'Maneuver Master', description: 'Learn 2 more maneuvers. When you roll initiative, regain 1 superiority die if you have none.' },
      ],
    },
    {
      id: 'champion',
      classId: 'fighter',
      name: 'Champion',
      description: 'Pursues physical perfection, scoring critical hits more often and gaining remarkable athletic prowess.',
      features: [
        { level: 3, name: 'Improved Critical', description: 'Weapon attacks score a critical hit on a roll of 19 or 20.' },
        { level: 3, name: 'Remarkable Athlete', description: 'Add half proficiency bonus (rounded up) to Strength, Dexterity, and Constitution checks that don\'t already use proficiency. Running long jump distance increases by 10 feet.' },
        { level: 7, name: 'Additional Fighting Style', description: 'Choose a second Fighting Style option.' },
        { level: 10, name: 'Heroic Warrior', description: 'When you roll initiative, gain temporary HP = Fighter level + Constitution modifier.' },
        { level: 15, name: 'Superior Critical', description: 'Weapon attacks score a critical hit on a roll of 18, 19, or 20.' },
        { level: 18, name: 'Survivor', description: 'At the start of each turn, if you have at least 1 HP and are below half your HP maximum, regain 5 + Constitution modifier HP.' },
      ],
    },
    {
      id: 'eldritch-knight',
      classId: 'fighter',
      name: 'Eldritch Knight',
      description: 'Blends martial mastery with wizardly magic, bonding weapons and casting abjuration and evocation spells.',
      features: [
        { level: 3, name: 'Spellcasting', description: 'Learn 2 cantrips and 3 1st-level spells from the wizard list (abjuration/evocation). Intelligence is your spellcasting ability. Gain more spells at higher levels (can replace one each level). Cantrips known: 2 at 3, 3 at 10. Spell slots: half Fighter level (rounded up) caster level.' },
        { level: 3, name: 'Weapon Bond', description: 'Spend 1 hour to bond with up to 2 weapons. You can\'t be disarmed of them while conscious. As a bonus action, summon a bonded weapon to your hand (same plane).' },
        { level: 7, name: 'War Magic', description: 'When you use your action to cast a cantrip, you can make one weapon attack as a bonus action.' },
        { level: 10, name: 'Eldritch Strike', description: 'When you hit with a weapon attack, the target has disadvantage on the next saving throw against a spell you cast before the end of your next turn.' },
        { level: 15, name: 'Arcane Charge', description: 'When you use Action Surge, you can teleport up to 30 feet to an unoccupied space you can see, before or after the extra action.' },
        { level: 18, name: 'Improved War Magic', description: 'When you use your action to cast a spell of 1st level or higher, you can make one weapon attack as a bonus action.' },
      ],
    },
    {
      id: 'psi-warrior',
      classId: 'fighter',
      name: 'Psi Warrior',
      description: 'Augments combat with psionic power, creating protective fields and striking with mental force.',
      features: [
        { level: 3, name: 'Psionic Power', description: 'Gain Psionic Energy dice (d6, equal to twice proficiency bonus, refresh on long rest). Spend dice for: Protective Field (reaction, reduce damage by die + Int), Psionic Strike (add die to damage, force type, push 10 ft), Telekinetic Movement (bonus action, move object/creature 30 ft, Str save).' },
        { level: 3, name: 'Telekinetic Adept', description: 'Gain new Psionic Power options: Telekinetic Thrust (on Psionic Strike, target falls prone), Telekinetic Maneuver (move self 30 ft without provoking).' },
        { level: 7, name: 'Guarded Mind', description: 'Gain resistance to psychic damage. You can\'t be frightened while you have at least 1 Psionic Energy die.' },
        { level: 10, name: 'Bulwark of Force', description: 'As a bonus action, grant half cover to yourself and allies within 30 ft for 1 minute (costs 1 die). Allies also gain +2 AC. Usable once per long rest or by spending a die.' },
        { level: 15, name: 'Telekinetic Master', description: 'Cast telekinesis without components (Int spellcasting). Concentration not required for 1 minute. Usable once per long rest or by spending 7 Psionic Energy dice.' },
        { level: 18, name: 'Psionic Mastery', description: 'Psionic Energy dice become d10. When you roll initiative, regain 1 die if you have none.' },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'fighting-style',
        name: 'Fighting Style',
        description: 'Choose two Fighting Style options: Archery (+2 ranged attacks), Blind Fighting (blindsight 10 ft), Defense (+1 AC), Dueling (+2 damage one-handed melee), Great Weapon Fighting (reroll 1/2 on two-handed), Interception (reaction reduce hit on ally 10 ft), Protection (reaction impose disadvantage on attack vs ally 5 ft, shield), Superior Technique (1 superiority die d6, 1 maneuver), Thrown Weapon Fighting (+2 damage thrown), Two-Weapon Fighting (add ability mod to off-hand), Unarmed Fighting (1d6+Str unarmed, 1d8 if two hands free). You can replace one when you gain a Fighter level.',
        options: [
          { id: 'archery', name: 'Archery', description: 'You gain a +2 bonus to attack rolls with ranged weapons.' },
          { id: 'blind-fighting', name: 'Blind Fighting', description: 'You have blindsight with a range of 10 feet.' },
          { id: 'defense', name: 'Defense', description: 'While wearing armor, you gain a +1 bonus to AC.' },
          { id: 'dueling', name: 'Dueling', description: 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
          { id: 'great-weapon-fighting', name: 'Great Weapon Fighting', description: 'When you roll a 1 or 2 on a damage die for a two-handed or versatile melee weapon attack, reroll the die and use the new roll.' },
          { id: 'interception', name: 'Interception', description: 'When a creature you can see hits a target within 10 ft of you, you can use your reaction to reduce the damage by 1d10 + proficiency (min 0). Must wield shield or simple/martial weapon.' },
          { id: 'protection', name: 'Protection', description: 'When a creature you can see attacks a target within 5 ft of you, you can use your reaction to impose disadvantage on the attack. Must wield a shield.' },
          { id: 'superior-technique', name: 'Superior Technique', description: 'Learn one Battle Master maneuver. You have 1 superiority die (d6) that refreshes on a short/long rest.' },
          { id: 'two-weapon-fighting', name: 'Two Weapon Fighting', description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the off-hand attack.' },
        ],
        optionCount: 2,
      },
      {
        id: 'second-wind',
        name: 'Second Wind',
        description: 'As a bonus action, regain 1d10 + Fighter level HP. Usable twice per long rest (3 at 4, 4 at 10).',
      },
    ],
    2: [
      {
        id: 'action-surge',
        name: 'Action Surge',
        description: 'On your turn, take one additional action. Usable once per short/long rest (twice at 17, but only once per turn).',
      },
      {
        id: 'tactical-mind',
        name: 'Tactical Mind',
        description: 'When you take the Ready action, choose one: gain a +2 bonus to one attack roll, take the Disengage or Follow actions as a bonus action, or make one melee attack that uses the Unarmed Strike Fighting Style. If you have no Focus Point, regain one when you finish a long rest.',
      },
      {
        id: 'weapon-mastery',
        name: 'Weapon Mastery',
        description: 'Your training lets you use the mastery properties of two kinds of weapons. At levels 4, 6, 10, and 16, you can replace a mastery or choose an additional one.',
      },
    ],
    3: [
      { id: 'subclass-feature-3', name: 'Martial Archetype', description: 'Choose a Martial Archetype: Battle Master, Champion, Eldritch Knight, or Psi Warrior. Each grants features at 3rd, 7th, 10th, 15th, and 18th level.' },
    ],
    4: [
      { id: 'ability-score-improvement', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    5: [
      { id: 'extra-attack', name: 'Extra Attack', description: 'You can attack twice instead of once when you take the Attack action.' },
      { id: 'tactical-shift', name: 'Tactical Shift', description: 'When you use Second Wind, you can move up to half your speed without provoking opportunity attacks.' },
    ],
    6: [
      { id: 'ability-score-improvement-6', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    7: [
      { id: 'subclass-feature-7', name: 'Martial Archetype Feature', description: 'Gain your Martial Archetype\'s 7th-level feature.' },
    ],
    8: [
      { id: 'ability-score-improvement-8', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    9: [
      { id: 'indomitable', name: 'Indomitable', description: 'When you fail a saving throw, reroll it with a bonus equal to your Fighter level. Usable once per long rest (twice at 13, three at 17).' },
    ],
    10: [
      { id: 'subclass-feature-10', name: 'Martial Archetype Feature', description: 'Gain your Martial Archetype\'s 10th-level feature.' },
      { id: 'extra-attack-2', name: 'Extra Attack (2)', description: 'You can attack three times instead of twice when you take the Attack action.' },
    ],
    12: [
      { id: 'ability-score-improvement-12', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    13: [
      { id: 'indomitable-2', name: 'Indomitable (2 uses)', description: 'You can use Indomitable twice per long rest.' },
    ],
    14: [
      { id: 'ability-score-improvement-14', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    15: [
      { id: 'subclass-feature-15', name: 'Martial Archetype Feature', description: 'Gain your Martial Archetype\'s 15th-level feature.' },
    ],
    16: [
      { id: 'ability-score-improvement-16', name: 'Ability Score Improvement', description: 'Increase one ability by 2, or two abilities by 1 each, or take a feat. Cannot raise an ability above 20.' },
    ],
    17: [
      { id: 'action-surge-2', name: 'Action Surge (2 uses)', description: 'You can use Action Surge twice per short rest (still only once per turn).' },
      { id: 'indomitable-3', name: 'Indomitable (3 uses)', description: 'You can use Indomitable three times per long rest.' },
    ],
    18: [
      { id: 'subclass-feature-18', name: 'Martial Archetype Feature', description: 'Gain your Martial Archetype\'s 18th-level feature.' },
      { id: 'tactical-master', name: 'Tactical Master', description: 'When you hit with an attack using a weapon mastery property, you can forgo the property to instead impose a tactical effect: push 15 ft, knock prone, or reduce speed by 15 ft until your next turn.' },
    ],
    20: [
      { id: 'extra-attack-3', name: 'Extra Attack (3)', description: 'You can attack four times instead of three when you take the Attack action.' },
    ],
  },
};