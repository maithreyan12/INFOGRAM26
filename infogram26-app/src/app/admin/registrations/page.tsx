'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, Download, CheckCircle2, UserCheck, Clock, RefreshCw, Ticket, ExternalLink, Copy } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, doc, updateDoc, addDoc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useEventStore } from '@/store/eventStore';
import { toast } from 'sonner';
import { OFFICIAL_EVENTS, isEventMatch } from '@/lib/eventsData';

export default function RegistrationsPage() {
  const storeRegistrations = useEventStore((state) => state.registrations);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [ticketsMap, setTicketsMap] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  /* ── 1. Real-time Firestore sync for Registrations & Tickets ── */
  useEffect(() => {
    if (!db) {
      setRegistrations(storeRegistrations || []);
      setLoading(false);
      return;
    }

    let rawRegs: any[] = [];
    let ticketItems: Record<string, any> = {};

    const updateCombinedList = () => {
      // Filter rawRegs to ONLY include paid registrations or those with a valid ticket
      const paidRegs = rawRegs.filter((r) => {
        const isPaidStatus = r.status === 'paid' || r.ticketId || ticketItems[r.applicantId];
        const email = (r.personalInfo?.email || r.email || '').toLowerCase().trim();
        const name = (r.personalInfo?.fullName || r.studentName || r.name || '').toLowerCase().trim();
        const appId = (r.applicantId || '').toLowerCase().trim();
        const isDemo =
          name === 'participant' ||
          name.includes('participant') ||
          appId.includes('98035') ||
          email.includes('verification.test') ||
          email.includes('arunkumar.cahcet') ||
          email === 'test@example.com' ||
          email.includes('test') ||
          name.includes('test') ||
          name.includes('verification') ||
          appId.includes('9999');
        return isPaidStatus && !isDemo;
      });

      const combined = [...paidRegs];

      // Add any tickets that are not in rawRegs
      Object.values(ticketItems).forEach((t: any) => {
        const email = (t.email || '').toLowerCase().trim();
        const name = (t.studentName || t.name || t.fullName || '').toLowerCase().trim();
        const appId = (t.applicantId || '').toLowerCase().trim();
        const isDemo =
          name === 'participant' ||
          name.includes('participant') ||
          appId.includes('98035') ||
          email.includes('verification.test') ||
          email.includes('arunkumar.cahcet') ||
          email === 'test@example.com' ||
          email.includes('test') ||
          name.includes('test') ||
          name.includes('verification') ||
          appId.includes('9999');
        if (isDemo) return;

        const exists = combined.some(
          (r) => r.applicantId === t.applicantId || (r.personalInfo?.email && r.personalInfo?.email === t.email)
        );
        if (!exists && (name || email)) {
          combined.push({
            id: t.registrationId || t.id,
            applicantId: t.applicantId || `INFO26-EVT-${Math.floor(10000 + Math.random() * 90000)}`,
            personalInfo: {
              fullName: t.studentName || t.fullName || '',
              email: t.email || '',
              phone: t.phone || '',
              college: t.college || '',
              department: t.department || '',
              year: t.year || '',
            },
            eventNames: Array.isArray(t.events) ? t.events : (t.events ? [t.events] : []),
            events: Array.isArray(t.events) ? t.events : (t.events ? [t.events] : []),
            totalFee: t.totalAmount || 0,
            status: 'paid',
            checkedIn: t.status === 'used' || t.checkedIn,
            attendanceStatus: t.status === 'used' || t.checkedIn ? 'checked_in' : 'pending',
            razorpayPaymentId: t.razorpayPaymentId,
          });
        }
      });

      // Fallback to storeRegistrations if empty
      setRegistrations(combined.length > 0 ? combined : (storeRegistrations || []).filter(r => (r.status as string) === 'paid' || r.status === 'confirmed'));
      setLoading(false);
    };

    // Realtime listener for registrations
    const unsubRegs = onSnapshot(
      collection(db, 'registrations'),
      (snap) => {
        rawRegs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        updateCombinedList();
      },
      (err) => {
        console.warn('Registrations live sync error:', err);
        updateCombinedList();
      }
    );

    // Realtime listener for tickets (to track QR check-in status and unlinked tickets)
    const unsubTickets = onSnapshot(
      collection(db, 'tickets'),
      (snap) => {
        const map: Record<string, any> = {};
        snap.docs.forEach((d) => {
          const data = d.data();
          if (data.applicantId) map[data.applicantId] = { id: d.id, ...data };
        });
        ticketItems = map;
        setTicketsMap(map);
        updateCombinedList();
      },
      (err) => console.warn('Tickets live sync error:', err)
    );

    return () => {
      unsubRegs();
      unsubTickets();
    };
  }, [storeRegistrations]);

  /* ── 2. Manual Check-in helper ── */
  const handleManualCheckIn = async (reg: any) => {
    try {
      if (!db) {
        toast.success(`Checked in ${reg.personalInfo?.fullName || reg.fullName || 'Participant'}`);
        return;
      }
      toast.info('Marking participant as Checked In...');

      // Update registration doc
      await updateDoc(doc(db, 'registrations', reg.id), {
        checkedIn: true,
        attendanceStatus: 'checked_in',
        checkedInAt: new Date(),
      });

      // Update matching ticket doc if exists
      const ticketInfo = ticketsMap[reg.applicantId];
      if (ticketInfo?.id) {
        await updateDoc(doc(db, 'tickets', ticketInfo.id), {
          status: 'used',
          checkedIn: true,
          checkedInAt: new Date(),
        });
      }

      // Sync to Google Sheets
      try {
        fetch('/api/sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicantId: reg.applicantId,
            name: reg.personalInfo?.fullName || reg.fullName,
            email: reg.personalInfo?.email || reg.email,
            phone: reg.personalInfo?.phone || reg.phone,
            college: reg.personalInfo?.college || reg.college,
            department: reg.personalInfo?.department || reg.department,
            events: Array.isArray(reg.eventNames || reg.events)
              ? (reg.eventNames || reg.events).join(', ')
              : reg.events,
            amount: reg.totalFee || 50,
            status: 'CHECKED IN (PRESENT)',
            checkedInAt: new Date().toISOString(),
          }),
        }).catch((e) => console.warn('Sheets sync warning:', e));
      } catch (sheetsErr) {
        console.warn('Sheets error:', sheetsErr);
      }

      toast.success(`✅ ${reg.personalInfo?.fullName || reg.fullName || 'Participant'} marked as Checked In (Green)!`);
    } catch (err) {
      console.error('Check-in error:', err);
      toast.error('Failed to check in participant');
    }
  };

  /* ── 3. Generate / Regenerate Ticket ── */
  const handleGenerateTicket = async (reg: any) => {
    try {
      if (!db) { toast.error('Database not connected'); return; }
      toast.info('Generating ticket...');

      const ticketId = `tkt_${reg.id}`;
      const applicantId = reg.applicantId || `INFO26-EVT-${Math.floor(10000 + Math.random() * 90000)}`;
      const name = reg.personalInfo?.fullName || reg.fullName || 'Participant';
      const email = reg.personalInfo?.email || reg.email || '';
      const phone = reg.personalInfo?.phone || reg.phone || '';
      const college = reg.personalInfo?.college || reg.college || 'Participant College';
      const dept = reg.personalInfo?.department || reg.department || 'Information Technology';
      const year = reg.personalInfo?.year || reg.year || '1st';
      const eventsList = reg.eventNames || reg.events || ['Symposium Event'];
      const amount = reg.totalFee || 50;

      const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
      const qrData = JSON.stringify({
        ticketNumber,
        applicantId,
        name,
        events: eventsList,
        verified: true,
      });

      await setDoc(doc(db, 'tickets', ticketId), {
        ticketNumber,
        applicantId,
        registrationId: reg.id,
        studentName: name,
        email,
        phone,
        college,
        department: dept,
        year,
        events: eventsList,
        totalAmount: amount,
        paymentMethod: reg.razorpayPaymentId ? 'razorpay' : 'manual',
        razorpayPaymentId: reg.razorpayPaymentId || '',
        qrData,
        status: 'valid',
        issueDate: serverTimestamp(),
      }, { merge: true });

      // Mark registration as paid too
      await updateDoc(doc(db, 'registrations', reg.id), {
        status: 'paid',
        ticketId,
      });

      const ticketUrl = `https://infogram26.in/ticket/${ticketId}`;
      await navigator.clipboard.writeText(ticketUrl).catch(() => {});
      toast.success(`✅ Ticket created! Link copied: ${ticketUrl}`, { duration: 8000 });

      // Sync to Sheets
      fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId, ticketNumber, name, email, phone, college,
          department: dept, year,
          events: Array.isArray(eventsList) ? eventsList.join(', ') : eventsList,
          amount, status: 'paid',
          razorpayPaymentId: reg.razorpayPaymentId || 'manual',
        }),
      }).catch(() => {});
    } catch (err) {
      console.error('Generate ticket error:', err);
      toast.error('Failed to generate ticket. Please try again.');
    }
  };


  const handleExportCSV = () => {
    if (registrations.length === 0) {
      toast.error('No registrations available to export.');
      return;
    }
    const headers = [
      'Applicant ID',
      'Name',
      'College',
      'Department',
      'Year',
      'Email',
      'Phone',
      'Events',
      'Amount Paid',
      'Payment Status',
      'Attendance / QR Scan Status',
    ];

    const rows = filteredRegistrations.map((reg) => {
      const ticketInfo = ticketsMap[reg.applicantId];
      const isCheckedIn = reg.checkedIn || reg.attendanceStatus === 'checked_in' || ticketInfo?.status === 'used' || ticketInfo?.checkedIn;
      const eventsStr = (reg.eventNames || reg.events || []).join('; ');
      return [
        `"${reg.applicantId || ''}"`,
        `"${reg.personalInfo?.fullName || reg.fullName || ''}"`,
        `"${reg.personalInfo?.college || reg.college || ''}"`,
        `"${reg.personalInfo?.department || reg.department || ''}"`,
        `"${reg.personalInfo?.year || reg.year || ''}"`,
        `"${reg.personalInfo?.email || reg.email || ''}"`,
        `"${reg.personalInfo?.phone || reg.phone || ''}"`,
        `"${eventsStr}"`,
        `"${reg.totalFee || 0}"`,
        `"${reg.status === 'paid' ? 'Paid' : 'Pending'}"`,
        `"${isCheckedIn ? 'CHECKED IN (PRESENT)' : 'NOT CHECKED IN'}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `INFOGRAM26_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully!');
  };

  /* ── 4. Filtering logic ── */
  const filteredRegistrations = registrations.filter((reg) => {
    const name = (reg.personalInfo?.fullName || reg.fullName || '').toLowerCase();
    const email = (reg.personalInfo?.email || reg.email || '').toLowerCase();
    const appId = (reg.applicantId || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch = name.includes(q) || email.includes(q) || appId.includes(q);

    const matchesEvent = !selectedEvent || isEventMatch(reg, { id: selectedEvent, slug: selectedEvent, name: selectedEvent });

    const ticketInfo = ticketsMap[reg.applicantId];
    const isCheckedIn = reg.checkedIn || reg.attendanceStatus === 'checked_in' || ticketInfo?.status === 'used' || ticketInfo?.checkedIn;

    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'checked_in' && isCheckedIn) ||
      (statusFilter === 'pending_entry' && !isCheckedIn) ||
      (statusFilter === 'paid' && reg.status === 'paid');

    return matchesSearch && matchesEvent && matchesStatus;
  });

  const totalCount = registrations.length;
  const checkedInCount = registrations.filter((reg) => {
    const t = ticketsMap[reg.applicantId];
    return reg.checkedIn || reg.attendanceStatus === 'checked_in' || t?.status === 'used' || t?.checkedIn;
  }).length;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Registrations &amp; Live Attendance
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Real-time participant check-in status (Turns Bright Green after QR scan at venue)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" /> Export CSV / Excel
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl border border-gray-800 bg-[#08182b] text-white">
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Registered</p>
          <p className="text-3xl font-black text-[#00d4ff] mt-1">{totalCount}</p>
        </div>
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-white">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> QR Scanned &amp; Present (Green)
          </p>
          <p className="text-3xl font-black text-emerald-400 mt-1">{checkedInCount}</p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-700 bg-slate-900/60 text-white">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Pending QR Scan (Normal)
          </p>
          <p className="text-3xl font-black text-slate-300 mt-1">{totalCount - checkedInCount}</p>
        </div>
      </div>

      {/* Controls / Filters */}
      <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Email, or Applicant ID (e.g. INFO26-BYTE-84920)..."
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold border border-gray-700 bg-black/60 text-white focus:outline-none focus:border-[#00d4ff]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="rounded-xl px-4 py-2.5 text-xs font-bold border border-gray-700 bg-black/60 text-white focus:outline-none focus:border-[#00d4ff]"
            >
              <option value="">All Events (All 16)</option>
              {OFFICIAL_EVENTS.map((evt) => (
                <option key={evt.id} value={evt.name}>
                  {evt.name} ({evt.category === 'technical' ? 'Tech' : 'Non-Tech'})
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl px-4 py-2.5 text-xs font-bold border border-gray-700 bg-black/60 text-white focus:outline-none focus:border-[#00d4ff]"
            >
              <option value="">Attendance: All</option>
              <option value="checked_in">✓ Checked In / Present (Green)</option>
              <option value="pending_entry">Pending Entry (Normal)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead className="text-[10px] uppercase tracking-wider border-b border-gray-800 bg-black/40 text-gray-300">
              <tr>
                <th className="px-6 py-4">Applicant ID</th>
                <th className="px-6 py-4">Participant Credentials</th>
                <th className="px-6 py-4">Events Registered</th>
                <th className="px-6 py-4">Payment Status</th>
                <th className="px-6 py-4">QR Scan &amp; Attendance Status</th>
                <th className="px-6 py-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading live registrations...
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-semibold">
                    No matching registrations found.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg: any) => {
                  const ticketInfo = ticketsMap[reg.applicantId];
                  const isCheckedIn =
                    reg.checkedIn ||
                    reg.attendanceStatus === 'checked_in' ||
                    ticketInfo?.status === 'used' ||
                    ticketInfo?.checkedIn;

                  const name = reg.personalInfo?.fullName || reg.fullName || reg.studentName || reg.name || '—';
                  const college = reg.personalInfo?.college || reg.college || 'C. Abdul Hakeem College of Engineering & Technology';
                  const dept = reg.personalInfo?.department || reg.department || 'Information Technology';
                  const year = reg.personalInfo?.year || reg.year || '2nd Year';
                  const email = reg.personalInfo?.email || reg.email || '';
                  const phone = reg.personalInfo?.phone || reg.phone || '';
                  const eventsList = reg.eventNames || reg.events || [];

                  return (
                    <tr
                      key={reg.id}
                      className={`transition-colors ${
                        isCheckedIn ? 'bg-emerald-950/20 hover:bg-emerald-900/30' : 'hover:bg-gray-800/50'
                      }`}
                    >
                      {/* Applicant ID */}
                      <td className="px-6 py-4 font-mono text-[#00d4ff] font-black text-sm">{reg.applicantId}</td>

                      {/* Participant Info */}
                      <td className="px-6 py-4">
                        <div className="font-black text-white text-sm">{name}</div>
                        <div className="text-[11px] text-gray-300 font-semibold mt-0.5">
                          {dept} {year ? `• ${year.includes('Year') ? year : `${year} Year`}` : ''}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">{college}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                          {email} {phone ? `• ${phone}` : ''}
                        </div>
                      </td>

                      {/* Events */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {eventsList.map((ev: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300"
                            >
                              {ev}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4">
                        <div className="font-black text-amber-400 text-sm">₹{reg.totalFee || 0}</div>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {reg.status === 'paid' ? 'PAID' : 'PAID'}
                        </span>
                      </td>

                      {/* QR Scan & Attendance Status (NORMAL BEFORE SCAN -> BRIGHT GREEN AFTER SCAN) */}
                      <td className="px-6 py-4">
                        {isCheckedIn ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-md shadow-emerald-500/20 animate-pulse">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>✓ CHECKED IN (PRESENT)</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>PENDING QR SCAN (NORMAL)</span>
                          </div>
                        )}
                      </td>

                      {/* Quick Action */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          {/* Generate / View Ticket */}
                          {ticketInfo?.id ? (
                            <a
                              href={`https://infogram26.in/ticket/${ticketInfo.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/30 transition-all active:scale-95"
                            >
                              <ExternalLink className="w-3 h-3" /> View Ticket
                            </a>
                          ) : (
                            <button
                              onClick={() => handleGenerateTicket(reg)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 transition-all active:scale-95"
                            >
                              <Ticket className="w-3 h-3" /> Gen Ticket
                            </button>
                          )}
                          {/* Check In */}
                          {!isCheckedIn ? (
                            <button
                              onClick={() => handleManualCheckIn(reg)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md transition-all active:scale-95"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Check In
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-400 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-xs font-semibold gap-2">
          <span>Showing {filteredRegistrations.length} of {totalCount} attendees</span>
          <span className="text-emerald-400 font-bold">
            {checkedInCount} Attendees Verified &amp; Present (Green)
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}

