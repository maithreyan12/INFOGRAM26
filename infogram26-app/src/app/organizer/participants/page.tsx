'use client';
export const dynamic = 'force-dynamic';

import OrganizerLayout from '@/components/admin/OrganizerLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEventStore } from '@/store/eventStore';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Search, Download, Users, IndianRupee, CheckCircle, Clock } from 'lucide-react';

export default function ParticipantsPage() {
  const { adminUser } = useAuth();
  const getEventByOrganizer = useEventStore((s) => s.getEventByOrganizer);
  const event = getEventByOrganizer(adminUser?.uid, adminUser?.assignedEventId);

  const [allRegs, setAllRegs] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  // Real-time Firestore listener - filter to this event only
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(collection(db, 'registrations'), (snap) => {
      const regs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAllRegs(regs);
    });
    return () => unsub();
  }, []);

  // Filter participants for this coordinator's event only, paid status only
  const participants = allRegs.filter((r) => {
    if (!event) return false;
    const isPaid = (r.status as string) === 'paid';
    if (!isPaid) return false;
    const regEvents: string[] = Array.isArray(r.eventNames) ? r.eventNames : (Array.isArray(r.events) ? r.events : []);
    return regEvents.some((ev: string) =>
      ev?.toLowerCase().includes(event.name?.toLowerCase()) ||
      event.name?.toLowerCase().includes(ev?.toLowerCase())
    );
  });

  const filtered = participants.filter((r) => {
    const name = (r.personalInfo?.fullName || r.studentName || '').toLowerCase();
    const phone = (r.personalInfo?.phone || r.phone || '').toLowerCase();
    const id = (r.applicantId || '').toLowerCase();
    const college = (r.personalInfo?.college || r.college || '').toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || phone.includes(q) || id.includes(q) || college.includes(q);
  });

  const totalRevenue = participants.reduce((sum, r) => sum + (r.totalFee || r.totalAmount || 50), 0);

  const handleExportCSV = () => {
    const rows = [
      ['Applicant ID', 'Name', 'College', 'Department', 'Year', 'Phone', 'Email', 'Fee Paid (₹)', 'Event'],
      ...filtered.map((r) => [
        r.applicantId || '',
        r.personalInfo?.fullName || r.studentName || '',
        r.personalInfo?.college || r.college || '',
        r.personalInfo?.department || r.department || '',
        r.personalInfo?.year || r.year || '',
        r.personalInfo?.phone || r.phone || '',
        r.personalInfo?.email || r.email || '',
        r.totalFee || r.totalAmount || 50,
        event?.name || '',
      ]),
    ];
    const csv = rows.map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.name || 'Event'}_Participants.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!event) {
    return (
      <OrganizerLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <Users className="w-12 h-12 text-gray-600 mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">No Event Assigned</h2>
          <p className="text-gray-400 text-sm">Ask the Super Admin to assign an event to your account.</p>
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-1">
            EVENT: {event.name}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Participants List</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Live registered participants for <span className="text-white font-bold">{event.name}</span>
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#08182b] border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl"><Users className="w-5 h-5 text-blue-400" /></div>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Registered</div>
            <div className="text-2xl font-black text-white">{participants.length}</div>
          </div>
        </div>
        <div className="bg-[#08182b] border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl"><IndianRupee className="w-5 h-5 text-emerald-400" /></div>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Fee Collected</div>
            <div className="text-2xl font-black text-emerald-400">₹{totalRevenue}</div>
          </div>
        </div>
        <div className="bg-[#08182b] border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl"><CheckCircle className="w-5 h-5 text-amber-400" /></div>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Event Status</div>
            <div className="text-lg font-black text-amber-400 uppercase">{event.status}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#08182b] border border-gray-800 rounded-2xl p-4 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Name, Phone, College, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-[#08182b] border border-gray-800 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Clock className="w-10 h-10 text-gray-600 mb-3" />
            <p className="text-white font-bold text-lg">
              {participants.length === 0 ? 'No participants yet for this event' : 'No results found'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {participants.length === 0
                ? 'Participants will appear here once they register and complete payment.'
                : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead className="text-[10px] uppercase tracking-wider border-b border-gray-800 bg-black/40 text-gray-300">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Applicant ID</th>
                  <th className="px-5 py-4">Name & Details</th>
                  <th className="px-5 py-4">College</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4 text-center">Fee Paid</th>
                  <th className="px-5 py-4 text-center">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {filtered.map((r, i) => (
                  <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-4 text-gray-500">{i + 1}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-[#00d4ff] font-black text-[11px]">
                        {r.applicantId || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-black text-white text-sm">
                        {r.personalInfo?.fullName || r.studentName || 'Participant'}
                      </div>
                      <div className="text-gray-400 text-[11px] font-semibold">
                        {r.personalInfo?.department || r.department || ''}{' '}
                        {r.personalInfo?.year ? `• ${r.personalInfo.year}` : r.year ? `• ${r.year}` : ''}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-300 text-[11px] max-w-[140px] truncate">
                      {r.personalInfo?.college || r.college || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-300 font-mono">
                      {r.personalInfo?.phone || r.phone || '—'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="font-black text-emerald-400 text-sm">
                        ₹{r.totalFee || r.totalAmount || 50}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <CheckCircle className="w-3 h-3" /> Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-center text-gray-600 text-xs font-semibold mt-4">
        Showing {filtered.length} of {participants.length} paid participants for {event.name}
      </p>
    </OrganizerLayout>
  );
}
