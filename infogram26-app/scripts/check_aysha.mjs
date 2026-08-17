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
  console.log('🔍 Searching for Aysha Daniya M...');

  // 1. Supabase search
  try {
    const { data: spRegs, error: spErr } = await supabase.from('registrations').select('*');
    console.log('Supabase Total Regs:', spRegs?.length, 'Err:', spErr);
    if (spRegs) {
      const matchReg = spRegs.filter(r => {
        const str = JSON.stringify(r).toLowerCase();
        return str.includes('aysha') || str.includes('daniya') || str.includes('islamiah women');
      });
      console.log('Supabase Matching Regs for Aysha:', matchReg);
    }

    const { data: spTkts, error: spTktErr } = await supabase.from('tickets').select('*');
    console.log('Supabase Total Tickets:', spTkts?.length, 'Err:', spTktErr);
    if (spTkts) {
      const matchTkt = spTkts.filter(t => {
        const str = JSON.stringify(t).toLowerCase();
        return str.includes('aysha') || str.includes('daniya') || str.includes('islamiah women');
      });
      console.log('Supabase Matching Tickets for Aysha:', matchTkt);
    }
  } catch (err) {
    console.error('Supabase error:', err);
  }

  // 2. Firestore search
  try {
    const regSnap = await getDocs(collection(db, 'registrations'));
    const fsRegs = regSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const fsMatchReg = fsRegs.filter(r => {
      const str = JSON.stringify(r).toLowerCase();
      return str.includes('aysha') || str.includes('daniya') || str.includes('islamiah women');
    });
    console.log('Firestore Matching Regs for Aysha:', fsMatchReg);

    const tktSnap = await getDocs(collection(db, 'tickets'));
    const fsTkts = tktSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const fsMatchTkt = fsTkts.filter(t => {
      const str = JSON.stringify(t).toLowerCase();
      return str.includes('aysha') || str.includes('daniya') || str.includes('islamiah women');
    });
    console.log('Firestore Matching Tickets for Aysha:', fsMatchTkt);
  } catch (err) {
    console.warn('Firestore notice:', err);
  }

  // Also print all registrations in Supabase to see if there is any unpaid / pending registration or partial record
  try {
    const { data: allRegs } = await supabase.from('registrations').select('*');
    console.log('--- ALL SUPABASE REGISTRATIONS ---');
    console.log(allRegs);
  } catch {}
}

main().catch(console.error);
