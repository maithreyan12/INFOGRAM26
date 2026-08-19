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
        const key = String(evt).trim();
        if (key) {
          eventSlots[key] = (eventSlots[key] || 0) + 1;
        }
      });
    });

    return NextResponse.json({
      success: true,
      eventSlots,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
