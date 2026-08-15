'use client';
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import PublicLayout from '@/components/layout/PublicLayout';
import { Search, Ticket, Phone, Mail, ArrowRight, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

export default function MyTicketPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'phone' | 'email'>('phone');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const val = searchValue.trim();
    if (!val) { toast.error('Please enter your mobile number, email, or Applicant ID'); return; }

    setLoading(true);
    setSearched(false);
    setResults([]);

    try {
      if (!db) { toast.error('Database connection unavailable'); setLoading(false); return; }

      const rawDigits = val.replace(/\D/g, '').slice(-10);
      const searchLower = val.toLowerCase();
      const matchedMap = new Map<string, any>();

      // ── 1. Search by Applicant ID (exact & formatted) ──
      const appCodeVariations = [
        val,
        val.toUpperCase(),
        val.toLowerCase(),
        val.replace(/INFO26EVT/i, 'INFO26-EVT-'),
        val.replace(/INFO26HACK/i, 'INFO26-HACK-'),
        val.replace(/INFO26BYTE/i, 'INFO26-BYTE-'),
        val.replace(/INFO26TECH/i, 'INFO26-TECH-'),
        val.replace(/INFO26CODE/i, 'INFO26-CODE-'),
      ];

      for (const appVar of appCodeVariations) {
        if (!appVar) continue;
        try {
          const qApp = query(collection(db, 'tickets'), where('applicantId', '==', appVar), limit(5));
          const snapApp = await getDocs(qApp);
          snapApp.docs.forEach((d) => {
            const data = d.data();
            const dedupKey = (data.applicantId || data.phone || data.email || d.id).toLowerCase();
            matchedMap.set(dedupKey, { id: d.id, ...data });
          });
        } catch {}

        if (matchedMap.size === 0) {
          try {
            const qRegApp = query(collection(db, 'registrations'), where('applicantId', '==', appVar), limit(5));
            const snapRegApp = await getDocs(qRegApp);
            snapRegApp.docs.forEach((d) => {
              const data = d.data();
              const fakeId = data.ticketId || `tkt_${d.id}`;
              matchedMap.set(fakeId, {
                id: fakeId,
                registrationId: d.id,
                studentName: data.personalInfo?.fullName || data.studentName || 'Participant',
                email: data.personalInfo?.email || data.email || '',
                phone: data.personalInfo?.phone || data.phone || '',
                college: data.personalInfo?.college || data.college || '',
                department: data.personalInfo?.department || data.department || '',
                year: data.personalInfo?.year || data.year || '',
                events: data.eventNames || data.events || [],
                totalAmount: data.totalFee || 50,
                status: data.status === 'paid' ? 'valid' : 'pending',
                applicantId: data.applicantId,
              });
            });
          } catch {}
        }
      }

      // ── 2. Search by Phone Number (if digits >= 10) ──
      if (rawDigits.length >= 10) {
        const phoneVariations = [
          rawDigits,
          `+91${rawDigits}`,
          `+91 ${rawDigits}`,
          `91${rawDigits}`,
        ];

        for (const pVar of phoneVariations) {
          try {
            const q1 = query(collection(db, 'tickets'), where('phone', '==', pVar), limit(5));
            const snap1 = await getDocs(q1);
            snap1.docs.forEach((d) => {
              const data = d.data();
              const dedupKey = (data.applicantId || data.phone || data.email || d.id).toLowerCase();
              matchedMap.set(dedupKey, { id: d.id, ...data });
            });
          } catch {}
        }

        if (matchedMap.size === 0) {
          for (const pVar of phoneVariations) {
            try {
              const q2 = query(collection(db, 'registrations'), where('personalInfo.phone', '==', pVar), limit(5));
              const snap2 = await getDocs(q2);
              snap2.docs.forEach((d) => {
                const data = d.data();
                const fakeId = data.ticketId || `tkt_${d.id}`;
                matchedMap.set(fakeId, {
                  id: fakeId,
                  registrationId: d.id,
                  studentName: data.personalInfo?.fullName || data.studentName || 'Participant',
                  email: data.personalInfo?.email || data.email || '',
                  phone: data.personalInfo?.phone || data.phone || '',
                  college: data.personalInfo?.college || data.college || '',
                  department: data.personalInfo?.department || data.department || '',
                  year: data.personalInfo?.year || data.year || '',
                  events: data.eventNames || data.events || [],
                  totalAmount: data.totalFee || 50,
                  status: data.status === 'paid' ? 'valid' : 'pending',
                  applicantId: data.applicantId,
                });
              });
            } catch {}
          }
        }
      }

      // ── 3. Search by Email (if contains '@') ──
      if (searchLower.includes('@')) {
        try {
          const q1 = query(collection(db, 'tickets'), where('email', '==', searchLower), limit(5));
          const snap1 = await getDocs(q1);
          snap1.docs.forEach((d) => {
            const data = d.data();
            const dedupKey = (data.applicantId || data.phone || data.email || d.id).toLowerCase();
            matchedMap.set(dedupKey, { id: d.id, ...data });
          });
        } catch {}

        if (matchedMap.size === 0) {
          try {
            const q2 = query(collection(db, 'registrations'), where('personalInfo.email', '==', searchLower), limit(5));
            const snap2 = await getDocs(q2);
            snap2.docs.forEach((d) => {
              const data = d.data();
              const fakeId = data.ticketId || `tkt_${d.id}`;
              matchedMap.set(fakeId, {
                id: fakeId,
                registrationId: d.id,
                studentName: data.personalInfo?.fullName || data.studentName || 'Participant',
                email: data.personalInfo?.email || data.email || '',
                phone: data.personalInfo?.phone || data.phone || '',
                college: data.personalInfo?.college || data.college || '',
                department: data.personalInfo?.department || data.department || '',
                year: data.personalInfo?.year || data.year || '',
                events: data.eventNames || data.events || [],
                totalAmount: data.totalFee || 50,
                status: data.status === 'paid' ? 'valid' : 'pending',
                applicantId: data.applicantId,
              });
            });
          } catch {}
        }
      }

      const tickets = Array.from(matchedMap.values());
      setResults(tickets);
      setSearched(true);

      if (tickets.length === 0) {
        toast.info('No ticket found for this contact. If paid, please contact support on WhatsApp.');
      } else {
        toast.success(`Found ${tickets.length} entry pass(es)!`);
      }
    } catch (err) {
      console.error('Ticket search error:', err);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const glassBg = isDark
    ? 'bg-white/[0.04] border-white/[0.08] backdrop-blur-xl'
    : 'bg-white/70 border-white/40 backdrop-blur-xl';

  return (
    <PublicLayout>
      <div className={`min-h-screen pt-28 pb-16 px-4 ${isDark ? 'bg-[#030a16]' : 'bg-gradient-to-br from-slate-50 to-purple-50/30'}`}>
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black uppercase tracking-wider mb-4 ${isDark ? 'bg-amber-400/10 border border-amber-400/30 text-amber-300' : 'bg-purple-500/10 border border-purple-500/20 text-purple-700'}`}>
              <Ticket className="w-4 h-4" /> Official Entry Pass Lookup
            </div>
            <h1 className={`text-3xl sm:text-4xl font-black tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-display)' }}>
              DOWNLOAD YOUR TICKET
            </h1>
            <p className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Enter your registered mobile number or email to view and download your official INFOGRAM&apos;26 entry pass PDF
            </p>
          </div>

          {/* Search Card */}
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-2xl ${glassBg}`}>
            {/* Toggle */}
            <div className={`flex rounded-2xl p-1 mb-6 ${isDark ? 'bg-white/[0.06]' : 'bg-slate-100'}`}>
              <button
                onClick={() => { setSearchType('phone'); setSearchValue(''); setSearched(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${searchType === 'phone' ? (isDark ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20' : 'bg-purple-600 text-white shadow-md') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}
              >
                <Phone className="w-4 h-4" /> Mobile Number
              </button>
              <button
                onClick={() => { setSearchType('email'); setSearchValue(''); setSearched(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${searchType === 'email' ? (isDark ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20' : 'bg-purple-600 text-white shadow-md') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}
              >
                <Mail className="w-4 h-4" /> Email Address
              </button>
            </div>

            {/* Input */}
            <div className="relative mb-4">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {searchType === 'phone' ? <Phone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
              </div>
              <input
                type={searchType === 'phone' ? 'tel' : 'email'}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder={searchType === 'phone' ? 'Enter 10-digit mobile number (e.g. 9626918439)' : 'Enter email (e.g. participant@gmail.com)'}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold border transition-all focus:outline-none focus:ring-2 ${isDark ? 'bg-white/[0.06] border-white/[0.1] text-white placeholder-slate-500 focus:border-amber-400 focus:ring-amber-400/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/20'}`}
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${isDark ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-xl shadow-amber-400/25' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-500/30'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {loading ? 'Searching Passes...' : 'Download Ticket'}
            </button>
          </div>

          {/* Results */}
          {searched && (
            <div className="mt-6 space-y-4">
              {results.length === 0 ? (
                <div className={`rounded-3xl border p-8 text-center ${glassBg}`}>
                  <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
                  <h3 className={`font-black text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No Pass Found</h3>
                  <p className={`text-xs sm:text-sm font-semibold mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    We couldn&apos;t find an entry pass for <span className="font-mono font-bold text-amber-400">{searchValue}</span>. If you completed payment via UPI or Razorpay, send your transaction screenshot on WhatsApp to instantly generate your ticket.
                  </p>
                  <a
                    href={`https://wa.me/918722964910?text=Hi! I paid for INFOGRAM'26 but can't find my ticket. My contact number is ${encodeURIComponent(searchValue)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    📱 Contact WhatsApp Support (+91 87229 64910)
                  </a>
                </div>
              ) : (
                results.map((ticket) => (
                  <div key={ticket.id} className={`rounded-3xl border p-6 shadow-2xl transition-all hover:border-amber-400/50 ${glassBg}`}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pass Holder</div>
                        <div className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-display)' }}>
                          {ticket.studentName || ticket.name}
                        </div>
                        <div className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {ticket.department} {ticket.year ? `• ${ticket.year.includes('Year') ? ticket.year : `${ticket.year} Year`}` : ''}
                        </div>
                        <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ticket.college}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Applicant ID</div>
                        <div className={`font-mono font-black text-base ${isDark ? 'text-amber-300' : 'text-purple-700'}`}>{ticket.applicantId}</div>
                      </div>
                    </div>

                    {/* Events */}
                    <div className="mt-4 pt-4 border-t border-white/[0.08]">
                      <div className={`text-[10px] font-black uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Registered Event</div>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(ticket.events) ? ticket.events : [ticket.events]).filter(Boolean).map((ev: string, i: number) => (
                          <span key={i} className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isDark ? 'bg-amber-400/15 border border-amber-400/30 text-amber-300' : 'bg-purple-500/10 border border-purple-500/20 text-purple-700'}`}>
                            ⚡ {ev}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" /> Official Valid Entry Pass
                      </div>
                      <button
                        onClick={() => router.push(`/ticket/${ticket.id}`)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 ${isDark ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-lg shadow-amber-400/20' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20'}`}
                      >
                        View &amp; Download Pass PDF <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Direct link for contact */}
          <div className={`mt-8 rounded-2xl border p-5 text-center ${isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-slate-200 bg-white/50'}`}>
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              For quick support, WhatsApp us directly at <a href="https://wa.me/918722964910" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-400 hover:underline">+91 87229 64910</a>
            </p>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
