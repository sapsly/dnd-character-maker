import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  collection,
  type DocumentSnapshot,
} from 'firebase/firestore';

import type { Character } from '../types/character';
import { normalizeCharacter } from './storage';

// Firebase config from environment variables (Vite exposes VITE_* vars)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app (singleton)
export const app: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// Export auth and firestore instances
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Collection paths
export const USERS_COLLECTION = 'users';
export const CHARACTERS_SUBCOLLECTION = 'characters';

/**
 * Get the Firestore collection reference for the current user's characters.
 */
export function getUserCharactersRef(userId: string) {
  return collection(db, USERS_COLLECTION, userId, CHARACTERS_SUBCOLLECTION);
}

/**
 * Get a specific character document reference.
 */
export function getCharacterRef(userId: string, characterId: string) {
  return doc(db, USERS_COLLECTION, userId, CHARACTERS_SUBCOLLECTION, characterId);
}

// ---------- Firestore Character CRUD ----------

export interface FirestoreResult<T> {
  ok: boolean;
  value: T;
  error?: string;
}

function toCharacter(docSnap: DocumentSnapshot): Character | null {
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return normalizeCharacter({
    ...data,
    id: docSnap.id,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt ?? new Date().toISOString(),
  } as Character);
}

/** Load all characters for the current user. */
export async function loadCharactersFirestore(userId: string): Promise<FirestoreResult<Character[]>> {
  try {
    const charsRef = getUserCharactersRef(userId);
    const q = query(charsRef, orderBy('updatedAt', 'desc'));
    const snap = await getDocs(q);
    const characters = snap.docs.map(toCharacter).filter((c): c is Character => c !== null);
    return { ok: true, value: characters };
  } catch (error) {
    return {
      ok: false,
      value: [],
      error: `Could not load characters: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

/** Get a single character by ID. */
export async function getCharacterFirestore(userId: string, characterId: string): Promise<FirestoreResult<Character | null>> {
  try {
    const ref = getCharacterRef(userId, characterId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { ok: true, value: null };
    return { ok: true, value: toCharacter(snap) };
  } catch (error) {
    return {
      ok: false,
      value: null,
      error: `Could not load character: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

/** Create or update a character. */
export async function upsertCharacterFirestore(
  userId: string,
  character: Character
): Promise<FirestoreResult<Character>> {
  try {
    const ref = getCharacterRef(userId, character.id);
    const payload = {
      ...character,
      updatedAt: serverTimestamp(),
      ...(character.createdAt ? {} : { createdAt: serverTimestamp() }),
    };
    await setDoc(ref, payload, { merge: true });
    return { ok: true, value: character };
  } catch (error) {
    return {
      ok: false,
      value: character,
      error: `Could not save character: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

/** Delete a character. */
export async function deleteCharacterFirestore(
  userId: string,
  characterId: string
): Promise<FirestoreResult<void>> {
  try {
    const ref = getCharacterRef(userId, characterId);
    await deleteDoc(ref);
    return { ok: true, value: undefined };
  } catch (error) {
    return {
      ok: false,
      value: undefined,
      error: `Could not delete character: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

/** Migrate localStorage characters to Firestore on first login. */
export async function migrateLocalCharactersToFirestore(
  userId: string,
  localCharacters: Character[]
): Promise<FirestoreResult<number>> {
  if (localCharacters.length === 0) return { ok: true, value: 0 };

  try {
    const batch = writeBatch(db);
    let count = 0;
    for (const char of localCharacters) {
      const ref = getCharacterRef(userId, char.id);
      const payload = {
        ...char,
        updatedAt: serverTimestamp(),
        createdAt: char.createdAt ? serverTimestamp() : serverTimestamp(),
      };
      batch.set(ref, payload, { merge: true });
      count++;
    }
    await batch.commit();
    return { ok: true, value: count };
  } catch (error) {
    return {
      ok: false,
      value: 0,
      error: `Migration failed: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}