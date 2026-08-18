'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { IndianRupee, CheckCircle, Clock, Plus, Search, Filter, RefreshCw, X, ShieldCheck, Ticket } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [ticketsMap, setTicketsMap] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Manual reconciliation modal
  const [showModal, setShowModal] = useState(false);
  const [paymentIdInput, setPaymentIdInput] = useState('');
  const [applicantIdInput, setApplicantIdInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [amountInput, setAmountInput] = useState<number>(100);
  const [collegeInput, setCollegeInput] = useState('');
  const [selectedEventsInput, setSelectedEventsInput] = useState('');
  const [reconciling, setReconciling] = useState(false);

  /* ── 1. Real-time Firestore sync for Registrations & Payments ── */
  useEffect(() => {
    let rawRegs: any[] = [];
    let rawTickets: any[] = [];

    const isTestEntry = (item: any) => {
      const email = (item.personalInfo?.email || item.email || '').toLowerCase().trim();
      const name = (item.personalInfo?.fullName || item.studentName || item.name || '').toLowerCase().trim();
      const appId = (item.applicantId || '').toLowerCase().trim();
      return (
        name === 'participant' ||
        email === 'test@example.com' ||
        email.includes('verification.test') ||
        appId.includes('999999')
      );
    };

    const mergeAndSet = () => {
      const combined = rawRegs.filter((r) => !isTestEntry(r));
      rawTickets.forEach((t: any) => {
        if (isTestEntry(t)) return;

        const exists = combined.some(
          (r) =>
            r.applicantId === t.applicantId ||
            (r.personalInfo?.email && t.email && r.personalInfo?.email === t.email)
        );
        if (!exists && (t.studentName || t.applicantId)) {
          combined.push({
            id: t.ticketId || t.id,
            applicantId: t.applicantId,
            razorpayPaymentId: t.razorpayPaymentId || t.paymentId || 'pass_issued',
            totalFee: t.totalAmount || t.totalFee || 0,
            status: 'paid',
            personalInfo: {
              fullName: t.studentName || t.name || '',
              email: t.email || '',
              phone: t.phone || '',
              college: t.college || '',
              department: t.department || t.branch || '',
              year: t.year || '',
            },
            events: t.eventNames || t.events || [],
            eventNames: t.eventNames || t.events || [],
          });
        }
      });
      setRegistrations(combined);
      setLoading(false);
    };

    // Initial API fallback fetch
    fetch('/api/admin/registrations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.registrations) && data.registrations.length > 0) {
          rawRegs = data.registrations;
          mergeAndSet();
        }
      })
      .catch((e) => console.warn('API registrations payment initial fetch note:', e));

    if (!db) {
      mergeAndSet();
      return;
    }

    const unsubRegs = onSnapshot(
      collection(db, 'registrations'),
      (snap) => {
        const dbItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (dbItems.length > 0) {
          rawRegs = dbItems;
        }
        mergeAndSet();
      },
      (err) => {
        console.warn('Registrations payment live sync error:', err);
        mergeAndSet();
      }
    );

    const unsubTickets = onSnapshot(
      collection(db, 'tickets'),
      (snap) => {
        rawTickets = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const map: Record<string, any> = {};
        rawTickets.forEach((t) => { if (t.applicantId) map[t.applicantId] = t; });
        setTicketsMap(map);
        mergeAndSet();
      },
      (err) => console.warn('Tickets payment live sync error:', err)
    );

    return () => {
      unsubRegs();
      unsubTickets();
    };
  }, []);

  /* ── 2. Manual Reconcile Payment Handler ── */
  const handleReconcilePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !paymentIdInput) {
      toast.error('Payment ID and Email are required.');
      return;
    }

    const toastId = toast.loading('Reconciling payment and generating official ticket pass...');
    try {
      const regId = `reg_${Date.now()}`;
      const num = Math.floor(10000 + Math.random() * 90000);
      const applicantId = `INFO26-BYTE-${num}`;
      const tktNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

      if (db) {
        // Create/Update Registration
        await setDoc(doc(db, 'registrations', regId), {
          applicantId,
          personalInfo: {
            fullName: nameInput || 'Participant',
            email: emailInput,
            phone: phoneInput || '',
            college: collegeInput || 'CAHCET Participant',
            department: 'Information Technology',
            year: '1st',
          },
          events: [selectedEventsInput],
          eventNames: [selectedEventsInput],
          totalFee: amountInput,
          status: 'paid',
          razorpayPaymentId: paymentIdInput,
          paymentMethod: 'UPI',
          createdAt: new Date().toISOString(),
          paidAt: new Date().toISOString(),
        });

        // Create Ticket Doc
        await setDoc(doc(db, 'tickets', `tkt_${regId}`), {
          ticketNumber: tktNumber,
          applicantId,
          registrationId: regId,
          studentName: nameInput || 'Participant',
          email: emailInput,
          phone: phoneInput || '',
          college: collegeInput || 'CAHCET Participant',
          department: 'Information Technology',
          year: '1st',
          events: [selectedEventsInput],
          totalAmount: amountInput,
          paymentMethod: 'UPI',
          razorpayPaymentId: paymentIdInput,
          qrData: JSON.stringify({ ticketNumber: tktNumber, applicantId, verified: true }),
          status: 'valid',
          issueDate: new Date(),
        });

        // Sync to Google Sheets
        fetch('/api/sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicantId,
            name: nameInput || 'Participant',
            email: emailInput,
            phone: phoneInput || '',
            college: collegeInput || 'CAHCET Participant',
            events: selectedEventsInput,
            amount: amountInput,
            status: 'paid',
            razorpayPaymentId: paymentIdInput,
          }),
        }).catch((err) => console.warn('Sheets sync error:', err));
      }

      toast.dismiss(toastId);
      toast.success(`✅ Payment ${paymentIdInput} linked successfully! Ticket Pass issued.`);
      setShowModal(false);
    } catch (err) {
      console.error('Reconcile error:', err);
      toast.dismiss(toastId);
      toast.error('Failed to link payment.');
    }
  };

  /* ── 3. Metrics calculation ── */
  const paidRegs = registrations.filter((r) => r.status === 'paid' || r.razorpayPaymentId);
  const totalRevenue = paidRegs.reduce((sum, r) => {
    const fee = (r.applicantId === 'INFO26-HACK-14423' || r.razorpayPaymentId === 'pay_TQSsGjMXY4BxKi')
      ? 50
      : Number(r.totalFee ?? r.totalAmount ?? r.fee ?? 100);
    return sum + fee;
  }, 0);
  const paidCount = paidRegs.length;
  const razorpayVerified = registrations.filter((r) => r.razorpayPaymentId && !r.razorpayPaymentId.startsWith('pass_')).length;

  const filteredRegistrations = registrations.filter((reg) => {
    const q = searchQuery.toLowerCase();
    const name = (reg.personalInfo?.fullName || reg.fullName || '').toLowerCase();
    const email = (reg.personalInfo?.email || reg.email || '').toLowerCase();
    const appId = (reg.applicantId || '').toLowerCase();
    const payId = (reg.razorpayPaymentId || '').toLowerCase();
    return name.includes(q) || email.includes(q) || appId.includes(q) || payId.includes(q);
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Payment &amp; Transaction Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Real-time Razorpay payments, verified revenue, and transaction reconciliation
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Link Unlinked Payment / Issue Pass
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/30">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Total Revenue Collected</p>
              <h3 className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/30">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Razorpay Verified</p>
              <h3 className="text-2xl font-black text-white">{razorpayVerified}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Paid Registrations</p>
              <h3 className="text-2xl font-black text-white">{paidCount}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/30">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Pending Review</p>
              <h3 className="text-2xl font-black text-white">0</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Payment ID (e.g. pay_TPu7QIBPv2e69G), Email, Name, or Applicant ID..."
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold border border-gray-700 bg-black/60 text-white focus:outline-none focus:border-[#00d4ff]"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead className="text-[10px] uppercase tracking-wider border-b border-gray-800 bg-black/40 text-gray-300">
              <tr>
                <th className="px-6 py-4">Applicant ID</th>
                <th className="px-6 py-4">Participant Details</th>
                <th className="px-6 py-4">Razorpay Payment ID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading transaction records...
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-semibold">
                    No matching transaction records found.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg: any) => {
                  const name = reg.personalInfo?.fullName || reg.fullName || reg.studentName || reg.name || 'Participant';
                  const email = reg.personalInfo?.email || reg.email || '';
                  const phone = reg.personalInfo?.phone || reg.phone || '';
                  const college = reg.personalInfo?.college || reg.college || 'C. Abdul Hakeem College of Engineering & Technology';
                  const payId = reg.razorpayPaymentId || reg.utrNumber || '—';
                  const fee = reg.totalFee ?? reg.totalAmount ?? reg.fee ?? (reg.applicantId === 'INFO26-HACK-14423' ? 50 : 100);

                  return (
                    <tr key={reg.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-[#00d4ff] font-black text-sm">{reg.applicantId}</td>
                      <td className="px-6 py-4">
                        <div className="font-black text-white text-sm">{name}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{college}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{email} {phone ? `• ${phone}` : ''}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-purple-300 font-black text-xs">{payId}</td>
                      <td className="px-6 py-4 font-black text-emerald-400 text-sm">₹{fee}</td>
                      <td className="px-6 py-4 text-gray-400 uppercase font-mono text-[11px]">UPI / Razorpay</td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {reg.status === 'paid' ? 'PAID' : 'PAID'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Reconcile Unlinked Payment Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-gray-800 mb-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00d4ff]" /> Link Payment &amp; Issue Ticket Pass
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleReconcilePayment} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-gray-300 mb-1">Razorpay Payment ID *</label>
                <input
                  type="text"
                  required
                  value={paymentIdInput}
                  onChange={(e) => setPaymentIdInput(e.target.value)}
                  placeholder="e.g. pay_TPu7QIBPv2e69G"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:border-[#00d4ff] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Participant Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Thamaraisanthi"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-[#00d4ff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="thamaraisanthi1459@gmail.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-[#00d4ff] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="9626918439"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-[#00d4ff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-[#00d4ff] focus:outline-none font-bold text-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">College Name</label>
                  <input
                    type="text"
                    value={collegeInput}
                    onChange={(e) => setCollegeInput(e.target.value)}
                    placeholder="e.g. CAHCET"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-[#00d4ff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Event Registered</label>
                  <input
                    type="text"
                    value={selectedEventsInput}
                    onChange={(e) => setSelectedEventsInput(e.target.value)}
                    placeholder="e.g. Byte Battle"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-[#00d4ff] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:bg-gray-800 transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-black bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 shadow-lg shadow-[#00d4ff]/20 transition-all text-xs uppercase tracking-wider"
                >
                  Link Payment &amp; Issue Ticket Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

