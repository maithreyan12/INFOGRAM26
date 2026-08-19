import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [regsResult, ticketsResult] = await Promise.all([
      supabaseAdmin
        .from('registrations')
        .select('*')
        .eq('status', 'paid')
        .order('paid_at', { ascending: false }),
      supabaseAdmin
        .from('tickets')
        .select('*')
        .eq('status', 'valid')
        .order('issue_date', { ascending: false }),
    ]);

    const registrations = (regsResult.data || []).map((r: any) => ({
      id: r.id,
      applicantId: r.applicant_id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      college: r.college,
      department: r.department,
      year: r.year,
      events: r.events || [],
      eventNames: r.events || [],
      totalFee: r.total_fee || 0,
      status: r.status,
      razorpayPaymentId: r.razorpay_payment_id,
      razorpayOrderId: r.razorpay_order_id,
      paidAt: r.paid_at,
      createdAt: r.created_at,
    }));

    const tickets = (ticketsResult.data || []).map((t: any) => ({
      id: t.id,
      ticketNumber: t.ticket_number,
      applicantId: t.applicant_id,
      registrationId: t.registration_id,
      studentName: t.student_name,
      email: t.email,
      phone: t.phone,
      college: t.college,
      department: t.department,
      year: t.year,
      events: t.events || [],
      totalAmount: t.total_amount || 0,
      razorpayPaymentId: t.razorpay_payment_id,
      status: t.status,
      issueDate: t.issue_date,
    }));

    const eventSlots: Record<string, number> = {};
    for (const reg of registrations) {
      for (const evt of (reg.events || [])) {
        const key = String(evt).trim();
        if (key) eventSlots[key] = (eventSlots[key] || 0) + 1;
      }
    }

    const totalRevenue = registrations.reduce((s: number, r: any) => s + (r.totalFee || 0), 0);

    return NextResponse.json({
      success: true,
      registrations,
      tickets,
      stats: {
        totalPaid: registrations.length,
        totalRevenue,
        totalTickets: tickets.length,
        eventSlots,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[/api/admin/live] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
