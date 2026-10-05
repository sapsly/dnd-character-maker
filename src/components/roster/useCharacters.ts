import { useCallback, useEffect, useState } from 'react'
import type { Character } from '../../types/character'
import { deleteCharacter, loadCharacters, upsertCharacter } from '../../lib/storage'
import type { StorageResult } from '../../lib/storage'

export interface UseCharacters {
  /** Current library, sorted by the caller. Always mirrors the last storage result. */
  characters: Character[]
  loading: boolean
  /** Storage or import failure worth showing above the list. */
  error: string | null
  /** Write one character; resolves with the storage result. */
  saveCharacter: (character: Character) => StorageResult<Character[]>
  removeCharacter: (id: string) => StorageResult<Character[]>
  /** Re-read storage, e.g. after a failed load. */
  reload: () => void
  clearError: () => void
}

/**
 * Single owner of character state for the roster.
 *
 * Storage is synchronous and returns the full list with every call, so the rule
 * here is simple and strict: call the storage function, then set state from the
 * `StorageResult.value` it hands back. Local state is never patched first —
 * what you see on screen is always what storage reported, including when a
 * write failed and the value is stale.
 */
export function useCharacters(): UseCharacters {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const read = useCallback(() => {
    const result = loadCharacters()
    setCharacters(result.value)
    setError(result.ok ? null : (result.error ?? 'Saved characters could not be read.'))
    setLoading(false)
  }, [])

  useEffect(() => {
    read()
  }, [read])

  const apply = useCallback((result: StorageResult<Character[]>): StorageResult<Character[]> => {
    setCharacters(result.value)
    setError(result.ok ? null : (result.error ?? 'That change could not be saved.'))
    return result
  }, [])

  const saveCharacter = useCallback(
    (character: Character) => apply(upsertCharacter(character)),
    [apply],
  )

  const removeCharacter = useCallback((id: string) => apply(deleteCharacter(id)), [apply])

  const reload = useCallback(() => {
    setLoading(true)
    read()
  }, [read])

  const clearError = useCallback(() => setError(null), [])

  return { characters, loading, error, saveCharacter, removeCharacter, reload, clearError }
}
