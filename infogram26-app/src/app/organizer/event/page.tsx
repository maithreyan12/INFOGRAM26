'use client';
export const dynamic = 'force-dynamic';

import OrganizerLayout from '@/components/admin/OrganizerLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEventStore } from '@/store/eventStore';
import { Save, Image as ImageIcon, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EventEditorPage() {
  const { adminUser } = useAuth();
  const getEventByOrganizer = useEventStore((state) => state.getEventByOrganizer);
  const updateEvent = useEventStore((state) => state.updateEvent);

  const event = getEventByOrganizer(adminUser?.uid, adminUser?.assignedEventId);

  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [venue, setVenue] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (event) {
      setDescription(event.description || '');
      setRules(event.rules?.join('\n') || '');
      setVenue(event.venue || '');
      setStartTime(event.startTime || '09:00');
      setEndTime(event.endTime || '17:00');
      setCoordinatorName(event.coordinatorName || '');
      setContactNumber(event.contactNumber || '');
    }
  }, [event]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    updateEvent(event.id, {
      description,
      rules: rules.split('\n').filter((r) => r.trim().length > 0),
      venue,
      startTime,
      endTime,
      coordinatorName,
      contactNumber,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!event) {
    return (
      <OrganizerLayout>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
          <p className="text-white font-semibold">No assigned event found.</p>
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Event Details</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Updating public information for <span className="text-blue-400 font-semibold">{event.name}</span>
          </p>
        </div>
        {savedSuccess && (
          <div className="bg-green-500/20 text-green-300 border border-green-500/30 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" /> Event Details Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Basic Info</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Student Coordinators</label>
                  <input 
                    type="text" 
                    value={coordinatorName} 
                    onChange={(e) => setCoordinatorName(e.target.value)} 
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm" 
                    placeholder="e.g. Mohammed Dhaniyal & Masood Nawaz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Contact Numbers (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={contactNumber} 
                    onChange={(e) => setContactNumber(e.target.value)} 
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm" 
                    placeholder="e.g. 7010155779, 9944410994"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Event Description</label>
                <textarea 
                  rows={4} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm" 
                  placeholder="Describe your event..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Rules & Guidelines (Enter each rule on a new line)
                </label>
                <textarea 
                  rows={6} 
                  value={rules} 
                  onChange={(e) => setRules(e.target.value)} 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm font-mono" 
                  placeholder="Rule 1&#10;Rule 2"
                />
              </div>
            </div>
          </div>

          <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Schedule & Venue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Venue Location</label>
                <input 
                  type="text" 
                  value={venue} 
                  onChange={(e) => setVenue(e.target.value)} 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                <input 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-transform shadow-lg shadow-blue-900/50 text-sm"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Event Poster</h2>
            <div className="aspect-[3/4] bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer relative overflow-hidden">
              <ImageIcon className="w-10 h-10 mb-2 text-gray-400" />
              <span className="text-sm font-medium">Click to update poster</span>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Recommended size: 1080x1440px</p>
          </div>
        </div>
      </form>
    </OrganizerLayout>
  );
}
