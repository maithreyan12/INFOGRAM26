import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDGPuGlZhb_lFur3YPAegpdr8aM4BUd-zY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "infogram26.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "infogram26",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "infogram26.firebasestorage.app",
  messagingSenderId: "1083758362629",
  appId: "1:1083758362629:web:38b344efbc36746efbdba4",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  console.log('Healing INFO26-HACK-14423 (Rohit Rajkumar)...');

  const rohitData = {
    applicantId: 'INFO26-HACK-14423',
    studentName: 'Rohit Rajkumar',
    fullName: 'Rohit Rajkumar',
    email: 'rajkumarrohit965@gmail.com',
    phone: '9740706586',
    college: 'C. Abdul Hakeem College of Engineering & Technology',
    department: 'Information Technology',
    year: '2nd Year',
    personalInfo: {
      fullName: 'Rohit Rajkumar',
      email: 'rajkumarrohit965@gmail.com',
      phone: '9740706586',
      college: 'C. Abdul Hakeem College of Engineering & Technology',
      department: 'Information Technology',
      year: '2nd Year',
    },
    events: ['HackForge'],
    eventNames: ['HackForge'],
    totalAmount: 50,
    totalFee: 50,
    status: 'paid',
    razorpayPaymentId: 'pay_TQSsGjMXY4BxKi',
    paymentMethod: 'UPI',
    paidAt: new Date().toISOString(),
  };

  // 1. Update tickets matching INFO26-HACK-14423 or pay_TQSsGjMXY4BxKi or empty name
  const tktsSnap = await getDocs(collection(db, 'tickets'));
  let updatedTkts = 0;
  for (const d of tktsSnap.docs) {
    const data = d.data();
    if (
      data.applicantId === 'INFO26-HACK-14423' ||
      data.razorpayPaymentId === 'pay_TQSsGjMXY4BxKi' ||
      data.email === 'rajkumarrohit965@gmail.com' ||
      d.id.includes('14423')
    ) {
      await setDoc(doc(db, 'tickets', d.id), {
        ticketNumber: data.ticketNumber || `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
        applicantId: 'INFO26-HACK-14423',
        studentName: 'Rohit Rajkumar',
        email: 'rajkumarrohit965@gmail.com',
        phone: '9740706586',
        college: 'C. Abdul Hakeem College of Engineering & Technology',
        department: 'Information Technology',
        year: '2nd Year',
        events: ['HackForge'],
        totalAmount: 50,
        paymentMethod: 'UPI',
        razorpayPaymentId: 'pay_TQSsGjMXY4BxKi',
        status: 'valid',
        issueDate: data.issueDate || new Date().toISOString(),
      }, { merge: true });
      console.log('✅ Updated ticket doc:', d.id);
      updatedTkts++;
    }
  }

  if (updatedTkts === 0) {
    const tktId = 'tkt_INFO26-HACK-14423';
    await setDoc(doc(db, 'tickets', tktId), {
      ticketNumber: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      applicantId: 'INFO26-HACK-14423',
      studentName: 'Rohit Rajkumar',
      email: 'rajkumarrohit965@gmail.com',
      phone: '9740706586',
      college: 'C. Abdul Hakeem College of Engineering & Technology',
      department: 'Information Technology',
      year: '2nd Year',
      events: ['HackForge'],
      totalAmount: 50,
      paymentMethod: 'UPI',
      razorpayPaymentId: 'pay_TQSsGjMXY4BxKi',
      status: 'valid',
      issueDate: new Date().toISOString(),
    }, { merge: true });
    console.log('✅ Created ticket doc:', tktId);
  }

  // 2. Update registrations matching INFO26-HACK-14423 or pay_TQSsGjMXY4BxKi or empty name
  const regSnap = await getDocs(collection(db, 'registrations'));
  let updatedRegs = 0;
  for (const d of regSnap.docs) {
    const data = d.data();
    if (
      data.applicantId === 'INFO26-HACK-14423' ||
      data.razorpayPaymentId === 'pay_TQSsGjMXY4BxKi' ||
      data.personalInfo?.email === 'rajkumarrohit965@gmail.com' ||
      data.email === 'rajkumarrohit965@gmail.com' ||
      d.id.includes('14423')
    ) {
      await setDoc(doc(db, 'registrations', d.id), rohitData, { merge: true });
      console.log('✅ Updated registration doc:', d.id);
      updatedRegs++;
    }
  }

  if (updatedRegs === 0) {
    const regId = 'reg_INFO26-HACK-14423';
    await setDoc(doc(db, 'registrations', regId), rohitData, { merge: true });
    console.log('✅ Created registration doc:', regId);
  }

  console.log('🎉 Done healing Rohit Rajkumar data!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
