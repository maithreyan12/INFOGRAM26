// ============================================================
// Firebase Configuration
// ============================================================
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const defaultFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA0B0C0D0E0F0G0H0I0J0K0L0M0N0O0P0Q",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "infogram26.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "infogram26",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "infogram26.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "100000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:100000000000:web:1000000000000000000000",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-1000000000",
};

export const isFirebaseConfigured = true;

// Singleton pattern for Next.js app initialization
const app = getApps().length > 0 ? getApp() : initializeApp(defaultFirebaseConfig);

export const auth = (typeof window !== 'undefined' ? getAuth(app) : null) as any;
export const db = (typeof window !== 'undefined' ? getFirestore(app) : null) as any;
export const storage = (typeof window !== 'undefined' ? getStorage(app) : null) as any;
export default app;
