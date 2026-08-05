'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function SponsorsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Sponsors</h1>
          <p className="text-gray-400 mt-1">Manage event partners and sponsors</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium">
          <Plus className="w-5 h-5" /> Add Sponsor
        </button>
      </div>

      <div className="space-y-8">
        {['Title Sponsor', 'Gold Sponsor', 'Silver Sponsor'].map((tier) => (
          <div key={tier} className="glass-card bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{tier}</h2>
            </div>
            <div className="p-4 space-y-3">
              {/* Dummy row */}
              <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-4 rounded-xl hover:border-gray-700 transition-colors group">
                <button className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300">
                  <GripVertical className="w-5 h-5" />
                </button>
                <div className="w-16 h-16 bg-white rounded flex items-center justify-center p-2">
                  <div className="w-full h-full bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">TechCorp Inc.</h3>
                  <a href="#" className="text-sm text-blue-400 hover:underline">https://techcorp.example.com</a>
                </div>
                <button className="text-gray-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Sponsor</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
                <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Website URL</label>
                <input type="url" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Sponsorship Tier</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  <option>Title Sponsor</option>
                  <option>Gold Sponsor</option>
                  <option>Silver Sponsor</option>
                  <option>Event Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Logo Upload</label>
                <input type="file" accept="image/*" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-1.5 text-gray-400" />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-800">Cancel</button>
              <button className="px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white">Save Sponsor</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
