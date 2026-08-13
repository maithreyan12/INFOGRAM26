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

export const auth = (() => {
  try { return app ? getAuth(app) : null; } catch { return null; }
})() as any;

export const db = (() => {
  try { return app ? getFirestore(app) : null; } catch { return null; }
})() as any;

export const storage = (() => {
  try { return app ? getStorage(app) : null; } catch { return null; }
})() as any;

export default app;
