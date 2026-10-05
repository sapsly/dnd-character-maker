import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  AbilityBonusMap,
  AbilityKey,
  AbilityScores,
  BackgroundDef,
  Choice,
  Character,
  ClassDef,
  CoinPurse,
  SpeciesDef,
  SpellKey,
  SkillKey,
  SpeciesLineageId,
  WeaponMasteryProperty,
} from '../../types/character'
import { SPECIES } from '../../data/species'
import { BACKGROUNDS } from '../../data/backgrounds'
import { CLASSES } from '../../data/classes'
import { lineagesForSpecies } from '../../data/lineages'
import { SKILL_DEFS } from '../../lib/rules/skillList'
import { startingEquipmentFor } from '../../data/startingEquipment'
import { gpToCoinPurse, addCoinPurses } from '../../lib/coins'
import {
  MAX_ALLOCATED_SCORE,
  MAX_FINAL_SCORE,
  MIN_ALLOCATED_SCORE,
  POINT_BUY_BUDGET,
  STANDARD_ARRAY_VALUES,
  createCharacter,
  pointsRemaining,
  pointsSpent,
} from '../../lib/characterFactory'
import { createId, upsertCharacter } from '../../lib/storage'
import { abilityModifier } from '../../lib/rules/ability'

export type WizardStep = 'identity' | 'class' | 'background' | 'abilities' | 'spells' | 'review'

export const WIZARD_STEPS: { id: WizardStep; label: string }[] = [
  { id: 'identity', label: 'Name & species' },
  { id: 'class', label: 'Class' },
  { id: 'background', label: 'Background' },
  { id: 'abilities', label: 'Abilities' },
  { id: 'spells', label: 'Spells' },
  { id: 'review', label: 'Review' },
]

export type ScoreMethod = 'standard' | 'pointBuy' | 'rolled'
/** 2024 lets a background grant +2/+1, or +1/+1/+1, among its listed abilities. */
export type BackgroundBonusMode = 'plus2plus1' | 'plus1each'

export interface WizardState {
  step: WizardStep
  name: string
  playerName: string
  speciesId: string
  /** Lineage choice for species that offer one (Elf, Gnome, Tiefling). Undefined for species without lineages. */
  lineageId: SpeciesLineageId | undefined
  classId: string
  backgroundId: string
  scoreMethod: ScoreMethod
  abilityScoreBase: AbilityScores
  backgroundMode: BackgroundBonusMode
  backgroundBonuses: AbilityBonusMap
  /** Cantrip spell IDs picked at creation */
  cantripIds: SpellKey[]
  /** Known spell IDs picked at creation (for 'known' classes) */
  spellIdsKnown: SpellKey[]
  /** Prepared spell IDs picked at creation (for 'prepared' classes) */
  spellIdsPrepared: SpellKey[]
  /** Background tool proficiency picked at creation (display name from tool catalog) */
  backgroundTool: string | null
  /** Class skill proficiency picks */
  skillPicks: SkillKey[]
  /** Weapon mastery property picks */
  weaponMasteries: WeaponMasteryProperty[]
  /** Starting equipment option ID chosen for background (resolved via startingEquipmentFor) */
  backgroundStartingEquipmentOptionId: string | null
  /** Starting equipment option ID chosen for class (resolved via startingEquipmentFor) */
  classStartingEquipmentOptionId: string | null
}

export interface CreateCharacterModel {
  state: WizardState
  /** True when the wizard is editing a saved character rather than creating one. */
  isEdit: boolean
  stepIndex: number
  species: SpeciesDef | null
  classDef: ClassDef | null
  background: BackgroundDef | null
  standardValues: readonly number[]
  pointsSpent: number
  pointsRemaining: number
  /** Every unmet prerequisite for the current step, human-readable. */
  stepErrors: string[]
  nameErrors: string[]
  speciesErrors: string[]
  backgroundErrors: string[]
  scoreErrors: string[]
  skillErrors: string[]
  weaponMasteryErrors: string[]
  equipmentErrors: string[]
  canAdvance: boolean
  canCreate: boolean
  saving: boolean
  saveError: string | null
  setStep: (step: WizardStep) => void
  next: () => void
  back: () => void
  setName: (value: string) => void
  setPlayerName: (value: string) => void
  setSpeciesId: (value: string) => void
  setLineageId: (id: SpeciesLineageId) => void
  setClassId: (value: string) => void
  setBackgroundId: (value: string) => void
  setScoreMethod: (value: ScoreMethod) => void
  setAbilityScore: (ability: AbilityKey, value: number) => void
  setBackgroundMode: (value: BackgroundBonusMode) => void
  setBackgroundBonus: (ability: AbilityKey, value: number) => void
  setCantripIds: (ids: SpellKey[]) => void
  setSpellIdsKnown: (ids: SpellKey[]) => void
  setSpellIdsPrepared: (ids: SpellKey[]) => void
  setBackgroundTool: (tool: string | null) => void
  setSkillPicks: (ids: SkillKey[]) => void
  setWeaponMasteries: (ids: WeaponMasteryProperty[]) => void
  setBackgroundStartingEquipmentOptionId: (id: string | null) => void
  setClassStartingEquipmentOptionId: (id: string | null) => void
  create: () => void
  reset: () => void
}

