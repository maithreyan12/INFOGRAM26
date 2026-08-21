/**
 * Full Database Fetch + Recover Missing Payments
 * Shows all 117 Supabase registrations AND recovers 6 missing ones from Razorpay
 * Run: node scripts/full_db_fetch.mjs
 */
import { createClient } from '@supabase/supabase-js';
import https from 'https';

const RAZORPAY_KEY_ID = 'rzp_live_TPacWV4BbmByiW';
const RAZORPAY_KEY_SECRET = 'ch33dn9aTpclea4ptqaKCMtT';
const SUPABASE_URL = 'https://fipoazwipiahfkttgwew.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcG9hendpcGlhaGZrdHRnd2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODc5ODEsImV4cCI6MjEwMjQ2Mzk4MX0.lx-wiLCzg90mzsliCeYh5IvBOtwmHWs-dIL20fCQ3zA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

function fetchRazorpay(path) {
  return new Promise((resolve, reject) => {
    https.get({ hostname: 'api.razorpay.com', path, headers: { Authorization: `Basic ${auth}` } }, (res) => {
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function getAllCapturedPayments() {
  const all = [];
  let skip = 0;
  while (true) {
    const res = await fetchRazorpay(`/v1/payments?count=100&skip=${skip}&status=captured`);
    const items = res.items || [];
    all.push(...items);
    if (items.length < 100) break;
    skip += 100;
  }
  return all;
}

function generateApplicantId(event) {
  const codes = {
    'tech talks': 'TALK', 'codestorm': 'CODE', 'pixel craft': 'PIXL',
    'open source': 'OPEN', 'byte battle': 'BYTE', 'hack forge': 'HACK',
    'clash of minds': 'CLSH', 'mind matrix': 'MNDX', 'quest x': 'QSTX',
    'frame craft': 'FRAM', 'fun fiesta': 'FEST', 'flavour fusion': 'FLVR',
    'mic drop': 'MICR', 'artistry': 'ARTS', 'reel it feel it': 'REEL',
    'battle verse': 'BVRS',
  };
  const key = (event || '').toLowerCase().trim();
  const code = codes[key] || 'NATX';
  const num = Math.floor(10000 + Math.random() * 89999);
  return `INFO26-${code}-${num}`;
}

async function main() {
  console.log('=' .repeat(70));
  console.log('INFOGRAM\'26 — FULL DATABASE FETCH & RECONCILIATION');
  console.log('='.repeat(70));

  // 1. Fetch all from Supabase
  const { data: allRegs, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('Supabase error:', error); return; }

  const paid = allRegs.filter(r => r.status === 'paid');
  console.log(`\n📦 SUPABASE: ${allRegs.length} total | ${paid.length} paid`);
  console.log(`💰 Total revenue in Supabase: ₹${paid.reduce((s, r) => s + (r.total_fee || 0), 0)}`);

  console.log('\n--- ALL PAID REGISTRATIONS ---');
  paid.forEach((r, i) => {
    console.log(`${String(i+1).padStart(3)}. ${r.applicant_id || r.id} | ${r.full_name} | ${r.email} | ₹${r.total_fee} | ${(r.events||[]).join(', ')}`);
  });

  // 2. Fetch all Razorpay captured
  console.log('\n🔍 Fetching Razorpay...');
  const payments = await getAllCapturedPayments();
  const razorTotal = payments.reduce((s, p) => s + p.amount / 100, 0);
  console.log(`✅ Razorpay: ${payments.length} captured | ₹${razorTotal}`);

  // 3. Find missing
  const knownPayIds = new Set(paid.map(r => r.razorpay_payment_id).filter(Boolean));
  const knownEmails = new Set(paid.map(r => (r.email || '').toLowerCase().trim()));
  const knownPhones = new Set(paid.map(r => (r.phone || '').replace(/\D/g, '').slice(-10)));

  const missing = payments.filter(p => {
    const email = (p.email || '').toLowerCase().trim();
    const phone = (p.contact || '').replace(/\D/g, '').slice(-10);
    const isVoid = email === 'void@razorpay.com';
    if (isVoid) return false; // skip void for now
    return !knownPayIds.has(p.id) && !knownEmails.has(email) && !knownPhones.has(phone);
  });

  console.log(`\n❌ Missing regular payments: ${missing.length}`);
  missing.forEach(p => console.log(`  ${p.id} | ₹${p.amount/100} | ${p.email} | ${p.contact}`));

  // 4. Recover missing payments → insert into Supabase
  console.log('\n🔧 Recovering missing payments into Supabase...');
  let recovered = 0;
  for (const p of missing) {
    // Fetch order details to get registration notes
    let notes = {};
    try {
      if (p.order_id) {
        const orderRes = await fetchRazorpay(`/v1/orders/${p.order_id}`);
        notes = orderRes.notes || {};
      }
    } catch {}

    const email = (p.email || '').toLowerCase().trim();
    const phone = (p.contact || '').replace(/\D/g, '').slice(-10);
    const name = notes.name || p.description || 'Participant';
    const college = notes.college || 'Participant';
    const department = notes.department || 'IT';
    const year = notes.year || '1st';
    const events = notes.events ? notes.events.split(', ').filter(Boolean) : ['Symposium Event'];
    const amount = p.amount / 100;
    const applicantId = notes.applicantId || `INFO26-REC-${p.id.slice(-8).toUpperCase()}`;
    // Use payment ID as the registration ID (same pattern as existing records)
    const regId = `reg_recovery_${p.id}`;

    // Insert registration — let Supabase auto-generate the UUID id
    const insertPayload = {
      id: regId,
      applicant_id: applicantId,
      full_name: name,
      email,
      phone,
      college,
      department,
      year,
      events,
      total_fee: amount,
      status: 'paid',
      razorpay_payment_id: p.id,
      razorpay_order_id: p.order_id || '',
      paid_at: new Date(p.created_at * 1000).toISOString(),
    };
    const { data: newReg, error: regErr } = await supabase.from('registrations').insert(insertPayload).select().single();

    if (regErr) {
      console.log(`  ❌ Failed to insert ${email}: ${regErr.message}`);
      continue;
    }

    // Insert ticket
    const ticketId = `tkt_${regId}`;
    const ticketNum = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    await supabase.from('tickets').upsert({
      id: ticketId,
      ticket_number: ticketNum,
      applicant_id: applicantId,
      registration_id: regId,
      student_name: name,
      email,
      phone,
      college,
      department,
      year,
      events,
      total_amount: amount,
      payment_method: 'razorpay',
      razorpay_payment_id: p.id,
      status: 'valid',
      issue_date: new Date().toISOString(),
    });

    console.log(`  ✅ Recovered: ${applicantId} | ${name} | ${email} | ₹${amount}`);
    recovered++;
  }

  // 5. Final summary
  console.log('\n' + '='.repeat(70));
  console.log(`✅ Recovered ${recovered} missing payments`);
  const { data: finalPaid } = await supabase.from('registrations').select('total_fee').eq('status', 'paid');
  const finalTotal = (finalPaid || []).reduce((s, r) => s + (r.total_fee || 0), 0);
  console.log(`📊 Supabase now: ${(finalPaid || []).length} paid | ₹${finalTotal}`);
  console.log(`📊 Razorpay:     ${payments.length} captured | ₹${razorTotal}`);
  console.log('='.repeat(70));
}

main().catch(console.error);
