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
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Event Admins / Organizers
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Manage event coordinators and their assigned event privileges
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] px-5 py-2.5 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> Add New Event Admin
        </button>
      </div>

      <div className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead className="text-[10px] uppercase tracking-wider border-b border-gray-800 bg-black/40 text-gray-300">
              <tr>
                <th className="px-6 py-4">Event Admin Name</th>
                <th className="px-6 py-4">Login Email</th>
                <th className="px-6 py-4">Assigned Event</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role Status</th>
                <th className="px-6 py-4 text-right">Assign Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {organizers.map((org) => {
                const assignedEvt = events.find((e) => e.id === org.assignedEventId);
                return (
                  <tr key={org.uid} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-black text-sm text-white">
                      {org.displayName}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#00d4ff]" />
                        <span>{org.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {assignedEvt ? (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {assignedEvt.name}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          General Admin
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {org.phone || '9360257573'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {org.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={org.assignedEventId || ''}
                        onChange={(e) => updateOrganizer(org.uid, { assignedEventId: e.target.value })}
                        className="bg-black/60 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00d4ff]"
                      >
                        <option value="">-- Assign Event --</option>
                        {events.map((e) => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </select>
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
