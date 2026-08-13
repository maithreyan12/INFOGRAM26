'use client';
export const dynamic = 'force-dynamic';

import OrganizerLayout from '@/components/admin/OrganizerLayout';
import { Search, Download, Check, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEventStore } from '@/store/eventStore';
import { useLiveRegistrations } from '@/hooks/useLiveRegistrations';
import { listenToCollection, collections, createDocument, updateDocument } from '@/lib/firebase/firestore';
import type { AttendanceRecord } from '@/types';

export default function ParticipantsPage() {
  const { adminUser } = useAuth();
  const getEventByOrganizer = useEventStore((state) => state.getEventByOrganizer);
  const event = getEventByOrganizer(adminUser?.uid, adminUser?.assignedEventId);

  const { registrations } = useLiveRegistrations();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = listenToCollection<AttendanceRecord>(collections.attendance, setAttendance);
    return () => unsubscribe();
  }, []);

  const participants = useMemo(() => {
    if (!event) return [];
    return registrations
      .filter((r) => r.events.includes(event.id) && r.status === 'paid')
      .filter((r) => {
        const q = search.toLowerCase();
        return !q || r.personalInfo?.fullName?.toLowerCase().includes(q) || r.applicantId?.toLowerCase().includes(q);
      });
  }, [registrations, event, search]);

  const attendanceFor = (registrationId: string) => attendance.find((a) => a.registrationId === registrationId);

  const markAttendance = async (registrationId: string, isPresent: boolean) => {
    if (!event) return;
    const existing = attendanceFor(registrationId);
    const reg = registrations.find((r) => r.id === registrationId);
    try {
      if (existing) {
        await updateDocument(collections.attendance, existing.id, {
          isPresent,
          markedAt: new Date().toISOString(),
          markedBy: adminUser?.email || 'organizer',
        });
      } else {
        await createDocument(collections.attendance, {
          eventId: event.id,
          registrationId,
          applicantId: reg?.applicantId || '',
          studentName: reg?.personalInfo?.fullName || '',
          isPresent,
          markedAt: new Date().toISOString(),
          markedBy: adminUser?.email || 'organizer',
        });
      }
    } catch (err) {
      console.error('Failed to mark attendance:', err);
    }
  };

  const exportCsv = () => {
    const rows = [
      ['Applicant ID', 'Name', 'College', 'Department', 'Phone', 'Attendance'],
      ...participants.map((p) => [
        p.applicantId,
        p.personalInfo?.fullName || '',
        p.personalInfo?.college || '',
        p.personalInfo?.department || '',
        p.personalInfo?.phone || '',
        attendanceFor(p.id)?.isPresent ? 'Present' : 'Not marked',
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.slug || 'participants'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!event) {
    return (
      <OrganizerLayout>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
          No event currently assigned.
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Participants List</h1>
          <p className="text-gray-400 mt-1">Manage attendance for {event.name}</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg text-white font-medium transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="glass-card bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name or ID..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="glass-card bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">College</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-center">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {participants.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No participants registered yet.</td></tr>
              ) : participants.map((p) => {
                const record = attendanceFor(p.id);
                const isPresent = record?.isPresent;
                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{p.applicantId}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{p.personalInfo?.fullName}</div>
                      <div className="text-xs text-gray-500">{p.personalInfo?.department}, {p.personalInfo?.year}</div>
                    </td>
                    <td className="px-6 py-4">{p.personalInfo?.college}</td>
                    <td className="px-6 py-4">{p.personalInfo?.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => markAttendance(p.id, true)}
                          title="Mark Present"
                          className={`p-2 rounded-lg transition-colors ${isPresent === true ? 'bg-green-500/40 text-green-300' : 'bg-green-500/10 text-green-400 hover:bg-green-500/30'}`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => markAttendance(p.id, false)}
                          title="Mark Absent"
                          className={`p-2 rounded-lg transition-colors ${isPresent === false ? 'bg-red-500/40 text-red-300' : 'bg-red-500/10 text-red-400 hover:bg-red-500/30'}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </OrganizerLayout>
  );
}
