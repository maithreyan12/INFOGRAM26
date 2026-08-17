'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import PublicLayout from '@/components/layout/PublicLayout';
import { Download, Home, CheckCircle, Calendar, MapPin, Clock, ShieldCheck, Tag } from 'lucide-react';
import { OFFICIAL_EVENTS, formatTimeRange } from '@/lib/eventsData';

/* Helper to resolve event details */
function getEventInfo(evNameOrId: string) {
  const norm = evNameOrId.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = OFFICIAL_EVENTS.find(
    (e) =>
      e.name.toLowerCase().replace(/[^a-z0-9]/g, '') === norm ||
      e.id === evNameOrId ||
      e.slug === evNameOrId
  );
  if (match) {
    return {
      name: match.name,
      category: match.category === 'technical' ? 'Technical' : 'Non-Technical',
      venue: match.venue,
      time: formatTimeRange(match.startTime, match.endTime),
      date: match.date || '22 Aug 2026',
    };
  }
  return {
    name: evNameOrId,
    category: 'Symposium Event',
    venue: 'Main Campus, CAHCET',
    time: 'Full Day',
    date: '22 Aug 2026',
  };
}

export default function TicketPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const exportTicketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        // 1. Try Firestore tickets collection with isolated try-catch
        if (db) {
          try {
            const ticketDoc = await getDoc(doc(db, 'tickets', id));
            if (ticketDoc.exists()) {
              setTicket({ id: ticketDoc.id, ...ticketDoc.data() });
              setLoading(false);
              return;
            }
            const regDoc = await getDoc(doc(db, 'registrations', id));
            if (regDoc.exists()) {
              const data = regDoc.data();
              setTicket({
                id: regDoc.id,
                ticketNumber: `TKT-${regDoc.id.slice(-6).toUpperCase()}`,
                applicantId: data.applicantId,
                studentName: data.personalInfo?.fullName || data.studentName || 'Participant',
                email: data.personalInfo?.email || data.email || '',
                phone: data.personalInfo?.phone || data.phone || '',
                college: data.personalInfo?.college || data.college || '',
                department: data.personalInfo?.department || data.department || '',
                year: data.personalInfo?.year || data.year || '',
                events: data.eventNames || data.events || [],
                totalAmount: data.totalFee || 100,
                qrData: JSON.stringify({ applicantId: data.applicantId, verified: true }),
                status: data.status === 'paid' ? 'valid' : 'pending',
              });
              setLoading(false);
              return;
            }
          } catch (fsErr) {
            console.warn('Firestore ticket fetch notice:', fsErr);
          }
        }

        // 2. Supabase production database fallback
        try {
          const { supabase } = await import('@/lib/supabase/config');
          const { data: spTicket } = await supabase
            .from('tickets')
            .select('*')
            .or(`id.eq.${id},applicant_id.eq.${id},registration_id.eq.${id},ticket_number.eq.${id}`)
            .maybeSingle();

          if (spTicket) {
            setTicket({
              id: spTicket.id,
              ticketNumber: spTicket.ticket_number,
              applicantId: spTicket.applicant_id,
              studentName: spTicket.student_name,
              email: spTicket.email,
              phone: spTicket.phone,
              college: spTicket.college,
              department: spTicket.department,
              year: spTicket.year,
              events: spTicket.events,
              totalAmount: spTicket.total_amount,
              qrData: spTicket.qr_data,
              status: spTicket.status,
            });
            setLoading(false);
            return;
          }

          // 2b. Supabase registrations table fallback
          const { data: spReg } = await supabase
            .from('registrations')
            .select('*')
            .or(`id.eq.${id},applicant_id.eq.${id}`)
            .maybeSingle();

          if (spReg) {
            setTicket({
              id: spReg.id,
              ticketNumber: `TKT-${(spReg.applicant_id || spReg.id).slice(-6).toUpperCase()}`,
              applicantId: spReg.applicant_id || spReg.id,
              studentName: spReg.full_name || 'Participant',
              email: spReg.email || '',
              phone: spReg.phone || '',
              college: spReg.college || '',
              department: spReg.department || '',
              year: spReg.year || '',
              events: spReg.events || [],
              totalAmount: spReg.total_fee || 100,
              qrData: JSON.stringify({ applicantId: spReg.applicant_id || spReg.id, verified: true }),
              status: spReg.status === 'paid' ? 'valid' : 'pending',
            });
            setLoading(false);
            return;
          }
        } catch (spErr) {
          console.warn('Supabase ticket lookup notice:', spErr);
        }

        // 3. Check Event Store & Hardcoded Fallbacks (for Faizan / Rohit / Team Members)
        try {
          const { useEventStore } = await import('@/store/eventStore');
          const storeRegs = (useEventStore.getState().registrations || []) as any[];
          const matchedReg: any = storeRegs.find(
            (r: any) =>
              r.id === id ||
              r.applicantId === id ||
              r.email === id ||
              r.razorpayPaymentId === id ||
              (id.toLowerCase().includes('faizan') && (r.email || '').includes('mohdfaizan'))
          );

          if (matchedReg) {
            setTicket({
              id: matchedReg.id,
              ticketNumber: `TKT-${(matchedReg.applicantId || matchedReg.id).slice(-6).toUpperCase()}`,
              applicantId: matchedReg.applicantId,
              studentName: matchedReg.studentName || matchedReg.fullName || 'Participant',
              email: matchedReg.email || matchedReg.personalInfo?.email || '',
              phone: matchedReg.phone || matchedReg.personalInfo?.phone || '',
              college: matchedReg.college || matchedReg.personalInfo?.college || '',
              department: matchedReg.department || matchedReg.personalInfo?.department || '',
              year: matchedReg.year || matchedReg.personalInfo?.year || '',
              events: matchedReg.eventNames || matchedReg.events || [],
              totalAmount: matchedReg.totalFee || 100,
              qrData: JSON.stringify({ applicantId: matchedReg.applicantId, verified: true }),
              status: (matchedReg.status as string) === 'paid' ? 'valid' : 'pending',
            });
            setLoading(false);
            return;
          }
        } catch (stErr) {
          console.warn('Store ticket lookup notice:', stErr);
        }

        // Special Faizan direct fallback
        if (
          id.toLowerCase().includes('faizan') ||
          id === 'INFO26-QSTX-30555' ||
          id === 'tkt_INFO26-QSTX-30555' ||
          id === 'SOrNtS85NAjUIGOaE4xK' ||
          id === 'TKT-QSTX-30555'
        ) {
          setTicket({
            id: 'tkt_INFO26-QSTX-30555',
            ticketNumber: 'TKT-QSTX-30555',
            applicantId: 'INFO26-QSTX-30555',
            studentName: 'Mohammed faizan',
            email: 'mohdfaizanfaizu786@gmail.com',
            phone: '6382013260',
            college: 'Islamiah college vaniyambadi',
            department: 'Bsc computer science',
            year: '3rd Year',
            events: ['Quest X', 'Fun Fiesta'],
            totalAmount: 100,
            qrData: JSON.stringify({
              ticketNumber: 'TKT-QSTX-30555',
              applicantId: 'INFO26-QSTX-30555',
              name: 'Mohammed faizan',
              events: ['Quest X', 'Fun Fiesta'],
              verified: true,
            }),
            status: 'valid',
          });
          setLoading(false);
          return;
        }

        // Special Aysha Daniya M direct fallback
        if (
          id.toLowerCase().includes('aysha') ||
          id.toLowerCase().includes('daniya') ||
          id === 'INFO26-QSTX-23449' ||
          id === 'tkt_INFO26-QSTX-23449' ||
          id === 'Knn0TVhDmHJU5r5B9h1q' ||
          id === 'TKT-QSTX-23449' ||
          id === 'darfmo313@gmail.com'
        ) {
          setTicket({
            id: 'tkt_INFO26-QSTX-23449',
            ticketNumber: 'TKT-QSTX-23449',
            applicantId: 'INFO26-QSTX-23449',
            studentName: 'Aysha Daniya M',
            email: 'darfmo313@gmail.com',
            phone: '7824984485',
            college: "Islamiah Women's Arts and Science College (Autonomous)",
            department: 'B.Sc Data Science',
            year: '3rd Year',
            events: ['Quest X', 'Fun Fiesta'],
            totalAmount: 100,
            qrData: JSON.stringify({
              ticketNumber: 'TKT-QSTX-23449',
              applicantId: 'INFO26-QSTX-23449',
              name: 'Aysha Daniya M',
              events: ['Quest X', 'Fun Fiesta'],
              verified: true,
            }),
            status: 'valid',
          });
          setLoading(false);
          return;
        }

        setError('Ticket pass not found in database');
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id]);

  const handleDownloadPDF = async () => {
    const targetEl = exportTicketRef.current || ticketRef.current;
    if (!targetEl) return;
    setDownloading(true);
    try {
      toast.info('Generating official PDF pass...');
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(targetEl, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#030a16',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.width / canvas.height;
      const pdfRatio = pdfWidth / pdfHeight;

      let drawW = pdfWidth;
      let drawH = pdfHeight;
      if (imgRatio > pdfRatio) {
        drawH = pdfWidth / imgRatio;
      } else {
        drawW = pdfHeight * imgRatio;
      }

      const x = (pdfWidth - drawW) / 2;
      const y = (pdfHeight - drawH) / 2;

      pdf.addImage(imgData, 'PNG', x, y, drawW, drawH);
      pdf.save(`INFOGRAM26_Ticket_${ticket?.applicantId || ticket?.ticketNumber}.pdf`);
      toast.success('Official Entry Ticket downloaded!');
    } catch (err) {
      console.error('PDF generation error', err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <PublicLayout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-2 border-[#00d4ff] border-t-transparent rounded-full" />
      </div>
    </PublicLayout>
  );

  if (!ticket) return (
    <PublicLayout>
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">Ticket Not Found</h1>
        <p className="text-slate-600 mb-8 font-medium">This ticket pass does not exist or has expired.</p>
        <button onClick={() => router.push('/')} className="btn-primary px-8 py-3 rounded-full font-bold">
          Return to Home
        </button>
      </div>
    </PublicLayout>
  );

  const issueDateStr = ticket.issueDate?.seconds
    ? new Date(ticket.issueDate.seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const rawEventsList: string[] = Array.isArray(ticket.events)
    ? ticket.events
    : typeof ticket.events === 'string'
    ? ticket.events.split(',')
    : [];

  const structuredEvents = rawEventsList.map((ev) => getEventInfo(ev.trim()));

  const holderName = ticket.studentName || ticket.fullName || ticket.personalInfo?.fullName || ticket.name || (ticket.applicantId === 'INFO26-HACK-14423' ? 'Rohit Rajkumar' : 'Participant');
  const holderCollege = ticket.college || ticket.personalInfo?.college || 'C. Abdul Hakeem College of Engineering & Technology';
  const holderDept = ticket.department || ticket.personalInfo?.department || 'Information Technology';
  const holderYear = ticket.year || ticket.personalInfo?.year || '2nd Year';
  const feePaidAmount = (ticket.applicantId === 'INFO26-HACK-14423' || ticket.razorpayPaymentId === 'pay_TQSsGjMXY4BxKi')
    ? 50
    : (ticket.totalAmount ?? ticket.totalFee ?? 100);

  return (
    <PublicLayout>
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2 text-xs font-black uppercase tracking-wider text-emerald-600 mb-3">
              <CheckCircle className="w-4 h-4" /> Registration &amp; Payment Confirmed
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              OFFICIAL ENTRY PASS
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-semibold mt-1">
              Present this pass or scannable QR code at the registration desk on event day
            </p>
          </div>

          {/* ══════════ FORMAL PREMIUM TICKET PASS ══════════ */}
          <div
            ref={ticketRef}
            className="relative w-full max-w-3xl mx-auto mb-8 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #030a16 0%, #07162c 50%, #030a16 100%)',
              borderRadius: '24px',
              border: '1.5px solid rgba(0, 212, 255, 0.4)',
              boxShadow: '0 16px 48px rgba(0, 212, 255, 0.15), 0 0 100px rgba(124, 58, 237, 0.1)',
            }}
          >
            {/* Top Metallic Trim */}
            <div style={{ height: '6px', background: 'linear-gradient(90deg, #7c3aed, #00d4ff, #ffd700, #00d4ff, #7c3aed)' }} />

            {/* Corner Decorative Frames */}
            <div className="absolute top-4 left-4" style={{ width: 16, height: 16, borderTop: '2px solid #00d4ff', borderLeft: '2px solid #00d4ff' }} />
            <div className="absolute top-4 right-4" style={{ width: 16, height: 16, borderTop: '2px solid #00d4ff', borderRight: '2px solid #00d4ff' }} />
            <div className="absolute bottom-4 left-4" style={{ width: 16, height: 16, borderBottom: '2px solid #ffd700', borderLeft: '2px solid #ffd700' }} />
            <div className="absolute bottom-4 right-4" style={{ width: 16, height: 16, borderBottom: '2px solid #ffd700', borderRight: '2px solid #ffd700' }} />

            <div className="p-6 sm:p-8">
              {/* Institution Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div style={{
                    width: 46, height: 46,
                    background: 'rgba(0,212,255,0.1)',
                    border: '1.5px solid rgba(0,212,255,0.4)',
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ShieldCheck className="w-6 h-6 text-[#00d4ff]" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>
                      INFOGRAM<span style={{ color: '#00d4ff' }}>&apos;26</span>
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 3, fontWeight: 700 }}>
                      Department of Information Technology • CAHCET
                    </div>
                  </div>
                </div>

                {/* Applicant ID Pill */}
                <div className="flex flex-col sm:items-end">
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 800 }}>
                    APPLICANT ID
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 900, color: '#00d4ff', letterSpacing: 1 }}>
                    {ticket.applicantId}
                  </div>
                </div>
              </div>

              {/* Main Section Grid: Participant Details + QR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                
                {/* Left 2 Cols: Participant Credentials & Formal Event Schedule */}
                <div className="md:col-span-2 space-y-5">
                  
                  {/* Participant Credentials */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ fontSize: 9, color: '#00d4ff', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 800, marginBottom: 4 }}>
                      PASS HOLDER CREDENTIALS
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>
                      {holderName}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                      {holderDept} {holderYear ? `• ${holderYear.includes('Year') ? holderYear : holderYear + ' Year'}` : ''}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      {holderCollege}
                    </div>
                  </div>

                  {/* Formal Structured Events Section */}
                  <div>
                    <div style={{ fontSize: 10, color: '#ffd700', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Tag className="w-3.5 h-3.5 text-amber-400" /> REGISTERED EVENT SCHEDULE
                    </div>
                    <div className="space-y-2.5">
                      {structuredEvents.map((ev, i) => (
                        <div
                          key={i}
                          style={{
                            background: 'rgba(0, 212, 255, 0.05)',
                            border: '1px solid rgba(0, 212, 255, 0.2)',
                            borderRadius: '14px',
                            padding: '12px 14px',
                          }}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span style={{
                                background: ev.category === 'Technical' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(192, 132, 252, 0.2)',
                                color: ev.category === 'Technical' ? '#00d4ff' : '#c084fc',
                                border: `1px solid ${ev.category === 'Technical' ? 'rgba(0,212,255,0.4)' : 'rgba(192,132,252,0.4)'}`,
                                fontSize: 9,
                                fontWeight: 800,
                                padding: '1px 7px',
                                borderRadius: 100,
                                textTransform: 'uppercase',
                              }}>
                                {ev.category}
                              </span>
                              <span style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
                                {ev.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-semibold text-white/70 shrink-0">
                            <div className="flex items-center gap-1 text-amber-300">
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span>{ev.time}</span>
                            </div>
                            <a
                              href="https://maps.google.com/?q=C.+Abdul+Hakeem+College+of+Engineering+and+Technology,+Melvisharam"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sky-300 hover:text-sky-200 hover:underline cursor-pointer transition-colors"
                              title="Click to open Google Maps venue location"
                            >
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                              <span>📍 {ev.venue}</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right 1 Col: Scannable QR & Serial */}
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '18px',
                  padding: '20px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                }}>
                  {/* QR Code Container */}
                  <div style={{ background: '#ffffff', padding: 10, borderRadius: 14, boxShadow: '0 0 24px rgba(0, 212, 255, 0.25)' }}>
                    <QRCode
                      value={typeof window !== 'undefined' ? `${window.location.origin}/ticket/${id}` : `https://www.infogram26.in/ticket/${id}`}
                      size={132}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#040d1a"
                    />
                  </div>

                  <div className="text-center">
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2, fontWeight: 800 }}>
                      TICKET NUMBER
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#ffffff', fontWeight: 800, wordBreak: 'break-all' }}>
                      {ticket.ticketNumber}
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div style={{
                    background: ticket.status === 'valid' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${ticket.status === 'valid' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                    color: ticket.status === 'valid' ? '#4ade80' : '#f87171',
                    padding: '4px 14px',
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}>
                    {ticket.status === 'valid' ? '✓ VALID ENTRY PASS' : ticket.status?.toUpperCase()}
                  </div>
                </div>

              </div>

              {/* Ticket Footer Meta Info */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }} className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>EVENT DATE: </span>
                  <span style={{ fontWeight: 800, color: '#ffd700' }}>SATURDAY, 22 AUGUST 2026</span>
                </div>
                <div>
                  <a
                    href="https://infogram26.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 800, color: '#00d4ff', textDecoration: 'none' }}
                    className="hover:underline"
                  >
                    🌐 www.infogram26.in
                  </a>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>FEE PAID: </span>
                  <span style={{ fontWeight: 900, color: '#4ade80' }}>₹{feePaidAmount}</span>
                </div>
              </div>
            </div>

            {/* Bottom Metallic Trim */}
            <div style={{ height: '5px', background: 'linear-gradient(90deg, #ffd700, #00d4ff, #7c3aed)' }} />
          </div>
          {/* ══════════ END FORMAL TICKET PASS ══════════ */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="btn-primary flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base shadow-xl disabled:opacity-60"
            >
              {downloading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating PDF Pass...</>
              ) : (
                <><Download className="w-5 h-5" /> Download Official PDF Ticket</>
              )}
            </button>
            <button
              onClick={() => router.push('/')}
              className="btn-glass flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base"
            >
              <Home className="w-5 h-5" /> Back to Home
            </button>
          </div>

          <p className="text-center text-slate-500 text-xs font-semibold mt-6">
            Keep this official ticket safe. Present the printed PDF or digital QR code at the registration counter on 22 Aug 2026.
          </p>
        </div>
      </div>

      {/* ══════════ OFF-SCREEN HIGH-DEF PDF TEMPLATE (780px FIXED) ══════════ */}
      <div style={{ position: 'fixed', left: '-9999px', top: '0', width: '780px', pointerEvents: 'none', zIndex: -100 }}>
        <div
          ref={exportTicketRef}
          style={{
            width: '780px',
            background: 'linear-gradient(135deg, #030a16 0%, #07162c 50%, #030a16 100%)',
            borderRadius: '24px',
            border: '1.5px solid rgba(0, 212, 255, 0.4)',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Metallic Trim */}
          <div style={{ height: '6px', background: 'linear-gradient(90deg, #7c3aed, #00d4ff, #ffd700, #00d4ff, #7c3aed)' }} />

          <div style={{ padding: '32px' }}>
            {/* Institution Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: 48, height: 48,
                  background: 'rgba(0,212,255,0.1)',
                  border: '1.5px solid rgba(0,212,255,0.4)',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ShieldCheck className="w-7 h-7 text-[#00d4ff]" />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: 1, lineHeight: 1 }}>
                    INFOGRAM<span style={{ color: '#00d4ff' }}>&apos;26</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4, fontWeight: 700 }}>
                    Department of Information Technology • CAHCET
                  </div>
                </div>
              </div>

              {/* Applicant ID Pill */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 800 }}>
                  APPLICANT ID
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 900, color: '#00d4ff', letterSpacing: 1 }}>
                  {ticket.applicantId}
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '24px', marginBottom: '24px' }}>
              {/* Left Column: Participant & Events */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Credentials Box */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ fontSize: 9, color: '#00d4ff', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 800, marginBottom: 4 }}>
                    PASS HOLDER CREDENTIALS
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>
                    {ticket.studentName}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                    {ticket.department} {ticket.year ? `• ${ticket.year}` : ''}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    {ticket.college}
                  </div>
                </div>

                {/* Event Schedule */}
                <div>
                  <div style={{ fontSize: 10, color: '#ffd700', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Tag className="w-3.5 h-3.5 text-amber-400" /> REGISTERED EVENT SCHEDULE
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {structuredEvents.map((ev, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(0, 212, 255, 0.05)',
                          border: '1px solid rgba(0, 212, 255, 0.2)',
                          borderRadius: '14px',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            background: ev.category === 'Technical' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(192, 132, 252, 0.2)',
                            color: ev.category === 'Technical' ? '#00d4ff' : '#c084fc',
                            border: `1px solid ${ev.category === 'Technical' ? 'rgba(0,212,255,0.4)' : 'rgba(192,132,252,0.4)'}`,
                            fontSize: 9,
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 100,
                            textTransform: 'uppercase',
                          }}>
                            {ev.category}
                          </span>
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>
                            {ev.name}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                          <div style={{ color: '#fde047' }}>
                            ⏰ {ev.time}
                          </div>
                          <div style={{ color: '#7dd3fc' }}>
                            📍 {ev.venue}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: QR Code & Verification */}
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '18px',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}>
                <div style={{ background: '#ffffff', padding: 12, borderRadius: 14, boxShadow: '0 0 24px rgba(0, 212, 255, 0.25)' }}>
                  <QRCode
                    value={typeof window !== 'undefined' ? `${window.location.origin}/ticket/${id}` : `https://www.infogram26.in/ticket/${id}`}
                    size={140}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#040d1a"
                  />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2, fontWeight: 800 }}>
                    TICKET NUMBER
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#ffffff', fontWeight: 800, wordBreak: 'break-all' }}>
                    {ticket.ticketNumber}
                  </div>
                </div>

                <div style={{
                  background: ticket.status === 'valid' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${ticket.status === 'valid' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  color: ticket.status === 'valid' ? '#4ade80' : '#f87171',
                  padding: '4px 14px',
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}>
                  {ticket.status === 'valid' ? '✓ VALID ENTRY PASS' : ticket.status?.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Footer Meta */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
              <div>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>EVENT DATE: </span>
                <span style={{ fontWeight: 800, color: '#ffd700' }}>SATURDAY, 22 AUGUST 2026</span>
              </div>
              <div>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>OFFICIAL PORTAL: </span>
                <span style={{ fontWeight: 800, color: '#00d4ff' }}>www.infogram26.in</span>
              </div>
              <div>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>FEE PAID: </span>
                <span style={{ fontWeight: 900, color: '#4ade80' }}>₹{ticket.totalAmount || 50}</span>
              </div>
            </div>
          </div>

          {/* Bottom Metallic Trim */}
          <div style={{ height: '5px', background: 'linear-gradient(90deg, #ffd700, #00d4ff, #7c3aed)' }} />
        </div>
      </div>
    </PublicLayout>
  );
}
