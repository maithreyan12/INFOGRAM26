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
    let deletedRegsCount = 0;

    // 1. Delete ALL old tickets matching any of these 4 emails or phones
    const allPhones = teamMembers.map(m => m.phone);
    const allEmails = teamMembers.map(m => m.email);

    // Query tickets
    const tktSnap = await getDocs(collection(db, 'tickets'));
    for (const d of tktSnap.docs) {
      const data = d.data();
      const p = (data.phone || '').replace(/\D/g, '').slice(-10);
      const e = (data.email || '').toLowerCase();
      const name = (data.studentName || data.name || '').toLowerCase();

      if (
        allPhones.includes(p) ||
        allEmails.includes(e) ||
        name.includes('thamarai') ||
        name.includes('lakshaya') ||
        name.includes('mithra') ||
        name.includes('rithika')
      ) {
        try {
          await deleteDoc(doc(db, 'tickets', d.id));
          deletedTicketsCount++;
        } catch (err: any) {
          console.warn('Err deleting ticket:', d.id, err.message);
        }
      }
    }

    // Query registrations
    const regSnap = await getDocs(collection(db, 'registrations'));
    for (const d of regSnap.docs) {
      const data = d.data();
      const p = (data.personalInfo?.phone || data.phone || '').replace(/\D/g, '').slice(-10);
      const e = (data.personalInfo?.email || data.email || '').toLowerCase();
      const name = (data.personalInfo?.fullName || data.fullName || '').toLowerCase();

      if (
        allPhones.includes(p) ||
        allEmails.includes(e) ||
        name.includes('thamarai') ||
        name.includes('lakshaya') ||
        name.includes('mithra') ||
        name.includes('rithika')
      ) {
        try {
          await deleteDoc(doc(db, 'registrations', d.id));
          deletedRegsCount++;
        } catch (err: any) {
          console.warn('Err deleting registration:', d.id, err.message);
        }
      }
    }

    // 2. Re-create EXACTLY 1 ticket per member
    const createdResults: any[] = [];
    for (const m of teamMembers) {
      const ticketNumber = `TKT-HACK-${Math.floor(10000 + Math.random() * 90000)}`;

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
        registrationId: regRef.id,
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
        ticketId: tktRef.id,
        url: `https://infogram26.in/ticket/${tktRef.id}`,
      });
    }

    return NextResponse.json({
      success: true,
      deletedTicketsCount,
      deletedRegsCount,
      createdCount: createdResults.length,
      passes: createdResults,
    });
  } catch (error: any) {
    console.error('Clean tickets error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
