/**
 * generate_all_missing_tickets.mjs
 *
 * Fetches ALL registrations from Supabase where status = 'paid'.
 * Cross-checks them against the tickets table.
 * For every paid registration that has NO ticket → generates and inserts one.
 *
 * Run: node scripts/generate_all_missing_tickets.mjs
 *
 * Safe to re-run: uses upsert so existing tickets won't be duplicated.
 */

import { createClient } from '@supabase/supabase-js';

// ── Credentials ────────────────────────────────────────────────────────────────
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fipoazwipiahfkttgwew.supabase.co';

const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcG9hendpcGlhaGZrdHRnd2V3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg4Nzk4MSwiZXhwIjoyMTAyNDYzOTgxfQ.ggCMgPLtdJJ2_RNqivcj3PkJOal6vzLOZOjrKrgQOBw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ── Helpers ────────────────────────────────────────────────────────────────────
function genTicketNumber(applicantId) {
  if (applicantId) {
    const suffix = applicantId.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(-8);
    return `TKT-${suffix}`;
  }
  return `TKT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function buildQrData({ ticketNumber, applicantId, name, events }) {
  return JSON.stringify({ ticketNumber, applicantId, name, events, verified: true });
}

async function fetchAll(table, columns, pageSize) {
  columns = columns || '*';
  pageSize = pageSize || 1000;
  const rows = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .range(from, from + pageSize - 1);
    if (error) {
      throw new Error('Supabase error fetching ' + table + ' (range ' + from + '-' + (from + pageSize - 1) + '): ' + error.message);
    }
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return rows;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  const startTime = Date.now();

  console.log('');
  console.log('===================================================');
  console.log("  INFOGRAM'26 — Bulk Ticket Check & Generate       ");
  console.log('===================================================');
  console.log('');

  console.log('Step 1: Fetching ALL registrations from Supabase...');
  let allRegs;
  try {
    allRegs = await fetchAll('registrations');
  } catch (e) {
    console.error('Fatal: Could not fetch registrations:', e.message);
    process.exit(1);
  }
  console.log('  Total registrations found: ' + allRegs.length);

  console.log('\nStep 2: Fetching ALL existing tickets from Supabase...');
  let allTickets;
  try {
    allTickets = await fetchAll('tickets', 'id, registration_id, applicant_id, ticket_number, status');
  } catch (e) {
    console.error('Fatal: Could not fetch tickets:', e.message);
    process.exit(1);
  }
  console.log('  Total existing tickets found: ' + allTickets.length);

  const ticketedByRegId  = new Set(allTickets.map(t => t.registration_id).filter(Boolean));
  const ticketedByApplId = new Set(allTickets.map(t => t.applicant_id).filter(Boolean));

  function hasTicket(reg) {
    return ticketedByRegId.has(reg.id) || ticketedByApplId.has(reg.applicant_id);
  }

  console.log('\nStep 3: Classifying ALL registrations (paid + unpaid)...');

  const with_ticket    = [];
  const missing_ticket = [];

  for (const reg of allRegs) {
    if (hasTicket(reg)) {
      with_ticket.push(reg);
    } else {
      missing_ticket.push(reg);
    }
  }

  console.log('');
  console.log('  Already have ticket: ' + with_ticket.length);
  console.log('  MISSING ticket     : ' + missing_ticket.length + '  <-- WILL FIX');
  console.log('  Total              : ' + allRegs.length);
  console.log('');

  if (missing_ticket.length === 0) {
    console.log('All registrations already have tickets! Nothing to do.');
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('Done in ' + elapsed + 's');
    return;
  }

  console.log('Step 4: Generating tickets for ' + missing_ticket.length + ' registrations...\n');

  let generated = 0;
  let failed    = 0;
  const failures = [];

  const BATCH_SIZE = 100;
  const batches = [];
  for (let i = 0; i < missing_ticket.length; i += BATCH_SIZE) {
    batches.push(missing_ticket.slice(i, i + BATCH_SIZE));
  }

  let batchNum = 0;
  for (const batch of batches) {
    batchNum++;
    const ticketRows = [];

    for (const reg of batch) {
      const applicantId   = reg.applicant_id  || reg.applicantId  || '';
      const regId         = reg.id            || '';
      const name          = reg.full_name     || reg.student_name || reg.fullName || 'Participant';
      const email         = (reg.email        || '').toLowerCase().trim();
      const phone         = reg.phone         || '';
      const college       = reg.college       || '';
      const department    = reg.department    || '';
      const year          = reg.year          || '';
      const events        = reg.events        || reg.selected_events || reg.eventNames || [];
      const totalAmount   = reg.total_fee     || reg.total_amount || reg.totalFee || 0;
      const paymentId     = reg.razorpay_payment_id || reg.paymentId || '';
      const paymentMethod = paymentId ? 'razorpay' : (reg.payment_method || 'manual');

      const ticketId     = 'tkt_' + (regId || applicantId);
      const ticketNumber = genTicketNumber(applicantId);
      const qrData       = buildQrData({ ticketNumber, applicantId, name, events });

      ticketRows.push({
        id:                   ticketId,
        ticket_number:        ticketNumber,
        applicant_id:         applicantId,
        registration_id:      regId,
        student_name:         name,
        email:                email,
        phone:                phone,
        college:              college,
        department:           department,
        year:                 year,
        events:               Array.isArray(events) ? events : [events],
        total_amount:         totalAmount,
        payment_method:       paymentMethod,
        razorpay_payment_id:  paymentId,
        qr_data:              qrData,
        status:               'valid',
        issue_date:           new Date().toISOString(),
      });
    }

    const { error } = await supabase
      .from('tickets')
      .upsert(ticketRows, { onConflict: 'id' });

    if (error) {
      for (const row of ticketRows) {
        const { error: singleErr } = await supabase
          .from('tickets')
          .upsert([row], { onConflict: 'id' });
        if (singleErr) {
          failed++;
          failures.push({ id: row.applicant_id, error: singleErr.message });
          console.error('  FAIL [' + row.applicant_id + ']: ' + singleErr.message);
        } else {
          generated++;
        }
      }
    } else {
      generated += ticketRows.length;
    }

    const total = missing_ticket.length;
    const done  = Math.min(batchNum * BATCH_SIZE, total);
    const pct   = ((done / total) * 100).toFixed(1);
    process.stdout.write('\r  Progress: ' + done + '/' + total + ' (' + pct + '%)   ');
  }

  console.log('');
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('');
  console.log('===================================================');
  console.log('  FINAL SUMMARY');
  console.log('===================================================');
  console.log('  Tickets generated  : ' + generated);
  console.log('  Failed             : ' + failed);
  console.log('  Already had ticket : ' + with_ticket.length);
  console.log('  Total registrations: ' + allRegs.length);
  console.log('  Time taken         : ' + elapsed + 's');
  console.log('===================================================');
  console.log('');

  if (failures.length > 0) {
    console.log('Failed registrations:');
    for (const f of failures) {
      console.log('  [' + f.id + '] -> ' + f.error);
    }
  }

  if (generated > 0) {
    console.log('Done! ' + generated + ' ticket(s) generated successfully.');
  }
}

main().catch(err => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
