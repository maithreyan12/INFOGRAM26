import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!webhookUrl) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Sheets webhook error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }
}
