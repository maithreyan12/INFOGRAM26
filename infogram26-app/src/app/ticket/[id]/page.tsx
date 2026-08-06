'use client';

import React, { useEffect, useState, useRef } from 'react';

import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import PublicLayout from '@/components/layout/PublicLayout';
import { Download, Home, CheckCircle } from 'lucide-react';

export default function TicketPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (id === 'mock_ticket_123') {
          setTicket({
            id: 'mock_ticket_123',
            ticketNumber: 'TKT-DEMO-2026',
            applicantId: 'APP123456',
            studentName: 'Test Participant',
            email: 'test@example.com',
            phone: '9876543210',
            college: 'Demo College of Engineering',
            department: 'B.E Information Technology',
            year: '2nd',
            events: ['Code Clash', 'Web Warriors'],
            totalAmount: 350,
            utrNumber: '123456789012',
            qrData: JSON.stringify({ ticketNumber: 'TKT-DEMO-2026', applicantId: 'APP123456', verified: true }),
            status: 'valid',
            issueDate: { seconds: Date.now() / 1000 },
          });
          setLoading(false);
          return;
        }
        const ticketDoc = await getDoc(doc(db, 'tickets', id));
        if (ticketDoc.exists()) {
          setTicket({ id: ticketDoc.id, ...ticketDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      toast.info('Generating premium PDF ticket...');
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#040d1a',
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
      pdf.save(`INFOGRAM26_Ticket_${ticket.ticketNumber}.pdf`);
      toast.success('Ticket downloaded! See your Downloads folder.');
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
        <h1 className="text-4xl font-bold mb-4 text-white">Ticket Not Found</h1>
        <p className="text-white/50 mb-8">This ticket does not exist or has been removed.</p>
        <button onClick={() => router.push('/')} className="btn-primary px-8 py-3 rounded-xl font-medium">
          Return to Home
        </button>
      </div>
    </PublicLayout>
  );

  const issueDate = ticket.issueDate?.seconds
    ? new Date(ticket.issueDate.seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <PublicLayout>
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/25 rounded-full px-5 py-2 text-sm font-semibold text-green-400 mb-4">
              <CheckCircle className="w-4 h-4" /> Registration Successful
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Your Entry Pass is Ready!</h1>
            <p className="text-white/50 text-sm">Download and present this ticket at the registration desk on event day.</p>
          </div>

          {/* ══════════ PREMIUM TICKET ══════════ */}
          <div ref={ticketRef} className="relative w-full max-w-3xl mx-auto mb-8 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #040d1a 0%, #071422 50%, #040d1a 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              boxShadow: '0 0 60px rgba(0, 212, 255, 0.15), 0 0 120px rgba(0, 212, 255, 0.05)',
            }}
          >
            {/* Top decorative bar */}
            <div style={{
              height: '5px',
              background: 'linear-gradient(90deg, #00d4ff, #ffd700, #00d4ff)',
              width: '100%',
            }} />

            {/* Holographic shimmer overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.03) 0%, transparent 50%, rgba(255,215,0,0.03) 100%)',
            }} />

            {/* Corner accents */}
            <div className="absolute top-3 left-3" style={{ width: 20, height: 20, borderTop: '2px solid #00d4ff', borderLeft: '2px solid #00d4ff' }} />
            <div className="absolute top-3 right-3" style={{ width: 20, height: 20, borderTop: '2px solid #00d4ff', borderRight: '2px solid #00d4ff' }} />
            <div className="absolute bottom-3 left-3" style={{ width: 20, height: 20, borderBottom: '2px solid #ffd700', borderLeft: '2px solid #ffd700' }} />
            <div className="absolute bottom-3 right-3" style={{ width: 20, height: 20, borderBottom: '2px solid #ffd700', borderRight: '2px solid #ffd700' }} />

            <div className="flex flex-col md:flex-row p-6 sm:p-8 gap-6" style={{ minHeight: 320 }}>
              {/* LEFT: Ticket Info */}
              <div className="flex-1 flex flex-col gap-5">
                {/* Logo + Title */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div style={{
                      width: 42, height: 42,
                      background: 'rgba(0,212,255,0.1)',
                      border: '1px solid rgba(0,212,255,0.3)',
                      borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>
                        INFOGRAM<span style={{ color: '#00d4ff' }}>&apos;26</span>
                      </div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                        National Level Tech Symposium
                      </div>
                    </div>
                  </div>
                  <div style={{
                    height: 1,
                    background: 'linear-gradient(90deg, rgba(0,212,255,0.5), rgba(255,255,255,0.05))',
                    marginBottom: 16,
                  }} />
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase' }}>
                    Department of Information Technology
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>
                    C. Abdul Hakeem College of Engineering & Technology
                  </div>
                </div>

                {/* Participant */}
                <div>
                  <div style={{ fontSize: 10, color: '#00d4ff', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Participant</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{ticket.studentName}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
                    {ticket.department} • {ticket.year} Year
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{ticket.college}</div>
                </div>

                {/* Events */}
                <div>
                  <div style={{ fontSize: 10, color: '#ffd700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Registered Events</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(ticket.events || []).map((ev: string, i: number) => (
                      <span key={i} style={{
                        background: 'rgba(0,212,255,0.12)',
                        border: '1px solid rgba(0,212,255,0.25)',
                        color: '#00d4ff',
                        padding: '3px 10px',
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 600,
                      }}>
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom meta */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase' }}>Applicant ID</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#00d4ff' }}>{ticket.applicantId}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase' }}>Event Date</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#ffd700' }}>22 Aug 2026</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase' }}>Amount Paid</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#4ade80' }}>₹{ticket.totalAmount}</div>
                  </div>
                </div>
              </div>

              {/* Divider (tear line) */}
              <div className="hidden md:flex flex-col items-center" style={{ minWidth: 24 }}>
                <div style={{ flex: 1, width: 1, background: 'repeating-linear-gradient(to bottom, rgba(0,212,255,0.3) 0px, rgba(0,212,255,0.3) 6px, transparent 6px, transparent 12px)' }} />
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#040d1a', border: '1px solid rgba(0,212,255,0.2)', margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,212,255,0.4)' }} />
                </div>
                <div style={{ flex: 1, width: 1, background: 'repeating-linear-gradient(to bottom, rgba(0,212,255,0.3) 0px, rgba(0,212,255,0.3) 6px, transparent 6px, transparent 12px)' }} />
              </div>

              {/* RIGHT: QR + Ticket Number */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, minWidth: 160 }}>
                <div style={{ background: '#fff', padding: 12, borderRadius: 12, boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}>
                  <QRCode
                    value={ticket.qrData || ticket.ticketNumber}
                    size={128}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#040d1a"
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Ticket No.</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#fff', fontWeight: 600, wordBreak: 'break-all' }}>{ticket.ticketNumber}</div>
                </div>
                <div style={{
                  background: ticket.status === 'valid' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                  border: `1px solid ${ticket.status === 'valid' ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  color: ticket.status === 'valid' ? '#4ade80' : '#f87171',
                  padding: '3px 12px',
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase' as const,
                }}>
                  {ticket.status === 'valid' ? '✓ VALID' : ticket.status?.toUpperCase()}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: 1, textTransform: 'uppercase' }}>Issued</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{issueDate}</div>
                </div>
              </div>
            </div>

            {/* Bottom decorative bar */}
            <div style={{
              height: '4px',
              background: 'linear-gradient(90deg, #ffd700, #00d4ff, #ffd700)',
              width: '100%',
            }} />
          </div>
          {/* ══════════ END TICKET ══════════ */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="btn-primary flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base disabled:opacity-60"
            >
              {downloading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating PDF...</>
              ) : (
                <><Download className="w-5 h-5" /> Download PDF Ticket</>
              )}
            </button>
            <button
              onClick={() => router.push('/')}
              className="btn-glass flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base"
            >
              <Home className="w-5 h-5" /> Back to Home
            </button>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            Keep this ticket safe. Present it at the registration desk on 22 Aug 2026.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