export const ABILITY_KEYS: readonly AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
}

/** Mirrors the default assignment used by createCharacter's standard array. */
const DEFAULT_STANDARD: AbilityScores = {
  str: 15,
  dex: 14,
  con: 13,
  int: 12,
  wis: 10,
  cha: 8,
}

const POINT_BUY_DEFAULT: AbilityScores = {
  str: 15,
  dex: 14,
  con: 13,
  int: 12,
  wis: 8,
  cha: 8,
}

/**
 * Placeholder for a hand-rolled character. The SRD range for 4d6 drop lowest is
 * 3-18; 12 across the board is a legal and ordinary roll that the player then
 * overwrites with their own dice. The app never generates randomness.
 */
const ROLLED_DEFAULT: AbilityScores = {
  str: 12,
  dex: 12,
  con: 12,
  int: 12,
  wis: 12,
  cha: 12,
}

export const MIN_ROLLED_SCORE = 3
export const MAX_ROLLED_SCORE = 18

/**
 * Infers which allocation pattern an existing character used, so editing does
 * not silently reset a background's increases to an unallocated state.
 */
function modeForBonuses(bonuses: AbilityBonusMap, choices: AbilityKey[]): BackgroundBonusMode {
  const values = choices.map((ability) => bonuses[ability] ?? 0).filter((value) => value > 0)
  return values.length === 3 && values.every((value) => value === 1) ? 'plus1each' : 'plus2plus1'
}

/**
 * `existing` turns the same wizard into an editor: the form starts from a saved
 * character instead of from creation defaults, and saving patches that
 * character in place rather than writing a new one.
 */
function initialState(existing?: Character | null): WizardState {
  if (!existing) {
    return {
      step: 'identity',
      name: '',
      playerName: '',
      speciesId: 'human',
      lineageId: undefined,
      classId: 'fighter',
      backgroundId: 'acolyte',
      scoreMethod: 'standard',
      abilityScoreBase: { ...DEFAULT_STANDARD },
      backgroundMode: 'plus2plus1',
      backgroundBonuses: {},
      cantripIds: [],
      spellIdsKnown: [],
      spellIdsPrepared: [],
      backgroundTool: null,
      skillPicks: [],
      weaponMasteries: [],
      backgroundStartingEquipmentOptionId: null,
      classStartingEquipmentOptionId: null,
    }
  }

  const backgroundId = existing.background?.backgroundId ?? 'acolyte'
  const background = BACKGROUNDS.find((b) => b.id === backgroundId)
  const bonuses = { ...(existing.background?.abilityBonuses ?? {}) }
  const classEntry = existing.classes?.[0]

  return {
    step: 'identity',
    name: existing.meta.name ?? '',
    playerName: existing.meta.playerName ?? '',
    speciesId: existing.species?.speciesId ?? 'human',
    lineageId: existing.species?.lineageId,
    classId: existing.classes?.[0]?.classId ?? 'fighter',
    backgroundId,
    scoreMethod: existing.abilityScoreMethod ?? 'standard',
    abilityScoreBase: { ...existing.abilityScoreBase },
    backgroundMode: modeForBonuses(bonuses, background?.abilityBonusChoices ?? []),
    backgroundBonuses: bonuses,
    cantripIds: classEntry?.cantripIds ?? [],
    spellIdsKnown: classEntry?.spellIdsKnown ?? [],
    spellIdsPrepared: classEntry?.spellIdsPrepared ?? [],
    backgroundTool: existing.background?.toolProficiencies?.[0] ?? null,
    skillPicks: classEntry?.skillPicks ?? [],
    weaponMasteries: classEntry?.weaponMasteries ?? [],
    backgroundStartingEquipmentOptionId: existing.background?.startingEquipmentOptionId ?? null,
    classStartingEquipmentOptionId: classEntry?.startingEquipmentOptionId ?? null,
  }
}

