'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, UserPlus, ShieldCheck, Check, X, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useEventStore } from '@/store/eventStore';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

export default function OrganizersPage() {
  const { organizers: storeOrganizers, events, addOrganizer: addStoreOrganizer, updateOrganizer: updateStoreOrganizer } = useEventStore();
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedEventId, setAssignedEventId] = useState('');
  const [saving, setSaving] = useState(false);

  /* ── 1. Live Firestore Listener ── */
  useEffect(() => {
    if (!db) {
      setOrganizers(storeOrganizers || []);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      collection(db, 'organizers'),
      (snap) => {
        const list = snap.docs.map((d) => ({
          uid: d.id,
          ...d.data(),
        }));
        setOrganizers(list.length > 0 ? list : storeOrganizers || []);
        setLoading(false);
      },
      (err) => {
        console.warn('Organizers live sync notice:', err);
        setOrganizers(storeOrganizers || []);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [storeOrganizers]);

  /* ── 2. Create Organizer ── */
  const handleCreateOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and Email are required.');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Creating Event Admin...');

    try {
      const emailLower = email.trim().toLowerCase();
      const newOrg = {
        displayName: name.trim(),
        email: emailLower,
        phone: phone.trim(),
        role: 'organizer' as const,
        assignedEventId: assignedEventId || undefined,
      };

      if (db) {
        await addDoc(collection(db, 'organizers'), {
          ...newOrg,
          createdAt: serverTimestamp(),
          isActive: true,
        });
        addStoreOrganizer(newOrg);
      } else {
        addStoreOrganizer(newOrg);
      }

      toast.dismiss(toastId);
      toast.success(`🎉 Event Admin created for ${emailLower}!`);

      setName('');
      setEmail('');
      setPhone('');
      setAssignedEventId('');
      setShowModal(false);
    } catch (err: any) {
      console.error('Create organizer error:', err);
      toast.dismiss(toastId);
      toast.error('Failed to create Event Admin.');
    } finally {
      setSaving(false);
    }
  };

  /* ── 3. Assign Event ── */
  const handleAssignEvent = async (orgUid: string, evtId: string) => {
    try {
      updateStoreOrganizer(orgUid, { assignedEventId: evtId });
      if (db && !orgUid.startsWith('gopika-')) {
        await setDoc(doc(db, 'organizers', orgUid), { assignedEventId: evtId }, { merge: true });
      }
      const targetEvt = events.find((e) => e.id === evtId);
      toast.success(`Assigned to ${targetEvt?.name || 'Event'}`);
    } catch (err) {
      console.error('Assign event error:', err);
      toast.error('Failed to assign event.');
    }
  };

  /* ── 4. Delete Organizer ── */
  const handleDeleteOrganizer = async (orgUid: string, orgName: string) => {
    if (!confirm(`Are you sure you want to remove ${orgName}?`)) return;

    try {
      if (db && !orgUid.startsWith('gopika-')) {
        await deleteDoc(doc(db, 'organizers', orgUid));
      }
      setOrganizers((prev) => prev.filter((o) => o.uid !== orgUid));
      toast.success(`Removed ${orgName}`);
    } catch (err) {
      console.error('Delete organizer error:', err);
      toast.error('Failed to remove organizer.');
    }
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mb-2" />
            Loading organizers list...
          </div>
        ) : (
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
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {organizers.map((org) => {
                  const assignedEvt = events.find((e) => e.id === org.assignedEventId);
                  return (
                    <tr key={org.uid} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-black text-sm text-white">
                        {org.displayName || 'Event Organizer'}
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
                        {org.phone || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {org.role || 'organizer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={org.assignedEventId || ''}
                          onChange={(e) => handleAssignEvent(org.uid, e.target.value)}
                          className="bg-black/60 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00d4ff]"
                        >
                          <option value="">-- Assign Event --</option>
                          {events.map((e) => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteOrganizer(org.uid, org.displayName || org.email)}
                          className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Remove Organizer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#08182b] border border-gray-700 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#00d4ff]" /> Add Event Admin / Organizer
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrganizer} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-300 mb-1">
                  Admin Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-[#00d4ff]"
                  placeholder="e.g. Shyam Sundar"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-300 mb-1">
                  Google Login Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00d4ff]"
                  placeholder="organizer@gmail.com"
                />
                <p className="text-[10px] text-gray-400 mt-1 font-medium">
                  This email must match their Google account for single sign-on access.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00d4ff]"
                  placeholder="+91 9345837870"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-300 mb-1">Assign Event</label>
                <select
                  value={assignedEventId}
                  onChange={(e) => setAssignedEventId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-[#00d4ff]"
                >
                  <option value="">-- Unassigned (General Admin) --</option>
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
                  className="px-4 py-2.5 rounded-xl font-bold text-gray-300 hover:bg-gray-800 text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] text-slate-950 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Create Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
