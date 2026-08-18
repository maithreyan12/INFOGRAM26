import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { supabase } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const registrations: any[] = [];
  const seenIds = new Set<string>();

  // 1. Fetch from Firestore registrations
  try {
    if (db) {
      const snap = await getDocs(collection(db, 'registrations'));
      snap.docs.forEach((d) => {
        const data = d.data();
        const appId = data.applicantId || d.id;
        if (!seenIds.has(appId)) {
          seenIds.add(appId);
          registrations.push({
            id: d.id,
            applicantId: data.applicantId,
            fullName: data.personalInfo?.fullName || data.fullName || data.studentName || data.name,
            studentName: data.personalInfo?.fullName || data.fullName || data.studentName || data.name,
            email: data.personalInfo?.email || data.email,
            phone: data.personalInfo?.phone || data.phone,
            college: data.personalInfo?.college || data.college,
            department: data.personalInfo?.department || data.department,
            year: data.personalInfo?.year || data.year,
            events: data.eventNames || data.events || [],
            eventNames: data.eventNames || data.events || [],
            totalFee: data.totalFee ?? data.totalAmount ?? data.fee ?? 0,
            status: data.status || (data.razorpayPaymentId ? 'paid' : 'pending_payment'),
            checkedIn: data.checkedIn || data.attendanceStatus === 'checked_in',
            attendanceStatus: data.attendanceStatus || (data.checkedIn ? 'checked_in' : 'pending'),
            razorpayPaymentId: data.razorpayPaymentId || data.paymentId,
            createdAt: data.createdAt,
          });
        }
      });
    }
  } catch (fsErr) {
    console.warn('API registrations Firestore fetch warning:', fsErr);
  }

  // 2. Fetch from Firestore tickets (to catch any tickets that might not be in registrations collection)
  try {
    if (db) {
      const tktSnap = await getDocs(collection(db, 'tickets'));
      tktSnap.docs.forEach((d) => {
        const data = d.data();
        const appId = data.applicantId;
        if (appId && !seenIds.has(appId)) {
          seenIds.add(appId);
          registrations.push({
            id: data.registrationId || d.id,
            applicantId: data.applicantId,
            ticketId: d.id,
            fullName: data.studentName || data.name || data.fullName,
            studentName: data.studentName || data.name || data.fullName,
            email: data.email,
            phone: data.phone,
            college: data.college,
            department: data.department,
            year: data.year,
            events: data.events || [],
            eventNames: data.events || [],
            totalFee: data.totalAmount ?? data.totalFee ?? 0,
            status: 'paid',
            checkedIn: data.status === 'used' || data.checkedIn,
            attendanceStatus: data.status === 'used' || data.checkedIn ? 'checked_in' : 'pending',
            razorpayPaymentId: data.razorpayPaymentId,
            createdAt: data.issueDate,
          });
        }
      });
    }
  } catch (tktErr) {
    console.warn('API tickets Firestore fetch warning:', tktErr);
  }

  // 3. Fetch from Supabase registrations
  try {
    if (supabase) {
      const { data: spRegs } = await supabase.from('registrations').select('*');
      if (spRegs) {
        spRegs.forEach((sr: any) => {
          const appId = sr.applicant_id || sr.id;
          if (appId && !seenIds.has(appId)) {
            seenIds.add(appId);
            registrations.push({
              id: sr.id,
              applicantId: sr.applicant_id,
              fullName: sr.full_name,
              studentName: sr.full_name,
              email: sr.email,
              phone: sr.phone,
              college: sr.college,
              department: sr.department,
              year: sr.year,
              events: sr.events || [],
              eventNames: sr.events || [],
              totalFee: sr.total_fee || 0,
              status: sr.status || (sr.razorpay_payment_id ? 'paid' : 'pending_payment'),
              razorpayPaymentId: sr.razorpay_payment_id,
              createdAt: sr.created_at,
            });
          }
        });
      }
    }
  } catch (spErr) {
    console.warn('API registrations Supabase fetch warning:', spErr);
  }

  // Ensure Lithika Ganapathy's confirmed payment (pay_TR6nR5uvpjrQAQ) is included
  const hasLithika = registrations.some(
    (r) => r.email === 'lithikaganapathy@gmail.com' || r.razorpayPaymentId === 'pay_TR6nR5uvpjrQAQ' || r.phone === '7418792577'
  );
  if (!hasLithika) {
    registrations.push({
      id: 'reg_code_79257',
      applicantId: 'INFO26-CODE-79257',
      ticketId: 'tkt_code_79257',
      fullName: 'Lithika Ganapathy',
      studentName: 'Lithika Ganapathy',
      email: 'lithikaganapathy@gmail.com',
      phone: '7418792577',
      college: 'C. Abdul Hakeem College of Engineering & Technology',
      department: 'Information Technology',
      year: '2nd Year',
      personalInfo: {
        fullName: 'Lithika Ganapathy',
        email: 'lithikaganapathy@gmail.com',
        phone: '7418792577',
        college: 'C. Abdul Hakeem College of Engineering & Technology',
        department: 'Information Technology',
        year: '2nd Year',
      },
      events: ['Codestorm'],
      eventNames: ['Codestorm'],
      totalFee: 50,
      status: 'paid',
      checkedIn: false,
      attendanceStatus: 'pending',
      razorpayPaymentId: 'pay_TR6nR5uvpjrQAQ',
      createdAt: '2026-08-18T10:27:00.000Z',
    });
  }

  // Deduplicate and filter confirmed paid registrations (by email, phone, and name)
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();
  const seenNames = new Set<string>();

  const confirmedPaidRegistrations = registrations.filter((r) => {
    const isPaid = r.status === 'paid' || r.ticketId || r.paidAt || r.razorpayPaymentId;
    const email = (r.personalInfo?.email || r.email || '').toLowerCase().trim();
    const phone = (r.personalInfo?.phone || r.phone || '').replace(/\D/g, '').slice(-10);
    const name = (r.personalInfo?.fullName || r.studentName || r.name || '').toLowerCase().trim();
    const isTest = !name || name === '—' || name === 'participant' || email.includes('test@example.com');
    if (!isPaid || isTest) return false;

    if (email && email.includes('@')) {
      if (seenEmails.has(email)) return false;
      seenEmails.add(email);
    }
    if (phone && phone.length === 10) {
      if (seenPhones.has(phone)) return false;
      seenPhones.add(phone);
    }
    if (name && name.length > 2) {
      if (seenNames.has(name)) return false;
      seenNames.add(name);
    }
    return true;
  });

  return NextResponse.json({
    success: true,
    count: confirmedPaidRegistrations.length,
    registrations: confirmedPaidRegistrations,
  });
}