/**
 * Outstanding choices a level-1 character still owes. The wizard records them
 * unresolved so the character sheet's `outstandingChoices` surfaces them,
 * rather than silently dropping choices it cannot model.
 *
 * Each one is emitted only when the character is actually short of it. The
 * wizard collects cantrips, spells, and background tools during creation and
 * writes them straight onto the entry, so queueing them unconditionally would
 * leave every finished spellcaster with a permanent "outstanding choices"
 * banner for picks they had already made.
 *
 * Class skills and weapon masteries are picked during creation too, so they are
 * never emitted here at all.
 */
function pendingChoices(
  character: Character,
  classDef: ClassDef | null,
  species: SpeciesDef | null,
): Choice[] {
  const out: Choice[] = []
  const classEntry = character.classes[0]

  if (species?.featLevels?.includes(1)) {
    out.push({
      id: createId('choice'),
      kind: 'speciesFeat',
      grantedAtLevel: 1,
      label: `${species.name} ancestry feat`,
      count: 1,
      picks: [],
      resolved: false,
    })
  }

  // Spell choices for classes with spellcasting at level 1
  if (classDef?.spellcasting) {
    const sc = classDef.spellcasting
    const cantripCount = sc.cantripCountByLevel[1] ?? 0
    const spellCount = sc.spellCountByLevel[1] ?? 0
    const prepared = sc.spellsMode === 'prepared'

    if (cantripCount > 0 && (classEntry?.cantripIds?.length ?? 0) < cantripCount) {
      out.push({
        id: createId('choice'),
        kind: 'cantrips',
        classEntryId: classEntry?.id,
        grantedAtLevel: 1,
        label: `${classDef.name} cantrips`,
        count: cantripCount - (classEntry?.cantripIds?.length ?? 0),
        picks: [],
        resolved: false,
      })
    }

    const chosen = prepared
      ? (classEntry?.spellIdsPrepared?.length ?? 0)
      : (classEntry?.spellIdsKnown?.length ?? 0)
    if (spellCount > 0 && chosen < spellCount) {
      out.push({
        id: createId('choice'),
        kind: prepared ? 'spellsPrepared' : 'spellsKnown',
        classEntryId: classEntry?.id,
        grantedAtLevel: 1,
        label: `${classDef.name} 1st-level spells`,
        count: spellCount - chosen,
        picks: [],
        resolved: false,
      })
    }
  }

  // Background tool choices
  const bgId = character.background?.backgroundId
  const bgDef = bgId ? BACKGROUNDS.find((b) => b.id === bgId) : null
  const bgTools = character.background?.toolProficiencies?.length ?? 0
  if (bgDef && bgDef.toolChoiceCount > 0 && bgTools < bgDef.toolChoiceCount) {
    out.push({
      id: createId('choice'),
      kind: 'backgroundTools',
      grantedAtLevel: 1,
      label: `${bgDef.name} tool proficiency`,
      count: bgDef.toolChoiceCount - bgTools,
      picks: [],
      resolved: false,
    })
  }

  return out
}

/**
 * Compute the starting CoinPurse from the chosen background and class equipment options.
 * Only 'coins' kind options contribute; 'package' options list their coins verbatim in items.
 */
function computeStartingCoins(
  backgroundId: string,
  backgroundOptionId: string | null,
  classId: string,
  classOptionId: string | null,
): CoinPurse {
  let coins: CoinPurse = { cp: 0, sp: 0, gp: 0 }

  if (backgroundOptionId) {
    const bgEquipment = startingEquipmentFor(backgroundId, 'background')
    const bgOption = bgEquipment?.options.find((o) => o.id === backgroundOptionId)
    if (bgOption?.kind === 'coins' && bgOption.coinsGp > 0) {
      coins = addCoinPurses(coins, gpToCoinPurse(bgOption.coinsGp))
    }
  }

  if (classOptionId) {
    const classEquipment = startingEquipmentFor(classId, 'class')
    const classOption = classEquipment?.options.find((o) => o.id === classOptionId)
    if (classOption?.kind === 'coins' && classOption.coinsGp > 0) {
      coins = addCoinPurses(coins, gpToCoinPurse(classOption.coinsGp))
    }
  }

  return coins
}

