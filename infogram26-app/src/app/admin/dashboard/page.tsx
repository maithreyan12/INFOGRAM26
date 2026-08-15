'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Users, IndianRupee, Calendar as CalendarIcon, Clock, Plus, Bell, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEventStore } from '@/store/eventStore';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

export default function AdminDashboard() {
  const { events, organizers, registrations: storeRegistrations } = useEventStore();
  const [liveRegistrations, setLiveRegistrations] = useState<any[]>([]);

  useEffect(() => {
    if (!db) {
      setLiveRegistrations(storeRegistrations || []);
      return;
    }

    let rawRegs: any[] = [];
    let ticketMap: Record<string, any> = {};

    const isTestEntry = (item: any) => {
      const email = (item.personalInfo?.email || item.email || '').toLowerCase();
      const name = (item.personalInfo?.fullName || item.studentName || item.name || '').toLowerCase();
      const appId = (item.applicantId || '').toLowerCase();
      return (
        email.includes('test') ||
        email.includes('verification') ||
        email.includes('arunkumar') ||
        name.includes('test') ||
        name.includes('verification') ||
        appId.includes('9999') ||
        appId.includes('test')
      );
    };

    const updateMetrics = () => {
      // Start from real registrations only
      const combined = rawRegs.filter((r) => !isTestEntry(r));

      // Add ticket-only entries (HackForge team passes, manually issued passes)
      // that don't already exist in registrations
      Object.values(ticketMap).forEach((t: any) => {
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
            totalFee: t.totalAmount || 100,
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

      const filteredStoreRegs = (storeRegistrations || []).filter((r) => !isTestEntry(r));
      setLiveRegistrations(combined.length > 0 ? combined : filteredStoreRegs);
    };

    const unsubRegs = onSnapshot(collection(db, 'registrations'), (snap) => {
      rawRegs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      updateMetrics();
    });

    const unsubTickets = onSnapshot(collection(db, 'tickets'), (snap) => {
      const map: Record<string, any> = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data.applicantId) map[data.applicantId] = data;
      });
      ticketMap = map;
      updateMetrics();
    });

    return () => {
      unsubRegs();
      unsubTickets();
    };
  }, [storeRegistrations]);

  const activeRegistrations = liveRegistrations.length > 0 ? liveRegistrations : storeRegistrations;
  const totalRegistrations = activeRegistrations.length;
  const totalRevenue = activeRegistrations.reduce((sum, r) => sum + (r.totalFee || 50), 0);
  const activeEventsCount = events.length;
  const organizersCount = organizers.length;

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40 px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
              Super Admin Mode
            </span>
            <span className="text-[11px] font-bold text-gray-400">
              maithreyan2006@gmail.com
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Dashboard Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            System-wide analytics, symposium events metrics, and organizer management
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/events"
            className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] px-4 py-2.5 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create Event
          </Link>
          <Link
            href="/admin/organizers"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider border border-gray-700 bg-[#08182b] text-white hover:bg-gray-800 transition-all active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-[#00d4ff]" /> Manage Event Admins
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-wider mb-1 text-gray-400">
                Total Registrations
              </p>
              <h3 className="text-3xl font-black text-white">
                {totalRegistrations}
              </h3>
              <p className="text-[#00d4ff] text-xs mt-2 font-bold">Across all symposium events</p>
            </div>
            <div className="p-3 bg-[#00d4ff]/10 rounded-2xl text-[#00d4ff] border border-[#00d4ff]/30">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-wider mb-1 text-gray-400">
                Total Revenue
              </p>
              <h3 className="text-3xl font-black text-white">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </h3>
              <p className="text-emerald-400 text-xs mt-2 font-bold">Verified registration fees</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/30">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-wider mb-1 text-gray-400">
                Active Events
              </p>
              <h3 className="text-3xl font-black text-white">
                {activeEventsCount}
              </h3>
              <p className="text-purple-400 text-xs mt-2 font-bold">Technical &amp; Non-Technical</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/30">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-wider mb-1 text-gray-400">
                Event Admins
              </p>
              <h3 className="text-3xl font-black text-white">
                {organizersCount}
              </h3>
              <p className="text-amber-400 text-xs mt-2 font-bold">Assigned student coordinators</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/30">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events Table */}
        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-white">
              Events &amp; Assigned Admins
            </h2>
            <Link href="/admin/events" className="text-xs font-black uppercase text-[#00d4ff] hover:underline flex items-center gap-1">
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead className="text-[10px] uppercase tracking-wider border-b border-gray-800 bg-black/40 text-gray-300">
                <tr>
                  <th className="px-4 py-3">Event Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Event Admin</th>
                  <th className="px-4 py-3 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {events.map((evt) => {
                  const org = organizers.find((o) => o.uid === evt.organizerUid || o.assignedEventId === evt.id);
                  return (
                    <tr key={evt.id} className="transition-colors hover:bg-gray-800/50">
                      <td className="px-4 py-3.5 font-black text-sm text-white">{evt.name}</td>
                      <td className="px-4 py-3.5 capitalize">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          evt.category === 'technical'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                        }`}>
                          {evt.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-300">
                        {org ? org.displayName : 'IT Association'}
                      </td>
                      <td className="px-4 py-3.5 text-right font-black text-amber-400">
                        {evt.registeredCount} / {evt.maxParticipants}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-white">
              Recent Registrations
            </h2>
            <Link href="/admin/registrations" className="text-xs font-black uppercase text-[#00d4ff] hover:underline flex items-center gap-1">
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead className="text-[10px] uppercase tracking-wider border-b border-gray-800 bg-black/40 text-gray-300">
                <tr>
                  <th className="px-4 py-3">Applicant ID</th>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">College</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {activeRegistrations.slice(0, 5).map((reg: any) => {
                  const name = reg.personalInfo?.fullName || reg.fullName || 'Participant';
                  const college = reg.personalInfo?.college || reg.college || 'CAHCET';
                  return (
                    <tr key={reg.id} className="transition-colors hover:bg-gray-800/50">
                      <td className="px-4 py-3.5 font-mono text-[#00d4ff] font-bold">{reg.applicantId}</td>
                      <td className="px-4 py-3.5 font-black text-white">{name}</td>
                      <td className="px-4 py-3.5 text-gray-300">{college}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase">
                          {reg.status === 'paid' ? 'PAID' : reg.status?.toUpperCase() || 'VERIFIED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
