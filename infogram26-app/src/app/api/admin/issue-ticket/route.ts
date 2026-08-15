import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, deleteDoc } from 'firebase/firestore';

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
    const adminKey = req.headers.get('x-admin-key');
    const secretKey = process.env.ADMIN_SECRET_KEY || 'infogram26_admin_secret_key_2026';

    // Verify secret key if configured or header provided
    if (process.env.ADMIN_SECRET_KEY && adminKey !== secretKey) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin key' }, { status: 401 });
    }

    const body = await req.json();

    // Handle delete action if requested
    if (body.action === 'delete') {
      const db = getDB();
      const { ticketId } = body;
      if (ticketId) {
        try {
          await deleteDoc(doc(db, 'tickets', ticketId));
        } catch (e: any) {
          console.warn('Delete ticket notice:', e.message);
        }
      }
      return NextResponse.json({ success: true, deleted: ticketId });
    }

    const { name, email, phone, college, department, year, events, amount, applicantId } = body;
    const db = getDB();

    const appCode = applicantId || `INFO26-HACK-${Math.floor(10000 + Math.random() * 90000)}`;
    const eventsList = Array.isArray(events) ? events : [events || 'HackForge'];
    const ticketNumber = `TKT-HACK-${Math.floor(10000 + Math.random() * 90000)}`;

    let regId = `reg_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    let regError = null;
    try {
      const regRef = await addDoc(collection(db, 'registrations'), {
        applicantId: appCode,
        personalInfo: {
          fullName: name || 'Participant',
          email: email || '',
          phone: phone || '',
          college: college || 'Vellore Institute of Technology',
          department: department || 'Software Engineering',
          year: year || '2nd Year',
        },
        eventNames: eventsList,
        events: eventsList,
        totalFee: amount || 100,
        status: 'paid',
        source: 'admin_issue_ticket',
        createdAt: new Date().toISOString(),
      });
      regId = regRef.id;
    } catch (err: any) {
      regError = err.message;
      console.error('REG ERROR:', err);
    }

    const qrData = JSON.stringify({
      ticketNumber,
      applicantId: appCode,
      name,
      events: eventsList,
      verified: true,
    });

    let ticketId = `tkt_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    let tktError = null;
    try {
      const ticketRef = await addDoc(collection(db, 'tickets'), {
        ticketNumber,
        applicantId: appCode,
        registrationId: regId,
        studentName: name || 'Participant',
        email: email || '',
        phone: phone || '',
        college: college || 'Vellore Institute of Technology',
        department: department || 'Software Engineering',
        year: year || '2nd Year',
        events: eventsList,
        totalAmount: amount || 100,
        paymentMethod: 'razorpay',
        qrData,
        status: 'valid',
        issueDate: new Date().toISOString(),
      });
      ticketId = ticketRef.id;
    } catch (err: any) {
      tktError = err.message;
      console.error('TKT ERROR:', err);
    }

    if (regError || tktError) {
      return NextResponse.json({
        error: 'Firestore write issue',
        regError,
        tktError,
      }, { status: 500 });
    }

    // Sync to Google Sheets
    try {
      fetch('https://www.infogram26.in/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId: appCode,
          ticketNumber,
          name,
          email: email || '',
          phone: phone || '',
          college: college || 'Vellore Institute of Technology',
          department: department || 'Software Engineering',
          year: year || '2nd Year',
          events: eventsList.join(', '),
          amount: amount || 100,
          status: 'paid',
          paymentMethod: 'razorpay',
        }),
      }).catch(() => {});
    } catch {}

    const ticketUrl = `https://infogram26.in/ticket/${ticketId}`;
    return NextResponse.json({
      success: true,
      ticketId,
      registrationId: regId,
      applicantId: appCode,
      ticketUrl,
    });
  } catch (error: any) {
    console.error('Manual ticket creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
