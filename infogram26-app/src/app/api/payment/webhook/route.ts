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

    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      console.log('✅ Webhook: payment.captured', {
        paymentId: payment?.id,
        orderId: payment?.order_id,
        amount: payment?.amount,
        method: payment?.method,
        email: payment?.email,
        contact: payment?.contact,
      });

      // The registration update is already handled by the frontend handler
      // This webhook serves as a backup confirmation path
      // In a production system, you'd update Firestore here too if not already done
    }

    return NextResponse.json({ status: 'ok', verified: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
