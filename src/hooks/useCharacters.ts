import { useAuth } from '../context/AuthContext';
import {
  loadCharacters as loadLocal,
  upsertCharacter as upsertLocal,
  deleteCharacter as deleteLocal,
  type StorageResult,
} from '../lib/storage';
import {
  loadCharactersFirestore,
  upsertCharacterFirestore,
  deleteCharacterFirestore,
  getCharacterFirestore,
  migrateLocalCharactersToFirestore,
  type FirestoreResult,
} from '../lib/firebase';
import {
  removeCharacterFromUserCampaigns,
  listMyCampaigns,
  syncCharacterToCampaign,
} from '../lib/campaigns';
import { useCallback, useEffect, useState } from 'react';
import type { Character } from '../types/character';

export function useCharacters() {
  const { user, loading: authLoading } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [migrated, setMigrated] = useState(false);

  // Load characters when auth state changes
  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      if (user) {
        // Signed in: load from Firestore
        const result = await loadCharactersFirestore(user.uid);
        if (result.ok) {
          setCharacters(result.value);
          // Migrate any localStorage characters on first login
          if (!migrated) {
            const { value: localChars } = loadLocal();
            if (localChars.length > 0) {
              await migrateLocalCharactersToFirestore(user.uid, localChars);
              // Reload after migration
              const fresh = await loadCharactersFirestore(user.uid);
              if (fresh.ok) setCharacters(fresh.value);
            }
            setMigrated(true);
          }
        } else {
          setError(result.error ?? 'Failed to load characters');
          setCharacters([]);
        }
      } else {
        // Not signed in: load from localStorage
        const result = loadLocal();
        if (result.ok) {
          setCharacters(result.value);
        } else {
          setError(result.error ?? 'Failed to load characters');
          setCharacters([]);
        }
      }
      setLoading(false);
    };

    load();
  }, [user, authLoading, migrated]);

  const upsert = useCallback(
    async (character: Character): Promise<StorageResult<Character[]> | FirestoreResult<Character>> => {
      setError(null);
      if (user) {
        const result = await upsertCharacterFirestore(user.uid, character);
        if (result.ok) {
          setCharacters((prev) => {
            const idx = prev.findIndex((c) => c.id === character.id);
            return idx >= 0
              ? prev.map((c) => (c.id === character.id ? character : c))
              : [...prev, character];
          });

          // Auto-sync to all campaigns the user belongs to (except localStorage path)
          try {
            const campaignsResult = await listMyCampaigns(user.uid);
            if (campaignsResult.ok && campaignsResult.value.length > 0) {
              for (const campaign of campaignsResult.value) {
                // Fire-and-forget sync; errors are logged but don't block the save
                syncCharacterToCampaign(user.uid, campaign.id, character.id, character).catch((err) => {
                  console.warn(`Auto-sync to campaign ${campaign.id} failed:`, err);
                });
              }
            }
          } catch (syncErr) {
            console.warn('Failed to list campaigns for auto-sync:', syncErr);
          }
        } else {
          setError(result.error ?? 'Failed to save character');
        }
        return result;
      } else {
        const result = upsertLocal(character);
        if (result.ok) setCharacters(result.value);
        else setError(result.error ?? 'Failed to save character');
        return result;
      }
    },
    [user]
  );

  const remove = useCallback(
    async (id: string): Promise<StorageResult<Character[]> | FirestoreResult<void>> => {
      setError(null);
      if (user) {
        const result = await deleteCharacterFirestore(user.uid, id);
        if (result.ok) {
          // Also remove from localStorage to prevent resurrection on next login.
          // Best-effort: these must never reject, or the character would reappear.
          try {
            deleteLocal(id);
          } catch {
            // ignore
          }
          try {
            await removeCharacterFromUserCampaigns(user.uid, id);
          } catch {
            // ignore
          }
          setCharacters((prev) => prev.filter((c) => c.id !== id));
        } else {
          setError(result.error ?? 'Failed to delete character');
        }
        return result;
      } else {
        const result = deleteLocal(id);
        if (result.ok) setCharacters(result.value);
        else setError(result.error ?? 'Failed to delete character');
        return result;
      }
    },
    [user]
  );

  const getOne = useCallback(
    async (id: string): Promise<FirestoreResult<Character | null> | StorageResult<Character | null>> => {
      if (user) {
        return getCharacterFirestore(user.uid, id);
      } else {
        const { value, error } = loadLocal();
        const found = value.find((c) => c.id === id) ?? null;
        return { ok: true, value: found, error };
      }
    },
    [user]
  );

  return { characters, loading: loading || authLoading, error, upsert, remove, getOne, clearError: () => setError(null) };
}