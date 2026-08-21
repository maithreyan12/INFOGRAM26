import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TPacWV4BbmByiW';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'ch33dn9aTpclea4ptqaKCMtT';

function generateApplicantId(event?: string) {
  const codes: Record<string, string> = {
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

async function fetchRazorpayPayments() {
  const authStr = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
  const allPayments: any[] = [];
  let skip = 0;

  while (true) {
    const res = await fetch(`https://api.razorpay.com/v1/payments?count=100&skip=${skip}&status=captured`, {
      headers: { Authorization: `Basic ${authStr}` },
      cache: 'no-store',
    });
    if (!res.ok) break;
    const json = await res.json();
    const items = json.items || [];
    allPayments.push(...items);
    if (items.length < 100) break;
    skip += 100;
  }
  return allPayments;
}

export async function GET() {
  try {
    return await reconcileLogic();
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    return await reconcileLogic();
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

async function reconcileLogic() {
  const razorPayments = await fetchRazorpayPayments();
  const razorTotalAmount = razorPayments.reduce((s, p) => s + (p.amount / 100), 0);

  // 1. Fetch current Supabase paid registrations
  const { data: supaRegs, error: supaErr } = await supabaseAdmin
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (supaErr) {
    return NextResponse.json({ success: false, error: supaErr.message }, { status: 500 });
  }

  const paidRegs = (supaRegs || []).filter((r: any) => r.status === 'paid');
  const knownPayIds = new Set(paidRegs.map((r: any) => r.razorpay_payment_id).filter(Boolean));
  const knownEmails = new Set(paidRegs.map((r: any) => (r.email || '').toLowerCase().trim()));
  const knownPhones = new Set(paidRegs.map((r: any) => (r.phone || '').replace(/\D/g, '').slice(-10)));

  // 2. Identify missing captured payments (skipping void@ duplicate tests)
  const missingPayments = razorPayments.filter((p: any) => {
    const email = (p.email || '').toLowerCase().trim();
    const phone = (p.contact || '').replace(/\D/g, '').slice(-10);
    const isVoid = email === 'void@razorpay.com';

    if (isVoid) return false;

    return (
      !knownPayIds.has(p.id) &&
      !knownEmails.has(email) &&
      (!phone || !knownPhones.has(phone))
    );
  });

  // 3. Update pending registrations if matching email/fee exists
  let recoveredCount = 0;
  const pendingRegs = (supaRegs || []).filter((r: any) => r.status === 'pending_payment');

  for (const p of razorPayments) {
    const pEmail = (p.email || '').toLowerCase().trim();
    const pAmount = p.amount / 100;
    if (pEmail === 'void@razorpay.com') continue;

    const matchedPending = pendingRegs.find(
      (r: any) => (r.email || '').toLowerCase().trim() === pEmail && Number(r.total_fee) === pAmount
    );

    if (matchedPending) {
      // Update registration to paid
      await supabaseAdmin
        .from('registrations')
        .update({
          status: 'paid',
          razorpay_payment_id: p.id,
          razorpay_order_id: p.order_id || '',
          paid_at: new Date(p.created_at * 1000).toISOString(),
        })
        .eq('id', matchedPending.id);

      // Create ticket
      const ticketId = `tkt_${matchedPending.id}`;
      const ticketNum = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      await supabaseAdmin.from('tickets').upsert([
        {
          id: ticketId,
          ticket_number: ticketNum,
          applicant_id: matchedPending.applicant_id,
          registration_id: matchedPending.id,
          student_name: matchedPending.full_name || 'Participant',
          email: matchedPending.email || '',
          phone: matchedPending.phone || '',
          college: matchedPending.college || 'Participant',
          department: matchedPending.department || 'IT',
          year: matchedPending.year || '1st',
          events: matchedPending.events || [],
          total_amount: pAmount,
          payment_method: p.method || 'razorpay',
          razorpay_payment_id: p.id,
          status: 'valid',
          issue_date: new Date().toISOString(),
        },
      ]);
      recoveredCount++;
    }
  }

  // 4. Recover completely missing registrations
  for (const p of missingPayments) {
    const email = (p.email || '').toLowerCase().trim();
    const phone = (p.contact || '').replace(/\D/g, '').slice(-10);
    const amount = p.amount / 100;

    let notes: Record<string, any> = {};
    if (p.order_id) {
      try {
        const authStr = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${p.order_id}`, {
          headers: { Authorization: `Basic ${authStr}` },
        });
        if (orderRes.ok) {
          const orderJson = await orderRes.json();
          notes = orderJson.notes || {};
        }
      } catch {}
    }

    const name = notes.name || p.description || 'Participant';
    const college = notes.college || 'College Participant';
    const department = notes.department || 'Information Technology';
    const year = notes.year || '1st';
    const events = notes.events ? notes.events.split(', ').filter(Boolean) : ['Symposium Event'];
    const applicantId = notes.applicantId || `INFO26-REC-${p.id.slice(-8).toUpperCase()}`;
    const regId = `reg_recovery_${p.id}`;

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

    const { error: insErr } = await supabaseAdmin.from('registrations').insert(insertPayload);
    if (!insErr) {
      const ticketId = `tkt_${regId}`;
      const ticketNum = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      await supabaseAdmin.from('tickets').upsert([
        {
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
          payment_method: p.method || 'razorpay',
          razorpay_payment_id: p.id,
          status: 'valid',
          issue_date: new Date().toISOString(),
        },
      ]);
      recoveredCount++;
    }
  }

  // 5. Query final stats
  const { data: finalRegs } = await supabaseAdmin
    .from('registrations')
    .select('total_fee')
    .eq('status', 'paid');

  const finalPaidCount = (finalRegs || []).length;
  const finalPaidRevenue = (finalRegs || []).reduce((s: number, r: any) => s + (r.total_fee || 0), 0);

  return NextResponse.json({
    success: true,
    reconciledAt: new Date().toISOString(),
    razorpay: {
      totalCapturedCount: razorPayments.length,
      totalCapturedAmount: razorTotalAmount,
    },
    supabase: {
      totalPaidCount: finalPaidCount,
      totalPaidRevenue: finalPaidRevenue,
    },
    recoveredCount,
    message: `Reconciliation complete. ${recoveredCount} records recovered/synced.`,
  });
}
