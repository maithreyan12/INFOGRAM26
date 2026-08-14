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
        <section className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg font-black text-white mb-6 border-b border-gray-800 pb-4">
            Razorpay Configuration
          </h2>
          <div className="mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="relative w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ml-3 text-xs font-black uppercase tracking-wider text-white">Enable Razorpay Gateway</span>
            </label>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Razorpay Key ID</label>
              <input type="text" className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#00d4ff] focus:outline-none focus:border-[#00d4ff]" defaultValue="rzp_test_9028173491" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Razorpay Key Secret</label>
              <div className="relative">
                <input type={showSecret ? "text" : "password"} className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 pr-12 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00d4ff]" defaultValue="secret_key_infogram26" />
                <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showSecret ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all">
              <Save className="w-4 h-4" /> Save API Keys
            </button>
          </div>
        </section>

        {/* UPI SETTINGS */}
        <section className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg font-black text-white mb-6 border-b border-gray-800 pb-4">
            Manual UPI Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">UPI VPA ID</label>
                <input type="text" className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#00d4ff] focus:outline-none focus:border-[#00d4ff]" defaultValue="9342706675@okbizaxis" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Merchant Name</label>
                <input type="text" className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00d4ff]" defaultValue="INFOGRAM 26 SYMPOSIUM" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Upload New QR Code</label>
                <input type="file" accept="image/*" className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2 text-xs text-gray-300 font-bold" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-black/60 border border-gray-800 rounded-2xl p-4">
              <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Current QR Preview</p>
              <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center border-4 border-[#00d4ff]/30 shadow-xl overflow-hidden relative">
                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=infogram26')] bg-cover"></div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all">
              <Save className="w-4 h-4" /> Save UPI Info
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
