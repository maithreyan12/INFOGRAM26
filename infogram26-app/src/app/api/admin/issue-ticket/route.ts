import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, phone, college, department, year, events, amount, applicantId } = await req.json();

    const { db } = await import('@/lib/firebase/config');
    const { collection, addDoc, doc, setDoc, serverTimestamp } = await import('firebase/firestore');

    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const appCode = applicantId || `INFO26-HACK-${Math.floor(10000 + Math.random() * 90000)}`;
    const eventsList = Array.isArray(events) ? events : [events || 'HackForge'];
    const ticketNumber = `TKT-HACK-${Math.floor(10000 + Math.random() * 90000)}`;

    // 1. Create Registration Document (allow create: if true)
    const regRef = await addDoc(collection(db, 'registrations'), {
      applicantId: appCode,
      personalInfo: {
        fullName: name || 'Thamaraiselvi',
        email: email || 'thamaraisanthi1459@gmail.com',
        phone: phone || '9626918439',
        college: college || 'Vellore Institute of Technology',
        department: department || 'Software Engineering',
        year: year || '2nd Year',
      },
      eventNames: eventsList,
      events: eventsList,
      totalFee: amount || 100,
      status: 'paid',
      source: 'manual_reconciliation',
      createdAt: new Date().toISOString(),
    });

    // 2. Create Ticket Document (allow create: if true)
    const ticketId = `tkt_${regRef.id}`;
    const qrData = JSON.stringify({
      ticketNumber,
      applicantId: appCode,
      name: name || 'Thamaraiselvi',
      events: eventsList,
      verified: true,
    });

    await setDoc(doc(db, 'tickets', ticketId), {
      ticketNumber,
      applicantId: appCode,
      registrationId: regRef.id,
      studentName: name || 'Thamaraiselvi',
      email: email || 'thamaraisanthi1459@gmail.com',
      phone: phone || '9626918439',
      college: college || 'Vellore Institute of Technology',
      department: department || 'Software Engineering',
      year: year || '2nd Year',
      events: eventsList,
      totalAmount: amount || 100,
      paymentMethod: 'razorpay',
      qrData,
      status: 'valid',
      issueDate: new Date(),
    });

    // Also sync to Google Sheets
    try {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://infogram26.in'}/api/sheets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId: appCode,
          ticketNumber,
          name: name || 'Thamaraiselvi',
          email: email || 'thamaraisanthi1459@gmail.com',
          phone: phone || '9626918439',
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
      registrationId: regRef.id,
      applicantId: appCode,
      ticketUrl,
    });
  } catch (error: any) {
    console.error('Manual ticket creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
