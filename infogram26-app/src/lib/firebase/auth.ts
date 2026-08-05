// ============================================================
// Firebase Authentication Helpers
// ============================================================
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './config';
import { getDocument, collections } from './firestore';
import { AdminUser } from '@/types';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ─── Sign In / Sign Out ──────────────────────────────────────
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// ─── Auth State ──────────────────────────────────────────────
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// ─── Admin / Organizer Check ─────────────────────────────────
export async function getAdminUser(uid: string): Promise<AdminUser | null> {
  return getDocument<AdminUser>(collections.users, uid);
}

export async function isAdmin(uid: string): Promise<boolean> {
  const user = await getAdminUser(uid);
  return user?.role === 'super_admin' && user.isActive;
}

export async function isOrganizer(uid: string): Promise<boolean> {
  const user = await getAdminUser(uid);
  return user?.role === 'organizer' && user.isActive;
}

export async function isAuthorized(uid: string): Promise<boolean> {
  const user = await getAdminUser(uid);
  return !!user && user.isActive;
}

export { auth };
