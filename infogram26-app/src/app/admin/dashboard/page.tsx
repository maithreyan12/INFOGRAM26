'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Users, IndianRupee, Calendar as CalendarIcon, Clock, Plus, Bell, UserCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useEventStore } from '@/store/eventStore';

export default function AdminDashboard() {
  const { events, organizers, registrations } = useEventStore();

  const totalRegistrations = registrations.length;
  const totalRevenue = registrations.reduce((sum, r) => sum + r.totalFee, 0);
  const activeEventsCount = events.length;
  const organizersCount = organizers.length;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span>Dashboard Overview</span>
            <span className="text-xs bg-purple-600/30 text-purple-300 border border-purple-500/40 px-3 py-1 rounded-full font-semibold">
              Super Admin Mode
            </span>
          </h1>
          <p className="text-gray-400 mt-1 text-sm">System-wide performance, events overview, and event admin metrics</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/events" className="btn-primary flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-lg shadow-purple-600/20">
            <Plus className="w-4 h-4" /> Create Event
          </Link>
          <Link href="/admin/organizers" className="btn-glass flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl text-white font-medium text-sm">
            <UserCheck className="w-4 h-4" /> Manage Event Admins
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Registrations</p>
              <h3 className="text-3xl font-bold text-white">{totalRegistrations}</h3>
              <p className="text-purple-400 text-xs mt-2 font-medium">Across all symposium events</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-white">₹{totalRevenue.toLocaleString('en-IN')}</h3>
              <p className="text-green-400 text-xs mt-2 font-medium">Verified payments</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Active Events</p>
              <h3 className="text-3xl font-bold text-white">{activeEventsCount}</h3>
              <p className="text-blue-400 text-xs mt-2 font-medium">Each assigned to an admin</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Event Admins</p>
              <h3 className="text-3xl font-bold text-white">{organizersCount}</h3>
              <p className="text-amber-400 text-xs mt-2 font-medium">Assigned coordinators</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Events & Assigned Admins</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-gray-400">
                <tr>
                  <th className="px-4 py-3">Event Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Event Admin</th>
                  <th className="px-4 py-3">Registrations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((evt) => {
                  const org = organizers.find((o) => o.uid === evt.organizerUid || o.assignedEventId === evt.id);
                  return (
                    <tr key={evt.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-white">{evt.name}</td>
                      <td className="px-4 py-3 text-xs capitalize text-purple-300">{evt.category}</td>
                      <td className="px-4 py-3 text-xs text-gray-300">
                        {org ? org.displayName : 'Unassigned'}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-white">
                        {evt.registeredCount} / {evt.maxParticipants}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Link href="/admin/events" className="block text-center text-sm text-purple-400 hover:text-purple-300 mt-4 font-semibold">
            Manage All Events &rarr;
          </Link>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Recent Registrations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-gray-400">
                <tr>
                  <th className="px-4 py-3">Applicant ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">College</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-purple-400">{reg.applicantId}</td>
                    <td className="px-4 py-3 text-white font-medium">{reg.fullName}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{reg.college}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-medium">
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/admin/registrations" className="block text-center text-sm text-purple-400 hover:text-purple-300 mt-4 font-semibold">
            View All Registrations &rarr;
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
