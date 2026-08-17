import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';

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
  console.log('⚡ Healing Mohammed Faizan in Supabase & Firestore...');

  const faizanApplicantId = 'INFO26-QSTX-30555';
  const faizanTicketNumber = 'TKT-QSTX-30555';
  const faizanRegId = 'SOrNtS85NAjUIGOaE4xK';
  const faizanEmail = 'mohdfaizanfaizu786@gmail.com';
  const faizanPhone = '6382013260';
  const faizanName = 'Mohammed faizan';
  const faizanCollege = 'Islamiah college vaniyambadi';
  const faizanDept = 'Bsc computer science';
  const faizanYear = '3rd Year';
  const faizanEvents = ['Quest X', 'Fun Fiesta'];
  const razorpayPaymentId = 'pay_manual_reconcile_faizan';

  const qrData = JSON.stringify({
    ticketNumber: faizanTicketNumber,
    applicantId: faizanApplicantId,
    name: faizanName,
    events: faizanEvents,
    verified: true,
  });

  const faizanRegistrationData = {
    applicantId: faizanApplicantId,
    studentName: faizanName,
    fullName: faizanName,
    email: faizanEmail,
    phone: faizanPhone,
    college: faizanCollege,
    department: faizanDept,
    year: faizanYear,
    personalInfo: {
      fullName: faizanName,
      email: faizanEmail,
      phone: faizanPhone,
      college: faizanCollege,
      department: faizanDept,
      year: faizanYear,
    },
    events: faizanEvents,
    eventNames: faizanEvents,
    selectedEvents: ['quest-x', 'fun-fiesta'],
    totalFee: 100,
    totalAmount: 100,
    status: 'paid',
    razorpayPaymentId,
    paymentMethod: 'UPI',
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const faizanTicketData = {
    ticketNumber: faizanTicketNumber,
    applicantId: faizanApplicantId,
    registrationId: faizanRegId,
    studentName: faizanName,
    email: faizanEmail,
    phone: faizanPhone,
    college: faizanCollege,
    department: faizanDept,
    year: faizanYear,
    events: faizanEvents,
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
      .upsert([
        {
          id: faizanRegId,
          applicant_id: faizanApplicantId,
          full_name: faizanName,
          email: faizanEmail,
          phone: faizanPhone,
          college: faizanCollege,
          department: faizanDept,
          year: faizanYear,
          events: faizanEvents,
          total_fee: 100,
          status: 'paid',
          razorpay_payment_id: razorpayPaymentId,
          paid_at: new Date().toISOString(),
        },
      ])
      .select();
    console.log('✅ Supabase Registration Upserted:', spReg, 'Err:', spRegErr);
  } catch (e) {
    console.error('Supabase reg error:', e);
  }

  // 2. Supabase Ticket Upsert
  try {
    const { data: spTkt, error: spTktErr } = await supabase
      .from('tickets')
      .upsert([
        {
          id: `tkt_${faizanApplicantId}`,
          ticket_number: faizanTicketNumber,
          applicant_id: faizanApplicantId,
          registration_id: faizanRegId,
          student_name: faizanName,
          email: faizanEmail,
          phone: faizanPhone,
          college: faizanCollege,
          department: faizanDept,
          year: faizanYear,
          events: faizanEvents,
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
    console.error('Supabase ticket error:', e);
  }

  // 3. Firestore Write (Multiple Key Aliases so lookup by any ID succeeds)
  if (db) {
    const keysToUpdate = [
      `tkt_${faizanApplicantId}`,
      faizanApplicantId,
      faizanRegId,
      faizanTicketNumber,
    ];

    for (const key of keysToUpdate) {
      try {
        await setDoc(doc(db, 'tickets', key), faizanTicketData, { merge: true });
        console.log(`✅ Firestore ticket updated for key: ${key}`);
      } catch (err) {
        console.warn(`Firestore ticket write notice for key ${key}:`, err);
      }
    }

    const regKeysToUpdate = [
      faizanRegId,
      faizanApplicantId,
      `reg_${faizanApplicantId}`,
    ];

    for (const key of regKeysToUpdate) {
      try {
        await setDoc(doc(db, 'registrations', key), faizanRegistrationData, { merge: true });
        console.log(`✅ Firestore registration updated for key: ${key}`);
      } catch (err) {
        console.warn(`Firestore reg write notice for key ${key}:`, err);
      }
    }
  }

  // 4. Sync to Google Sheets
  try {
    fetch('https://www.infogram26.in/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantId: faizanApplicantId,
        ticketNumber: faizanTicketNumber,
        name: faizanName,
        email: faizanEmail,
        phone: faizanPhone,
        college: faizanCollege,
        department: faizanDept,
        year: faizanYear,
        events: faizanEvents.join(', '),
        amount: 100,
        status: 'paid',
        paymentMethod: 'razorpay',
        razorpayPaymentId,
      }),
    }).catch(() => {});
  } catch {}

  console.log('🎉 Mohammed Faizan ticket generation and database heal complete!');
  process.exit(0);
}

main().catch(console.error);
