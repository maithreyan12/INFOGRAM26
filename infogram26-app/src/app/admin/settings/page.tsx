'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Save, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Global Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
          Configure application parameters, contact details, and payment gateways
        </p>
      </div>

      <div className="space-y-8 max-w-4xl">
        {/* EVENT SETTINGS */}
        <section className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg font-black text-white mb-6 border-b border-gray-800 pb-4">
            Event Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Symposium Dates</label>
              <input type="text" defaultValue="August 22, 2026" className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]" />
            </div>
            <div className="flex flex-col justify-center">
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Registration Status</label>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="relative w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4ff]"></div>
                <span className="ml-3 text-xs font-black uppercase tracking-wider text-white">Registrations Open</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Contact Email</label>
              <input type="email" defaultValue="info@cahcet.edu.in" className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Contact Phone</label>
              <input type="text" defaultValue="9342706675" className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all">
              <Save className="w-4 h-4" /> Save Event Settings
            </button>
          </div>
        </section>

        {/* PAYMENT SETTINGS */}
        <section className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Razorpay Configuration</h2>
          <div className="mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              <span className="ml-3 text-sm font-medium text-white">Enable Razorpay Gateway</span>
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Razorpay Key ID</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono" placeholder="rzp_test_..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Razorpay Key Secret</label>
              <div className="relative">
                <input type={showSecret ? "text" : "password"} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pr-12 text-white font-mono" placeholder="••••••••••••••••" />
                <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showSecret ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              <Save className="w-4 h-4" /> Save API Keys
            </button>
          </div>
        </section>

        {/* UPI SETTINGS */}
        <section className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Manual UPI Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">UPI ID</label>
                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="merchant@upi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Merchant Name</label>
                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Upload New QR Code</label>
                <input type="file" accept="image/*" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-1.5 text-gray-400" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-900 border border-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-4">Current QR Preview</p>
              <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative">
                {/* Placeholder for QR Code */}
                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=infogram26')] bg-cover"></div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              <Save className="w-4 h-4" /> Save UPI Info
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
