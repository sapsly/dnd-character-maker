import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { AbilityKey, Character, CharacterCombat, CoinPurse, InventoryItem } from '../../types/character'
import type { DerivedCharacter } from '../../lib/derived'
import { deriveCharacter } from '../../lib/derived'
import { isAccent } from '../../lib/theme'
import type { Accent } from '../../lib/theme'
import { downloadCharacter } from '../../lib/storage'
import { normalizeCoinPurse } from '../../lib/coins'
import { useCharacters } from '../../hooks/useCharacters'

export type SheetStatus = 'loading' | 'ready' | 'not-found' | 'error'

export interface CharacterSheetModel {
  status: SheetStatus
  character: Character | null
  derived: DerivedCharacter | null
  error: string | null
  reload: () => void
  exportCharacter: () => void
  setCurrentHp: (value: number) => void
  adjustCurrentHp: (delta: number) => void
  setTemporaryHp: (value: number) => void
  setHpBonusFlat: (value: number) => void
  setHpOverride: (value: number | undefined) => void
  healToFull: () => void
  updateCombat: (patch: Partial<CharacterCombat>) => void
  setCoins: (coins: CoinPurse) => void
  setInventory: (inventory: InventoryItem[]) => void
  setAccent: (accent: Accent | null) => void
  removeSubclassSpell: (classEntryId: string, featureId: string, spellId: string) => void
}

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
}

export const ABILITY_ORDER: readonly AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : String(value)
}

export function governingEntry(
  record: Record<AbilityKey, number> | null,
): { ability: AbilityKey; label: string; value: number } | null {
  if (!record) return null
  const nonZero = ABILITY_ORDER.filter((key) => record[key] !== 0)
  const first = nonZero[0]
  if (first) return { ability: first, label: ABILITY_LABELS[first], value: record[first] }
  return null
}

