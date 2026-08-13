'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { IndianRupee, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLiveRegistrations } from '@/hooks/useLiveRegistrations';

export default function PaymentsPage() {
  const { registrations } = useLiveRegistrations();
  const paidRegistrations = registrations.filter((r) => r.status === 'paid');
  const pendingRegistrations = registrations.filter((r) => r.status === 'pending_payment');
  const totalRevenue = paidRegistrations.reduce((sum, r) => sum + r.totalFee, 0);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Payment Management
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
          Review transaction records and verified registration fees
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/30">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/30">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Online Payments</p>
              <h3 className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/30">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Verified Registrations</p>
              <h3 className="text-2xl font-black text-white">{paidRegistrations.length}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/30">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Pending Review</p>
              <h3 className="text-2xl font-black text-white">{pendingRegistrations.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead className="text-[10px] uppercase tracking-wider border-b border-gray-800 bg-black/40 text-gray-300">
              <tr>
                <th className="px-6 py-4">Applicant ID</th>
                <th className="px-6 py-4">Participant</th>
                <th className="px-6 py-4">College</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {paidRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[#00d4ff] font-black">{reg.applicantId}</td>
                  <td className="px-6 py-4 font-black text-white text-sm">{reg.personalInfo?.fullName}</td>
                  <td className="px-6 py-4 text-gray-300">{reg.personalInfo?.college}</td>
                  <td className="px-6 py-4 font-black text-emerald-400">₹{reg.totalFee}</td>
                  <td className="px-6 py-4 text-gray-400 uppercase font-mono text-[11px]">UPI / Online</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {reg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
