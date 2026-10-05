import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { AbilityKey, Character, CharacterCombat, CoinPurse, InventoryItem } from '../../types/character'
import type { DerivedCharacter } from '../../lib/derived'
import { deriveCharacter } from '../../lib/derived'
import { isAccent } from '../../lib/theme'
import type { Accent } from '../../lib/theme'
import { downloadCharacter, loadCharacters, upsertCharacter } from '../../lib/storage'
import { normalizeCoinPurse } from '../../lib/coins'

export type SheetStatus = 'loading' | 'ready' | 'not-found' | 'error'

export interface CharacterSheetModel {
  status: SheetStatus
  character: Character | null
  derived: DerivedCharacter | null
  error: string | null
  reload: () => void
  exportCharacter: () => void
  /** Absolute set of current hit points, clamped to 0..max. */
  setCurrentHp: (value: number) => void
  /** Signed adjustment, clamped to 0..max. Negative values are damage. */
  adjustCurrentHp: (delta: number) => void
  setTemporaryHp: (value: number) => void
  /** Flat HP bonus from external sources (Tough, boons, items). May be negative. */
  setHpBonusFlat: (value: number) => void
  /** Overrides the computed maximum. Pass undefined to go back to the computed value. */
  setHpOverride: (value: number | undefined) => void
  /** Restores current HP to the maximum without touching temporary HP. */
  healToFull: () => void
  /** Persists an arbitrary combat change. */
  updateCombat: (patch: Partial<CharacterCombat>) => void
  /** Persists a coin purse change, normalized so cp/sp stay under 10. */
  setCoins: (coins: CoinPurse) => void
  /** Persists the tracked inventory. */
  setInventory: (inventory: InventoryItem[]) => void
  /**
   * Persists this character's accent override. Pass `null` to clear it and go
   * back to following the app-wide accent.
   */
  setAccent: (accent: Accent | null) => void
  /**
   * Drop one spell from a subclass spell pool (e.g. a Magical Discoveries pick).
   *
   * The rules let a character replace one of those spells each time they gain a
   * level; the level-up adds a new spell and this removes the old one, which is
   * the same net result without modelling a separate swap record.
   */
  removeSubclassSpell: (classEntryId: string, featureId: string, spellId: string) => void
}


/** Long-form ability names, keyed by the short form stored on the character. */
export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
}

export const ABILITY_ORDER: readonly AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

/** Signed modifier with an explicit plus, matching how sheets are written by hand. */
export function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : String(value)
}

/**
 * Finds the single non-zero entry in a spellcasting record. `deriveCharacter`
 * zeroes every ability except the governing one, so exactly one key carries a
 * value. A record where every key is zero means the governing ability happens
 * to net to 0, which we report as such rather than guessing.
 */
export function governingEntry(
  record: Record<AbilityKey, number> | null,
): { ability: AbilityKey; label: string; value: number } | null {
  if (!record) return null
  const nonZero = ABILITY_ORDER.filter((key) => record[key] !== 0)
  const first = nonZero[0]
  if (first) return { ability: first, label: ABILITY_LABELS[first], value: record[first] }
  // All zero: fall back to the casting ability we can still identify.
  return null
}

