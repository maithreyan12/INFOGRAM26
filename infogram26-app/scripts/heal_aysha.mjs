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
  console.log('⚡ Healing Aysha Daniya M (INFO26-QSTX-23449) in Supabase & Firestore...');

  const applicantId = 'INFO26-QSTX-23449';
  const ticketNumber = 'TKT-QSTX-23449';
  const regId = 'Knn0TVhDmHJU5r5B9h1q';
  const name = 'Aysha Daniya M';
  const email = 'darfmo313@gmail.com';
  const phone = '7824984485';
  const college = "Islamiah Women's Arts and Science College (Autonomous)";
  const department = 'B.Sc Data Science';
  const year = '3rd Year';
  const events = ['Quest X', 'Fun Fiesta'];
  const razorpayPaymentId = 'pay_manual_reconcile_aysha';

  const qrData = JSON.stringify({
    ticketNumber,
    applicantId,
    name,
    events,
    verified: true,
  });

  const registrationData = {
    applicantId,
    studentName: name,
    fullName: name,
    email,
    phone,
    college,
    department,
    year,
    personalInfo: {
      fullName: name,
      email,
      phone,
      college,
      department,
      year,
    },
    events,
    eventNames: events,
    selectedEvents: ['quest-x', 'fun-fiesta'],
    totalFee: 100,
    totalAmount: 100,
    status: 'paid',
    razorpayPaymentId,
    paymentMethod: 'UPI',
    paidAt: new Date().toISOString(),
  };

  const ticketData = {
    ticketNumber,
    applicantId,
    registrationId: regId,
    studentName: name,
    email,
    phone,
    college,
    department,
    year,
    events,
    totalAmount: 100,
    paymentMethod: 'razorpay',
    razorpayPaymentId,
    qrData,
    status: 'valid',
    issueDate: new Date().toISOString(),
  };

  // 1. Supabase Registration Update
  try {
    const { data: spReg, error: spRegErr } = await supabase
      .from('registrations')
      .update({
        status: 'paid',
        razorpay_payment_id: razorpayPaymentId,
        paid_at: new Date().toISOString(),
      })
      .eq('id', regId)
      .select();
    console.log('✅ Supabase Registration Updated:', spReg, 'Err:', spRegErr);
  } catch (e) {
    console.error('Supabase reg update error:', e);
  }

  // 2. Supabase Ticket Upsert
  try {
    const { data: spTkt, error: spTktErr } = await supabase
      .from('tickets')
      .upsert([
        {
          id: `tkt_${applicantId}`,
          ticket_number: ticketNumber,
          applicant_id: applicantId,
          registration_id: regId,
          student_name: name,
          email,
          phone,
          college,
          department,
          year,
          events,
          total_amount: 100,
          payment_method: 'razorpay',
          razorpay_payment_id: razorpayPaymentId,
          qr_data: qrData,
          status: 'valid',
          issue_date: new Date().toISOString(),
        },
      ])
      .select();
    console.log('✅ Supabase Ticket Upserted:', spTkt, 'Err:', spTktErr);
  } catch (e) {
    console.error('Supabase ticket upsert error:', e);
  }

  // 3. Firestore Writes
  if (db) {
    const ticketKeys = [`tkt_${applicantId}`, applicantId, regId, ticketNumber];
    for (const key of ticketKeys) {
      try {
        await setDoc(doc(db, 'tickets', key), ticketData, { merge: true });
        console.log(`✅ Firestore ticket document updated for key: ${key}`);
      } catch (err) {
        console.warn(`Firestore ticket write notice for key ${key}:`, err);
      }
    }

    const regKeys = [regId, applicantId, `reg_${applicantId}`];
    for (const key of regKeys) {
      try {
        await setDoc(doc(db, 'registrations', key), registrationData, { merge: true });
        console.log(`✅ Firestore registration document updated for key: ${key}`);
      } catch (err) {
        console.warn(`Firestore reg write notice for key ${key}:`, err);
      }
    }
  }

  // 4. Google Sheets Sync
  try {
    fetch('https://www.infogram26.in/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantId,
        ticketNumber,
        name,
        email,
        phone,
        college,
        department,
        year,
        events: events.join(', '),
        amount: 100,
        status: 'paid',
        paymentMethod: 'razorpay',
        razorpayPaymentId,
      }),
    }).catch(() => {});
  } catch {}

  console.log('🎉 Aysha Daniya M ticket generation and database update complete!');
  process.exit(0);
}

main().catch(console.error);
