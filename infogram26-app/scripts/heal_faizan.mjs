import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fipoazwipiahfkttgwew.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcG9hendpcGlhaGZrdHRnd2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODc5ODEsImV4cCI6MjEwMjQ2Mzk4MX0.lx-wiLCzg90mzsliCeYh5IvBOtwmHWs-dIL20fCQ3zA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('⚡ Healing Mohammed Faizan (INFO26-QSTX-30555) in Supabase...');

  // 1. Update registration status to 'paid'
  const { data: updatedReg, error: regErr } = await supabase
    .from('registrations')
    .update({
      status: 'paid',
      razorpay_payment_id: 'pay_manual_reconcile_faizan',
      paid_at: new Date().toISOString(),
    })
    .eq('email', 'mohdfaizanfaizu786@gmail.com')
    .select();

  console.log('✅ Supabase Registration Updated:', updatedReg, 'Error:', regErr);

  // 2. Create official valid ticket pass in Supabase tickets table
  const ticketId = 'tkt_INFO26-QSTX-30555';
  const ticketNumber = 'TKT-QSTX-30555';
  const qrData = JSON.stringify({
    ticketNumber,
    applicantId: 'INFO26-QSTX-30555',
    name: 'Mohammed faizan',
    events: ['Quest X', 'Fun Fiesta'],
    verified: true,
  });

  const { data: createdTkt, error: tktErr } = await supabase.from('tickets').upsert([
    {
      id: ticketId,
      ticket_number: ticketNumber,
      applicant_id: 'INFO26-QSTX-30555',
      registration_id: 'SOrNtS85NAjUIGOaE4xK',
      student_name: 'Mohammed faizan',
      email: 'mohdfaizanfaizu786@gmail.com',
      phone: '6382013260',
      college: 'Islamiah college vaniyambadi',
      department: 'Bsc computer science',
      year: '3rd',
      events: ['Quest X', 'Fun Fiesta'],
      total_amount: 100,
      payment_method: 'razorpay',
      razorpay_payment_id: 'pay_manual_reconcile_faizan',
      qr_data: qrData,
      status: 'valid',
      issue_date: new Date().toISOString(),
    },
  ]).select();

  console.log('✅ Supabase Ticket Created:', createdTkt, 'Error:', tktErr);
  process.exit(0);
}

main().catch(console.error);
