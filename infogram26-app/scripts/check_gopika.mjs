import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDGPuGlZhb_lFur3YPAegpdr8aM4BUd-zY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "infogram26.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "infogram26",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "infogram26.firebasestorage.app",
  messagingSenderId: "1083758362629",
  appId: "1:1083758362629:web:38b344efbc36746efbdba4",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  console.log('🔍 Checking Firestore users collection for Gopika / 23521.gopika.it@cahcet.edu.in...');

  try {
    const snap = await getDocs(collection(db, 'users'));
    console.log('Total users in Firestore:', snap.docs.length);
    snap.docs.forEach(d => {
      console.log('User doc:', d.id, d.data());
    });
  } catch (err) {
    console.error('Firestore users fetch error:', err);
  }

  try {
    const orgSnap = await getDocs(collection(db, 'organizers'));
    console.log('Total organizers in Firestore:', orgSnap.docs.length);
    orgSnap.docs.forEach(d => {
      console.log('Organizer doc:', d.id, d.data());
    });
  } catch (err) {
    console.error('Firestore organizers fetch error:', err);
  }
}

main().catch(console.error);
