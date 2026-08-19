import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

export async function GET() {
  const { data: regs } = await supabaseAdmin.from('registrations').select('id, status, total_fee, applicant_id, full_name, email');
  const paid = (regs || []).filter((r: any) => r.status === 'paid');
  const pending = (regs || []).filter((r: any) => r.status !== 'paid');
  const totalRevenue = paid.reduce((s: number, r: any) => s + (r.total_fee || 0), 0);
  return NextResponse.json({ paid: paid.length, pending: pending.length, totalRevenue, paidList: paid, pendingList: pending.map((r: any) => ({ id: r.id, applicant_id: r.applicant_id, full_name: r.full_name, email: r.email })) });
}

export async function DELETE() {
  try {
    // Step 1: Get all pending IDs
    const { data: pending, error: fetchErr } = await supabaseAdmin
      .from('registrations')
      .select('id, applicant_id, full_name, email')
      .neq('status', 'paid');
    if (fetchErr) throw new Error('Fetch error: ' + fetchErr.message);

    const pendingIds = (pending || []).map((r: any) => r.id);
    console.log('Pending IDs to delete:', pendingIds.length, pendingIds.join(', '));

    if (pendingIds.length === 0) {
      return NextResponse.json({ success: true, deleted: 0, message: 'No pending registrations to delete' });
    }

    // Step 2: Delete one by one to see which fail
    let deleted = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const id of pendingIds) {
      const { error: delErr, count } = await supabaseAdmin
        .from('registrations')
        .delete({ count: 'exact' })
        .eq('id', id);
      if (delErr) {
        errors.push(`${id}: ${delErr.message}`);
        failed++;
      } else {
        deleted++;
      }
    }

    const { data: paidRegs } = await supabaseAdmin.from('registrations').select('total_fee').eq('status', 'paid');
    const totalRevenue = (paidRegs || []).reduce((s: number, r: any) => s + (r.total_fee || 0), 0);
    const { data: remaining } = await supabaseAdmin.from('registrations').select('id').neq('status', 'paid');

    return NextResponse.json({ 
      success: true, 
      attempted: pendingIds.length,
      deleted, 
      failed,
      stillRemaining: (remaining || []).length,
      errors: errors.slice(0, 5),
      paidCount: (paidRegs || []).length, 
      totalRevenue 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
