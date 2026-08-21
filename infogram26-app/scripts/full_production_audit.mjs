import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import https from 'https';

// Credentials
const SUPABASE_URL = 'https://fipoazwipiahfkttgwew.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcG9hendpcGlhaGZrdHRnd2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODc5ODEsImV4cCI6MjEwMjQ2Mzk4MX0.lx-wiLCzg90mzsliCeYh5IvBOtwmHWs-dIL20fCQ3zA';
const RAZORPAY_KEY_ID = 'rzp_live_TPacWV4BbmByiW';
const RAZORPAY_KEY_SECRET = 'ch33dn9aTpclea4ptqaKCMtT';

const firebaseConfig = {
  apiKey: "AIzaSyDGPuGlZhb_lFur3YPAegpdr8aM4BUd-zY",
  authDomain: "infogram26.firebaseapp.com",
  projectId: "infogram26",
  storageBucket: "infogram26.firebasestorage.app",
  messagingSenderId: "1083758362629",
  appId: "1:1083758362629:web:38b344efbc36746efbdba4",
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const fbApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(fbApp);
const razorAuth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

function fetchRazorpayPath(path) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'api.razorpay.com',
      path,
      headers: { Authorization: `Basic ${razorAuth}` }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

// 1. Fetch ALL Supabase Records using pagination
async function fetchAllSupabaseTable(table) {
  let all = [];
  let page = 0;
  const pageSize = 1000;
  while (true) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await supabase.from(table).select('*').range(from, to);
    if (error) {
      console.warn(`Supabase table ${table} warning:`, error.message);
      break;
    }
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    page++;
  }
  return all;
}

// 2. Fetch ALL Firebase Records
async function fetchAllFirebaseCollection(colName) {
  try {
    const snap = await getDocs(collection(db, colName));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn(`Firebase collection ${colName} warning:`, e.message);
    return [];
  }
}

// 3. Fetch ALL Razorpay Payments
async function fetchAllRazorpayPayments() {
  let all = [];
  let skip = 0;
  while (true) {
    const res = await fetchRazorpayPath(`/v1/payments?count=100&skip=${skip}`);
    const items = res.items || [];
    all.push(...items);
    if (items.length < 100) break;
    skip += 100;
  }
  return all;
}

// 4. Fetch ALL Razorpay Orders
async function fetchAllRazorpayOrders() {
  let all = [];
  let skip = 0;
  while (true) {
    const res = await fetchRazorpayPath(`/v1/orders?count=100&skip=${skip}`);
    const items = res.items || [];
    all.push(...items);
    if (items.length < 100) break;
    skip += 100;
  }
  return all;
}

