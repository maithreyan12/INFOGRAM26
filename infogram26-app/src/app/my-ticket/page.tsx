'use client';
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import PublicLayout from '@/components/layout/PublicLayout';
import { Search, Ticket, Phone, Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
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
    if (!val) { toast.error('Please enter your phone or email'); return; }
    if (searchType === 'phone' && !/^\d{10}$/.test(val.replace(/\D/g, '').slice(-10))) {
      toast.error('Enter a valid 10-digit mobile number'); return;
    }
    if (searchType === 'email' && !val.includes('@')) {
      toast.error('Enter a valid email address'); return;
    }

    setLoading(true);
    setSearched(false);
    setResults([]);

    try {
      if (!db) { toast.error('Database not available'); setLoading(false); return; }

      const tickets: any[] = [];

      // Search in tickets collection
      const normalizedPhone = val.replace(/\D/g, '').slice(-10);
      const field = searchType === 'phone' ? 'phone' : 'email';
      const searchVal = searchType === 'phone' ? normalizedPhone : val.toLowerCase();

      const q = query(
        collection(db, 'tickets'),
        where(field, '==', searchType === 'phone' ? normalizedPhone : val),
        limit(5)
      );
      const snap = await getDocs(q);
      snap.docs.forEach(d => tickets.push({ id: d.id, ...d.data() }));

      // Also try registrations if tickets empty
      if (tickets.length === 0) {
        const regField = searchType === 'phone' ? 'personalInfo.phone' : 'personalInfo.email';
        const q2 = query(
          collection(db, 'registrations'),
          where(regField, '==', searchType === 'phone' ? normalizedPhone : val),
          limit(5)
        );
        const snap2 = await getDocs(q2);
        snap2.docs.forEach(d => {
          const data = d.data();
          tickets.push({
            id: `tkt_${d.id}`,
            registrationId: d.id,
            studentName: data.personalInfo?.fullName || 'Participant',
            email: data.personalInfo?.email || '',
            phone: data.personalInfo?.phone || '',
            college: data.personalInfo?.college || '',
            department: data.personalInfo?.department || '',
            year: data.personalInfo?.year || '',
            events: data.eventNames || data.events || [],
            totalAmount: data.totalFee || 50,
            status: data.status === 'paid' ? 'valid' : 'pending',
            applicantId: data.applicantId,
            fromRegistration: true,
          });
        });
      }

      setResults(tickets);
      setSearched(true);
      if (tickets.length === 0) {
        toast.info('No ticket found. Contact support if you have paid.');
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
              <Ticket className="w-4 h-4" /> Find Your Entry Pass
            </div>
            <h1 className={`text-4xl font-black tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-display)' }}>
              RETRIEVE YOUR TICKET
            </h1>
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Enter your registered mobile number or email to find your INFOGRAM&apos;26 entry pass
            </p>
          </div>

          {/* Search Card */}
          <div className={`rounded-3xl border p-8 shadow-2xl ${glassBg}`}>
            {/* Toggle */}
            <div className={`flex rounded-2xl p-1 mb-6 ${isDark ? 'bg-white/[0.06]' : 'bg-slate-100'}`}>
              <button
                onClick={() => setSearchType('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${searchType === 'phone' ? (isDark ? 'bg-amber-400 text-slate-900' : 'bg-purple-600 text-white shadow-md') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}
              >
                <Phone className="w-3.5 h-3.5" /> Mobile Number
              </button>
              <button
                onClick={() => setSearchType('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${searchType === 'email' ? (isDark ? 'bg-amber-400 text-slate-900' : 'bg-purple-600 text-white shadow-md') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}
              >
                <Mail className="w-3.5 h-3.5" /> Email Address
              </button>
            </div>

            {/* Input */}
            <div className="relative mb-4">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {searchType === 'phone' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              </div>
              <input
                type={searchType === 'phone' ? 'tel' : 'email'}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder={searchType === 'phone' ? 'Enter your 10-digit mobile number' : 'Enter your registered email address'}
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-semibold border transition-all focus:outline-none focus:ring-2 ${isDark ? 'bg-white/[0.06] border-white/[0.1] text-white placeholder-slate-500 focus:border-amber-400 focus:ring-amber-400/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/20'}`}
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${isDark ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-lg shadow-amber-400/25' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30'}`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? 'Searching...' : 'Find My Ticket'}
            </button>
          </div>

          {/* Results */}
          {searched && (
            <div className="mt-6 space-y-4">
              {results.length === 0 ? (
                <div className={`rounded-3xl border p-8 text-center ${glassBg}`}>
                  <AlertCircle className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
                  <h3 className={`font-black text-base mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No Ticket Found</h3>
                  <p className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    We couldn&apos;t find a ticket with that {searchType}. If you&apos;ve paid, please contact us on WhatsApp with your UPI transaction ID.
                  </p>
                  <a
                    href="https://wa.me/919043293530?text=Hi, I paid for INFOGRAM26 but haven't received my ticket. My UPI Transaction ID is:"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all ${isDark ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                  >
                    📱 WhatsApp Support
                  </a>
                </div>
              ) : (
                results.map((ticket) => (
                  <div key={ticket.id} className={`rounded-3xl border p-6 shadow-xl ${glassBg}`}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className={`text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pass Holder</div>
                        <div className={`text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{ticket.studentName || ticket.name}</div>
                        <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {ticket.department} • {ticket.year} Year
                        </div>
                        <div className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{ticket.college}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Applicant ID</div>
                        <div className={`font-mono font-black text-sm ${isDark ? 'text-amber-300' : 'text-purple-700'}`}>{ticket.applicantId}</div>
                      </div>
                    </div>

                    {/* Events */}
                    <div className="mt-4">
                      <div className={`text-[10px] font-black uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Registered Events</div>
                      <div className="flex flex-wrap gap-1.5">
                        {(Array.isArray(ticket.events) ? ticket.events : [ticket.events]).filter(Boolean).map((ev: string, i: number) => (
                          <span key={i} className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${isDark ? 'bg-amber-400/10 border border-amber-400/30 text-amber-300' : 'bg-purple-500/10 border border-purple-500/20 text-purple-700'}`}>
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status + Link */}
                    <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase ${ticket.status === 'valid' ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400' : 'bg-amber-500/15 border border-amber-500/40 text-amber-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        {ticket.status === 'valid' ? 'Valid Entry Pass' : 'Processing'}
                      </div>
                      {ticket.status === 'valid' && !ticket.fromRegistration && (
                        <button
                          onClick={() => router.push(`/ticket/${ticket.id}`)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 ${isDark ? 'bg-amber-400 hover:bg-amber-300 text-slate-900' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                        >
                          View & Download Pass <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {ticket.fromRegistration && (
                        <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Contact support for your ticket link
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Help Note */}
          <div className={`mt-8 rounded-2xl border p-5 text-center ${isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-slate-200 bg-white/50'}`}>
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Can&apos;t find your ticket? Share your UPI transaction screenshot on WhatsApp and we&apos;ll generate your ticket within 2 hours.
            </p>
            <a
              href="https://wa.me/919043293530"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 mt-3 text-xs font-black ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
            >
              📱 +91 90432 93530 (WhatsApp Support)
            </a>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
