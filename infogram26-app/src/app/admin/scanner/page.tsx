'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import {
  ScanLine, Search, CheckCircle, XCircle, AlertTriangle,
  User, Calendar, CreditCard, Hash, Building, Clock, Ticket,
} from 'lucide-react';
import { toast } from 'sonner';

type TicketData = {
  id: string;
  ticketNumber: string;
  applicantId: string;
  studentName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  events: string[];
  totalAmount: number;
  paymentMethod: string;
  razorpayPaymentId?: string;
  utrNumber?: string;
  qrData: string;
  status: string;
  issueDate: any;
};

export default function ScannerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [searching, setSearching] = useState(false);
  const [scanResult, setScanResult] = useState<'valid' | 'invalid' | 'used' | 'not-found' | null>(null);
  const [markingUsed, setMarkingUsed] = useState(false);
  const scannerRef = useRef<any>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  /* ── Start camera scanner ── */
  const startScanner = useCallback(async () => {
    if (scanning) return;
    setScanning(true);
    setTicket(null);
    setScanResult(null);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');

      // Small delay to let DOM mount
      await new Promise(r => setTimeout(r, 200));

      if (!document.getElementById('qr-reader')) return;

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText: string) => {
          // Stop scanner on successful scan
          try { await scanner.stop(); } catch {}
          setScanning(false);
          await lookupTicket(decodedText);
        },
        () => {} // ignore errors during scanning
      );
    } catch (err) {
      console.error('Scanner error:', err);
      toast.error('Camera access denied or unavailable');
      setScanning(false);
    }
  }, [scanning]);

  /* ── Stop scanner ── */
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => { stopScanner(); };
  }, [stopScanner]);

  /* ── Lookup ticket by QR data, ticket URL, ticket number, or applicant ID ── */
  const lookupTicket = async (input: string) => {
    setSearching(true);
    setTicket(null);
    setScanResult(null);

    try {
      if (!db) { toast.error('Database not connected'); return; }

      let searchField = input.trim();

      // Extract ticket ID if full URL is scanned/pasted
      if (searchField.includes('/ticket/')) {
        const parts = searchField.split('/ticket/');
        searchField = parts[parts.length - 1].split('?')[0].split('#')[0].trim();
      }

      let ticketNumber = '';
      let applicantId = '';

      try {
        const qrParsed = JSON.parse(searchField);
        ticketNumber = qrParsed.ticketNumber || '';
        applicantId = qrParsed.applicantId || '';
      } catch {
        ticketNumber = searchField;
        applicantId = searchField;
      }

      let foundTicket: TicketData | null = null;

      // Search by ticketNumber
      if (ticketNumber) {
        const q1 = query(collection(db, 'tickets'), where('ticketNumber', '==', ticketNumber));
        const snap1 = await getDocs(q1);
        if (!snap1.empty) {
          const d = snap1.docs[0];
          foundTicket = { id: d.id, ...d.data() } as TicketData;
        }
      }

      // Search by applicantId
      if (!foundTicket && applicantId) {
        const q2 = query(collection(db, 'tickets'), where('applicantId', '==', applicantId));
        const snap2 = await getDocs(q2);
        if (!snap2.empty) {
          const d = snap2.docs[0];
          foundTicket = { id: d.id, ...d.data() } as TicketData;
        }
      }

      // Search by document ID (ticket ID in URL)
      if (!foundTicket && searchField.length > 10) {
        try {
          const { getDoc } = await import('firebase/firestore');
          const docSnap = await getDoc(doc(db, 'tickets', searchField));
          if (docSnap.exists()) {
            foundTicket = { id: docSnap.id, ...docSnap.data() } as TicketData;
          }
        } catch {}
      }

      if (foundTicket) {
        setTicket(foundTicket);
        if (foundTicket.status === 'valid') {
          setScanResult('valid');
          toast.success('Valid ticket found!');
        } else if (foundTicket.status === 'used') {
          setScanResult('used');
          toast.warning('This ticket has already been used!');
        } else {
          setScanResult('invalid');
          toast.error('Ticket is invalid or expired');
        }
      } else {
        setScanResult('not-found');
        toast.error('Ticket not found');
      }
    } catch (err) {
      console.error('Lookup error:', err);
      toast.error('Error looking up ticket');
      setScanResult('not-found');
    } finally {
      setSearching(false);
    }
  };

  /* ── Mark ticket as used (check-in) ── */
  const markAsUsed = async () => {
    if (!ticket || !db) return;
    setMarkingUsed(true);
    try {
      await updateDoc(doc(db, 'tickets', ticket.id), {
        status: 'used',
        checkedInAt: new Date(),
      });
      setTicket({ ...ticket, status: 'used' });
      setScanResult('used');
      toast.success('✅ Attendee checked in successfully!');
    } catch (err) {
      console.error('Check-in error:', err);
      toast.error('Failed to check in');
    } finally {
      setMarkingUsed(false);
    }
  };

  /* ── Manual search ── */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    lookupTicket(searchQuery.trim());
  };

  /* ── Result colors ── */
  const resultColors = {
    valid: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle },
    used: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: AlertTriangle },
    invalid: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: XCircle },
    'not-found': { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: XCircle },
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-[#00d4ff]" />
            </div>
            Ticket Scanner
          </h1>
          <p className="text-gray-400 text-sm mt-2">Scan QR codes or search by Ticket No. / Applicant ID to verify entry.</p>
        </div>

        {/* Scanner + Search */}
        <div className="space-y-4 mb-8">
          {/* Camera Scanner */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                📷 Camera Scanner
              </h2>
              <button
                onClick={scanning ? stopScanner : startScanner}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  scanning
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    : 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 hover:bg-[#00d4ff]/30'
                }`}
              >
                {scanning ? '■ Stop Camera' : '▶ Start Camera'}
              </button>
            </div>
            <div className="p-4">
              <div
                ref={scannerContainerRef}
                id="qr-reader"
                className="rounded-xl overflow-hidden"
                style={{
                  width: '100%',
                  minHeight: scanning ? 300 : 0,
                  display: scanning ? 'block' : 'none',
                  background: '#000',
                }}
              />
              {!scanning && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <ScanLine className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-sm font-bold">Click &quot;Start Camera&quot; to scan a ticket QR code</p>
                  <p className="text-gray-600 text-xs mt-1">Works on mobile — point camera at the ticket</p>
                </div>
              )}
            </div>
          </div>

          {/* Manual Search */}
          <form onSubmit={handleSearch} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-[#00d4ff]" /> Manual Search
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Enter Ticket No. (TKT-...) or Applicant ID (APP...)"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00d4ff]/50 transition-all"
              />
              <button
                type="submit"
                disabled={searching || !searchQuery.trim()}
                className="px-6 py-3 rounded-xl bg-[#00d4ff] text-slate-950 font-black text-sm hover:brightness-110 disabled:opacity-40 transition-all"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Scan Result ── */}
        {scanResult && (
          <div className="space-y-4">
            {/* Status Banner */}
            <div className={`${resultColors[scanResult].bg} ${resultColors[scanResult].border} border rounded-2xl p-5 flex items-center gap-4`}>
              {React.createElement(resultColors[scanResult].icon, {
                className: `w-8 h-8 ${resultColors[scanResult].text}`,
              })}
              <div>
                <h3 className={`font-black text-lg ${resultColors[scanResult].text}`}>
                  {scanResult === 'valid' && '✅ Valid Ticket'}
                  {scanResult === 'used' && '⚠️ Already Checked In'}
                  {scanResult === 'invalid' && '❌ Invalid Ticket'}
                  {scanResult === 'not-found' && '❌ Ticket Not Found'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {scanResult === 'valid' && 'This ticket is valid and ready for check-in.'}
                  {scanResult === 'used' && 'This attendee has already been checked in.'}
                  {scanResult === 'invalid' && 'This ticket is expired or invalid.'}
                  {scanResult === 'not-found' && 'No ticket found with this ID. Verify manually.'}
                </p>
              </div>
            </div>

            {/* Ticket Details */}
            {ticket && (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-sm font-black text-white uppercase tracking-wider">Attendee Details</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow icon={Ticket} label="Ticket No." value={ticket.ticketNumber} color="text-[#00d4ff]" />
                    <InfoRow icon={Hash} label="Applicant ID" value={ticket.applicantId} color="text-[#00d4ff]" />
                    <InfoRow icon={User} label="Name" value={ticket.studentName} />
                    <InfoRow icon={Building} label="College" value={ticket.college} />
                    <InfoRow icon={Calendar} label="Events" value={(ticket.events || []).join(', ')} color="text-amber-400" />
                    <InfoRow icon={CreditCard} label="Amount Paid" value={`₹${ticket.totalAmount}`} color="text-emerald-400" />
                    <InfoRow icon={Clock} label="Payment Method" value={ticket.paymentMethod?.toUpperCase() || 'N/A'} />
                    {ticket.razorpayPaymentId && (
                      <InfoRow icon={CreditCard} label="Razorpay ID" value={ticket.razorpayPaymentId} color="text-violet-400" />
                    )}
                  </div>

                  {/* Check-in Button */}
                  {scanResult === 'valid' && (
                    <button
                      onClick={markAsUsed}
                      disabled={markingUsed}
                      className="w-full mt-4 py-4 rounded-xl bg-emerald-500 text-white font-black text-base hover:bg-emerald-400 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                    >
                      {markingUsed ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Checking In...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Mark as Checked In
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scan Another */}
            <button
              onClick={() => {
                setTicket(null);
                setScanResult(null);
                setSearchQuery('');
              }}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              🔄 Scan Another Ticket
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

/* ── Info Row Component ── */
function InfoRow({ icon: Icon, label, value, color = 'text-white' }: {
  icon: any; label: string; value: string; color?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{value || 'N/A'}</p>
      </div>
    </div>
  );
}