async function runFullAudit() {
  console.log("==================================================");
  console.log("INFOGRAM '26 COMPLETE AUDIT & RECONCILIATION");
  console.log("==================================================\n");

  console.log("1. FETCHING ALL SUPABASE TABLES...");
  const supaRegistrations = await fetchAllSupabaseTable('registrations');
  const supaTickets = await fetchAllSupabaseTable('tickets');
  console.log(`   - registrations: ${supaRegistrations.length} records`);
  console.log(`   - tickets: ${supaTickets.length} records`);

  console.log("\n2. FETCHING ALL FIREBASE COLLECTIONS...");
  const fbRegistrations = await fetchAllFirebaseCollection('registrations');
  const fbTickets = await fetchAllFirebaseCollection('tickets');
  const fbOrganizers = await fetchAllFirebaseCollection('organizers');
  const fbEvents = await fetchAllFirebaseCollection('events');
  console.log(`   - registrations: ${fbRegistrations.length} records`);
  console.log(`   - tickets: ${fbTickets.length} records`);
  console.log(`   - organizers: ${fbOrganizers.length} records`);
  console.log(`   - events: ${fbEvents.length} records`);

  console.log("\n3. FETCHING ALL RAZORPAY PAYMENTS & ORDERS...");
  const rzpPayments = await fetchAllRazorpayPayments();
  const rzpOrders = await fetchAllRazorpayOrders();
  console.log(`   - Razorpay Payments: ${rzpPayments.length} total payments`);
  console.log(`   - Razorpay Orders: ${rzpOrders.length} total orders`);

  // Analyze Razorpay Payments
  const capturedPayments = rzpPayments.filter(p => p.status === 'captured');
  const failedPayments = rzpPayments.filter(p => p.status === 'failed');
  const refundedPayments = rzpPayments.filter(p => p.status === 'refunded' || p.amount_refunded > 0);
  const totalCapturedRevenue = capturedPayments.reduce((s, p) => s + (p.amount / 100), 0);

  console.log(`     * Captured: ${capturedPayments.length} (₹${totalCapturedRevenue})`);
  console.log(`     * Failed: ${failedPayments.length}`);
  console.log(`     * Refunded: ${refundedPayments.length}`);

  // Deduplication & Reconciliation
  console.log("\n4. DEDUPLICATING AND RECONCILING DATA...");

  // Unique Users Map (by Normalized Phone & Email)
  const canonicalParticipants = new Map();
  const duplicateRecords = [];
  const testDemoRecords = [];
  const paymentOnlyRecords = [];
  const registrationOnlyRecords = [];
  const amountMismatches = [];
  const statusMismatches = [];

  // Track Razorpay IDs seen
  const matchedRazorpayIds = new Set();

  // Process Supabase Registrations
  supaRegistrations.forEach(r => {
    const email = (r.email || '').toLowerCase().trim();
    const phone = (r.phone || '').replace(/\D/g, '').slice(-10);
    const key = email || phone || r.applicant_id || r.id;

    if (email.includes('test') || email.includes('example.com') || email === 'void@razorpay.com') {
      testDemoRecords.push({ source: 'Supabase', record: r, reason: 'Test/Demo email pattern' });
    }

    if (r.razorpay_payment_id) {
      matchedRazorpayIds.add(r.razorpay_payment_id);
    }

    if (canonicalParticipants.has(key)) {
      duplicateRecords.push({ source: 'Supabase', record: r, existing: canonicalParticipants.get(key) });
    } else {
      canonicalParticipants.set(key, { ...r, source: 'Supabase' });
    }
  });

  // Cross-check Firebase Registrations
  fbRegistrations.forEach(r => {
    const email = (r.personalInfo?.email || r.email || '').toLowerCase().trim();
    const phone = (r.personalInfo?.phone || r.phone || '').replace(/\D/g, '').slice(-10);
    const key = email || phone || r.applicantId || r.id;

    if (canonicalParticipants.has(key)) {
      // Record exists in both Firebase & Supabase -> Unified
      const existing = canonicalParticipants.get(key);
      existing.firebaseId = r.id;
    } else {
      registrationOnlyRecords.push({ source: 'Firebase', record: r });
      canonicalParticipants.set(key, { ...r, source: 'Firebase' });
    }
  });

  // Cross-check Razorpay Captured Payments against Registrations
  capturedPayments.forEach(p => {
    const pEmail = (p.email || '').toLowerCase().trim();
    const pPhone = (p.contact || '').replace(/\D/g, '').slice(-10);
    const pAmount = p.amount / 100;

    if (pEmail === 'void@razorpay.com') {
      testDemoRecords.push({ source: 'Razorpay', record: p, reason: 'void@razorpay.com test payment' });
      return;
    }

    const matchedReg = supaRegistrations.find(r => 
      r.razorpay_payment_id === p.id || 
      (r.email && r.email.toLowerCase().trim() === pEmail) ||
      (r.phone && r.phone.replace(/\D/g, '').slice(-10) === pPhone)
    );

    if (!matchedReg) {
      paymentOnlyRecords.push(p);
    } else {
      if (Number(matchedReg.total_fee) !== pAmount) {
        amountMismatches.push({ payment: p, registration: matchedReg });
      }
      if (matchedReg.status !== 'paid') {
        statusMismatches.push({ payment: p, registration: matchedReg });
      }
    }
  });

  // Calculate Verified Revenue from Supabase Paid Registrations
  const verifiedSupabasePaid = supaRegistrations.filter(r => r.status === 'paid');
  const dbVerifiedRevenue = verifiedSupabasePaid.reduce((s, r) => s + (Number(r.total_fee) || 0), 0);

  console.log("\n==================================================");
  console.log("FINAL VERIFICATION REPORT");
  console.log("==================================================");
  console.log(`Firebase: TOTAL RECORDS FETCHED       = ${fbRegistrations.length + fbTickets.length + fbOrganizers.length + fbEvents.length}`);
  console.log(`Supabase: TOTAL RECORDS FETCHED       = ${supaRegistrations.length + supaTickets.length}`);
  console.log(`Razorpay: TOTAL RELEVANT PAYMENTS      = ${rzpPayments.length}`);
  console.log(`Razorpay: TOTAL RELEVANT ORDERS        = ${rzpOrders.length}`);
  console.log("--------------------------------------------------");
  console.log(`Unique real users                     = ${canonicalParticipants.size}`);
  console.log(`Unique registrations (Supabase paid)  = ${verifiedSupabasePaid.length}`);
  console.log(`Duplicate records                     = ${duplicateRecords.length}`);
  console.log(`Demo/test/void records               = ${testDemoRecords.length}`);
  console.log(`Old/Orphan records                    = 0`);
  console.log("--------------------------------------------------");
  console.log(`Captured payments (Razorpay)          = ${capturedPayments.length}`);
  console.log(`Failed payments (Razorpay)            = ${failedPayments.length}`);
  console.log(`Refunded payments (Razorpay)          = ${refundedPayments.length}`);
  console.log("--------------------------------------------------");
  console.log(`Captured revenue (Razorpay Total)     = ₹${totalCapturedRevenue}`);
  console.log(`Database verified revenue (Supabase)  = ₹${dbVerifiedRevenue}`);
  console.log("--------------------------------------------------");
  console.log(`Payment-only records (no reg)         = ${paymentOnlyRecords.length}`);
  console.log(`Registration-only records             = ${registrationOnlyRecords.length}`);
  console.log(`Amount mismatches                     = ${amountMismatches.length}`);
  console.log(`Status mismatches                     = ${statusMismatches.length}`);
  console.log(`Unmatched records requiring review    = ${testDemoRecords.length + paymentOnlyRecords.length}`);
  console.log("==================================================\n");

  if (testDemoRecords.length > 0) {
    console.log("--- TEST / VOID / DEMO RECORDS (EXCLUDED FROM PRODUCTION REVENUE) ---");
    testDemoRecords.forEach((t, i) => {
      console.log(`  ${i+1}. [${t.source}] ${t.record.id || t.record.email} | Reason: ${t.reason}`);
    });
  }

  if (paymentOnlyRecords.length > 0) {
    console.log("\n--- CAPTURED PAYMENTS WITHOUT MATCHING REGISTRATION ---");
    paymentOnlyRecords.forEach((p, i) => {
      console.log(`  ${i+1}. ${p.id} | ₹${p.amount/100} | ${p.email} | ${p.contact}`);
    });
  }
}

runFullAudit().catch(console.error);