export function useCreateCharacter(existing: Character | null = null): CreateCharacterModel {
  const navigate = useNavigate()
  const [state, setState] = useState<WizardState>(() => initialState(existing))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const isEdit = existing !== null

  const species = useMemo(
    () => SPECIES.find((s) => s.id === state.speciesId) ?? null,
    [state.speciesId],
  )
  const classDef = useMemo(
    () => CLASSES.find((c) => c.id === state.classId) ?? null,
    [state.classId],
  )
  const background = useMemo(
    () => BACKGROUNDS.find((b) => b.id === state.backgroundId) ?? null,
    [state.backgroundId],
  )

  const stepIndex = WIZARD_STEPS.findIndex((s) => s.id === state.step)

  const spent = pointsSpent(state.abilityScoreBase)
  const remaining = pointsRemaining(state.abilityScoreBase)

  const nameErrors = useMemo(() => {
    const trimmed = state.name.trim()
    if (trimmed.length === 0) return ['Enter a name for this character.']
    if (trimmed.length > 60) return ['Keep the name under 60 characters.']
    return []
  }, [state.name])

  const speciesErrors = useMemo(() => {
    if (!species) return ['That species is not in the catalogue.']
    return []
  }, [species])

  const backgroundErrors = useMemo(() => {
    if (!background) return ['That background is not in the catalogue.']

    const allowed = new Set<AbilityKey>(background.abilityBonusChoices)
    const errors: string[] = []

    for (const [key, value] of Object.entries(state.backgroundBonuses)) {
      const ability = key as AbilityKey
      if (!allowed.has(ability)) {
        errors.push(
          `${ABILITY_LABELS[ability]} is not one of the abilities ${background.name} offers.`,
        )
      }
      if (value !== 1 && value !== 2) {
        errors.push(`${ABILITY_LABELS[ability]} increase must be +1 or +2.`)
      }
    }

    const values = background.abilityBonusChoices
      .map((ability) => state.backgroundBonuses[ability] ?? 0)
      .filter((value) => value > 0)

    if (state.backgroundMode === 'plus2plus1') {
      const twos = values.filter((v) => v === 2).length
      const ones = values.filter((v) => v === 1).length
      if (twos !== 1 || ones !== 1 || values.length !== 2) {
        errors.push('Choose +2 to one ability and +1 to another.')
      }
    } else if (values.length !== 3 || values.some((v) => v !== 1)) {
      errors.push('Choose +1 to all three listed abilities.')
    }

    for (const ability of background.abilityBonusChoices) {
      const final =
        state.abilityScoreBase[ability] + (state.backgroundBonuses[ability] ?? 0)
      if (final > MAX_FINAL_SCORE) {
        errors.push(
          `${ABILITY_LABELS[ability]} would reach ${final}, above the maximum of ${MAX_FINAL_SCORE}.`,
        )
      }
    }

    return errors
  }, [background, state.backgroundBonuses, state.abilityScoreBase])

  const toolErrors = useMemo(() => {
    if (!background || background.toolChoiceCount === 0) return []
    if (!state.backgroundTool) return ['Choose a tool proficiency for this background.']
    return []
  }, [background, state.backgroundTool])

  const skillErrors = useMemo(() => {
    if (!classDef || classDef.skills.choiceCount === 0) return []
    const required = classDef.skills.choiceCount
    const chosen = state.skillPicks.length
    const allowed = new Set(classDef.skills.choices)
    const invalid = state.skillPicks.filter((s) => !allowed.has(s))
    const errors: string[] = []
    if (chosen < required) {
      errors.push(`Choose ${required} skill proficiencies from ${classDef.name}; ${chosen} selected.`)
    } else if (chosen > required) {
      errors.push(`Too many skill proficiencies chosen (max ${required}).`)
    }
    if (invalid.length > 0) {
      errors.push(`Invalid skill picks: ${invalid.join(', ')} are not in the ${classDef.name} skill list.`)
    }
    return errors
  }, [classDef, state.skillPicks])

  const weaponMasteryErrors = useMemo(() => {
    if (!classDef?.weaponMastery || classDef.weaponMastery.choiceCount === 0) return []
    const required = classDef.weaponMastery.choiceCount
    const chosen = state.weaponMasteries.length
    const allowed = new Set(classDef.weaponMastery.pool)
    const invalid = state.weaponMasteries.filter((m) => !allowed.has(m))
    const errors: string[] = []
    if (chosen < required) {
      errors.push(`Choose ${required} weapon mastery properties; ${chosen} selected.`)
    } else if (chosen > required) {
      errors.push(`Too many weapon mastery properties chosen (max ${required}).`)
    }
    if (invalid.length > 0) {
      errors.push(`Invalid weapon mastery picks: ${invalid.join(', ')} are not in the ${classDef.name} mastery pool.`)
    }
    return errors
  }, [classDef, state.weaponMasteries])

  const equipmentErrors = useMemo(() => {
    const errors: string[] = []

    // Background starting equipment
    const bgDef = BACKGROUNDS.find((b) => b.id === state.backgroundId)
    const bgEquipment = bgDef ? startingEquipmentFor(bgDef.id, 'background') : undefined
    if (bgEquipment && bgEquipment.options.length > 0) {
      if (!state.backgroundStartingEquipmentOptionId) {
        errors.push('Choose a starting equipment option for your background.')
      } else if (!bgEquipment.options.some((opt) => opt.id === state.backgroundStartingEquipmentOptionId)) {
        errors.push('Selected background equipment option is not valid.')
      }
    }

    // Class starting equipment
    const classDefForEquipment = CLASSES.find((c) => c.id === state.classId)
    const classEquipment = classDefForEquipment ? startingEquipmentFor(classDefForEquipment.id, 'class') : undefined
    if (classEquipment && classEquipment.options.length > 0) {
      if (!state.classStartingEquipmentOptionId) {
        errors.push('Choose a starting equipment option for your class.')
      } else if (!classEquipment.options.some((opt) => opt.id === state.classStartingEquipmentOptionId)) {
        errors.push('Selected class equipment option is not valid.')
      }
    }

    return errors
  }, [state.backgroundId, state.backgroundStartingEquipmentOptionId, state.classId, state.classStartingEquipmentOptionId])

  const scoreErrors = useMemo(() => {
    const errors: string[] = []
    const scores = state.abilityScoreBase

    // Rolled characters use the full 4d6-drop-lowest range; the other two
    // methods share the narrower 8-15 band the SRD allows for allocation.
    const low = state.scoreMethod === 'rolled' ? MIN_ROLLED_SCORE : MIN_ALLOCATED_SCORE
    const high = state.scoreMethod === 'rolled' ? MAX_ROLLED_SCORE : MAX_ALLOCATED_SCORE

    for (const ability of ABILITY_KEYS) {
      const value = scores[ability]
      if (value < low || value > high) {
        errors.push(`${ABILITY_LABELS[ability]} must be between ${low} and ${high}.`)
      }
    }

    if (state.scoreMethod === 'pointBuy' && remaining < 0) {
      errors.push(`Point buy is over budget by ${Math.abs(remaining)} point(s).`)
    }

    if (state.scoreMethod === 'rolled') {
      // A sanity check, not a rule: this distribution is legal but almost
      // always a mistyped score rather than a real roll.
      const extreme = ABILITY_KEYS.filter((ability) => {
        const value = scores[ability]
        return value >= 18 || value <= 3
      })
      if (extreme.length >= 2) {
        errors.push(
          `${extreme.length} scores at ${MIN_ROLLED_SCORE} or ${MAX_ROLLED_SCORE} is very unusual for a roll. Check the numbers.`,
        )
      }
    }

    if (state.scoreMethod === 'standard') {
      const used = ABILITY_KEYS.map((ability) => scores[ability])
      const expected = [...STANDARD_ARRAY_VALUES].sort((a, b) => a - b)
      const actual = [...used].sort((a, b) => a - b)
      if (used.some((value) => !STANDARD_ARRAY_VALUES.includes(value))) {
        errors.push('Every ability must use one of the six standard array values.')
      } else if (actual.join(',') !== expected.join(',')) {
        errors.push('Each standard array value must be used exactly once.')
      }
    }

    return errors
  }, [state.abilityScoreBase, state.scoreMethod, remaining])

  const stepErrors = useMemo(() => {
    switch (state.step) {
      case 'identity':
        return [...nameErrors, ...speciesErrors]
      case 'class':
        return classDef ? [...skillErrors, ...weaponMasteryErrors] : ['That class is not in the catalogue.']
      case 'background':
        return [...backgroundErrors, ...toolErrors, ...equipmentErrors]
      case 'abilities':
        return scoreErrors
      case 'spells':
        return []
      case 'review':
        return [...nameErrors, ...speciesErrors, ...backgroundErrors, ...scoreErrors, ...skillErrors, ...weaponMasteryErrors, ...equipmentErrors]
      default:
        return []
    }
  }, [state.step, nameErrors, speciesErrors, backgroundErrors, scoreErrors, toolErrors, classDef, skillErrors, weaponMasteryErrors, equipmentErrors])

  const canAdvance = stepErrors.length === 0
  const canCreate = canAdvance && nameErrors.length === 0 && backgroundErrors.length === 0 && scoreErrors.length === 0 && skillErrors.length === 0 && weaponMasteryErrors.length === 0 && equipmentErrors.length === 0

  const setStep = useCallback((step: WizardStep) => {
    setSaveError(null)
    setState((s) => ({ ...s, step }))
  }, [])

  const next = useCallback(() => {
    setState((s) => {
      const idx = WIZARD_STEPS.findIndex((w) => w.id === s.step)
      const following = WIZARD_STEPS[idx + 1]
      return following ? { ...s, step: following.id } : s
    })
  }, [])

  const back = useCallback(() => {
    setState((s) => {
      const idx = WIZARD_STEPS.findIndex((w) => w.id === s.step)
      const previous = WIZARD_STEPS[idx - 1]
      return previous ? { ...s, step: previous.id } : s
    })
  }, [])

  const setName = useCallback((value: string) => setState((s) => ({ ...s, name: value })), [])
  const setPlayerName = useCallback(
    (value: string) => setState((s) => ({ ...s, playerName: value })),
    [],
  )

  const setSpeciesId = useCallback(
    (value: string) => setState((s) => {
      // Changing species resets lineage when the new species has no lineage options.
      const hasLineages = lineagesForSpecies(value).length > 0
      return { ...s, speciesId: value, lineageId: hasLineages ? s.lineageId : undefined }
    }),
    [],
  )
  const setLineageId = useCallback(
    (id: SpeciesLineageId) => setState((s) => ({ ...s, lineageId: id })),
    [],
  )
  const setClassId = useCallback((value: string) => {
    setState((s) => {
      // Changing class clears stale skill/weapon mastery picks from the old class
      return { ...s, classId: value, skillPicks: [], weaponMasteries: [], classStartingEquipmentOptionId: null }
    })
  }, [])

  const setBackgroundId = useCallback(
    (value: string) => {
      setState((s) => {
        const next_background = BACKGROUNDS.find((b) => b.id === value)
        // Switching background invalidates a bonus split built for the old one.
        const allowed = new Set<AbilityKey>(next_background?.abilityBonusChoices ?? [])
        const backgroundBonuses: AbilityBonusMap = {}
        for (const [key, bonus] of Object.entries(s.backgroundBonuses)) {
          if (allowed.has(key as AbilityKey)) backgroundBonuses[key as AbilityKey] = bonus
        }
        // Changing background clears any previously selected tool and starting equipment option
        return { ...s, backgroundId: value, backgroundBonuses, backgroundTool: null, backgroundStartingEquipmentOptionId: null }
      })
    },
    [],
  )

  const setScoreMethod = useCallback((value: ScoreMethod) => {
    setState((s) => ({
      ...s,
      scoreMethod: value,
      // Each method has its own legal starting point, so switching resets
      // rather than leaving scores that are illegal for the new method.
      abilityScoreBase:
        value === 'standard'
          ? { ...DEFAULT_STANDARD }
          : value === 'rolled'
            ? { ...ROLLED_DEFAULT }
            : { ...POINT_BUY_DEFAULT },
    }))
  }, [])

  const setAbilityScore = useCallback((ability: AbilityKey, value: number) => {
    setState((s) => {
      // A rolled score may legitimately be 3 or 18, so it is not clamped to
      // the narrower band the allocating methods use.
      const low = s.scoreMethod === 'rolled' ? MIN_ROLLED_SCORE : MIN_ALLOCATED_SCORE
      const high = s.scoreMethod === 'rolled' ? MAX_ROLLED_SCORE : MAX_ALLOCATED_SCORE
      const clamped = Math.min(high, Math.max(low, value))
      return { ...s, abilityScoreBase: { ...s.abilityScoreBase, [ability]: clamped } }
    })
  }, [])

  const setBackgroundMode = useCallback((value: BackgroundBonusMode) => {
    setState((s) => ({ ...s, backgroundMode: value, backgroundBonuses: {} }))
  }, [])

  const setBackgroundBonus = useCallback((ability: AbilityKey, value: number) => {
    setState((s) => {
      const backgroundBonuses = { ...s.backgroundBonuses }
      if (value <= 0) {
        delete backgroundBonuses[ability]
      } else {
        backgroundBonuses[ability] = value
      }
      return { ...s, backgroundBonuses }
    })
  }, [])

  const setCantripIds = useCallback((ids: SpellKey[]) => setState((s) => ({ ...s, cantripIds: ids })), [])
  const setSpellIdsKnown = useCallback((ids: SpellKey[]) => setState((s) => ({ ...s, spellIdsKnown: ids })), [])
  const setSpellIdsPrepared = useCallback((ids: SpellKey[]) => setState((s) => ({ ...s, spellIdsPrepared: ids })), [])

  const setBackgroundTool = useCallback((tool: string | null) => setState((s) => ({ ...s, backgroundTool: tool })), [])

  const setSkillPicks = useCallback((ids: SkillKey[]) => setState((s) => ({ ...s, skillPicks: ids })), [])
  const setWeaponMasteries = useCallback((ids: WeaponMasteryProperty[]) => setState((s) => ({ ...s, weaponMasteries: ids })), [])
  const setBackgroundStartingEquipmentOptionId = useCallback((id: string | null) => setState((s) => ({ ...s, backgroundStartingEquipmentOptionId: id })), [])
  const setClassStartingEquipmentOptionId = useCallback((id: string | null) => setState((s) => ({ ...s, classStartingEquipmentOptionId: id })), [])

  const create = useCallback(() => {
    if (!canCreate || saving) return
    setSaving(true)
    setSaveError(null)

    const trimmedName = state.name.trim()
    const trimmedPlayerName = state.playerName.trim()

    let character: Character

    if (existing) {
      // Editing patches only what this wizard owns. Level, classes' resolved
      // picks, outstanding choices, combat, inventory and notes are carried
      // over untouched so opening the editor can never lose sheet progress.
      const classChanged = state.classId !== existing.classes?.[0]?.classId
      const speciesChanged = state.speciesId !== existing.species?.speciesId
      const backgroundChanged = state.backgroundId !== existing.background?.backgroundId
      const backgroundOptionChanged = state.backgroundStartingEquipmentOptionId !== existing.background?.startingEquipmentOptionId
      const classOptionChanged = state.classStartingEquipmentOptionId !== existing.classes?.[0]?.startingEquipmentOptionId

      // Equipment grant changes if background/class identity changed OR the chosen option within that origin changed.
      const equipmentGrantChanged = backgroundChanged || classChanged || backgroundOptionChanged || classOptionChanged

      // On edit, only recompute coins if the equipment grant actually changed.
      // Otherwise preserve the player's manually-set purse (avoids silent data loss).
      const startingCoins = equipmentGrantChanged
        ? computeStartingCoins(
            state.backgroundId,
            state.backgroundStartingEquipmentOptionId,
            state.classId,
            state.classStartingEquipmentOptionId,
          )
        : existing.coins

      character = {
        ...existing,
        updatedAt: new Date().toISOString(),
        meta: { ...existing.meta, name: trimmedName, playerName: trimmedPlayerName },
        species: {
          ...existing.species,
          speciesId: state.speciesId,
          lineageId: state.lineageId,
          // A species change invalidates a flexible species' stored bonus split.
          abilityBonuses: speciesChanged ? {} : { ...existing.species.abilityBonuses },
        },
        classes: existing.classes.map((entry, index) =>
          index === 0
            ? {
                ...entry,
                classId: state.classId,
                // When class changes, clear old spell picks; otherwise keep them
                cantripIds: classChanged ? [] : (state.cantripIds ?? entry.cantripIds),
                spellIdsKnown: classChanged ? [] : (state.spellIdsKnown ?? entry.spellIdsKnown),
                spellIdsPrepared: classChanged ? [] : (state.spellIdsPrepared ?? entry.spellIdsPrepared),
                // Skill and weapon mastery picks follow class change rules
                skillPicks: classChanged ? state.skillPicks : (state.skillPicks.length > 0 ? state.skillPicks : entry.skillPicks),
                weaponMasteries: classChanged ? state.weaponMasteries : (state.weaponMasteries.length > 0 ? state.weaponMasteries : entry.weaponMasteries),
                startingEquipmentOptionId: classChanged ? (state.classStartingEquipmentOptionId ?? undefined) : (state.classStartingEquipmentOptionId ?? entry.startingEquipmentOptionId),
              }
            : entry,
        ),
        background: {
          ...existing.background,
          backgroundId: state.backgroundId,
          abilityBonuses: { ...state.backgroundBonuses },
          toolProficiencies: state.backgroundTool ? [state.backgroundTool] : [],
          startingEquipmentOptionId: state.backgroundStartingEquipmentOptionId ?? undefined,
        },
        abilityScoreMethod: state.scoreMethod,
        abilityScoreBase: { ...state.abilityScoreBase },
        coins: startingCoins,
        choices: classChanged || speciesChanged ? [] : existing.choices,
      }

      // Choices recorded for the previous class or species are stale, so they
      // are re-queued rather than kept. Anything already resolved is still lost
      // in that case, which is why the editor warns before saving.
      if (classChanged || speciesChanged) {
        character = { ...character, choices: pendingChoices(character, classDef, species) }
      }
    } else {
      const base = createCharacter({
        name: trimmedName,
        playerName: trimmedPlayerName,
        speciesId: state.speciesId,
        classId: state.classId,
        backgroundId: state.backgroundId,
      })

      // Compute starting coins from chosen equipment options
      const startingCoins = computeStartingCoins(
        state.backgroundId,
        state.backgroundStartingEquipmentOptionId,
        state.classId,
        state.classStartingEquipmentOptionId,
      )

      const created: Character = {
        ...base,
        abilityScoreMethod: state.scoreMethod,
        abilityScoreBase: { ...state.abilityScoreBase },
        species: { ...base.species, speciesId: state.speciesId, lineageId: state.lineageId },
        background: { ...base.background, abilityBonuses: { ...state.backgroundBonuses }, toolProficiencies: state.backgroundTool ? [state.backgroundTool] : [], startingEquipmentOptionId: state.backgroundStartingEquipmentOptionId ?? undefined },
        classes: base.classes.map((entry, index) =>
          index === 0
            ? {
                ...entry,
                cantripIds: state.cantripIds,
                spellIdsKnown: state.spellIdsKnown,
                spellIdsPrepared: state.spellIdsPrepared,
                skillPicks: state.skillPicks,
                weaponMasteries: state.weaponMasteries,
                startingEquipmentOptionId: state.classStartingEquipmentOptionId ?? undefined,
              }
            : entry,
        ),
        coins: startingCoins,
      }

      // Resolved against `created`, not `base`: `base` predates the wizard's
      // picks, so queueing against it would owe cantrips and spells the player
      // already chose during creation.
      character = { ...created, choices: pendingChoices(created, classDef, species) }
    }

    const saved = upsertCharacter(character)
    if (!saved.ok) {
      setSaveError(saved.error ?? 'That character could not be saved.')
      setSaving(false)
      return
    }

    setSaving(false)
    navigate(`/character/${character.id}`)
  }, [canCreate, saving, state, classDef, species, navigate, existing])

  const reset = useCallback(() => {
    setState(initialState(existing))
    setSaveError(null)
    setSaving(false)
  }, [existing])

  return {
    state,
    isEdit,
    stepIndex,
    species,
    classDef,
    background,
    standardValues: STANDARD_ARRAY_VALUES,
    pointsSpent: spent,
    pointsRemaining: remaining,
    stepErrors,
    nameErrors,
    speciesErrors,
    backgroundErrors,
    scoreErrors,
    skillErrors,
    weaponMasteryErrors,
    equipmentErrors,
    canAdvance,
    canCreate,
    saving,
    saveError,
    setStep,
    next,
    back,
    setName,
    setPlayerName,
    setSpeciesId,
    setLineageId,
    setClassId,
    setBackgroundId,
    setScoreMethod,
    setAbilityScore,
    setBackgroundMode,
    setBackgroundBonus,
    setCantripIds,
    setSpellIdsKnown,
    setSpellIdsPrepared,
    setBackgroundTool,
    setSkillPicks,
    setWeaponMasteries,
    setBackgroundStartingEquipmentOptionId,
    setClassStartingEquipmentOptionId,
    create,
    reset,
  }
}

/** Exported so the page can label skills without duplicating the list. */
export { SKILL_DEFS, POINT_BUY_BUDGET, abilityModifier, MIN_ALLOCATED_SCORE, MAX_ALLOCATED_SCORE, MAX_FINAL_SCORE }
