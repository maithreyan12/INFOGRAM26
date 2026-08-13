'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { useLiveRegistrations } from '@/hooks/useLiveRegistrations';

export default function RegistrationsPage() {
  const { registrations } = useLiveRegistrations();

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Registrations Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Manage and view all registered symposium attendees across events
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 transition-all active:scale-95">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Name, Email, or Applicant ID..." 
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold border border-gray-700 bg-black/60 text-white focus:outline-none focus:border-[#00d4ff]"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select className="rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold border border-gray-700 bg-black/60 text-white appearance-none focus:outline-none focus:border-[#00d4ff]">
                <option value="">All Events</option>
                <option value="hackathon">Hackathon</option>
                <option value="bgmi">BGMI</option>
              </select>
            </div>
            <select className="rounded-xl px-4 py-2.5 text-xs font-bold border border-gray-700 bg-black/60 text-white focus:outline-none focus:border-[#00d4ff]">
              <option value="">Status: All</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead className="text-[10px] uppercase tracking-wider border-b border-gray-800 bg-black/40 text-gray-300">
              <tr>
                <th className="px-6 py-4">Applicant ID</th>
                <th className="px-6 py-4">Participant Name</th>
                <th className="px-6 py-4">College Name</th>
                <th className="px-6 py-4">Phone / Email</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {registrations?.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[#00d4ff] font-black">{reg.applicantId}</td>
                  <td className="px-6 py-4 font-black text-white text-sm">{reg.personalInfo?.fullName}</td>
                  <td className="px-6 py-4 text-gray-300 font-bold">{reg.personalInfo?.college}</td>
                  <td className="px-6 py-4 text-gray-400">
                    <div>{reg.personalInfo?.email}</div>
                    <div className="text-[11px] text-gray-500 font-mono">{reg.personalInfo?.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-black text-amber-400">₹{reg.totalFee}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {reg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-800 text-center text-gray-400 text-sm">
          Showing entries from the database
        </div>
      </div>
    </AdminLayout>
  );
}
