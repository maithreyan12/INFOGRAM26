'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function EventsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Events Management</h1>
          <p className="text-gray-400 mt-1">Create and manage symposium events</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium"
        >
          <Plus className="w-5 h-5" /> Create New Event
        </button>
      </div>

      <div className="glass-card bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registrations</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Dummy Data */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">Hackathon 2026</td>
                <td className="px-6 py-4">Technical</td>
                <td className="px-6 py-4">Oct 15, 2026</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 badge-live">Live</span>
                </td>
                <td className="px-6 py-4">145 / 200</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4 inline" /></button>
                  <button className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">BGMI Tournament</td>
                <td className="px-6 py-4">Gaming</td>
                <td className="px-6 py-4">Oct 16, 2026</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 badge-upcoming">Upcoming</span>
                </td>
                <td className="px-6 py-4">80 / 100</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4 inline" /></button>
                  <button className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl my-8 relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Create New Event</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 form-label">Event Name</label>
                  <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white form-input" placeholder="e.g., Code Debugging" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 form-label">Category</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white form-input">
                    <option>Technical</option>
                    <option>Non-Technical</option>
                    <option>Gaming</option>
                    <option>Workshop</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2 form-label">Description</label>
                  <textarea rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white form-input" placeholder="Event details..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 form-label">Date</label>
                  <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 form-label">Time</label>
                  <div className="flex gap-2">
                    <input type="time" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white form-input" />
                    <span className="self-center text-gray-500">to</span>
                    <input type="time" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white form-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 form-label">Registration Fee (₹)</label>
                  <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white form-input" defaultValue="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 form-label">Max Participants</label>
                  <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 form-label">Assign Organizer</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white form-input">
                    <option>Select Organizer...</option>
                    <option>Organizer 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 form-label">Banner Image</label>
                  <input type="file" accept="image/*" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-1.5 text-gray-400 form-input" />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-800 flex justify-end gap-4 sticky bottom-0 bg-gray-900 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-800">Cancel</button>
              <button className="px-6 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white">Save Event</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
