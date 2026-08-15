'use client';
export const dynamic = 'force-dynamic';

import OrganizerLayout from '@/components/admin/OrganizerLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEventStore } from '@/store/eventStore';
import { Save, Image as ImageIcon, Check, Play, Pause, CheckCircle2, Radio, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

  const handleStatusChange = (newStatus: 'live' | 'upcoming' | 'paused' | 'completed') => {
    if (!event) return;
    updateEvent(event.id, { status: newStatus as any });
    const labels = {
      live: '🟢 Event is now LIVE on stage!',
      upcoming: '⚡ Registration is OPEN!',
      paused: '⏸️ Registration is PAUSED.',
      completed: '🏁 Event is marked COMPLETED.',
    };
    toast.success(labels[newStatus]);
  };

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
          <p className="text-white font-semibold">No assigned event found for your account.</p>
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Admin Control &amp; Editor</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Authorized management panel for <span className="text-blue-400 font-bold">{event.name}</span>
          </p>
        </div>
        {savedSuccess && (
          <div className="bg-green-500/20 text-green-300 border border-green-500/30 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" /> Event Details Saved!
          </div>
        )}
      </div>

      {/* ── Start / Stop Live Event Control Panel ── */}
      <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" /> Live Event &amp; Registration Control Panel
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Control live status &amp; registration availability for {event.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Current Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
              event.status === 'live'
                ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                : event.status === 'completed'
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : event.status === 'paused'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              {event.status === 'live' ? '🟢 LIVE NOW' : event.status?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handleStatusChange('live')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              event.status === 'live'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 ring-2 ring-red-500/50'
                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            <Play className="w-4 h-4 fill-current" /> Start Event (Go Live)
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('upcoming')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              event.status === 'upcoming'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Open Registration
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('paused')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              event.status === 'paused'
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}
          >
            <Pause className="w-4 h-4" /> Pause Registration
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('completed')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              event.status === 'completed'
                ? 'bg-slate-700 text-white border-slate-600 shadow-lg'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Lock className="w-4 h-4" /> Mark Completed
          </button>
        </div>
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
