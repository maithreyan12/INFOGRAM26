'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Users, IndianRupee, Calendar as CalendarIcon, Clock, Plus, Bell, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEventStore } from '@/store/eventStore';
import { useTheme } from '@/context/ThemeContext';

export default function AdminDashboard() {
  const { events, organizers, registrations } = useEventStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalRegistrations = registrations.length;
  const totalRevenue = registrations.reduce((sum, r) => sum + r.totalFee, 0);
  const activeEventsCount = events.length;
  const organizersCount = organizers.length;

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
              Super Admin Mode
            </span>
            <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              maithreyan2006@gmail.com
            </span>
          </div>
          <h1 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`} style={{ fontFamily: 'var(--font-display)' }}>
            Dashboard Overview
          </h1>
          <p className={`mt-1 text-xs sm:text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            System-wide analytics, symposium events metrics, and organizer management
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/events"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create Event
          </Link>
          <Link
            href="/admin/organizers"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider border transition-all active:scale-95 ${
              isDark
                ? 'bg-slate-900 border-purple-500/30 text-white hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <UserCheck className="w-4 h-4 text-purple-500" /> Manage Event Admins
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className={`p-6 rounded-3xl border shadow-xl transition-all ${
          isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Total Registrations
              </p>
              <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {totalRegistrations}
              </h3>
              <p className="text-purple-400 text-xs mt-2 font-bold">Across all symposium events</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400 border border-purple-500/30">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border shadow-xl transition-all ${
          isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Total Revenue
              </p>
              <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                ₹{totalRevenue.toLocaleString('en-IN')}
              </h3>
              <p className="text-emerald-400 text-xs mt-2 font-bold">Verified registration fees</p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/30">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border shadow-xl transition-all ${
          isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Active Events
              </p>
              <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {activeEventsCount}
              </h3>
              <p className="text-blue-400 text-xs mt-2 font-bold">Technical &amp; Non-Technical</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 border border-blue-500/30">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border shadow-xl transition-all ${
          isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Event Admins
              </p>
              <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {organizersCount}
              </h3>
              <p className="text-amber-400 text-xs mt-2 font-bold">Assigned student coordinators</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/30">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events Table */}
        <div className={`p-6 rounded-3xl border shadow-xl ${
          isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
              Events &amp; Assigned Admins
            </h2>
            <Link href="/admin/events" className="text-xs font-black uppercase text-purple-400 hover:underline flex items-center gap-1">
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead className={`uppercase text-[10px] tracking-wider border-b ${
                isDark ? 'bg-slate-950/80 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <tr>
                  <th className="px-4 py-3">Event Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Event Admin</th>
                  <th className="px-4 py-3 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                {events.map((evt) => {
                  const org = organizers.find((o) => o.uid === evt.organizerUid || o.assignedEventId === evt.id);
                  return (
                    <tr key={evt.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className={`px-4 py-3.5 font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>{evt.name}</td>
                      <td className="px-4 py-3.5 capitalize">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          evt.category === 'technical'
                            ? (isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200')
                            : (isDark ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-teal-50 text-teal-700 border-teal-200')
                        }`}>
                          {evt.category}
                        </span>
                      </td>
                      <td className={`px-4 py-3.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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
        <div className={`p-6 rounded-3xl border shadow-xl ${
          isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
              Recent Registrations
            </h2>
            <Link href="/admin/registrations" className="text-xs font-black uppercase text-purple-400 hover:underline flex items-center gap-1">
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead className={`uppercase text-[10px] tracking-wider border-b ${
                isDark ? 'bg-slate-950/80 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <tr>
                  <th className="px-4 py-3">Applicant ID</th>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">College</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                {registrations.map((reg) => (
                  <tr key={reg.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="px-4 py-3.5 font-mono text-purple-400 font-bold">{reg.applicantId}</td>
                    <td className={`px-4 py-3.5 font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>{reg.fullName}</td>
                    <td className={`px-4 py-3.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{reg.college}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase">
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
