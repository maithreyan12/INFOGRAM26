import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fipoazwipiahfkttgwew.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcG9hendpcGlhaGZrdHRnd2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODc5ODEsImV4cCI6MjEwMjQ2Mzk4MX0.lx-wiLCzg90mzsliCeYh5IvBOtwmHWs-dIL20fCQ3zA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('⚡ Updating Hack Forge venue location to Tech Tower Lab 1 & 2 in Supabase & Firestore...');

  const updates = {
    venue: 'Tech Tower Lab 1 & 2',
    updatedAt: new Date().toISOString(),
  };

  // 1. Supabase
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .or('slug.eq.hack-forge,id.eq.tech-6,name.ilike.%hack forge%')
      .select();
    console.log('✅ Supabase events update:', data, 'Error:', error);
  } catch (e) {
    console.warn('Supabase event update notice:', e);
  }

  // 2. Firestore
  if (db) {
    const ids = ['tech-6', 'hack-forge', 'evt_hack-forge'];
    for (const id of ids) {
      try {
        await setDoc(doc(db, 'events', id), {
          id: 'tech-6',
          slug: 'hack-forge',
          name: 'Hack Forge',
          category: 'technical',
          venue: 'Tech Tower Lab 1 & 2',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log(`✅ Firestore event document updated: ${id}`);
      } catch (e) {
        console.warn(`Firestore event update notice for ${id}:`, e);
      }
    }
  }

  console.log('🎉 Hack Forge venue update complete!');
  process.exit(0);
}

main().catch(console.error);
