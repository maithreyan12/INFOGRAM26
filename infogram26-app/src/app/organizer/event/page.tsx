'use client';
export const dynamic = 'force-dynamic';

import OrganizerLayout from '@/components/admin/OrganizerLayout';
import { Save, Image as ImageIcon } from 'lucide-react';

export default function EventEditorPage() {
  return (
    <OrganizerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Event Details</h1>
        <p className="text-gray-400 mt-1">Update your event's public information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Event Description</label>
                <textarea rows={5} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" defaultValue="Join us for the ultimate 24-hour coding challenge..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Rules & Guidelines (One per line)</label>
                <textarea rows={6} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" defaultValue="1. Teams must consist of 2-4 members.\n2. Bring your own laptops.\n3. Use of AI tools is restricted."></textarea>
              </div>
            </div>
          </div>

          <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Schedule & Venue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Venue</label>
                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" defaultValue="Main Auditorium" />
              </div>
              <div></div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Start Time</label>
                <input type="time" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" defaultValue="10:00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">End Time</label>
                <input type="time" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" defaultValue="17:00" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-transform shadow-lg shadow-blue-900/50">
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Event Poster</h2>
            <div className="aspect-[3/4] bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer relative overflow-hidden">
              <ImageIcon className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">Click to upload poster</span>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Recommended size: 1080x1440px (Max 2MB)</p>
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
}
