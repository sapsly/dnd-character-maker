import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  deleteField,
  type DocumentSnapshot,
} from 'firebase/firestore';

import { db, type FirestoreResult } from './firebase';
import type { Character } from '../types/character';
import { normalizeCharacter } from './storage';

export interface Campaign {
  id: string;
  name: string;
  joinCode: string;
  dmUserId: string;
  createdAt: string;
  members: Record<string, true>;
}

export interface CampaignCharacter extends Character {
  originalCharId: string;
  userId: string;
  campaignId: string;
}

const CAMPAIGNS_COLLECTION = 'campaigns';
const CHARACTERS_SUBCOLLECTION = 'characters';
const JOINED_CAMPAIGNS_SUBCOLLECTION = 'joinedCampaigns';

const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ234567';
const JOIN_CODE_LENGTH = 6;
const JOIN_CODE_FALLBACK_LENGTH = 8;
const MAX_JOIN_CODE_ATTEMPTS = 10;

function generateJoinCode(length = JOIN_CODE_LENGTH): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += JOIN_CODE_ALPHABET[Math.floor(Math.random() * JOIN_CODE_ALPHABET.length)];
  }
  return code;
}

async function isJoinCodeTaken(joinCode: string): Promise<boolean> {
  if (!db) return true;
  const snap = await getDoc(doc(db, 'joinCodes', joinCode));
  return snap.exists();
}

async function generateUniqueJoinCode(): Promise<string> {
  for (let attempt = 0; attempt < MAX_JOIN_CODE_ATTEMPTS; attempt++) {
    const code = generateJoinCode();
    if (!(await isJoinCodeTaken(code))) return code;
  }
  const code = generateJoinCode(JOIN_CODE_FALLBACK_LENGTH);
  if (await isJoinCodeTaken(code)) {
    return generateJoinCode(JOIN_CODE_FALLBACK_LENGTH + 2);
  }
  return code;
}

function campaignDocToCampaign(snap: DocumentSnapshot): Campaign | null {
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name,
    joinCode: data.joinCode,
    dmUserId: data.dmUserId,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? new Date().toISOString(),
    members: data.members ?? {},
  };
}

function campaignCharacterDocToCampaignCharacter(
  snap: DocumentSnapshot,
  campaignId: string
): CampaignCharacter | null {
  if (!snap.exists()) return null;
  const data = snap.data();
  const character = normalizeCharacter({
    ...data,
    id: data.originalCharId ?? snap.id,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt ?? new Date().toISOString(),
  } as Character);
  if (!character) return null;
  return {
    ...character,
    originalCharId: data.originalCharId ?? '',
    userId: data.userId ?? snap.id,
    campaignId,
  };
}

