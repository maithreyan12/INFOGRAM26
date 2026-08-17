import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

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
  console.log('⚡ Removing Participant (INFO26-HACK-98035) from Supabase & Firestore...');

  // 1. Supabase Deletions
  try {
    const { data: spRegs } = await supabase.from('registrations').select('*');
    if (spRegs) {
      for (const r of spRegs) {
        const name = (r.full_name || '').toLowerCase();
        const appId = (r.applicant_id || '').toLowerCase();
        if (name === 'participant' || name.includes('participant') || appId.includes('98035') || appId.includes('test')) {
          const { error } = await supabase.from('registrations').delete().eq('id', r.id);
          console.log(`✅ Deleted Supabase registration: ${r.id} (${r.applicant_id} / ${r.full_name})`, 'Err:', error);
        }
      }
    }

    const { data: spTkts } = await supabase.from('tickets').select('*');
    if (spTkts) {
      for (const t of spTkts) {
        const name = (t.student_name || '').toLowerCase();
        const appId = (t.applicant_id || '').toLowerCase();
        if (name === 'participant' || name.includes('participant') || appId.includes('98035') || appId.includes('test')) {
          const { error } = await supabase.from('tickets').delete().eq('id', t.id);
          console.log(`✅ Deleted Supabase ticket: ${t.id} (${t.applicant_id} / ${t.student_name})`, 'Err:', error);
        }
      }
    }
  } catch (err) {
    console.error('Supabase deletion error:', err);
  }

  // 2. Firestore Deletions
  if (db) {
    try {
      const regSnap = await getDocs(collection(db, 'registrations'));
      for (const d of regSnap.docs) {
        const data = d.data();
        const name = (data.personalInfo?.fullName || data.studentName || data.fullName || '').toLowerCase();
        const appId = (data.applicantId || d.id || '').toLowerCase();
        if (name === 'participant' || name.includes('participant') || appId.includes('98035') || appId.includes('test')) {
          try {
            await deleteDoc(doc(db, 'registrations', d.id));
            console.log(`✅ Deleted Firestore registration: ${d.id}`);
          } catch {}
        }
      }

      const tktSnap = await getDocs(collection(db, 'tickets'));
      for (const d of tktSnap.docs) {
        const data = d.data();
        const name = (data.studentName || data.fullName || data.name || '').toLowerCase();
        const appId = (data.applicantId || d.id || '').toLowerCase();
        if (name === 'participant' || name.includes('participant') || appId.includes('98035') || appId.includes('test')) {
          try {
            await deleteDoc(doc(db, 'tickets', d.id));
            console.log(`✅ Deleted Firestore ticket: ${d.id}`);
          } catch {}
        }
      }
    } catch (fsErr) {
      console.warn('Firestore deletion notice:', fsErr);
    }
  }

  console.log('🎉 Cleanup complete!');
  process.exit(0);
}

main().catch(console.error);
