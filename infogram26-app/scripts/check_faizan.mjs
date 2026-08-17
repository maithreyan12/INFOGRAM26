import { createClient } from '@supabase/supabase-js';
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fipoazwipiahfkttgwew.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcG9hendpcGlhaGZrdHRnd2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODc5ODEsImV4cCI6MjEwMjQ2Mzk4MX0.lx-wiLCzg90mzsliCeYh5IvBOtwmHWs-dIL20fCQ3zA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('🔍 Searching for Mohd Faizan (mohdfaizanfaizu786@gmail.com / 6382013260)...');

  // 1. Supabase Check
  try {
    const { data: spRegs, error: spErr } = await supabase.from('registrations').select('*');
    console.log('Supabase registrations total:', spRegs?.length || 0, 'Error:', spErr);
    if (spRegs) {
      const match = spRegs.filter(r => 
        (r.email || '').toLowerCase().includes('mohdfaizan') || 
        (r.phone || '').includes('6382013260')
      );
      console.log('Supabase matching registrations:', match);
    }

    const { data: spTkts } = await supabase.from('tickets').select('*');
    console.log('Supabase tickets total:', spTkts?.length || 0);
    if (spTkts) {
      const matchTkt = spTkts.filter(t => 
        (t.email || '').toLowerCase().includes('mohdfaizan') || 
        (t.phone || '').includes('6382013260')
      );
      console.log('Supabase matching tickets:', matchTkt);
    }
  } catch (err) {
    console.error('Supabase search error:', err);
  }

  // 2. Firestore Check
  try {
    const regSnap = await getDocs(collection(db, 'registrations'));
    console.log('Firestore registrations total:', regSnap.docs.length);
    const fsRegs = regSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const fsMatch = fsRegs.filter(r => {
      const email = (r.personalInfo?.email || r.email || '').toLowerCase();
      const phone = (r.personalInfo?.phone || r.phone || '');
      return email.includes('mohdfaizan') || phone.includes('6382013260');
    });
    console.log('Firestore matching registrations:', fsMatch);

    const tktSnap = await getDocs(collection(db, 'tickets'));
    console.log('Firestore tickets total:', tktSnap.docs.length);
    const fsTkts = tktSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const fsMatchTkt = fsTkts.filter(t => {
      const email = (t.email || '').toLowerCase();
      const phone = (t.phone || '');
      return email.includes('mohdfaizan') || phone.includes('6382013260');
    });
    console.log('Firestore matching tickets:', fsMatchTkt);
  } catch (err) {
    console.error('Firestore search error:', err);
  }
}

main().catch(console.error);
