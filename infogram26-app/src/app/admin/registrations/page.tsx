'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, Download, CheckCircle2, UserCheck, Clock, RefreshCw } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useEventStore } from '@/store/eventStore';
import { toast } from 'sonner';

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

    // Realtime listener for registrations
    const unsubRegs = onSnapshot(
      collection(db, 'registrations'),
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setRegistrations(list.length > 0 ? list : storeRegistrations || []);
        setLoading(false);
      },
      (err) => {
        console.warn('Registrations live sync error:', err);
        setRegistrations(storeRegistrations || []);
        setLoading(false);
      }
    );

    // Realtime listener for tickets (to track QR check-in status)
    const unsubTickets = onSnapshot(
      collection(db, 'tickets'),
      (snap) => {
        const map: Record<string, any> = {};
        snap.docs.forEach((d) => {
          const data = d.data();
          if (data.applicantId) map[data.applicantId] = { id: d.id, ...data };
        });
        setTicketsMap(map);
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

  /* ── 3. CSV / Excel Export ── */
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
        `"${reg.totalFee || 50}"`,
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

    const eventsList = (reg.eventNames || reg.events || []).map((e: string) => e.toLowerCase());
    const matchesEvent = !selectedEvent || eventsList.some((e: string) => e.includes(selectedEvent.toLowerCase()));

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
              <option value="">All Events</option>
              <option value="byte">Byte Battle</option>
              <option value="tech">Tech Talks</option>
              <option value="code">Codestorm</option>
              <option value="pixel">Pixel Craft</option>
              <option value="hack">Hack Forge</option>
              <option value="bgmi">Battle Verse (BGMI)</option>
              <option value="quest">Quest X</option>
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

                  const name = reg.personalInfo?.fullName || reg.fullName || 'Participant';
                  const college = reg.personalInfo?.college || reg.college || 'CAHCET';
                  const dept = reg.personalInfo?.department || reg.department || 'IT';
                  const year = reg.personalInfo?.year || reg.year || '1st';
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
                          {dept} • {year} Year
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
                        <div className="font-black text-amber-400 text-sm">₹{reg.totalFee || 50}</div>
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

