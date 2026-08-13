'use client';
export const dynamic = 'force-dynamic';

import OrganizerLayout from '@/components/admin/OrganizerLayout';
import { Trophy, Award, Medal, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEventStore } from '@/store/eventStore';
import { useLiveRegistrations } from '@/hooks/useLiveRegistrations';
import { createDocument, collections } from '@/lib/firebase/firestore';
import { toast } from 'react-hot-toast';
import type { Winner } from '@/types';

const PLACES = [
  { position: 1, label: '1st Place', icon: Trophy, iconClass: 'text-yellow-400', borderClass: 'border-yellow-500/30', bgClass: 'bg-yellow-500/10' },
  { position: 2, label: '2nd Place', icon: Medal, iconClass: 'text-gray-300', borderClass: 'border-gray-400/30', bgClass: 'bg-gray-400/10' },
  { position: 3, label: '3rd Place', icon: Award, iconClass: 'text-orange-400', borderClass: 'border-orange-500/30', bgClass: 'bg-orange-500/10' },
];

function emptyWinner(position: number): Winner {
  return { position, teamName: '', members: [], college: '' };
}

export default function WinnersPage() {
  const { adminUser } = useAuth();
  const getEventByOrganizer = useEventStore((state) => state.getEventByOrganizer);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const event = getEventByOrganizer(adminUser?.uid, adminUser?.assignedEventId);
  const { registrations } = useLiveRegistrations();

  const [winners, setWinners] = useState<Winner[]>([1, 2, 3].map(emptyWinner));
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (event?.winners && event.winners.length > 0) {
      setWinners([1, 2, 3].map((p) => event.winners!.find((w) => w.position === p) || emptyWinner(p)));
    }
  }, [event]);

  const updateWinner = (position: number, field: keyof Winner, value: string) => {
    setWinners((prev) => prev.map((w) => w.position === position
      ? { ...w, [field]: field === 'members' ? value.split(',').map((s) => s.trim()).filter(Boolean) : value }
      : w));
  };

  const handleSave = async () => {
    if (!event) return;
    setSaving(true);
    try {
      const nonEmpty = winners.filter((w) => w.teamName || w.members.length > 0 || w.college);
      updateEvent(event.id, { winners: nonEmpty });
      toast.success('Winners saved & published');
    } catch (err) {
      console.error('Failed to save winners:', err);
      toast.error('Could not save winners');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateCertificates = async () => {
    if (!event) return;
    setGenerating(true);
    try {
      let count = 0;
      for (const winner of winners) {
        if (winner.members.length === 0) continue;
        for (const applicantId of winner.members) {
          const reg = registrations.find((r) => r.applicantId === applicantId);
          await createDocument(collections.certificates, {
            eventId: event.id,
            registrationId: reg?.id || '',
            studentName: reg?.personalInfo?.fullName || applicantId,
            eventName: event.name,
            participationType: 'winner',
            position: winner.position,
          });
          count++;
        }
      }
      toast.success(count > 0 ? `${count} certificate(s) queued` : 'Add participant IDs to a winner first');
    } catch (err) {
      console.error('Failed to generate certificates:', err);
      toast.error('Could not generate certificates');
    } finally {
      setGenerating(false);
    }
  };

  if (!event) {
    return (
      <OrganizerLayout>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
          No event currently assigned.
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Declare Winners
        </h1>
        <p className="text-gray-400 mt-1">Announce the champions of {event.name}</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 text-blue-200 p-4 rounded-xl mb-8 flex items-start gap-3">
        <div className="mt-0.5"><Trophy className="w-5 h-5" /></div>
        <p className="text-sm">Once winners are declared, they will be visible publicly on the website. Use Generate Certificates to queue certificates for the winning teams.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PLACES.map(({ position, label, icon: Icon, iconClass, borderClass, bgClass }) => {
          const winner = winners.find((w) => w.position === position) || emptyWinner(position);
          return (
            <div key={position} className={`glass-card bg-white/5 border ${borderClass} rounded-2xl p-6 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-20 h-20 ${bgClass} rounded-bl-full -z-10`}></div>
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <Icon className={`w-8 h-8 ${iconClass}`} />
                <h2 className="text-2xl font-bold text-white">{label}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Team Name (Optional)</label>
                  <input
                    type="text"
                    value={winner.teamName}
                    onChange={(e) => updateWinner(position, 'teamName', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Participant IDs (Comma separated)</label>
                  <input
                    type="text"
                    value={winner.members.join(', ')}
                    onChange={(e) => updateWinner(position, 'members', e.target.value)}
                    placeholder="APP123456, APP654321"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">College</label>
                  <input
                    type="text"
                    value={winner.college}
                    onChange={(e) => updateWinner(position, 'college', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-transform shadow-lg disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save & Publish Winners'}
        </button>
        <button
          onClick={handleGenerateCertificates}
          disabled={generating}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-transform shadow-lg disabled:opacity-50"
        >
          <FileText className="w-5 h-5" /> {generating ? 'Generating...' : 'Generate Certificates'}
        </button>
      </div>
    </OrganizerLayout>
  );
}