export function useCharacterSheet(): CharacterSheetModel {
  const { id } = useParams<{ id: string }>()
  const { error, upsert, getOne, clearError } = useCharacters()
  const [status, setStatus] = useState<SheetStatus>('loading')
  const [character, setCharacter] = useState<Character | null>(null)
  const [derived, setDerived] = useState<DerivedCharacter | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!id) {
      setStatus('not-found')
      setCharacter(null)
      setDerived(null)
      return
    }

    let cancelled = false

    const load = async () => {
      setStatus('loading')
      setLocalError(null)

      try {
        const result = await getOne(id)
        if (cancelled) return

        if (!result.ok && !result.value) {
          setLocalError(result.error ?? 'Character could not be loaded.')
          setStatus('error')
          setCharacter(null)
          setDerived(null)
          return
        }

        if (!result.value) {
          setLocalError(result.ok ? null : (result.error ?? null))
          setStatus('not-found')
          setCharacter(null)
          setDerived(null)
          return
        }

        setCharacter(result.value)
        setDerived(deriveCharacter(result.value))
        setLocalError(result.ok ? null : (result.error ?? null))
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        setLocalError(err instanceof Error ? err.message : 'Unknown error loading character')
        setStatus('error')
        setCharacter(null)
        setDerived(null)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id, attempt, getOne])

  const exportCharacter = useCallback(() => {
    if (character) downloadCharacter(character)
  }, [character])

  const latest = useRef<{ character: Character | null; derived: DerivedCharacter | null }>({
    character: null,
    derived: null,
  })
  latest.current = { character, derived }

  const commitCharacter = useCallback(
    async (patch: Partial<Character>) => {
      const current = latest.current.character
      if (!current) return
      const next: Character = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      }
      const result = await upsert(next)
      if (!result.ok) {
        setLocalError(result.error ?? 'Changes could not be saved.')
        return
      }
      setLocalError(null)
      latest.current = { character: next, derived: deriveCharacter(next) }
      setCharacter(next)
      setDerived(latest.current.derived)
    },
    [upsert]
  )

  const commit = useCallback(
    async (patch: Partial<CharacterCombat>) => {
      const current = latest.current.character
      if (!current) return
      await commitCharacter({ combat: { ...current.combat, ...patch } })
    },
    [commitCharacter]
  )

  const setCurrentHp = useCallback(
    (value: number) => {
      const max = latest.current.derived?.hitPoints.max ?? 0
      const safe = Number.isFinite(value) ? Math.round(value) : 0
      commit({ hitPointsCurrent: Math.min(Math.max(safe, 0), Math.max(max, 0)) })
    },
    [commit]
  )

  const adjustCurrentHp = useCallback(
    (delta: number) => {
      const state = latest.current
      if (!state?.character) return
      setCurrentHp(state.character.combat.hitPointsCurrent + delta)
    },
    [commit, setCurrentHp]
  )

  const setTemporaryHp = useCallback(
    (value: number) => {
      const safe = Number.isFinite(value) ? Math.round(value) : 0
      commit({ temporaryHitPoints: Math.max(safe, 0) })
    },
    [commit]
  )

  const setHpBonusFlat = useCallback(
    (value: number) => {
      commit({ hpBonusFlat: Number.isFinite(value) ? Math.round(value) : 0 })
    },
    [commit]
  )

  const setHpOverride = useCallback(
    (value: number | undefined) => {
      const state = latest.current
      if (!state?.character) return
      // Replace the whole combat object so clearing the override actually removes
      // the key (a merged patch cannot delete an existing optional property).
      const combat: CharacterCombat = { ...state.character.combat }
      if (value === undefined || !Number.isFinite(value) || value <= 0) {
        delete combat.hpOverride
      } else {
        combat.hpOverride = Math.round(value)
      }
      const base = Math.max(combat.hpOverride ?? state.derived?.hitPoints.computed ?? 0, 0)
      combat.hitPointsCurrent = Math.min(state.character.combat.hitPointsCurrent, base)
      commitCharacter({ combat })
    },
    [commitCharacter]
  )

  const healToFull = useCallback(() => {
    const max = latest.current.derived?.hitPoints.max ?? 0
    commit({ hitPointsCurrent: Math.max(max, 0) })
  }, [commit])

  const setCoins = useCallback(
    (coins: CoinPurse) => {
      const toCount = (value: number) =>
        Number.isFinite(value) && value > 0 ? Math.round(value) : 0
      commitCharacter({
        coins: normalizeCoinPurse({
          cp: toCount(coins.cp),
          sp: toCount(coins.sp),
          gp: toCount(coins.gp),
        }),
      })
    },
    [commitCharacter]
  )

  const setInventory = useCallback(
    (inventory: InventoryItem[]) => commitCharacter({ inventory }),
    [commitCharacter]
  )

  const setAccent = useCallback(
    (accent: Accent | null) => commitCharacter({ accent: isAccent(accent) ? accent : null }),
    [commitCharacter]
  )

  const removeSubclassSpell = useCallback(
    (classEntryId: string, featureId: string, spellId: string) => {
      const current = latest.current.character
      if (!current) return
      let changed = false
      const classes = current.classes.map((entry) => {
        if (entry.id !== classEntryId) return entry
        const remaining = (entry.featurePicks[featureId] ?? []).filter((id) => id !== spellId)
        if (remaining.length === (entry.featurePicks[featureId] ?? []).length) return entry
        changed = true
        const featurePicks = { ...entry.featurePicks }
        if (remaining.length > 0) {
          featurePicks[featureId] = remaining
        } else {
          delete featurePicks[featureId]
        }
        return { ...entry, featurePicks }
      })
      if (!changed) return
      commitCharacter({ classes })
    },
    [commitCharacter]
  )

  return {
    status,
    character,
    derived,
    error: localError ?? error,
    reload: () => { setAttempt((n) => n + 1); clearError(); },
    exportCharacter,
    setCurrentHp,
    adjustCurrentHp,
    setTemporaryHp,
    setHpBonusFlat,
    setHpOverride,
    healToFull,
    updateCombat: commit,
    setCoins,
    setInventory,
    setAccent,
    removeSubclassSpell,
  }
}