'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, UserPlus, ShieldCheck, Check, X, Mail, Phone, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useEventStore } from '@/store/eventStore';

export default function OrganizersPage() {
  const { organizers, events, addOrganizer, updateOrganizer } = useEventStore();
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedEventId, setAssignedEventId] = useState('');

  const handleCreateOrganizer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addOrganizer({
      displayName: name,
      email,
      phone,
      role: 'organizer',
      assignedEventId: assignedEventId || undefined,
    });

    setName('');
    setEmail('');
    setPhone('');
    setAssignedEventId('');
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Admins / Organizers</h1>
          <p className="text-gray-400 mt-1">Manage event coordinators and their assigned event privileges</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn-primary flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl text-white font-medium shadow-lg shadow-purple-600/30 transition-all transform hover:scale-105"
        >
          <UserPlus className="w-5 h-5" /> Add New Event Admin
        </button>
      </div>

      <div className="glass-card bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-gray-400 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Event Admin Name</th>
                <th className="px-6 py-4">Login Email</th>
                <th className="px-6 py-4">Assigned Event</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {organizers.map((org) => {
                const evt = events.find((e) => e.id === org.assignedEventId);
                return (
                  <tr key={org.uid} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                          {org.displayName.charAt(0)}
                        </div>
                        <span>{org.displayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                        <span>{org.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {evt ? (
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          {evt.name}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {org.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        org.isActive 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {org.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => updateOrganizer(org.uid, { isActive: !org.isActive })}
                        className="text-xs text-purple-400 hover:text-purple-300 font-medium underline"
                      >
                        {org.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add Event Admin / Organizer</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <form onSubmit={handleCreateOrganizer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Admin Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                  placeholder="e.g. John Smith" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Google Login Email *</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                  placeholder="john.smith@gmail.com" 
                />
                <p className="text-xs text-gray-500 mt-1">This email must match their Google sign-in account.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                  placeholder="+91 9876543210" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Assign Event</label>
                <select 
                  value={assignedEventId} 
                  onChange={(e) => setAssignedEventId(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">-- Unassigned --</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2.5 rounded-xl font-medium text-gray-300 hover:bg-gray-800 text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-lg text-sm"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
