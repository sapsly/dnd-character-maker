import { SCHEMA_VERSION } from '../types/character';
import type {
  AbilityScores,
  Character,
  ClassEntry,
  HitDiePool,
  CoinPurse,
} from '../types/character';
import { createId } from './storage';
import { ALL_SOURCES } from './rules/sources';

/**
 * Constructors and defaults for characters.
 *
 * Keeping these in one place means the creation wizard, the import path, and
 * the level-up flow all start from the same shape, so a field added here is
 * never missing from one of them.
 */

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

/** Ability scores laid out so each of the six gets a distinct standard-array value. */
function standardArrayScores(): AbilityScores {
  return { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
}

export function createClassEntry(classId: string, isPrimary: boolean): ClassEntry {
  return {
    id: createId('class'),
    classId,
    level: 1,
    isPrimary,
    skillPicks: [],
    cantripIds: [],
    spellIdsKnown: [],
    spellIdsPrepared: [],
    weaponMasteries: [],
    featurePicks: {},
  };
}

export interface NewCharacterOptions {
  name?: string;
  playerName?: string;
  speciesId?: string;
  backgroundId?: string;
  classId?: string;
}

export function createCharacter(options: NewCharacterOptions = {}): Character {
  const now = new Date().toISOString();
  return {
    id: createId(),
    schemaVersion: SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,

    meta: {
      name: options.name ?? '',
      playerName: options.playerName ?? '',
      pronouns: '',
      avatarColor: 'var(--accent)',
      isFavorite: false,
    },

    level: 1,
    xp: 0,

    classes: [createClassEntry(options.classId ?? 'fighter', true)],

    species: {
      speciesId: options.speciesId ?? 'human',
      abilityBonuses: {},
    },
    lineageSpellIds: {},
    background: {
      backgroundId: options.backgroundId ?? 'acolyte',
      abilityBonuses: {},
    },

    abilityScoreMethod: 'standard',
    abilityScoreBase: standardArrayScores(),

    /** All source books enabled by default for new characters. */
    sources: [...ALL_SOURCES],

    choices: [],

    combat: {
      armorId: 'none',
      shieldEquipped: false,
      acBonusFlat: 0,
      speedBonus: 0,
      initiativeBonus: 0,
      hpBonusFlat: 0,
      hitPointsCurrent: 0,
      temporaryHitPoints: 0,
      exhaustionLevel: 0,
      conditions: [],
    },

    hitDice: { die: 10, total: 1, used: 0 } as HitDiePool,
    deathSaves: { successes: 0, failures: 0 },
    spellSlotsUsed: {},
    featureUses: {},

    inventory: [],
    coins: { cp: 0, sp: 0, gp: 0 } as CoinPurse,
    notes: {
      appearance: '',
      personality: '',
      ideals: '',
      bonds: '',
      flaws: '',
      backstory: '',
      notes: '',
      privateNotes: '',
    },
  };
}

export const POINT_BUY_BUDGET = 27;

/** SRD 5.2 / 2024 point-buy cost table. 7 is the floor; 8 is free. */
export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export const MIN_ALLOCATED_SCORE = 8;
export const MAX_ALLOCATED_SCORE = 15;
export const MAX_FINAL_SCORE = 20;

export function pointsSpent(scores: AbilityScores): number {
  return Object.values(scores).reduce((total, score) => {
    return total + (POINT_BUY_COSTS[score] ?? Math.max(0, score - 7));
  }, 0);
}

export function pointsRemaining(scores: AbilityScores): number {
  return POINT_BUY_BUDGET - pointsSpent(scores);
}

export const STANDARD_ARRAY_VALUES: readonly number[] = STANDARD_ARRAY;
