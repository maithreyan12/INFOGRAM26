'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, Download, Users, AlertCircle } from 'lucide-react';
import { useLiveRegistrations } from '@/hooks/useLiveRegistrations';
import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

export default function RegistrationsPage() {
  const { registrations, loading } = useLiveRegistrations();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // ── Filtered list ────────────────────────────────────────
  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        (r.personalInfo?.fullName || '').toLowerCase().includes(q) ||
        (r.personalInfo?.email || '').toLowerCase().includes(q) ||
        (r.applicantId || '').toLowerCase().includes(q) ||
        (r.personalInfo?.college || '').toLowerCase().includes(q) ||
        (r.personalInfo?.phone || '').toLowerCase().includes(q);

      const matchStatus = !statusFilter || r.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [registrations, searchQuery, statusFilter]);

  // ── Excel Export ─────────────────────────────────────────
  const exportToExcel = () => {
    if (!filtered.length) { toast.error('No registrations to export'); return; }
    const rows = filtered.map((r, i) => ({
      'S.No':              i + 1,
      'Applicant ID':      r.applicantId || '',
      'Full Name':         r.personalInfo?.fullName || '',
      'College':           r.personalInfo?.college || '',
      'Department':        r.personalInfo?.department || '',
      'Year':              r.personalInfo?.year || '',
      'Register Number':   r.personalInfo?.registerNumber || '',
      'Email':             r.personalInfo?.email || '',
      'Phone':             r.personalInfo?.phone || '',
      'Gender':            r.personalInfo?.gender || '',
      'Events Registered': (r.eventNames || r.events || []).join(', '),
      'Total Fee (₹)':     r.totalFee || 0,
      'Payment Status':    r.status || '',
      'Payment / UTR ID':  r.utrNumber || r.paymentId || '',
      'Ticket ID':         r.ticketId || '',
      'Registered On':     r.createdAt ? new Date(r.createdAt as any).toLocaleString('en-IN') : '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = Object.keys(rows[0]).map(k => ({ wch: Math.max(k.length + 2, 16) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
    const filename = `INFOGRAM26_Registrations_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, filename);
    toast.success(`Downloaded: ${filename}`);
  };

  // ── Status badge colour ──────────────────────────────────
  const statusBadge = (status: string) => {
    if (status === 'paid' || status === 'verified') {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
    if (status === 'pending_payment' || status === 'pending') {
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
    if (status === 'cancelled') {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Registrations
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            {loading ? 'Loading...' : `${registrations.length} total · ${filtered.length} shown`}
          </p>
        </div>
        <button
          onClick={exportToExcel}
          disabled={loading || filtered.length === 0}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export Excel ({filtered.length})
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 sm:p-5 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Email, Phone, College or Applicant ID..."
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold border border-gray-700 bg-black/60 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold border border-gray-700 bg-black/60 text-white appearance-none focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
            >
              <option value="">Status: All</option>
              <option value="paid">Paid</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="cancelled">Cancelled</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden">
        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-bold">Loading registrations from Firestore…</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
            {registrations.length === 0 ? (
              <>
                <Users className="w-14 h-14 text-gray-700" />
                <div>
                  <p className="text-white font-black text-lg mb-1">No Registrations Yet</p>
                  <p className="text-gray-400 text-sm font-bold">
                    Registrations will appear here once participants complete the registration flow.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-14 h-14 text-amber-500/50" />
                <div>
                  <p className="text-white font-black text-lg mb-1">No Results Found</p>
                  <p className="text-gray-400 text-sm font-bold">
                    No registrations match your search or filter. Try clearing the filters.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setStatusFilter(''); }}
                    className="mt-3 text-xs font-black text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead className="text-[10px] uppercase tracking-wider border-b border-gray-800 bg-black/40 text-gray-300">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Applicant ID</th>
                  <th className="px-5 py-4">Participant</th>
                  <th className="px-5 py-4">College</th>
                  <th className="px-5 py-4">Phone / Email</th>
                  <th className="px-5 py-4">Events</th>
                  <th className="px-5 py-4">Fee</th>
                  <th className="px-5 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {filtered.map((reg, idx) => (
                  <tr key={reg.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4 text-gray-500 font-mono">{idx + 1}</td>
                    <td className="px-5 py-4 font-mono text-purple-400 font-black text-[11px]">
                      {reg.applicantId || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-black text-white text-sm">{reg.personalInfo?.fullName || '—'}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                        {reg.personalInfo?.year} yr · {reg.personalInfo?.department}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-300 font-bold max-w-[180px]">
                      <div className="truncate">{reg.personalInfo?.college || '—'}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">
                      <div className="text-[11px]">{reg.personalInfo?.email || '—'}</div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">{reg.personalInfo?.phone || '—'}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-300 max-w-[180px]">
                      <div className="truncate text-[11px]">
                        {(reg.eventNames || []).join(', ') || (reg.events || []).join(', ') || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-black text-amber-400">
                      ₹{reg.totalFee || 0}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusBadge(reg.status)}`}>
                        {reg.status?.replace('_', ' ') || 'unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 border-t border-gray-800 text-center text-gray-600 text-xs font-bold">
              Showing {filtered.length} of {registrations.length} registrations · Live from Firestore
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
