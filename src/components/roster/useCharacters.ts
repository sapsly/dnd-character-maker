import { useCharacters as useCharactersCore } from '../../hooks/useCharacters';
import type { Character } from '../../types/character';
import type { StorageResult } from '../../lib/storage';

export interface UseCharacters {
  characters: Character[];
  loading: boolean;
  error: string | null;
  saveCharacter: (character: Character) => StorageResult<Character[]>;
  removeCharacter: (id: string) => StorageResult<Character[]>;
  reload: () => void;
  clearError: () => void;
}

/**
 * Adapter that wraps the new unified useCharacters hook (Firestore + localStorage)
 * to match the roster's expected synchronous interface.
 * The core hook handles async Firestore/localStorage internally and updates state.
 */
export function useCharacters(): UseCharacters {
  const { characters, loading, error, upsert, remove, clearError } = useCharactersCore();

  const reload = () => {
    // The core hook reloads automatically on auth changes
  };

  const saveCharacter = (character: Character): StorageResult<Character[]> => {
    // Fire and forget - core hook updates state internally
    upsert(character);
    return { ok: true, value: characters, error: undefined };
  };

  const removeCharacter = (id: string): StorageResult<Character[]> => {
    remove(id);
    return { ok: true, value: characters.filter((c) => c.id !== id), error: undefined };
  };

  return { characters, loading, error, saveCharacter, removeCharacter, reload, clearError };
}