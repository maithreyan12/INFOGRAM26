/**
 * repair_missing_tickets.mjs
 * Fetches ALL captured Razorpay payments → cross-checks Supabase
 * → marks any captured-but-pending registrations as PAID
 * → generates missing tickets
 *
 * Run: node scripts/repair_missing_tickets.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import https from 'https';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fipoazwipiahfkttgwew.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcG9hendpcGlhaGZrdHRnd2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODc5ODEsImV4cCI6MjEwMjQ2Mzk4MX0.lx-wiLCzg90mzsliCeYh5IvBOtwmHWs-dIL20fCQ3zA';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TPacWV4BbmByiW';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'ch33dn9aTpclea4ptqaKCMtT';

const firebaseConfig = {
  apiKey: 'AIzaSyDGPuGlZhb_lFur3YPAegpdr8aM4BUd-zY',
  authDomain: 'infogram26.firebaseapp.com',
  projectId: 'infogram26',
  storageBucket: 'infogram26.firebasestorage.app',
  messagingSenderId: '1083758362629',
  appId: '1:1083758362629:web:38b344efbc36746efbdba4',
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const fbApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

function razorpayGet(path) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const opts = {
      hostname: 'api.razorpay.com',
      path,
      method: 'GET',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
    });
    req.on('error', reject);
    req.end();
  });
}

async function fetchAllCaptured() {
  console.log('\n📡 Fetching payments from Razorpay API...');
  const captured = [];
  let skip = 0;
  while (true) {
    const res = await razorpayGet(`/v1/payments?count=100&skip=${skip}`);
    const items = res.items || [];
    if (items.length === 0) break;
    for (const p of items) {
      if (p.status === 'captured') {
        captured.push({
          paymentId: p.id,
          orderId: p.order_id || '',
          email: (p.email || '').toLowerCase().trim(),
          contact: (p.contact || '').replace(/\D/g,'').slice(-10),
          amount: p.amount / 100,
          createdAt: new Date(p.created_at * 1000).toISOString(),
        });
      }
    }
    if (items.length < 100) break;
    skip += 100;
  }
  console.log(`  ✅ ${captured.length} captured payments on Razorpay`);
  return captured;
}

function genTicketNumber() {
  return `TKT-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
}

async function main() {
  console.log('🔧 INFOGRAM26 — Ticket Repair Script');
  console.log('=====================================\n');

  const captured = await fetchAllCaptured();

  console.log('\n📦 Fetching all registrations from Supabase...');
  const { data: allRegs, error: regErr } = await supabase.from('registrations').select('*');
  if (regErr) { console.error('❌ Supabase error:', regErr.message); process.exit(1); }
  console.log(`  ✅ ${allRegs.length} registrations in Supabase`);

  const { data: existingTickets } = await supabase.from('tickets').select('registration_id');
  const ticketedRegIds = new Set((existingTickets || []).map(t => t.registration_id));
  console.log(`  🎟️  ${ticketedRegIds.size} already have tickets`);

  const emailToReg = {};
  const phoneToReg = {};
  for (const r of allRegs) {
    if (r.email) emailToReg[r.email.toLowerCase().trim()] = r;
    if (r.phone) phoneToReg[String(r.phone).replace(/\D/g,'').slice(-10)] = r;
  }

  console.log('\n🔍 Cross-checking...\n');
  const toFix = [];
  const alreadyOk = [];
  const notFound = [];

  for (const payment of captured) {
    let reg = emailToReg[payment.email];
    if (!reg && payment.contact) reg = phoneToReg[payment.contact];

    if (!reg) {
      notFound.push(payment);
      console.log(`  ⚠️  NOT IN DB: ${payment.email} | ${payment.paymentId} | ₹${payment.amount}`);
      continue;
    }

    if (reg.status === 'paid' && ticketedRegIds.has(reg.id)) {
      alreadyOk.push(reg);
      console.log(`  ✅ OK:        [${reg.applicant_id}] ${reg.email}`);
      continue;
    }

    toFix.push({ payment, reg });
    const reason = reg.status !== 'paid' ? `status=${reg.status}` : 'ticket missing';
    console.log(`  ❌ FIX NEEDED:[${reg.applicant_id}] ${reg.email} — ${reason}`);
  }

  console.log(`\n--- Pre-fix summary ---`);
  console.log(`  Already OK:   ${alreadyOk.length}`);
  console.log(`  Needs fixing: ${toFix.length}`);
  console.log(`  Not in DB:    ${notFound.length}`);

  if (toFix.length === 0) {
    console.log('\n🎉 All captured payments are correctly reflected in DB!');
    return;
  }

  console.log('\n🔧 Applying fixes...\n');
  let fixed = 0, failed = 0;

  for (const { payment, reg } of toFix) {
    const regId = reg.id;
    const applicantId = reg.applicant_id;
    const ticketId = `tkt_${regId}`;
    const ticketNumber = genTicketNumber();
    const name = reg.full_name || 'Participant';
    const events = reg.events || [];
    const totalFee = reg.total_fee || payment.amount || 50;
    const qrData = JSON.stringify({ ticketNumber, applicantId, name, events, verified: true });

    console.log(`  🔧 [${applicantId}] ${reg.email}...`);
    try {
      // Update Supabase registration
      const { error: e1 } = await supabase.from('registrations').update({
        status: 'paid',
        razorpay_payment_id: payment.paymentId,
        razorpay_order_id: payment.orderId,
        paid_at: payment.createdAt,
      }).eq('id', regId);
      if (e1) throw new Error(`reg update: ${e1.message}`);

      // Upsert Supabase ticket
      const { error: e2 } = await supabase.from('tickets').upsert([{
        id: ticketId,
        ticket_number: ticketNumber,
        applicant_id: applicantId,
        registration_id: regId,
        student_name: name,
        email: reg.email || '',
        phone: reg.phone || '',
        college: reg.college || '',
        department: reg.department || '',
        year: reg.year || '',
        events,
        total_amount: totalFee,
        payment_method: 'razorpay',
        razorpay_payment_id: payment.paymentId,
        qr_data: qrData,
        status: 'valid',
        issue_date: new Date().toISOString(),
      }]);
      if (e2) throw new Error(`ticket upsert: ${e2.message}`);

      // Update Firestore registration (best-effort)
      try {
        const fsRef = doc(db, 'registrations', regId);
        const fsSnap = await getDoc(fsRef);
        if (fsSnap.exists()) {
          await updateDoc(fsRef, { status: 'paid', razorpayPaymentId: payment.paymentId, paidAt: payment.createdAt });
        }
      } catch {}

      // Write Firestore ticket (best-effort)
      try {
        await setDoc(doc(db, 'tickets', ticketId), {
          ticketNumber, applicantId, registrationId: regId,
          studentName: name, email: reg.email || '', phone: reg.phone || '',
          college: reg.college || '', department: reg.department || '', year: reg.year || '',
          events, totalAmount: totalFee, paymentMethod: 'razorpay',
          razorpayPaymentId: payment.paymentId, qrData, status: 'valid',
          issueDate: new Date().toISOString(),
        }, { merge: true });
      } catch {}

      console.log(`     ✅ Fixed! Ticket: ${ticketNumber}`);
      fixed++;
    } catch (err) {
      console.error(`     ❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log('\n=====================================');
  console.log('🎉 Repair done!');
  console.log(`  Fixed:      ${fixed}`);
  console.log(`  Failed:     ${failed}`);
  console.log(`  Already OK: ${alreadyOk.length}`);
  if (notFound.length > 0) {
    console.log(`\n⚠️  ${notFound.length} Razorpay captured payments with NO matching DB registration:`);
    for (const p of notFound) {
      console.log(`    email=${p.email || 'none'}  phone=${p.contact}  id=${p.paymentId}  ₹${p.amount}  ${p.createdAt}`);
    }
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