export async function createCampaign(
  userId: string,
  name: string,
  joinCode?: string
): Promise<FirestoreResult<Campaign>> {
  if (!db) {
    return { ok: false, value: null as any, error: 'Firebase backend is not configured' };
  }

  try {
    const code = joinCode ?? (await generateUniqueJoinCode());
    const campaignRef = doc(collection(db, CAMPAIGNS_COLLECTION));
    const now = serverTimestamp();
    const payload = {
      joinCode: code,
      dmUserId: userId,
      name,
      createdAt: now,
      members: { [userId]: true },
    };
    await setDoc(campaignRef, payload);

    await setDoc(doc(db, 'joinCodes', code), {
      campaignId: campaignRef.id,
      dmUserId: userId,
      createdAt: now,
    });

    const joinedRef = doc(db, 'users', userId, JOINED_CAMPAIGNS_SUBCOLLECTION, campaignRef.id);
    await setDoc(joinedRef, {
      role: 'dm',
      campaignId: campaignRef.id,
      joinedAt: serverTimestamp(),
    });

    const campaign: Campaign = {
      id: campaignRef.id,
      joinCode: code,
      dmUserId: userId,
      name,
      createdAt: new Date().toISOString(),
      members: { [userId]: true },
    };
    return { ok: true, value: campaign };
  } catch (error) {
    return {
      ok: false,
      value: null as any,
      error: `Could not create campaign: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export async function joinCampaign(
  userId: string,
  joinCode: string
): Promise<FirestoreResult<Campaign>> {
  if (!db) {
    return { ok: false, value: null as any, error: 'Firebase backend is not configured' };
  }

  try {
    const codeSnap = await getDoc(doc(db, 'joinCodes', joinCode));
    if (!codeSnap.exists()) {
      return { ok: false, value: null as any, error: 'Campaign not found with that join code.' };
    }
    const campaignId = codeSnap.data().campaignId;

    const existing = await getCampaign(userId, campaignId);
    if (existing.ok && existing.value && existing.value.members[userId]) {
      return { ok: false, value: null as any, error: 'You are already in this campaign.' };
    }

    await updateDoc(doc(db, CAMPAIGNS_COLLECTION, campaignId), { ['members.' + userId]: true });

    const joinedRef = doc(db, 'users', userId, JOINED_CAMPAIGNS_SUBCOLLECTION, campaignId);
    await setDoc(joinedRef, {
      role: 'member',
      campaignId,
      joinedAt: serverTimestamp(),
    });

    const result = await getCampaign(userId, campaignId);
    return result.ok && result.value
      ? { ok: true, value: result.value }
      : {
          ok: true,
          value: {
            id: campaignId,
            name: '',
            joinCode,
            dmUserId: '',
            createdAt: new Date().toISOString(),
            members: { [userId]: true },
          },
        };
  } catch (error) {
    return {
      ok: false,
      value: null as any,
      error: `Could not join campaign: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export async function getCampaign(
  _userId: string,
  campaignId: string
): Promise<FirestoreResult<Campaign | null>> {
  if (!db) {
    return { ok: false, value: null, error: 'Firebase backend is not configured' };
  }

  try {
    const ref = doc(db, CAMPAIGNS_COLLECTION, campaignId);
    const snap = await getDoc(ref);
    const campaign = campaignDocToCampaign(snap);
    return { ok: true, value: campaign };
  } catch (error) {
    return {
      ok: false,
      value: null,
      error: `Could not load campaign: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export async function listMyCampaigns(
  userId: string
): Promise<FirestoreResult<Campaign[]>> {
  if (!db) {
    return { ok: false, value: [], error: 'Firebase backend is not configured' };
  }

  try {
    const joinedRef = collection(db, 'users', userId, JOINED_CAMPAIGNS_SUBCOLLECTION);
    const joinedSnap = await getDocs(joinedRef);
    const campaigns: Campaign[] = [];

    for (const joinedDoc of joinedSnap.docs) {
      const data = joinedDoc.data();
      const campaignId = data.campaignId ?? joinedDoc.id;
      const result = await getCampaign(userId, campaignId);
      if (result.ok && result.value) {
        campaigns.push(result.value);
      }
    }

    return { ok: true, value: campaigns };
  } catch (error) {
    return {
      ok: false,
      value: [],
      error: `Could not list campaigns: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export async function syncCharacterToCampaign(
  userId: string,
  campaignId: string,
  originalCharacterId: string,
  character: Character
): Promise<FirestoreResult<boolean>> {
  if (!db) {
    return { ok: false, value: false, error: 'Firebase backend is not configured' };
  }

  try {
    const normalized = normalizeCharacter(character);
    const ref = doc(db, CAMPAIGNS_COLLECTION, campaignId, CHARACTERS_SUBCOLLECTION, userId);
    const payload = {
      ...normalized,
      originalCharId: originalCharacterId,
      userId,
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, payload, { merge: true });
    return { ok: true, value: true };
  } catch (error) {
    return {
      ok: false,
      value: false,
      error: `Could not sync character to campaign: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export async function removeCharacterFromCampaign(
  userId: string,
  campaignId: string
): Promise<FirestoreResult<void>> {
  if (!db) {
    return { ok: false, value: undefined, error: 'Firebase backend is not configured' };
  }

  try {
    const ref = doc(db, CAMPAIGNS_COLLECTION, campaignId, CHARACTERS_SUBCOLLECTION, userId);
    await deleteDoc(ref);
    return { ok: true, value: undefined };
  } catch (error) {
    return {
      ok: false,
      value: undefined,
      error: `Could not remove character from campaign: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export async function getCampaignCharacters(
  campaignId: string,
  _viewerId: string
): Promise<FirestoreResult<CampaignCharacter[]>> {
  if (!db) {
    return { ok: false, value: [], error: 'Firebase backend is not configured' };
  }

  try {
    const ref = collection(db, CAMPAIGNS_COLLECTION, campaignId, CHARACTERS_SUBCOLLECTION);
    const snap = await getDocs(ref);
    const characters = snap.docs
      .map((d) => campaignCharacterDocToCampaignCharacter(d, campaignId))
      .filter((c): c is CampaignCharacter => c !== null);
    return { ok: true, value: characters };
  } catch (error) {
    return {
      ok: false,
      value: [],
      error: `Could not load campaign characters: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export async function removeCampaignMember(
  _dmUserId: string,
  campaignId: string,
  memberUid: string
): Promise<FirestoreResult<boolean>> {
  if (!db) {
    return { ok: false, value: false, error: 'Firebase backend is not configured' };
  }

  try {
    const campaignRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
    await updateDoc(campaignRef, { [`members.${memberUid}`]: deleteField() });

    // NOTE: The character copy delete is now allowed for the DM (rules allow delete if
    // request.auth.uid == uid || isDM(request.auth.uid, campaignId)). We attempt it here;
    // if it fails, the members map update still succeeds.
    const characterRef = doc(db, CAMPAIGNS_COLLECTION, campaignId, CHARACTERS_SUBCOLLECTION, memberUid);
    try {
      await deleteDoc(characterRef);
    } catch {
      // Character copy delete failed (likely permissions). Log and continue.
      console.warn('DM removeCampaignMember: character copy delete denied by rules; member removed from campaign only.');
    }

    return { ok: true, value: true };
  } catch (error) {
    return {
      ok: false,
      value: false,
      error: `Could not remove member: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export async function leaveCampaign(
  userId: string,
  campaignId: string
): Promise<FirestoreResult<void>> {
  if (!db) {
    return { ok: false, value: undefined, error: 'Firebase backend is not configured' };
  }

  try {
    const campaignRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
    await updateDoc(campaignRef, { [`members.${userId}`]: deleteField() });

    // Best-effort: delete own synced character copy
    try {
      await deleteDoc(doc(db, CAMPAIGNS_COLLECTION, campaignId, CHARACTERS_SUBCOLLECTION, userId));
    } catch {
      // Ignore: character copy may not exist or delete may be denied
    }

    // Best-effort: delete own joinedCampaigns marker
    try {
      await deleteDoc(doc(db, 'users', userId, JOINED_CAMPAIGNS_SUBCOLLECTION, campaignId));
    } catch {
      // Ignore: marker may not exist or delete may be denied
    }

    return { ok: true, value: undefined };
  } catch (error) {
    return {
      ok: false,
      value: undefined,
      error: `Could not leave campaign: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export async function removeCharacterFromUserCampaigns(
  userId: string,
  characterId: string
): Promise<FirestoreResult<void>> {
  if (!db) {
    return { ok: false, value: undefined, error: 'Firebase backend is not configured' };
  }

  try {
    const joinedRef = collection(db, 'users', userId, JOINED_CAMPAIGNS_SUBCOLLECTION);
    const joinedSnap = await getDocs(joinedRef);

    for (const joinedDoc of joinedSnap.docs) {
      const data = joinedDoc.data();
      const campaignId = data.campaignId ?? joinedDoc.id;

      try {
        const charRef = doc(db, CAMPAIGNS_COLLECTION, campaignId, CHARACTERS_SUBCOLLECTION, userId);
        const charSnap = await getDoc(charRef);
        if (charSnap.exists() && charSnap.data().originalCharId === characterId) {
          await deleteDoc(charRef);
        }
      } catch {
        // Best-effort per campaign; ignore errors and continue
      }
    }

    return { ok: true, value: undefined };
  } catch (error) {
    return {
      ok: false,
      value: undefined,
      error: `Could not clean up campaign copies: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

export async function deleteCampaign(
  _dmUserId: string,
  campaignId: string
): Promise<FirestoreResult<void>> {
  if (!db) {
    return { ok: false, value: undefined, error: 'Firebase backend is not configured' };
  }

  try {
    const existing = await getCampaign(_dmUserId, campaignId);
    const campaignRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
    // Delete the joinCodes mapping FIRST: its delete rule calls isDM(), which reads the
    // campaign doc. That read fails once the campaign doc is gone, so the code cleanup
    // must happen while the campaign doc still exists.
    if (existing.ok && existing.value) {
      try {
        await deleteDoc(doc(db, 'joinCodes', existing.value.joinCode));
      } catch {
        // Best-effort cleanup; ignore if join code doc doesn't exist
      }
    }
    await deleteDoc(campaignRef);
    // Note: Subcollections (characters) and joinedCampaigns markers are not automatically
    // deleted by Firestore. A Cloud Function or batch job should clean those up.
    return { ok: true, value: undefined };
  } catch (error) {
    return {
      ok: false,
      value: undefined,
      error: `Could not delete campaign: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}