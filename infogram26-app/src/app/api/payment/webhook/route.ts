import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Razorpay Webhook Handler (Step 5)
 * 
 * Catches `payment.captured` events as a backup confirmation path
 * in case the frontend handler never fires (browser closed mid-payment, etc.)
 * 
 * Setup in Razorpay Dashboard → Settings → Webhooks:
 *   URL:    https://infogram26.in/api/payment/webhook
 *   Events: payment.captured
 *   Secret: (set RAZORPAY_WEBHOOK_SECRET in env vars)
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // If no webhook secret configured, skip verification but log
    if (!webhookSecret) {
      console.warn('RAZORPAY_WEBHOOK_SECRET not configured — webhook signature not verified');
      return NextResponse.json({ status: 'ok', verified: false });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Webhook signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload?.payment?.entity;
      const paymentId = payment?.id;
      const orderId = payment?.order_id;
      const email = payment?.email;
      const contact = payment?.contact;
      const amount = payment?.amount ? payment.amount / 100 : 50;

      console.log('✅ Server-Side Webhook: payment.captured received:', {
        paymentId,
        orderId,
        amount,
        email,
        contact,
      });

      // Server-side Firestore update if DB configured
      try {
        const { db } = await import('@/lib/firebase/config');
        const { collection, query, where, getDocs, updateDoc, doc, setDoc } = await import('firebase/firestore');

        if (db) {
          let regDoc: any = null;

          // 1. Find matching registration by orderId, email, or phone
          if (orderId) {
            const q1 = query(collection(db, 'registrations'), where('razorpayOrderId', '==', orderId));
            const snap1 = await getDocs(q1);
            if (!snap1.empty) regDoc = snap1.docs[0];
          }

          if (!regDoc && email) {
            const q2 = query(collection(db, 'registrations'), where('personalInfo.email', '==', email));
            const snap2 = await getDocs(q2);
            if (!snap2.empty) regDoc = snap2.docs[0];
          }

          if (regDoc) {
            const regData = regDoc.data();
            const applicantId = regData.applicantId || `INFO26-BYTE-${Math.floor(10000 + Math.random() * 90000)}`;

            // Update registration status to paid
            await updateDoc(doc(db, 'registrations', regDoc.id), {
              status: 'paid',
              razorpayPaymentId: paymentId,
              razorpayOrderId: orderId,
              paidAt: new Date().toISOString(),
            });

            // Create ticket doc if not created yet
            const ticketId = `tkt_${regDoc.id}`;
            await setDoc(
              doc(db, 'tickets', ticketId),
              {
                ticketNumber: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
                applicantId,
                registrationId: regDoc.id,
                studentName: regData.personalInfo?.fullName || regData.fullName || 'Participant',
                email: regData.personalInfo?.email || email,
                phone: regData.personalInfo?.phone || contact,
                college: regData.personalInfo?.college || 'College Participant',
                department: regData.personalInfo?.department || 'Information Technology',
                year: regData.personalInfo?.year || '1st',
                events: regData.eventNames || regData.events || ['Symposium Event'],
                totalAmount: amount,
                paymentMethod: payment?.method || 'UPI',
                razorpayPaymentId: paymentId,
                status: 'valid',
                issueDate: new Date(),
              },
              { merge: true }
            );

            // Sync to Google Sheets
            try {
              fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://infogram26.in'}/api/sheets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  applicantId,
                  name: regData.personalInfo?.fullName || regData.fullName || 'Participant',
                  email: regData.personalInfo?.email || email,
                  phone: regData.personalInfo?.phone || contact,
                  college: regData.personalInfo?.college || 'College Participant',
                  department: regData.personalInfo?.department || 'Information Technology',
                  year: regData.personalInfo?.year || '1st',
                  events: Array.isArray(regData.eventNames) ? regData.eventNames.join(', ') : regData.events,
                  amount,
                  status: 'paid',
                  razorpayPaymentId: paymentId,
                }),
              }).catch((e) => console.warn('Sheets webhook sync warning:', e));
            } catch (sErr) {
              console.warn('Sheets sync error:', sErr);
            }
          }
        }
      } catch (dbErr) {
        console.error('Webhook DB sync error:', dbErr);
      }
    }

    return NextResponse.json({ status: 'ok', verified: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
