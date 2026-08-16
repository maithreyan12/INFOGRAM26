import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, addDoc, getDocs, serverTimestamp, increment } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDGPuGlZhb_lFur3YPAegpdr8aM4BUd-zY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "infogram26.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "infogram26",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "infogram26.firebasestorage.app",
  messagingSenderId: "1083758362629",
  appId: "1:1083758362629:web:38b344efbc36746efbdba4",
};

function getDB() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = await req.json();
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Signature Verification if secret is configured
    if (keySecret) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto.createHmac('sha256', keySecret)
                                      .update(body.toString())
                                      .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    // ── Instant Ticket Auto-Generation ──
    const db = getDB();
    let ticketId = `tkt_${Date.now()}`;

    if (registrationId && db) {
      try {
        const regRef = doc(db, 'registrations', registrationId);
        const regSnap = await getDoc(regRef);

        if (regSnap.exists()) {
          const regData = regSnap.data();

          // 1. Update registration status to paid
          await updateDoc(regRef, {
            status: 'paid',
            razorpayPaymentId: razorpay_payment_id || '',
            razorpayOrderId: razorpay_order_id || '',
            paidAt: new Date().toISOString(),
          });

          // 2. Auto-generate ticket document
          const appCode = regData.applicantId || `INFO26-EVT-${Math.floor(10000 + Math.random() * 90000)}`;
          const ticketNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
          const name = regData.personalInfo?.fullName || regData.fullName || 'Participant';
          const eventsList = regData.eventNames || regData.events || ['Symposium Event'];

          const qrData = JSON.stringify({
            ticketNumber,
            applicantId: appCode,
            name,
            events: eventsList,
            verified: true,
          });

          ticketId = `tkt_${registrationId}`;

          // Dual-write ticket & update registration in Supabase
          try {
            const { supabaseAdmin } = await import('@/lib/supabase/config');
            await supabaseAdmin
              .from('registrations')
              .update({
                status: 'paid',
                razorpay_payment_id: razorpay_payment_id || '',
                razorpay_order_id: razorpay_order_id || '',
                paid_at: new Date().toISOString(),
              })
              .or(`id.eq.${registrationId},applicant_id.eq.${appCode}`);

            await supabaseAdmin.from('tickets').upsert([
              {
                id: ticketId,
                ticket_number: ticketNumber,
                applicant_id: appCode,
                registration_id: registrationId,
                student_name: name,
                email: regData.personalInfo?.email || regData.email || '',
                phone: regData.personalInfo?.phone || regData.phone || '',
                college: regData.personalInfo?.college || regData.college || '',
                department: regData.personalInfo?.department || regData.department || '',
                year: regData.personalInfo?.year || regData.year || '',
                events: eventsList,
                total_amount: regData.totalFee || 100,
                payment_method: 'razorpay',
                razorpay_payment_id: razorpay_payment_id || '',
                qr_data: qrData,
                status: 'valid',
                issue_date: new Date().toISOString(),
              },
            ]);
          } catch (spErr) {
            console.warn('Supabase payment sync warning:', spErr);
          }
          await setDoc(
            doc(db, 'tickets', ticketId),
            {
              ticketNumber,
              applicantId: appCode,
              registrationId,
              studentName: name,
              email: regData.personalInfo?.email || regData.email || '',
              phone: regData.personalInfo?.phone || regData.phone || '',
              college: regData.personalInfo?.college || regData.college || '',
              department: regData.personalInfo?.department || regData.department || '',
              year: regData.personalInfo?.year || regData.year || '',
              events: eventsList,
              totalAmount: regData.totalFee || 100,
              paymentMethod: 'razorpay',
              razorpayPaymentId: razorpay_payment_id || '',
              razorpayOrderId: razorpay_order_id || '',
              qrData,
              status: 'valid',
              issueDate: new Date().toISOString(),
            },
            { merge: true }
          );

          // 3. Increment registeredCount for each registered event in Firestore
          if (Array.isArray(eventsList)) {
            try {
              const eventsSnap = await getDocs(collection(db, 'events'));
              for (const evtNameOrId of eventsList) {
                const normName = String(evtNameOrId).toLowerCase().replace(/[^a-z0-9]/g, '');
                const matchDoc = eventsSnap.docs.find(d => {
                  const data = d.data();
                  const dNorm = (data.name || data.slug || d.id).toLowerCase().replace(/[^a-z0-9]/g, '');
                  return dNorm === normName || d.id === evtNameOrId;
                });

                if (matchDoc) {
                  await updateDoc(doc(db, 'events', matchDoc.id), {
                    registeredCount: increment(1),
                  });
                } else {
                  await setDoc(doc(db, 'events', evtNameOrId), {
                    name: evtNameOrId,
                    registeredCount: 1,
                    createdAt: serverTimestamp(),
                  }, { merge: true });
                }
              }
            } catch (evtCntErr) {
              console.warn('Event registeredCount increment warning:', evtCntErr);
            }
          }

          // 4. Sync to Google Sheets
          fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://infogram26.in'}/api/sheets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              applicantId: appCode,
              ticketNumber,
              name,
              email: regData.personalInfo?.email || regData.email || '',
              phone: regData.personalInfo?.phone || regData.phone || '',
              college: regData.personalInfo?.college || regData.college || '',
              department: regData.personalInfo?.department || regData.department || '',
              year: regData.personalInfo?.year || regData.year || '',
              events: Array.isArray(eventsList) ? eventsList.join(', ') : eventsList,
              amount: regData.totalFee || 100,
              status: 'paid',
              paymentMethod: 'razorpay',
              razorpayPaymentId: razorpay_payment_id || '',
            }),
          }).catch((e) => console.warn('Sheets sync warning:', e));
        }
      } catch (dbErr: any) {
        console.error('Firestore ticket auto-gen error:', dbErr);
      }
    }

    return NextResponse.json({ success: true, ticketId });
  } catch (error: any) {
    console.error('Razorpay Verify Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
