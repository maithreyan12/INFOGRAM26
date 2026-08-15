import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency = 'INR',
      receipt,
      registrationId,
      // full registration data for notes (webhook recovery)
      name,
      email,
      phone,
      college,
      department,
      year,
      events,
      applicantId,
    } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    // Build notes with full registration data so webhook can recover even if Firestore lookup fails
    const notes: Record<string, string> = {
      registrationId: registrationId || '',
      applicantId: applicantId || '',
      name: name || '',
      email: email || '',
      phone: String(phone || ''),
      college: college || '',
      department: department || '',
      year: year || '',
      events: Array.isArray(events) ? events.join(', ') : (events || ''),
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // amount in paise
        currency,
        receipt: receipt || `rcpt_${registrationId}`,
        notes,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.description || 'Failed to create Razorpay order');
    }

    // Save the Razorpay orderId back to the Firestore registration document
    // so the webhook can look it up later even if the frontend callback never runs
    if (registrationId && registrationId !== 'mock_reg_123') {
      try {
        const { db } = await import('@/lib/firebase/config');
        const { doc, updateDoc } = await import('firebase/firestore');
        if (db) {
          await updateDoc(doc(db, 'registrations', registrationId), {
            razorpayOrderId: data.id,
            paymentStatus: 'pending',
          });
          console.log(`✅ Saved razorpayOrderId ${data.id} to registration ${registrationId}`);
        }
      } catch (dbErr) {
        console.warn('Could not save orderId to Firestore (non-fatal):', dbErr);
      }
    }

    return NextResponse.json({
      ...data,
      keyId,
    });
  } catch (error: any) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
