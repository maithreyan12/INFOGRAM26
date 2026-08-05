'use client';
export const dynamic = 'force-dynamic';

import OrganizerLayout from '@/components/admin/OrganizerLayout';
import { Search, Download, Check, X } from 'lucide-react';

export default function ParticipantsPage() {
  return (
    <OrganizerLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Participants List</h1>
          <p className="text-gray-400 mt-1">Manage attendance for your event</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg text-white font-medium transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="glass-card bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
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
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">APP-2001</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-white">Rahul Kumar</div>
                  <div className="text-xs text-gray-500">CSE, 3rd Year</div>
                </td>
                <td className="px-6 py-4">SRM Institute</td>
                <td className="px-6 py-4">+91 9876543210</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/40 transition-colors title='Mark Present'"><Check className="w-4 h-4"/></button>
                    <button className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors opacity-50 title='Mark Absent'"><X className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">APP-2002</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-white">Priya Singh</div>
                  <div className="text-xs text-gray-500">IT, 2nd Year</div>
                </td>
                <td className="px-6 py-4">VIT Chennai</td>
                <td className="px-6 py-4">+91 9123456780</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors opacity-50 title='Mark Present'"><Check className="w-4 h-4"/></button>
                    <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-colors title='Mark Absent'"><X className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </OrganizerLayout>
  );
}
