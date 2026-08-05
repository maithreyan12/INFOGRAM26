'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Users, IndianRupee, Calendar as CalendarIcon, Clock, Plus, Bell } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <div className="flex gap-4">
          <Link href="/admin/events" className="btn-primary flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white">
            <Plus className="w-4 h-4" /> Create Event
          </Link>
          <Link href="/admin/notifications" className="btn-glass flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-white">
            <Bell className="w-4 h-4" /> Notify Users
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Registrations</p>
              <h3 className="text-3xl font-bold text-white">1,248</h3>
              <p className="text-green-400 text-xs mt-2 font-medium">+12% from last week</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-white">₹2,48,500</h3>
              <p className="text-green-400 text-xs mt-2 font-medium">+5% from yesterday</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Active Events</p>
              <h3 className="text-3xl font-bold text-white">24</h3>
              <p className="text-gray-400 text-xs mt-2 font-medium">3 Upcoming</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Pending Payments</p>
              <h3 className="text-3xl font-bold text-white">18</h3>
              <p className="text-red-400 text-xs mt-2 font-medium">Requires approval</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Recent Registrations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Applicant ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Events</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">APP-1023</td>
                  <td className="px-4 py-3">John Doe</td>
                  <td className="px-4 py-3">2</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">APP-1024</td>
                  <td className="px-4 py-3">Jane Smith</td>
                  <td className="px-4 py-3">1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Link href="/admin/registrations" className="block text-center text-sm text-purple-400 hover:text-purple-300 mt-4">
            View All Registrations &rarr;
          </Link>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Pending UPI Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">PAY-501</td>
                  <td className="px-4 py-3">₹450</td>
                  <td className="px-4 py-3">
                    <button className="bg-green-500/20 text-green-400 hover:bg-green-500/40 px-3 py-1 rounded text-xs font-medium">Approve</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Link href="/admin/payments" className="block text-center text-sm text-purple-400 hover:text-purple-300 mt-4">
            Manage All Payments &rarr;
          </Link>
        </div>
      </div>
      
      <div className="mt-8 glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
         <h2 className="text-xl font-bold text-white mb-6">Registration Trend (Placeholder)</h2>
         <div className="h-64 flex items-center justify-center border border-dashed border-gray-600 rounded-xl bg-black/20">
            <p className="text-gray-400">[Chart will be rendered here via Recharts]</p>
         </div>
      </div>
    </AdminLayout>
  );
}