export function useCharacterSheet(): CharacterSheetModel {
  const { id } = useParams<{ id: string }>()
  const [status, setStatus] = useState<SheetStatus>('loading')
  const [character, setCharacter] = useState<Character | null>(null)
  const [derived, setDerived] = useState<DerivedCharacter | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    if (!id) {
      setStatus('not-found')
      setCharacter(null)
      setDerived(null)
      return
    }

    let cancelled = false
    setStatus('loading')

    const result = loadCharacters()
    if (cancelled) return

    if (!result.ok && result.value.length === 0) {
      setError(result.error ?? 'Saved characters could not be read.')
      setStatus('error')
      setCharacter(null)
      setDerived(null)
      return
    }

    const found = result.value.find((c) => c.id === id)
    if (!found) {
      // A partial read can still legitimately report "not found".
      setError(result.ok ? null : (result.error ?? null))
      setStatus('not-found')
      setCharacter(null)
      setDerived(null)
      return
    }

    setCharacter(found)
    setDerived(deriveCharacter(found))
    setError(result.ok ? null : (result.error ?? null))
    setStatus('ready')

    return () => {
      cancelled = true
    }
  }, [id, attempt])

  const exportCharacter = useCallback(() => {
    if (character) downloadCharacter(character)
  }, [character])

  // Combat edits write straight through to storage, so the callbacks below
  // need the freshest character and derived values without re-reading storage
  // on every keystroke. Refs keep them stable across renders.
  const latest = useRef<{ character: Character | null; derived: DerivedCharacter | null }>({
    character: null,
    derived: null,
  })
  latest.current = { character, derived }

  /**
   * Writes a whole-character patch through the shared save path. Combat,
   * coin and inventory edits all land here so every change is persisted with
   * one `upsertCharacter` call and one re-derive.
   */
  const commitCharacter = useCallback((patch: Partial<Character>) => {
    const current = latest.current.character
    if (!current) return
    const next: Character = {
      ...current,
      ...patch,
    }
    const result = upsertCharacter(next)
    if (!result.ok) {
      setError(result.error ?? 'Changes could not be saved.')
      return
    }
    setError(null)
    latest.current = { character: next, derived: deriveCharacter(next) }
    setCharacter(next)
    setDerived(latest.current.derived)
  }, [])

  const commit = useCallback(
    (patch: Partial<CharacterCombat>) => {
      const current = latest.current.character
      if (!current) return
      commitCharacter({ combat: { ...current.combat, ...patch } })
    },
    [commitCharacter],
  )

  const setCurrentHp = useCallback(
    (value: number) => {
      const max = latest.current.derived?.hitPoints.max ?? 0
      const safe = Number.isFinite(value) ? Math.round(value) : 0
      commit({ hitPointsCurrent: Math.min(Math.max(safe, 0), Math.max(max, 0)) })
    },
    [commit],
  )

  const adjustCurrentHp = useCallback(
    (delta: number) => {
      const state = latest.current
      if (!state?.character) return
      setCurrentHp(state.character.combat.hitPointsCurrent + delta)
    },
    [commit, setCurrentHp],
  )

  const setTemporaryHp = useCallback(
    (value: number) => {
      const safe = Number.isFinite(value) ? Math.round(value) : 0
      commit({ temporaryHitPoints: Math.max(safe, 0) })
    },
    [commit],
  )

  const setHpBonusFlat = useCallback(
    (value: number) => {
      commit({ hpBonusFlat: Number.isFinite(value) ? Math.round(value) : 0 })
    },
    [commit],
  )

  /**
   * Changing the ceiling can strand current HP above the new maximum, so the
   * two are written together and the current value is re-clamped.
   */
  const setHpOverride = useCallback(
    (value: number | undefined) => {
      const state = latest.current
      if (!state?.character) return
      const patch: Partial<CharacterCombat> = {}
      if (value === undefined) {
        delete patch.hpOverride
      } else if (Number.isFinite(value) && value > 0) {
        patch.hpOverride = Math.round(value)
      }
      const base = Math.max(patch.hpOverride ?? state.derived?.hitPoints.computed ?? 0, 0)
      const current = state.character.combat.hitPointsCurrent
      patch.hitPointsCurrent = Math.min(current, base)
      commit(patch)
    },
    [commit],
  )

  const healToFull = useCallback(() => {
    const max = latest.current.derived?.hitPoints.max ?? 0
    commit({ hitPointsCurrent: Math.max(max, 0) })
  }, [commit])

  /**
   * Coin counts are clamped to non-negative integers and normalized on the
   * way in, so cp and sp can never sit at 10 or above in stored data.
   */
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
    [commitCharacter],
  )

  const setInventory = useCallback(
    (inventory: InventoryItem[]) => commitCharacter({ inventory }),
    [commitCharacter],
  )

  /**
   * Stores the accent override verbatim, with `null` as the explicit "follow the
   * app accent" value. An unknown id is coerced to `null` rather than saved:
   * the picker can only offer ids that have a block in `styles/tint.css`, but a
   * hand-edited save could carry anything, and a bad `data-character-accent`
   * would silently tint nothing.
   */
  const setAccent = useCallback(
    (accent: Accent | null) => commitCharacter({ accent: isAccent(accent) ? accent : null }),
    [commitCharacter],
  )

  /**
   * Removes one spell from a class entry's subclass spell pool.
   *
   * Works on the stored `featurePicks` array rather than a dedicated record so
   * there is a single source of truth for what the pool currently holds. An
   * emptied pool is deleted from the map entirely so a later level-up sees it as
   * unfilled and offers the full count again.
   */
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
    [commitCharacter],
  )

  return {
    status,
    character,
    derived,
    error,
    reload,
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
