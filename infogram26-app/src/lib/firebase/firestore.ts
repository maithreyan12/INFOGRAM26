// ============================================================
// Firebase Firestore Helpers
// ============================================================
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
  DocumentData,
  WhereFilterOp,
} from 'firebase/firestore';
import { db } from './config';

// ─── Collection References ───────────────────────────────────
export const collections = {
  events: 'events',
  registrations: 'registrations',
  payments: 'payments',
  tickets: 'tickets',
  users: 'users',
  sponsors: 'sponsors',
  announcements: 'announcements',
  gallery: 'gallery',
  settings: 'settings',
  notifications: 'notifications',
  attendance: 'attendance',
  certificates: 'certificates',
} as const;

// ─── Generic CRUD ────────────────────────────────────────────
export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as T;
}

export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: T,
  id?: string
): Promise<string> {
  if (id) {
    await setDoc(doc(db, collectionName, id), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  }
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateDocument<T extends Partial<DocumentData>>(
  collectionName: string,
  id: string,
  data: T
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}

// ─── Real-time Listeners ─────────────────────────────────────
export function listenToDocument<T>(
  collectionName: string,
  id: string,
  callback: (data: T | null) => void
): () => void {
  const docRef = doc(db, collectionName, id);
  return onSnapshot(docRef, (snap) => {
    if (!snap.exists()) {
      callback(null);
    } else {
      callback({ id: snap.id, ...snap.data() } as T);
    }
  });
}

export function listenToCollection<T>(
  collectionName: string,
  callback: (data: T[]) => void,
  constraints: QueryConstraint[] = []
): () => void {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
  });
}

// ─── Query Builders ──────────────────────────────────────────
export { where, orderBy, limit, Timestamp, serverTimestamp };

// ─── ID Generators ───────────────────────────────────────────
export function generateApplicantId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `IGR26-${num}`;
}

export function generateTicketNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TKT-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ─── Settings Helpers ────────────────────────────────────────
export async function getSettings() {
  const snap = await getDoc(doc(db, collections.settings, 'global'));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function updateSettings(data: Partial<Record<string, unknown>>) {
  await setDoc(doc(db, collections.settings, 'global'), data, { merge: true });
}
