'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, Download, Eye } from 'lucide-react';

export default function RegistrationsPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Registrations</h1>
          <p className="text-gray-400 mt-1">Manage all symposium attendees</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 px-4 py-2 rounded-lg font-medium transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="glass-card bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Name, Email, or Applicant ID..." 
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select className="bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-8 py-2.5 text-white appearance-none focus:outline-none focus:border-purple-500">
                <option value="">All Events</option>
                <option value="hackathon">Hackathon</option>
                <option value="bgmi">BGMI</option>
              </select>
            </div>
            <select className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500">
              <option value="">Status: All</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-gray-400">
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
