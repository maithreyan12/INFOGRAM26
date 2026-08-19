import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: regs, error } = await supabaseAdmin
      .from('registrations')
      .select('events')
      .eq('status', 'paid');

    if (error) throw error;

    const eventSlots: Record<string, number> = {};

    (regs || []).forEach((r: any) => {
      (r.events || []).forEach((evt: string) => {
        const rawName = String(evt).trim();
        if (!rawName) return;

        // Count exact raw name
        eventSlots[rawName] = (eventSlots[rawName] || 0) + 1;

        // Also count normalized lowercase alphanumeric key
        const normKey = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normKey && normKey !== rawName) {
          eventSlots[normKey] = (eventSlots[normKey] || 0) + 1;
        }
      });
    });

    return NextResponse.json({
      success: true,
      eventSlots,
      totalPaidRegistrations: (regs || []).length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[/api/events/slots] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
