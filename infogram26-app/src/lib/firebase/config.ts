// ============================================================
// Firebase Configuration — INFOGRAM'26 Production Credentials
// ============================================================
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDGPuGlZhb_lFur3YPAegpdr8aM4BUd-zY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "infogram26.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "infogram26",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "infogram26.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "207965452211",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:207965452211:web:aec06e1299bf5a27233dc6",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-11PB2J23P7",
};

export const isFirebaseConfigured = true;

// ─── Singleton Firebase App ───────────────────────────────────
function getFirebaseApp() {
  try {
    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  } catch (e) {
    console.warn("Firebase initialization notice:", e);
    return null;
  }
}

const app = getFirebaseApp();

// ─── Exports — always freshly resolved to avoid "closing/hidden" ─
// Auth: singleton is fine (no closing issue)
export const auth = (() => {
  try { return app ? getAuth(app) : null; } catch { return null; }
})() as any;

// db: use a lazy getter so we always get a live instance
// This fixes "Database is closing/hidden" after tab hide/restore
let _db: ReturnType<typeof getFirestore> | null = null;
export function getDb() {
  try {
    if (!app) return null;
    if (!_db) _db = getFirestore(app);
    return _db;
  } catch (e) {
    // If instance closed, force a fresh one
    try { _db = getFirestore(app!); return _db; } catch { return null; }
  }
}
// Backward-compat proxy for code that imports `db` directly
export const db = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getDb();
    if (!instance) return undefined;
    const val = (instance as any)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  }
});

export const storage = (() => {
  try { return app ? getStorage(app) : null; } catch { return null; }
})() as any;

export default app;

