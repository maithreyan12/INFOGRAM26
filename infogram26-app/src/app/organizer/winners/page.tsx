'use client';
export const dynamic = 'force-dynamic';

import OrganizerLayout from '@/components/admin/OrganizerLayout';
import { Trophy, Award, Medal, FileText } from 'lucide-react';

export default function WinnersPage() {
  return (
    <OrganizerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Declare Winners
        </h1>
        <p className="text-gray-400 mt-1">Announce the champions of your event</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 text-blue-200 p-4 rounded-xl mb-8 flex items-start gap-3">
        <div className="mt-0.5"><Trophy className="w-5 h-5" /></div>
        <p className="text-sm">Once winners are declared, they will be visible publicly on the website. Certificates will be generated automatically for the winning teams.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1st Place */}
        <div className="glass-card bg-white/5 border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-full -z-10"></div>
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">1st Place</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Team Name (Optional)</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Participant IDs (Comma separated)</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none" placeholder="APP-2001, APP-2005" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">College</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* 2nd Place */}
        <div className="glass-card bg-white/5 border border-gray-400/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-400/10 rounded-bl-full -z-10"></div>
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Medal className="w-8 h-8 text-gray-300" />
            <h2 className="text-2xl font-bold text-white">2nd Place</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Team Name (Optional)</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-gray-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Participant IDs (Comma separated)</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-gray-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">College</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-gray-400 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="glass-card bg-white/5 border border-orange-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-full -z-10"></div>
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Award className="w-8 h-8 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">3rd Place</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Team Name (Optional)</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Participant IDs (Comma separated)</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">College</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-transform shadow-lg">
          Save & Publish Winners
        </button>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-transform shadow-lg">
          <FileText className="w-5 h-5" /> Generate Certificates
        </button>
      </div>
    </OrganizerLayout>
  );
}
