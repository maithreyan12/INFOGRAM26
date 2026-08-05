'use client';
export const dynamic = 'force-dynamic';

import OrganizerLayout from '@/components/admin/OrganizerLayout';
import { Users, UserCheck, Armchair, PlayCircle, StopCircle, Edit } from 'lucide-react';
import Link from 'next/link';

export default function OrganizerDashboard() {
  return (
    <OrganizerLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Hackathon 2026</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 badge-upcoming uppercase tracking-wider">
              Upcoming
            </span>
            <span className="text-gray-400 text-sm">Main Auditorium • 10:00 AM</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold transition-transform hover:scale-105 shadow-lg shadow-green-900/50">
            <PlayCircle className="w-5 h-5" /> START EVENT
          </button>
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-5 py-2.5 rounded-xl font-medium transition-colors border border-gray-700">
            <StopCircle className="w-5 h-5" /> End Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Registered</p>
              <h3 className="text-4xl font-bold text-white mt-2">145</h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Present Today</p>
              <h3 className="text-4xl font-bold text-white mt-2">112</h3>
              <p className="text-green-400 text-xs mt-2 font-medium">77% Attendance</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Seats Remaining</p>
              <h3 className="text-4xl font-bold text-white mt-2">55</h3>
              <p className="text-gray-400 text-xs mt-2 font-medium">Max capacity: 200</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Armchair className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/organizer/event" className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors">
                <Edit className="w-6 h-6 text-purple-400" />
                <span className="text-sm font-medium text-gray-300">Edit Details</span>
              </Link>
              <Link href="/organizer/participants" className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors">
                <UserCheck className="w-6 h-6 text-green-400" />
                <span className="text-sm font-medium text-gray-300">Mark Attendance</span>
              </Link>
            </div>
         </div>
      </div>
    </OrganizerLayout>
  );
}
