'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, UserPlus, ShieldAlert, Check, X } from 'lucide-react';
import { useState } from 'react';

export default function OrganizersPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Organizers</h1>
          <p className="text-gray-400 mt-1">Manage event coordinators and their permissions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium">
          <UserPlus className="w-5 h-5" /> Add Organizer
        </button>
      </div>

      <div className="glass-card bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email (Login ID)</th>
                <th className="px-6 py-4">Assigned Event</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">Alice Johnson</td>
                <td className="px-6 py-4">alice@example.com</td>
                <td className="px-6 py-4"><span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-medium">Hackathon</span></td>
                <td className="px-6 py-4">+91 9876543210</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-white underline text-xs">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add Organizer</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Organizer Name</label>
                <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Google Email (Login Email)</label>
                <input type="email" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                <p className="text-xs text-gray-500 mt-1">They will use this to sign in via Google.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                <input type="tel" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Assign Event</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  <option>Select an event...</option>
                  <option>Hackathon</option>
                  <option>BGMI Tournament</option>
                </select>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-800">Cancel</button>
              <button className="px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white">Create Organizer</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
