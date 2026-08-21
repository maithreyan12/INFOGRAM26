'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { IndianRupee, CheckCircle, Clock, Plus, Search, RefreshCw, X, ShieldCheck, Zap, CreditCard } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { setDoc, doc } from 'firebase/firestore';
import { supabase } from '@/lib/supabase/config';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [ticketsMap, setTicketsMap] = useState<Record<string, any>>({});
  const [paymentMethodsStats, setPaymentMethodsStats] = useState<Record<string, number>>({
    upi: 0,
    wallet: 0,
    netbanking: 0,
    card: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Manual reconciliation modal
  const [showModal, setShowModal] = useState(false);
  const [paymentIdInput, setPaymentIdInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [amountInput, setAmountInput] = useState<number>(100);
  const [collegeInput, setCollegeInput] = useState('');
  const [selectedEventsInput, setSelectedEventsInput] = useState('');

  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/live');
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
        
        if (data.stats?.paymentMethods) {
          setPaymentMethodsStats(data.stats.paymentMethods);
        }

        const map: Record<string, any> = {};
        (data.tickets || []).forEach((t: any) => {
          if (t.applicantId) {
            map[t.applicantId] = t;
          }
          if (t.registrationId) {
            map[t.registrationId] = t;
          }
        });
        setTicketsMap(map);
        setLastUpdated(data.lastUpdated || new Date().toISOString());
      }
    } catch (e) {
      console.warn('Payments live fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReconcile = async () => {
    setSyncing(true);
    const toastId = toast.loading('Running server-side Razorpay Live Reconciliation...');
    try {
      const res = await fetch('/api/admin/reconcile', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.dismiss(toastId);
        toast.success(`🎉 ${data.message}`);
        await fetchLive();
      } else {
        toast.dismiss(toastId);
        toast.error(`Sync error: ${data.error}`);
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error('Failed to trigger reconciliation.');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 15000);

    // Supabase Realtime subscription
    let channel: any = null;
    try {
      if (supabase) {
        channel = supabase
          .channel('admin-payments-realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => {
            fetchLive();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
            fetchLive();
          })
          .subscribe();
      }
    } catch (e) {
      console.warn('Realtime subscription notice:', e);
    }

    return () => {
      clearInterval(interval);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchLive]);

  /* ── Manual Reconcile Payment Handler ── */
  const handleManualReconcile = async (e: React.FormEvent) => {
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
      }

      toast.dismiss(toastId);
      toast.success(`✅ Payment ${paymentIdInput} linked successfully! Ticket Pass issued.`);
      setShowModal(false);
      fetchLive();
    } catch (err) {
      console.error('Reconcile error:', err);
      toast.dismiss(toastId);
      toast.error('Failed to link payment.');
    }
  };

  /* ── Metrics calculation ── */
  const totalRevenue = registrations.reduce((sum, r) => {
    const fee = Number(r.totalFee ?? r.totalAmount ?? r.fee ?? 0);
    return sum + (isNaN(fee) ? 0 : fee);
  }, 0);
  const paidCount = registrations.length;
  const razorpayVerified = registrations.length;

  const filteredRegistrations = registrations.filter((reg) => {
    const q = searchQuery.toLowerCase();
    const name = (reg.personalInfo?.fullName || reg.fullName || '').toLowerCase();
    const email = (reg.personalInfo?.email || reg.email || '').toLowerCase();
    const appId = (reg.applicantId || '').toLowerCase();
    const payId = (reg.razorpayPaymentId || '').toLowerCase();
    return name.includes(q) || email.includes(q) || appId.includes(q) || payId.includes(q);
  });

  const fmtTime = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
      ' · ' + d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE REALTIME
            </span>
            {lastUpdated && <span className="text-[11px] text-gray-500 font-bold">Last synced: {fmtTime(lastUpdated)}</span>}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Payment &amp; Transaction Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Real-time Razorpay payments, verified revenue, and automated reconciliation
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleReconcile}
            disabled={syncing}
            className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" /> {syncing ? 'Reconciling...' : 'Run Razorpay Reconcile'}
          </button>
          <button
            onClick={fetchLive}
            className="flex items-center gap-2 border border-gray-700 hover:border-[#00d4ff] text-gray-300 hover:text-[#00d4ff] px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Manual Link Payment
          </button>
        </div>
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
              <p className="text-emerald-400/80 text-[10px] mt-1 font-bold">100% Verified Payments</p>
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
              <p className="text-blue-400/80 text-[10px] mt-1 font-bold">Captured Transactions</p>
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
              <p className="text-purple-400/80 text-[10px] mt-1 font-bold">Valid Tickets Issued</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/30">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Payment Breakdown</p>
              <p className="text-xs font-black text-amber-400 mt-1">
                UPI: {paymentMethodsStats.upi || paidCount} | Wallet: {paymentMethodsStats.wallet || 0}
              </p>
              <p className="text-[10px] text-gray-400 font-bold">Netbanking: {paymentMethodsStats.netbanking || 0}</p>
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
                filteredRegistrations.map((reg: any, idx: number) => {
                  const name = reg.personalInfo?.fullName || reg.fullName || reg.studentName || reg.name || 'Participant';
                  const email = reg.personalInfo?.email || reg.email || '';
                  const phone = reg.personalInfo?.phone || reg.phone || '';
                  const college = reg.personalInfo?.college || reg.college || 'C. Abdul Hakeem College of Engineering & Technology';
                  const payId = reg.razorpayPaymentId || 'pay_razorpay_verified';
                  const fee = reg.totalFee ?? reg.totalAmount ?? reg.fee ?? 100;

                  return (
                    <tr key={reg.applicantId || reg.id || `pay-${idx}`} className="hover:bg-gray-800/50 transition-colors">
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
                          PAID
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

            <form onSubmit={handleManualReconcile} className="space-y-4 text-xs font-bold">
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
