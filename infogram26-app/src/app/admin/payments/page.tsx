'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { IndianRupee, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Payment Management</h1>
        <p className="text-gray-400 mt-1">Review and approve transaction records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><IndianRupee className="w-6 h-6" /></div>
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-white">₹2,48,500</h3>
            </div>
          </div>
        </div>
        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><CheckCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-gray-400 text-sm">Razorpay (Auto)</p>
              <h3 className="text-2xl font-bold text-white">₹1,90,000</h3>
            </div>
          </div>
        </div>
        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><IndianRupee className="w-6 h-6" /></div>
            <div>
              <p className="text-gray-400 text-sm">UPI (Manual)</p>
              <h3 className="text-2xl font-bold text-white">₹58,500</h3>
            </div>
          </div>
        </div>
        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400"><Clock className="w-6 h-6" /></div>
            <div>
              <p className="text-gray-400 text-sm">Pending Approval</p>
              <h3 className="text-2xl font-bold text-white">18</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">All Payments</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white rounded-lg text-sm font-medium">Pending UPI</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white rounded-lg text-sm font-medium">Verified</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">TXN_upi_9029</td>
                <td className="px-6 py-4 font-medium text-white">APP-2004</td>
                <td className="px-6 py-4">₹450</td>
                <td className="px-6 py-4">UPI (Manual)</td>
                <td className="px-6 py-4">2 hours ago</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 flex items-center w-fit gap-1"><Clock className="w-3 h-3"/> Pending</span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs font-medium">View SS</button>
                  <button className="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-xs font-medium">Approve</button>
                  <button className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-medium">Reject</button>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">pay_MoY02KkO</td>
                <td className="px-6 py-4 font-medium text-white">APP-2005</td>
                <td className="px-6 py-4">₹600</td>
                <td className="px-6 py-4">Razorpay</td>
                <td className="px-6 py-4">5 hours ago</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 flex items-center w-fit gap-1"><CheckCircle className="w-3 h-3"/> Verified</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-gray-500 text-xs">Auto-approved</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
