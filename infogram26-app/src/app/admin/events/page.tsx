'use client';
export const dynamic = 'force-dynamic';

import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import { Plus, Edit2, Trash2, X, UserCheck, Calendar, MapPin, Clock, Tag } from 'lucide-react';
import { useEventStore } from '@/store/eventStore';
import type { Event, EventCategory } from '@/types';

import { useTheme } from '@/context/ThemeContext';

export default function EventsPage() {
  const { events, organizers, addEvent, updateEvent, deleteEvent } = useEventStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form fields state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EventCategory>('technical');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [registrationFee, setRegistrationFee] = useState<number>(0);
  const [maxParticipants, setMaxParticipants] = useState<number>(200);
  const [coordinatorName, setCoordinatorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [rules, setRules] = useState('');
  const [organizerUid, setOrganizerUid] = useState('');

  const openCreateModal = () => {
    setEditingEvent(null);
    setName('');
    setCategory('technical');
    setDescription('');
    setVenue('');
    setDate('2026-08-22');
    setStartTime('09:00');
    setEndTime('17:00');
    setRegistrationFee(50);
    setMaxParticipants(200);
    setCoordinatorName('');
    setContactNumber('');
    setRules('');
    setOrganizerUid(organizers[0]?.uid || '');
    setShowModal(true);
  };

  const openEditModal = (evt: Event) => {
    setEditingEvent(evt);
    setName(evt.name);
    setCategory(evt.category);
    setDescription(evt.description);
    setVenue(evt.venue);
    setDate(evt.date);
    setStartTime(evt.startTime);
    setEndTime(evt.endTime);
    setRegistrationFee(evt.registrationFee);
    setMaxParticipants(evt.maxParticipants);
    setCoordinatorName(evt.coordinatorName || '');
    setContactNumber(evt.contactNumber || '');
    setRules(evt.rules?.join('\n') || '');
    setOrganizerUid(evt.organizerUid || '');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedOrg = organizers.find((o) => o.uid === organizerUid);
    const parsedRules = rules.split('\n').filter((r) => r.trim().length > 0);

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        name,
        category,
        description,
        venue,
        date,
        startTime,
        endTime,
        registrationFee,
        maxParticipants,
        coordinatorName,
        contactNumber,
        rules: parsedRules.length > 0 ? parsedRules : editingEvent.rules,
        organizerUid,
        organizerName: assignedOrg?.displayName || 'Unassigned',
      });
    } else {
      addEvent({
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        category,
        description,
        rules: parsedRules.length > 0 ? parsedRules : ['Follow symposium conduct policy'],
        venue: venue || 'IT Block',
        date: date || '2026-08-22',
        startTime: startTime || '09:00',
        endTime: endTime || '17:00',
        registrationDeadline: date || '2026-08-20',
        registrationFee,
        maxParticipants,
        coordinatorName: coordinatorName || 'Student Coordinator',
        organizerName: assignedOrg?.displayName || 'IT Association',
        contactNumber: contactNumber || '9360257573',
        status: 'upcoming',
        organizerUid,
        isFeatured: true,
      });
    }
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Events Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-gray-400">
            Create events and assign dedicated Event Admins (Organizers)
          </p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00b4d8] px-5 py-2.5 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create New Event
        </button>
      </div>

      {/* Events Table */}
      <div className="rounded-3xl border border-gray-800 bg-[#08182b] text-white shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead className="text-[10px] uppercase tracking-wider border-b border-gray-800 bg-black/40 text-gray-300">
              <tr>
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date &amp; Venue</th>
                <th className="px-6 py-4">Assigned Event Admin</th>
                <th className="px-6 py-4">Fee</th>
                <th className="px-6 py-4 text-center">Registrations</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {events.map((evt) => {
                const org = organizers.find((o) => o.uid === evt.organizerUid || o.assignedEventId === evt.id);
                return (
                  <tr key={evt.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-black text-sm text-white">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#00d4ff]" />
                        <span>{evt.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        evt.category === 'technical' 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                          : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                      }`}>
                        {evt.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-200">
                        <Calendar className="w-3.5 h-3.5 text-[#00d4ff]" /> {evt.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" /> {evt.venue}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {org ? (
                        <div className="flex items-center gap-2 bg-[#00d4ff]/10 text-white border border-[#00d4ff]/30 px-3 py-1.5 rounded-xl text-xs font-bold w-fit">
                          <UserCheck className="w-4 h-4 text-[#00d4ff] shrink-0" />
                          <div>
                            <p className="font-black text-white">{org.displayName}</p>
                            <p className="text-[10px] text-gray-400">{org.email}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-black text-white">
                      {evt.registrationFee > 0 ? `₹${evt.registrationFee}` : 'Free'}
                    </td>
                    <td className="px-6 py-4 text-center font-black">
                      <span className="bg-black/60 px-3 py-1 rounded-full border border-gray-800 text-xs text-amber-400">
                        {evt.registeredCount} / {evt.maxParticipants}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => openEditModal(evt)} 
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl transition-all"
                        title="Edit Event & Admin"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteEvent(evt.id)} 
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all"
                        title="Delete Event"
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh] shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {editingEvent ? 'Edit Event & Assigned Admin' : 'Create New Event'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                    placeholder="e.g. AI Prompt Engineering"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as EventCategory)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="technical">Technical</option>
                    <option value="non-technical">Non-Technical</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Assign Dedicated Event Admin (Organizer) *</label>
                  <select 
                    value={organizerUid} 
                    onChange={(e) => setOrganizerUid(e.target.value)} 
                    className="w-full bg-purple-950/40 border border-purple-500/40 rounded-xl px-4 py-2.5 text-purple-200 focus:outline-none focus:border-purple-400 font-medium"
                  >
                    <option value="">-- Select an Event Admin --</option>
                    {organizers.map((org) => (
                      <option key={org.uid} value={org.uid}>
                        {org.displayName} ({org.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-purple-400/70 mt-1">
                    Only this assigned Event Admin will have management access to this event in their organizer dashboard.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Student Coordinators</label>
                  <input 
                    type="text" 
                    value={coordinatorName} 
                    onChange={(e) => setCoordinatorName(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                    placeholder="e.g. Mohammed Dhaniyal & Masood Nawaz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Numbers (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={contactNumber} 
                    onChange={(e) => setContactNumber(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                    placeholder="e.g. 7010155779, 9944410994"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea 
                    rows={3} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                    placeholder="Event objectives and highlights..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rules & Guidelines (One per line)</label>
                  <textarea 
                    rows={4} 
                    value={rules} 
                    onChange={(e) => setRules(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 font-mono text-sm" 
                    placeholder="Rule 1&#10;Rule 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Venue</label>
                  <input 
                    type="text" 
                    value={venue} 
                    onChange={(e) => setVenue(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                    placeholder="e.g. IT Lab 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Registration Fee (₹)</label>
                  <input 
                    type="number" 
                    value={registrationFee} 
                    onChange={(e) => setRegistrationFee(Number(e.target.value))} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Capacity</label>
                  <input 
                    type="number" 
                    value={maxParticipants} 
                    onChange={(e) => setMaxParticipants(Number(e.target.value))} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:bg-gray-800 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 transition-all text-sm"
                >
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
