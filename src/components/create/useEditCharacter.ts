import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type {
  AbilityBonusMap,
  AbilityKey,
  AbilityScores,
  BackgroundDef,
  Character,
  ClassDef,
  SpeciesDef,
  SpeciesLineageId,
} from '../../types/character'
import { SPECIES } from '../../data/species'
import { BACKGROUNDS } from '../../data/backgrounds'
import { CLASSES } from '../../data/classes'
import { lineagesForSpecies } from '../../data/lineages'
import {
  MAX_ALLOCATED_SCORE,
  MAX_FINAL_SCORE,
  MIN_ALLOCATED_SCORE,
  POINT_BUY_BUDGET,
  STANDARD_ARRAY_VALUES,
  pointsRemaining,
  pointsSpent,
} from '../../lib/characterFactory'
import { loadCharacters, upsertCharacter } from '../../lib/storage'
import { abilityModifier } from '../../lib/rules/ability'
import { asiIncreases } from '../../lib/rules/asi'

export type WizardStep = 'identity' | 'class' | 'background' | 'abilities' | 'review'

export const WIZARD_STEPS: { id: WizardStep; label: string }[] = [
  { id: 'identity', label: 'Name & species' },
  { id: 'class', label: 'Class' },
  { id: 'background', label: 'Background' },
  { id: 'abilities', label: 'Abilities' },
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
}

export interface EditCharacterModel {
  state: WizardState
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
  canAdvance: boolean
  canSave: boolean
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
  save: () => void
  character: Character | null
  notFound: boolean
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

function stateFromCharacter(character: Character): WizardState {
  return {
    step: 'identity',
    name: character.meta.name,
    playerName: character.meta.playerName,
    speciesId: character.species.speciesId,
    lineageId: character.species.lineageId,
    classId: character.classes[0]?.classId ?? 'fighter',
    backgroundId: character.background.backgroundId,
    scoreMethod: character.abilityScoreMethod,
    abilityScoreBase: { ...character.abilityScoreBase },
    backgroundMode: 'plus2plus1',
    backgroundBonuses: { ...character.background.abilityBonuses },
  }
}

export function useEditCharacter(): EditCharacterModel {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [character, setCharacter] = useState<Character | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [state, setState] = useState<WizardState>(() => {
    if (!id) return {
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
    }
    const { value } = loadCharacters()
    const found = value.find((c) => c.id === id)
    if (!found) {
      setNotFound(true)
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
      }
    }
    setCharacter(found)
    return stateFromCharacter(found)
  })

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
    if (!species) return ['That species is not in the SRD set.']
    return []
  }, [species])

  const backgroundErrors = useMemo(() => {
    if (!background) return ['That background is not in the SRD set.']

    // Include existing ASI increases from the choice log
    // so the 20-cap validation accounts for all bonuses.
    const existingAsiBonuses = character ? asiIncreases(character.choices) : {};

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
        state.abilityScoreBase[ability] +
        (state.backgroundBonuses[ability] ?? 0) +
        (existingAsiBonuses[ability] ?? 0)
      if (final > MAX_FINAL_SCORE) {
        errors.push(
          `${ABILITY_LABELS[ability]} would reach ${final}, above the maximum of ${MAX_FINAL_SCORE}.`,
        )
      }
    }

    return errors
  }, [background, state.backgroundBonuses, state.abilityScoreBase, character])

  const scoreErrors = useMemo(() => {
    const errors: string[] = []
    const scores = state.abilityScoreBase

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
        return classDef ? [] : ['That class is not in the SRD set.']
      case 'background':
        return backgroundErrors
      case 'abilities':
        return scoreErrors
      case 'review':
        return [...nameErrors, ...speciesErrors, ...backgroundErrors, ...scoreErrors]
      default:
        return []
    }
  }, [state.step, nameErrors, speciesErrors, backgroundErrors, scoreErrors, classDef])

  const canAdvance = stepErrors.length === 0
  const canSave = canAdvance && nameErrors.length === 0 && backgroundErrors.length === 0 && scoreErrors.length === 0

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
  const setClassId = useCallback((value: string) => setState((s) => ({ ...s, classId: value })), [])

  const setBackgroundId = useCallback(
    (value: string) => {
      setState((s) => {
        const nextBackground = BACKGROUNDS.find((b) => b.id === value)
        const allowed = new Set<AbilityKey>(nextBackground?.abilityBonusChoices ?? [])
        const backgroundBonuses: AbilityBonusMap = {}
        for (const [key, bonus] of Object.entries(s.backgroundBonuses)) {
          if (allowed.has(key as AbilityKey)) backgroundBonuses[key as AbilityKey] = bonus
        }
        return { ...s, backgroundId: value, backgroundBonuses }
      })
    },
    [],
  )

  const setScoreMethod = useCallback((value: ScoreMethod) => {
    setState((s) => ({
      ...s,
      scoreMethod: value,
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

  const save = useCallback(() => {
    if (!canSave || saving || !character) return
    setSaving(true)
    setSaveError(null)

    const now = new Date().toISOString()
    const updatedCharacter: Character = {
      ...character,
      updatedAt: now,
      meta: {
        ...character.meta,
        name: state.name.trim(),
        playerName: state.playerName.trim(),
      },
      species: {
        ...character.species,
        speciesId: state.speciesId,
        lineageId: state.lineageId,
      },
      background: {
        ...character.background,
        backgroundId: state.backgroundId,
        abilityBonuses: { ...state.backgroundBonuses },
      },
      abilityScoreMethod: state.scoreMethod,
      abilityScoreBase: { ...state.abilityScoreBase },
      // Preserve existing: id, createdAt, level, xp, classes, choices, combat, hitDice, deathSaves, spellSlotsUsed, featureUses, inventory, notes, schemaVersion
    }

    const saved = upsertCharacter(updatedCharacter)
    if (!saved.ok) {
      setSaveError(saved.error ?? 'That character could not be saved.')
      setSaving(false)
      return
    }

    setSaving(false)
    navigate(`/character/${character.id}`)
  }, [canSave, saving, character, state, navigate])

  return {
    state,
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
    canAdvance,
    canSave,
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
    save,
    character,
    notFound,
  }
}

export { MIN_ALLOCATED_SCORE, MAX_ALLOCATED_SCORE, MAX_FINAL_SCORE, POINT_BUY_BUDGET, abilityModifier }