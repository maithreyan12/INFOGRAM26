// ============================================================
// Firebase Configuration — INFOGRAM'26 Production Credentials
// ============================================================
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDGPuGlZhb_lFur3YPAegpdr8aM4BUd-zY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "infogram26.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "infogram26",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "infogram26.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1083758362629",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1083758362629:web:38b344efbc36746efbdba4",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-11PB2J23P7",
};

export const isFirebaseConfigured = true;

// ─── Singleton Firebase App ───────────────────────────────────
export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ─── Singleton Auth ───────────────────────────────────────────
let _auth: Auth | null = null;
try {
  _auth = getAuth(app);
} catch {
  _auth = null;
}
export const auth: Auth = _auth as Auth;

// ─── Singleton Firestore ──────────────────────────────────────
let _db: Firestore | null = null;
try {
  _db = getFirestore(app);
} catch {
  try {
    _db = initializeFirestore(app, {});
  } catch {
    _db = null;
  }
}
export const db: Firestore = _db as Firestore;

// ─── Singleton Storage ────────────────────────────────────────
let _storage: FirebaseStorage | null = null;
try {
  _storage = getStorage(app);
} catch {
  _storage = null;
}
export const storage: FirebaseStorage = _storage as FirebaseStorage;

export default app;
