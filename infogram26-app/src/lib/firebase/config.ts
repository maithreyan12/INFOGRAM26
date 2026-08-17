// ============================================================
// Firebase Configuration — INFOGRAM'26 Production Credentials
// ============================================================
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  type Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  type Auth,
} from 'firebase/auth';
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
// Uses browserLocalPersistence (localStorage) instead of the default
// indexedDBLocalPersistence to avoid "Database is closing/hidden" errors.
let _auth: Auth | null = null;
function getAuthInstance(): Auth | null {
  if (_auth) return _auth;
  try {
    // Initialize with localStorage-based persistence and browserPopupRedirectResolver
    _auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    try {
      // Already initialized — retrieve existing instance
      _auth = getAuth(app);
    } catch (e2) {
      console.warn('Firebase Auth init failed:', e2);
      _auth = null;
    }
  }
  return _auth;
}
export const auth: Auth = getAuthInstance() as Auth;

// ─── Singleton Firestore ──────────────────────────────────────
// Uses memoryLocalCache to completely avoid IndexedDB persistence
// issues like "Database is closing/hidden" errors.
let _db: Firestore | null = null;
function getFirestoreInstance(): Firestore | null {
  if (_db) return _db;
  try {
    _db = getFirestore(app);
  } catch {
    try {
      _db = initializeFirestore(app, {
        localCache: memoryLocalCache(),
      });
    } catch (e2) {
      console.warn('Firebase Firestore init failed:', e2);
      _db = null;
    }
  }
  return _db;
}
export const db: Firestore = getFirestoreInstance() as Firestore;

// ─── Singleton Storage ────────────────────────────────────────
let _storage: FirebaseStorage | null = null;
function getStorageInstance(): FirebaseStorage | null {
  if (_storage) return _storage;
  try {
    _storage = getStorage(app);
  } catch (e) {
    console.warn('Firebase Storage init failed:', e);
    _storage = null;
  }
  return _storage;
}
export const storage: FirebaseStorage = getStorageInstance() as FirebaseStorage;

export default app;

