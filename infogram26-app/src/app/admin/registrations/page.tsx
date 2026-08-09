'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function RegistrationsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Registrations Management</h1>
          <p className={`mt-1 text-xs sm:text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Manage all registered symposium attendees</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className={`p-6 rounded-3xl border shadow-xl mb-6 ${
        isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
      }`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input 
              type="text" 
              placeholder="Search by Name, Email, or Applicant ID..." 
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold border focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#7c3aed]'
              }`}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <select className={`rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold border appearance-none focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#7c3aed]'
              }`}>
                <option value="">All Events</option>
                <option value="hackathon">Hackathon</option>
                <option value="bgmi">BGMI</option>
              </select>
            </div>
            <select className={`rounded-xl px-4 py-2.5 text-xs font-bold border focus:outline-none ${
              isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#7c3aed]'
            }`}>
              <option value="">Status: All</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`rounded-3xl border shadow-xl overflow-hidden ${
        isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead className={`text-[10px] uppercase tracking-wider border-b ${
              isDark ? 'bg-slate-950/80 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <tr>
                <th className="px-6 py-4">Applicant ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">College</th>
                <th className="px-6 py-4">Events</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">APP-2001</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">Rahul Kumar</div>
                  <div className="text-xs text-gray-500">rahul@example.com</div>
                </td>
                <td className="px-6 py-4">SRM Institute</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">2</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">Verified</span>
                </td>
                <td className="px-6 py-4">Oct 1, 2026</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-purple-400 hover:text-purple-300 p-2"><Eye className="w-5 h-5" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/5 text-center text-gray-400 text-sm">
          Showing 1 to 10 of 1,248 entries
        </div>
      </div>
    </AdminLayout>
  );
}
