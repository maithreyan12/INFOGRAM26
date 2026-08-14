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
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Sponsors &amp; Partners
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Manage event partners and sponsor branding tiers
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all">
          <Plus className="w-4 h-4" /> Add Sponsor
        </button>
      </div>

      <div className="space-y-8">
        {['Title Sponsor', 'Gold Sponsor', 'Silver Sponsor'].map((tier) => (
          <div key={tier} className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden">
            <div className="bg-black/40 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-base font-black text-white">{tier}</h2>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00d4ff] px-2.5 py-0.5 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                Official Tier
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-4 bg-black/50 border border-gray-800 p-4 rounded-2xl hover:border-gray-700 transition-colors group">
                <button className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300">
                  <GripVertical className="w-5 h-5" />
                </button>
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center text-white font-black text-xs">
                    LOGO
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-white text-base">TechCorp Inc.</h3>
                  <a href="#" className="text-xs text-[#00d4ff] font-mono hover:underline">https://techcorp.example.com</a>
                </div>
                <button className="text-gray-500 hover:text-red-400 p-2 transition-all">
                  <Trash2 className="w-4 h-4" />
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
