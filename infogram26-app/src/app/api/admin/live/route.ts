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

    // Fetch organizers count from Firestore if possible
    let organizersCount = 0;
    try {
      const { db } = await import('@/lib/firebase/config');
      if (db) {
        const { collection, getDocs } = await import('firebase/firestore');
        const orgsSnap = await getDocs(collection(db, 'organizers'));
        organizersCount = orgsSnap.size;
      }
    } catch {
      organizersCount = 0;
    }

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
      paymentMethod: t.payment_method || 'UPI',
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

    // Calculate Payment Method Stats
    const paymentMethods: Record<string, number> = {
      upi: 0,
      wallet: 0,
      netbanking: 0,
      card: 0,
      other: 0,
    };

    tickets.forEach((t: any) => {
      const method = (t.paymentMethod || 'upi').toLowerCase();
      if (method.includes('upi')) paymentMethods.upi++;
      else if (method.includes('wallet')) paymentMethods.wallet++;
      else if (method.includes('netbank') || method.includes('bank')) paymentMethods.netbanking++;
      else if (method.includes('card')) paymentMethods.card++;
      else paymentMethods.upi++; // default majority UPI
    });

    return NextResponse.json({
      success: true,
      registrations,
      tickets,
      stats: {
        totalPaid: registrations.length,
        totalRevenue,
        totalTickets: tickets.length,
        organizersCount,
        eventSlots,
        paymentMethods,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[/api/admin/live] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
