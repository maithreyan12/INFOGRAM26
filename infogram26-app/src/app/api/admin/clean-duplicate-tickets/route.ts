import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';

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

    if (process.env.ADMIN_SECRET_KEY && adminKey !== secretKey) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin key' }, { status: 401 });
    }

    const db = getDB();

    const teamMembers = [
      {
        applicantId: 'INFO26-HACK-1001',
        name: 'Thamaraiselvi',
        phone: '9626918439',
        email: 'thamaraisanthi1459@gmail.com',
        college: 'Vellore Institute of Technology',
        department: 'Software Engineering',
        year: '4th Year',
        events: ['HackForge'],
        amount: 100,
      },
      {
        applicantId: 'INFO26-HACK-1002',
        name: 'Lakshaya A',
        phone: '8870333393',
        email: 'lakshaya.arul16@gmail.com',
        college: 'Vellore Institute of Technology',
        department: 'Software Engineering',
        year: '4th Year',
        events: ['HackForge'],
        amount: 100,
      },
      {
        applicantId: 'INFO26-HACK-1003',
        name: 'Mithra',
        phone: '7708271028',
        email: 'mithrakasi26@gmail.com',
        college: 'Vellore Institute of Technology',
        department: 'Software Engineering',
        year: '2nd Year',
        events: ['HackForge'],
        amount: 100,
      },
      {
        applicantId: 'INFO26-HACK-1004',
        name: 'Rithika P T',
        phone: '8807425155',
        email: 'rithikaparthiban15@gmail.com',
        college: 'Vellore Institute of Technology',
        department: 'Software Engineering',
        year: '2nd Year',
        events: ['HackForge'],
        amount: 100,
      },
    ];

    let deletedTicketsCount = 0;

    // Delete test registrations (arunkumar and verification.test)
    const testEmails = ['arunkumar.cahcet@gmail.com', 'verification.test@example.com', 'test@example.com'];
    for (const testE of testEmails) {
      try {
        const qE = query(collection(db, 'tickets'), where('email', '==', testE));
        const snapE = await getDocs(qE);
        for (const d of snapE.docs) {
          try { await deleteDoc(doc(db, 'tickets', d.id)); } catch {}
        }
      } catch {}
    }

    // Delete old tickets matching each phone / email
    for (const m of teamMembers) {
      const phoneVars = [m.phone, `+91${m.phone}`, `+91 ${m.phone}`];
      for (const pVar of phoneVars) {
        try {
          const q = query(collection(db, 'tickets'), where('phone', '==', pVar));
          const snap = await getDocs(q);
          for (const d of snap.docs) {
            try {
              await deleteDoc(doc(db, 'tickets', d.id));
              deletedTicketsCount++;
            } catch {}
          }
        } catch {}
      }
      try {
        const qE = query(collection(db, 'tickets'), where('email', '==', m.email));
        const snapE = await getDocs(qE);
        for (const d of snapE.docs) {
          try {
            await deleteDoc(doc(db, 'tickets', d.id));
            deletedTicketsCount++;
          } catch {}
        }
      } catch {}
    }

    // Now create EXACTLY 1 ticket per member
    const createdResults: any[] = [];
    for (const m of teamMembers) {
      const ticketNumber = `TKT-HACK-${Math.floor(10000 + Math.random() * 90000)}`;

      let regId = `reg_${Date.now()}_${Math.floor(Math.random()*1000)}`;
      try {
        const regRef = await addDoc(collection(db, 'registrations'), {
          applicantId: m.applicantId,
          personalInfo: {
            fullName: m.name,
            email: m.email,
            phone: m.phone,
            college: m.college,
            department: m.department,
            year: m.year,
          },
          eventNames: m.events,
          events: m.events,
          totalFee: m.amount,
          status: 'paid',
          source: 'clean_dedup_system',
          createdAt: new Date().toISOString(),
        });
        regId = regRef.id;
      } catch {}

      const qrData = JSON.stringify({
        ticketNumber,
        applicantId: m.applicantId,
        name: m.name,
        events: m.events,
        verified: true,
      });

      const tktRef = await addDoc(collection(db, 'tickets'), {
        ticketNumber,
        applicantId: m.applicantId,
        registrationId: regId,
        studentName: m.name,
        email: m.email,
        phone: m.phone,
        college: m.college,
        department: m.department,
        year: m.year,
        events: m.events,
        totalAmount: m.amount,
        paymentMethod: 'razorpay',
        qrData,
        status: 'valid',
        issueDate: new Date().toISOString(),
      });

      createdResults.push({
        name: m.name,
        phone: m.phone,
        ticketId: tktRef.id,
        url: `https://infogram26.in/ticket/${tktRef.id}`,
      });
    }

    return NextResponse.json({
      success: true,
      deletedTicketsCount,
      createdCount: createdResults.length,
      passes: createdResults,
    });
  } catch (error: any) {
    console.error('Clean tickets error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
