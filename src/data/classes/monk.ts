import type { ClassDef } from '../../types/character';

export const monk: ClassDef = {
  id: 'monk',
  name: 'Monk',
  hitDie: 8,
  savingThrowProficiencies: ['str', 'dex'],
  armorProficiencies: [],
  weaponProficiencies: [
    'Simple weapons',
    'Shortswords',
    'Shortbows',
    'Light crossbows',
    'Darts',
    'Slings',
    'Flutes',
    'Drums',
    'Lutes',
  ],
  toolProficiencies: [
    "three artisan tools of choice (carpenter's, weaver's, leatherworker's, mason's, smith's, calligrapher's)",
  ],
  skills: {
    granted: [],
    choices: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
    choiceCount: 2,
  },
  subclassLevel: 3,
  extraFeatLevel: 4,
  sourceNote: 'SRD 5.2',
  asiLevels: [4, 8, 12, 16],
  multiclassGains: [
    'Simple weapons, Shortswords',
    'Two skills from the Monk list',
    "Three artisan tools of choice (carpenter's, weaver's, leatherworker's, mason's, smith's, calligrapher's)",
  ],
  subclasses: [
    {
      id: 'warrior-of-the-open-hand',
      classId: 'monk',
      name: 'Warrior of the Open Hand',
      description: 'Master unarmed combat techniques that push, trip, and manipulate opponents.',
      features: [
        {
          level: 3,
          name: 'Open Hand Technique',
          description:
            'On a hit with an attack granted by Flurry of Blows, impose Addle (no Opportunity Attacks until its next turn), Push (Str save or pushed 15 ft), or Topple (Dex save or Prone).',
        },
        {
          level: 6,
          name: 'Wholeness of Body',
          description:
            'As a Bonus Action, roll your Martial Arts die and regain Hit Points equal to that roll plus your Wisdom modifier (minimum 1). Uses equal to your Wisdom modifier per Long Rest.',
        },
        {
          level: 11,
          name: 'Fleet Step',
          description:
            'When you take a Bonus Action other than Step of the Wind, you can also use Step of the Wind immediately after it.',
        },
        {
          level: 17,
          name: 'Quivering Palm',
          description:
            'On a hit with an Unarmed Strike, expend 4 Focus Points to seed vibrations lasting days equal to your Monk level. Ending them requires a Con save; failure deals 10d12 Force damage. One target at a time.',
        },
      ],
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: 'martial-arts',
        name: 'Martial Arts',
        description:
          'While unarmed or wielding monk weapons, use Dex for attack and damage and roll d6 in place of the damage die (d8 at 5, d10 at 11, d12 at 17). When you take the Attack action, make one Unarmed Strike as a Bonus Action (two at 5).',
      },
      {
        id: 'unarmored-defense',
        name: 'Unarmored Defense',
        description:
          'While not wearing armor or wielding a shield, AC = 10 + Dexterity modifier + Wisdom modifier.',
      },
    ],
    2: [
      {
        id: 'focus-points',
        name: "Monk's Focus",
        description:
          'Focus Points equal to your Monk level, regained on a Short or Long Rest. Spend 1 for Flurry of Blows (two Unarmed Strikes as a Bonus Action), Patient Defense (Disengage, or both Disengage and Dodge, as a Bonus Action), or Step of the Wind (Dash, or both Disengage and Dash plus doubled jump distance). Focus Point save DC = 8 + Wisdom modifier + Proficiency Bonus.',
      },
      {
        id: 'unarmored-movement',
        name: 'Unarmored Movement',
        description:
          'Speed increases by 10 feet while not wearing armor or wielding a shield, scaling to +15 at 6, +20 at 10, +25 at 14, and +30 at 18.',
      },
      {
        id: 'uncanny-metabolism',
        name: 'Uncanny Metabolism',
        description:
          'When you roll Initiative, regain all expended Focus Points and roll your Martial Arts die to regain Hit Points equal to your Monk level plus the roll. Once per Long Rest.',
      },
    ],
    3: [
      {
        id: 'deflect-attacks',
        name: 'Deflect Attacks',
        description:
          'When hit by an attack dealing Bludgeoning, Piercing, or Slashing damage, take a Reaction to reduce damage by 1d10 + Dexterity modifier + Monk level. If reduced to 0, spend 1 Focus Point to redirect it; the target makes a Dex save or takes two Martial Arts dice + Dex modifier of the same damage type.',
      },
      {
        id: 'subclass-feature-3',
        name: 'Monk Subclass',
        description: 'Choose the Warrior of the Open Hand subclass, which grants features at Monk levels 3, 6, 11, and 17.',
      },
    ],
    4: [
      {
        id: 'ability-score-improvement',
        name: 'Ability Score Improvement',
        description:
          'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify.',
      },
      {
        id: 'slow-fall',
        name: 'Slow Fall',
        description:
          'Take a Reaction when you fall to reduce falling damage by an amount equal to five times your Monk level.',
      },
    ],
    5: [
      {
        id: 'extra-attack',
        name: 'Extra Attack',
        description: 'You can attack twice instead of once whenever you take the Attack action.',
      },
      {
        id: 'stunning-strike',
        name: 'Stunning Strike',
        description:
          'Once per turn, on a hit with a Monk weapon or Unarmed Strike, spend 1 Focus Point. The target makes a Con save; failure means Stunned until the start of its next turn, success halves its Speed and grants you Advantage on the next attack against it.',
      },
    ],
    6: [
      {
        id: 'empowered-strikes',
        name: 'Empowered Strikes',
        description:
          'Damage from your Unarmed Strike can be Force damage or its normal damage type, whichever you choose.',
      },
      {
        id: 'subclass-feature-6',
        name: 'Warrior of the Open Hand Feature',
        description: "Gain your subclass's 6th-level feature, Wholeness of Body.",
      },
    ],
    7: [
      {
        id: 'evasion',
        name: 'Evasion',
        description:
          'When you make a Dex save for half damage, take none on a success and half on a failure. Ineffective while Incapacitated.',
      },
    ],
    8: [
      {
        id: 'ability-score-improvement-8',
        name: 'Ability Score Improvement',
        description:
          'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify.',
      },
    ],
    9: [
      {
        id: 'acrobatic-movement',
        name: 'Acrobatic Movement',
        description:
          'While not wearing armor or wielding a shield, move along vertical surfaces and across liquids without falling.',
      },
    ],
    10: [
      {
        id: 'heightened-focus',
        name: 'Heightened Focus',
        description:
          'Flurry of Blows makes three Unarmed Strikes instead of two; Patient Defense grants Temporary Hit Points equal to two Martial Arts dice; Step of the Wind lets you move a willing Large-or-smaller creature within 5 feet with you.',
      },
      {
        id: 'self-restoration',
        name: 'Self-Restoration',
        description:
          'Remove one Charmed, Frightened, or Poisoned condition from yourself at the end of each of your turns. Forgoing food and drink no longer causes Exhaustion levels.',
      },
    ],
    11: [
      {
        id: 'subclass-feature-11',
        name: 'Warrior of the Open Hand Feature',
        description: "Gain your subclass's 11th-level feature, Fleet Step.",
      },
    ],
    12: [
      {
        id: 'ability-score-improvement-12',
        name: 'Ability Score Improvement',
        description:
          'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify.',
      },
    ],
    13: [
      {
        id: 'deflect-energy',
        name: 'Deflect Energy',
        description:
          'Use Deflect Attacks against attacks dealing any damage type, not just Bludgeoning, Piercing, or Slashing.',
      },
    ],
    14: [
      {
        id: 'disciplined-survivor',
        name: 'Disciplined Survivor',
        description:
          'Gain proficiency in all saving throws. On a failed save, spend 1 Focus Point to reroll it and must use the new roll.',
      },
    ],
    15: [
      {
        id: 'perfect-focus',
        name: 'Perfect Focus',
        description:
          'When you roll Initiative and do not use Uncanny Metabolism, regain Focus Points until you have 4 if you have 3 or fewer.',
      },
    ],
    16: [
      {
        id: 'ability-score-improvement-16',
        name: 'Ability Score Improvement',
        description:
          'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify.',
      },
    ],
    17: [
      {
        id: 'subclass-feature-17',
        name: 'Warrior of the Open Hand Feature',
        description: "Gain your subclass's 17th-level feature, Quivering Palm.",
      },
    ],
    18: [
      {
        id: 'superior-defense',
        name: 'Superior Defense',
        description:
          'At the start of your turn, spend 3 Focus Points for 1 minute or until Incapacitated to gain Resistance to all damage except Force damage.',
      },
    ],
    19: [
      {
        id: 'epic-boon',
        name: 'Epic Boon',
        description:
          'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Irresistible Offense is recommended.',
      },
    ],
    20: [
      {
        id: 'body-and-mind',
        name: 'Body and Mind',
        description: 'Your Dexterity and Wisdom scores increase by 4, to a maximum of 25.',
      },
    ],
  },
};
