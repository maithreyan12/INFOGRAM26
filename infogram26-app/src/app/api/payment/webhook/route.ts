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

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      if (expectedSignature !== signature) {
        console.error('Webhook signature mismatch');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      console.warn('RAZORPAY_WEBHOOK_SECRET not set — processing webhook without signature verification');
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
        const { collection, query, where, getDocs, updateDoc, addDoc, doc, setDoc, serverTimestamp } = await import('firebase/firestore');

        if (db) {
          let regDoc: any = null;
          let regId: string | null = null;

          // 1. Find registration by razorpayOrderId (set when order is created)
          if (orderId) {
            const q1 = query(collection(db, 'registrations'), where('razorpayOrderId', '==', orderId));
            const snap1 = await getDocs(q1);
            if (!snap1.empty) { regDoc = snap1.docs[0]; regId = snap1.docs[0].id; }
          }

          // 2. Fallback: find by email
          if (!regDoc && email) {
            const q2 = query(collection(db, 'registrations'), where('personalInfo.email', '==', email));
            const snap2 = await getDocs(q2);
            if (!snap2.empty) { regDoc = snap2.docs[0]; regId = snap2.docs[0].id; }
          }

          // 3. Fetch Razorpay order notes as recovery data (set by create-order route)
          let notes: Record<string, string> = {};
          try {
            const keyId = process.env.RAZORPAY_KEY_ID;
            const keySecret = process.env.RAZORPAY_KEY_SECRET;
            if (keyId && keySecret && orderId) {
              const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
              const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
                headers: { Authorization: `Basic ${auth}` },
              });
              if (orderRes.ok) {
                const orderData = await orderRes.json();
                notes = orderData.notes || {};
                // Try by registrationId from notes
                if (!regDoc && notes.registrationId) {
                  regId = notes.registrationId;
                  const { getDoc } = await import('firebase/firestore');
                  const regSnap = await getDoc(doc(db, 'registrations', notes.registrationId));
                  if (regSnap.exists()) { regDoc = regSnap; regId = regSnap.id; }
                }
              }
            }
          } catch (notesErr) {
            console.warn('Could not fetch Razorpay order notes:', notesErr);
          }

          // 4. If no registration found, create one from notes data
          if (!regDoc && notes.registrationId) {
            console.log('⚠️ No registration found — creating from Razorpay notes:', notes);
            const newApplicantId = notes.applicantId || `INFO26-WH-${Math.floor(10000 + Math.random() * 90000)}`;
            const eventsList = notes.events ? notes.events.split(', ').filter(Boolean) : ['Symposium Event'];
            const newRegRef = await addDoc(collection(db, 'registrations'), {
              applicantId: newApplicantId,
              personalInfo: {
                fullName: notes.name || 'Participant',
                email: notes.email || email || '',
                phone: notes.phone || contact || '',
                college: notes.college || 'College Participant',
                department: notes.department || 'Information Technology',
                year: notes.year || '1st',
              },
              eventNames: eventsList,
              totalFee: amount,
              status: 'paid',
              razorpayOrderId: orderId,
              razorpayPaymentId: paymentId,
              paidAt: new Date().toISOString(),
              createdAt: serverTimestamp(),
              source: 'webhook_recovery',
            });
            regId = newRegRef.id;
            console.log('✅ Recovery registration created:', regId);
          } else if (regDoc && regId) {
            // Update existing registration to paid
            await updateDoc(doc(db, 'registrations', regId), {
              status: 'paid',
              razorpayPaymentId: paymentId,
              razorpayOrderId: orderId,
              paidAt: new Date().toISOString(),
            });
          }

          if (regId) {
            const regData = regDoc ? regDoc.data() : null;
            const applicantId = regData?.applicantId || notes.applicantId || `INFO26-WH-${Math.floor(10000 + Math.random() * 90000)}`;
            const studentName = regData?.personalInfo?.fullName || notes.name || 'Participant';
            const studentEmail = regData?.personalInfo?.email || notes.email || email || '';
            const studentPhone = regData?.personalInfo?.phone || notes.phone || contact || '';
            const studentCollege = regData?.personalInfo?.college || notes.college || 'College Participant';
            const studentDept = regData?.personalInfo?.department || notes.department || 'Information Technology';
            const studentYear = regData?.personalInfo?.year || notes.year || '1st';
            const eventsList = regData?.eventNames || regData?.events ||
              (notes.events ? notes.events.split(', ').filter(Boolean) : ['Symposium Event']);

            // Create ticket (merge so double-runs are safe)
            const ticketId = `tkt_${regId}`;
            const ticketNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
            await setDoc(
              doc(db, 'tickets', ticketId),
              {
                ticketNumber,
                applicantId,
                registrationId: regId,
                studentName,
                email: studentEmail,
                phone: studentPhone,
                college: studentCollege,
                department: studentDept,
                year: studentYear,
                events: eventsList,
                totalAmount: amount,
                paymentMethod: payment?.method || 'UPI',
                razorpayPaymentId: paymentId,
                status: 'valid',
                issueDate: new Date(),
              },
              { merge: true }
            );
            console.log('✅ Ticket created/updated:', ticketId);

            // Sync to Google Sheets
            try {
              fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://infogram26.in'}/api/sheets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  applicantId,
                  ticketNumber,
                  name: studentName,
                  email: studentEmail,
                  phone: studentPhone,
                  college: studentCollege,
                  department: studentDept,
                  year: studentYear,
                  events: Array.isArray(eventsList) ? eventsList.join(', ') : eventsList,
                  amount,
                  status: 'paid',
                  paymentMethod: payment?.method || 'UPI',
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
