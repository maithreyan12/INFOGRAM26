'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Users, IndianRupee, Calendar as CalendarIcon, Plus, UserCheck, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useEventStore } from '@/store/eventStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/config';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { user, adminUser, role } = useAuth();
  const { events, organizers } = useEventStore();
  const [liveRegistrations, setLiveRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalRevenue: 0,
    totalTickets: 0,
    organizersCount: 0,
    eventSlots: {} as Record<string, number>,
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/live');
      const data = await res.json();
      if (data.success) {
        setLiveRegistrations(data.registrations || []);
        setStats(data.stats || { totalPaid: 0, totalRevenue: 0, totalTickets: 0, organizersCount: 0, eventSlots: {} });
        setLastUpdated(data.lastUpdated || new Date().toISOString());
      }
    } catch (e) {
      console.warn('Dashboard live fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReconcile = async () => {
    setSyncing(true);
    const toastId = toast.loading('Synchronizing Razorpay & Supabase records...');
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

    // 1. Fallback polling every 15 seconds
    const interval = setInterval(fetchLive, 15000);

    // 2. Supabase Realtime Subscription for instant updates
    let channel: any = null;
    try {
      if (supabase) {
        channel = supabase
          .channel('admin-dashboard-realtime')
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

  const paidRegistrations = liveRegistrations;
  const totalRegistrations = stats.totalPaid;
  const totalRevenue = stats.totalRevenue;
  const activeEventsCount = events.length;
  const displayOrganizersCount = stats.organizersCount || organizers.length;

  const fmtTime = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
      ' · ' + d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40 px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
              {role === 'super_admin' ? 'Super Admin Mode' : 'Event Admin Mode'}
            </span>
            <span className="text-[11px] font-bold text-gray-400">
              {user?.displayName || adminUser?.displayName || 'Administrator'}
            </span>
            {/* Realtime indicator */}
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE REALTIME
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Dashboard Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400 flex items-center gap-2 flex-wrap">
            <span>Live data from Supabase &amp; Razorpay</span>
            {lastUpdated && <span className="text-gray-500">· Last synced: {fmtTime(lastUpdated)}</span>}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleReconcile}
            disabled={syncing}
            className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" /> {syncing ? 'Syncing...' : 'Sync Payment Data'}
          </button>
          <button
            onClick={fetchLive}
            className="flex items-center gap-2 border border-gray-700 hover:border-[#00d4ff] text-gray-300 hover:text-[#00d4ff] px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <Link
            href="/admin/registrations"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-600/20 transition-all active:scale-95"
          >
            <Users className="w-4 h-4" /> View Attendees
          </Link>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-wider mb-1 text-gray-400">Confirmed Attendees</p>
              <h3 className="text-3xl font-black text-white">
                {loading ? <span className="animate-pulse text-gray-600">—</span> : totalRegistrations}
              </h3>
              <p className="text-[#00d4ff] text-xs mt-2 font-bold">{stats.totalTickets} tickets issued</p>
            </div>
            <div className="p-3 bg-[#00d4ff]/10 rounded-2xl text-[#00d4ff] border border-[#00d4ff]/30">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-wider mb-1 text-gray-400">Total Revenue</p>
              <h3 className="text-3xl font-black text-emerald-400">
                {loading ? <span className="animate-pulse text-gray-600">—</span> : `₹${totalRevenue.toLocaleString('en-IN')}`}
              </h3>
              <p className="text-emerald-400/80 text-xs mt-2 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Razorpay verified
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/30">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-wider mb-1 text-gray-400">Active Events</p>
              <h3 className="text-3xl font-black text-white">{activeEventsCount}</h3>
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
              <p className="text-xs font-black uppercase tracking-wider mb-1 text-gray-400">Event Admins</p>
              <h3 className="text-3xl font-black text-white">{displayOrganizersCount}</h3>
              <p className="text-amber-400 text-xs mt-2 font-bold">Assigned coordinators</p>
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
                {events.map((evt, idx) => {
                  const org = organizers.find((o: any) => o.uid === evt.organizerUid || o.assignedEventId === evt.id);
                  const evtCount = stats.eventSlots[evt.name] || 0;

                  return (
                    <tr key={evt.id || evt.slug || `evt-${idx}`} className="transition-colors hover:bg-gray-800/50">
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
                        {loading ? '—' : evtCount} / {evt.maxSlots || 200}
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
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {loading && liveRegistrations.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-600 font-bold">Loading live data...</td></tr>
                )}
                {liveRegistrations.slice(0, 15).map((reg: any, index: number) => (
                  <tr key={reg.id || reg.applicantId || `reg-${index}`} className="transition-colors hover:bg-gray-800/50">
                    <td className="px-4 py-3.5 font-mono text-[#00d4ff] font-bold text-xs">{reg.applicantId}</td>
                    <td className="px-4 py-3.5 font-black text-white">{reg.fullName || '—'}</td>
                    <td className="px-4 py-3.5 text-gray-300 text-xs">{reg.college || '—'}</td>
                    <td className="px-4 py-3.5 font-black text-amber-400">₹{reg.totalFee || 0}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase">
                        PAID
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
