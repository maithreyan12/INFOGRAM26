import { NextResponse } from 'next/server';
import { OFFICIAL_EVENTS, generateApplicantId } from '@/lib/eventsData';
import { supabaseAdmin } from '@/lib/supabase/config';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      college,
      department,
      year,
      registerNumber,
      gender,
      selectedEvents = [],
    } = body;

    // Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      return NextResponse.json({ error: 'Full name must be at least 3 characters long.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string' || !/^\d{10}$/.test(phone.trim())) {
      return NextResponse.json({ error: 'Valid 10-digit phone number is required.' }, { status: 400 });
    }
    if (!college || typeof college !== 'string' || !college.trim()) {
      return NextResponse.json({ error: 'College name is required.' }, { status: 400 });
    }
    if (!department || typeof department !== 'string' || !department.trim()) {
      return NextResponse.json({ error: 'Department is required.' }, { status: 400 });
    }
    if (!year || typeof year !== 'string') {
      return NextResponse.json({ error: 'Year of study is required.' }, { status: 400 });
    }
    if (year !== '1st' && (!registerNumber || !String(registerNumber).trim())) {
      return NextResponse.json({ error: 'Register Number is required for 2nd year and above.' }, { status: 400 });
    }
    if (!gender || typeof gender !== 'string') {
      return NextResponse.json({ error: 'Gender is required.' }, { status: 400 });
    }
    if (!Array.isArray(selectedEvents) || selectedEvents.length === 0) {
      return NextResponse.json({ error: 'Please select at least one event.' }, { status: 400 });
    }

    // Resolve event objects, names, fees
    const eventDetails = selectedEvents.map((idOrName: string) => {
      const normInput = idOrName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const match = OFFICIAL_EVENTS.find(
        (e) =>
          e.id === idOrName ||
          e.slug === idOrName ||
          e.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normInput
      );
      return match
        ? { id: match.id, name: match.name, fee: match.registrationFee }
        : { id: idOrName, name: idOrName, fee: 50 };
    });

    // Check Flavour Fusion gender constraint
    const hasFlavour = eventDetails.some((e) => e.name.toLowerCase().includes('flavour'));
    if (hasFlavour && gender === 'Male') {
      return NextResponse.json(
        { error: 'Flavour Fusion is exclusively for Female participants.' },
        { status: 400 }
      );
    }

    const eventNamesList = eventDetails.map((e) => e.name);
    const totalFee = eventDetails.reduce((sum, e) => sum + e.fee, 0);

    const applicantId = generateApplicantId(eventNamesList);
    const registrationId = `reg_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    let supabaseSuccess = false;
    let firestoreSuccess = false;
    let lastError: any = null;

    // 1. Primary write to Supabase using server admin client (bypasses RLS issues)
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('registrations')
          .upsert([
            {
              id: registrationId,
              applicant_id: applicantId,
              full_name: fullName.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim(),
              college: college.trim(),
              department: department.trim(),
              year: String(year).trim(),
              events: eventNamesList,
              total_fee: totalFee,
              status: 'pending_payment',
              created_at: new Date().toISOString(),
            },
          ])
          .select();

        if (error) {
          console.error('❌ Supabase server registration insert error:', error);
          lastError = error;
        } else {
          console.log(`✅ Supabase server registration inserted: ${registrationId} (${applicantId})`);
          supabaseSuccess = true;
        }
      }
    } catch (spErr) {
      console.error('❌ Supabase registration exception:', spErr);
      lastError = spErr;
    }

    // 2. Dual write to Firebase Firestore
    try {
      const { db } = await import('@/lib/firebase/config');
      if (db) {
        const { doc, setDoc } = await import('firebase/firestore');
        const cleanPersonalInfo = {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          college: college.trim(),
          department: department.trim(),
          year: String(year).trim(),
          registerNumber: registerNumber ? String(registerNumber).trim() : null,
          gender: String(gender).trim(),
        };

        await setDoc(doc(db, 'registrations', registrationId), {
          applicantId,
          personalInfo: cleanPersonalInfo,
          events: selectedEvents,
          eventNames: eventNamesList,
          totalFee,
          status: 'pending_payment',
          createdAt: new Date().toISOString(),
        });

        console.log(`✅ Firestore server registration inserted: ${registrationId}`);
        firestoreSuccess = true;
      }
    } catch (fsErr) {
      console.error('❌ Firestore registration exception:', fsErr);
      if (!lastError) lastError = fsErr;
    }

    // Require at least one database insertion to succeed
    if (!supabaseSuccess && !firestoreSuccess) {
      console.error('❌ Server Registration Failed: Both database writes failed.');
      return NextResponse.json(
        {
          error: 'Failed to persist registration to database.',
          details: lastError?.message || String(lastError),
        },
        { status: 500 }
      );
    }

    // Non-blocking background sync to Google Sheets
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://infogram26.in';
      fetch(`${appUrl}/api/sheets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId,
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          college: college.trim(),
          department: department.trim(),
          year: String(year).trim(),
          events: eventNamesList.join(', '),
          amount: totalFee,
          paymentMethod: 'pending',
          status: 'pending_payment',
        }),
      }).catch((sheetsErr) => console.warn('Google Sheets background sync notice:', sheetsErr));
    } catch {}

    return NextResponse.json({
      success: true,
      registrationId,
      applicantId,
      totalFee,
      events: eventNamesList,
      personalInfo: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        college: college.trim(),
        department: department.trim(),
        year: String(year).trim(),
        registerNumber: registerNumber ? String(registerNumber).trim() : '',
        gender: String(gender).trim(),
      },
    });
  } catch (error: any) {
    console.error('❌ Unexpected Registration API Exception:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during registration.' },
      { status: 500 }
    );
  }
}
