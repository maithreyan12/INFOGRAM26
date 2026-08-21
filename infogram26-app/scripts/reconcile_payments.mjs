/**
 * Razorpay → Supabase Reconciliation Script
 * Finds captured Razorpay payments missing from Supabase and recovers them.
 * Run: node scripts/reconcile_payments.mjs
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
    const options = {
      hostname: 'api.razorpay.com',
      path,
      headers: { Authorization: `Basic ${auth}` },
    };
    https.get(options, (res) => {
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

async function main() {
  console.log('🔍 Fetching all captured Razorpay payments...');
  const payments = await getAllCapturedPayments();
  console.log(`✅ Razorpay: ${payments.length} captured payments`);
  const razorTotal = payments.reduce((s, p) => s + p.amount / 100, 0);
  console.log(`💰 Razorpay total: ₹${razorTotal}`);

  console.log('\n🔍 Fetching Supabase paid registrations...');
  const { data: supaRegs, error } = await supabase
    .from('registrations')
    .select('id, applicant_id, email, phone, razorpay_payment_id, total_fee, status')
    .eq('status', 'paid');

  if (error) { console.error('Supabase error:', error); return; }
  console.log(`✅ Supabase: ${supaRegs.length} paid registrations`);
  const supaTotal = supaRegs.reduce((s, r) => s + (r.total_fee || 0), 0);
  console.log(`💰 Supabase total: ₹${supaTotal}`);

  // Build set of known Razorpay payment IDs in Supabase
  const knownPayIds = new Set(supaRegs.map((r) => r.razorpay_payment_id).filter(Boolean));
  const knownEmails = new Set(supaRegs.map((r) => (r.email || '').toLowerCase().trim()));
  const knownPhones = new Set(supaRegs.map((r) => (r.phone || '').replace(/\s/g, '')));

  console.log('\n🔍 Finding missing payments...');
  const missing = payments.filter((p) => {
    const email = (p.email || '').toLowerCase().trim();
    const phone = (p.contact || '').replace(/\s/g, '');
    const isVoid = email === 'void@razorpay.com';
    return (
      !knownPayIds.has(p.id) &&
      !isVoid &&
      !knownEmails.has(email) &&
      !knownPhones.has(phone)
    );
  });

  // Also flag void@ payments (phone-only, need phone match)
  const voidPayments = payments.filter((p) => {
    const email = (p.email || '').toLowerCase().trim();
    const phone = (p.contact || '').replace(/\s/g, '');
    return email === 'void@razorpay.com' && !knownPhones.has(phone) && !knownPayIds.has(p.id);
  });

  console.log(`\n❌ Missing from Supabase: ${missing.length + voidPayments.length} payments`);
  console.log('\n--- Regular missing (by email/phone) ---');
  missing.forEach((p) => {
    console.log(`  ${p.id} | ₹${p.amount / 100} | ${p.email} | ${p.contact}`);
  });
  console.log('\n--- void@razorpay.com (phone-pay, phone not matched) ---');
  voidPayments.forEach((p) => {
    console.log(`  ${p.id} | ₹${p.amount / 100} | phone: ${p.contact}`);
  });

  const totalMissing = [...missing, ...voidPayments].reduce((s, p) => s + p.amount / 100, 0);
  console.log(`\n💸 Missing revenue: ₹${totalMissing}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Razorpay:  ${payments.length} payments | ₹${razorTotal}`);
  console.log(`   Supabase:  ${supaRegs.length} registrations | ₹${supaTotal}`);
  console.log(`   Gap:       ${missing.length + voidPayments.length} payments | ₹${totalMissing}`);
}

main().catch(console.error);
