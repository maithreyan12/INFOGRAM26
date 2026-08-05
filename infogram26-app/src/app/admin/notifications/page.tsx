'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Send, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Notifications</h1>
        <p className="text-gray-400 mt-1">Send alerts and updates to users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Send New Message</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Target Audience</label>
                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none">
                  <option>All Registered Users</option>
                  <option>Specific Event Participants</option>
                  <option>Specific Email</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none">
                  <option>Announcement (Info)</option>
                  <option>Alert (Important)</option>
                  <option>Success (Green)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none" placeholder="e.g. Venue Change" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea rows={4} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none" placeholder="Write your message here..."></textarea>
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg font-bold transition-colors mt-4">
                <Send className="w-4 h-4" /> Broadcast Message
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Sent Notifications History</h2>
              <button className="text-sm text-purple-400 hover:text-purple-300">Mark all as read</button>
            </div>
            
            <div className="space-y-4">
              {/* Dummy notification history */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white">Hackathon Venue Updated</h3>
                    <span className="text-xs text-gray-500">2 hrs ago</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">The venue for Hackathon has been shifted to Main Auditorium.</p>
                  <div className="text-xs font-medium px-2 py-1 rounded bg-white/5 text-gray-400 inline-block">Target: All Users</div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Send className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white">Welcome to INFOGRAM'26</h3>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Registrations are now officially open!</p>
                  <div className="text-xs font-medium px-2 py-1 rounded bg-white/5 text-gray-400 inline-block">Target: All Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
