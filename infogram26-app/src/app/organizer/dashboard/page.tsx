'use client';
export const dynamic = 'force-dynamic';

import OrganizerLayout from '@/components/admin/OrganizerLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEventStore } from '@/store/eventStore';
import { Users, CheckCircle, Clock, Calendar, Edit3, Award, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function OrganizerDashboard() {
  const { adminUser } = useAuth();
  const getEventByOrganizer = useEventStore((state) => state.getEventByOrganizer);
  const getRegistrationsForEvent = useEventStore((state) => state.getRegistrationsForEvent);

  const event = getEventByOrganizer(adminUser?.uid, adminUser?.assignedEventId);
  const eventRegistrations = event ? getRegistrationsForEvent(event.id) : [];

  if (!event) {
    return (
      <OrganizerLayout>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
          <Calendar className="w-12 h-12 mx-auto text-gray-600 mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">No Event Currently Assigned</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Please ask the Super Administrator to assign an event to your organizer account.
          </p>
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-3 py-1 rounded-full font-semibold">
              Event Admin Portal
            </span>
            <span className="text-xs bg-gray-800 text-gray-300 border border-gray-700 px-3 py-1 rounded-full font-medium">
              ID: {event.id}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mt-2 flex items-center gap-3">
            <span>{event.name}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Dashboard for {adminUser?.displayName || 'Event Organizer'} &bull; Venue: {event.venue} &bull; Date: {event.date}
          </p>
        </div>

        <div className="flex gap-3">
          <Link 
            href="/organizer/event" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-lg shadow-blue-600/30 transition-all"
          >
            <Edit3 className="w-4 h-4" /> Edit Event Rules
          </Link>
          <Link 
            href="/organizer/participants" 
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2.5 rounded-xl text-white font-medium text-sm transition-all"
          >
            <Users className="w-4 h-4" /> View Participants
          </Link>
        </div>
      </div>

      {/* Metrics for this specific event */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Registered Participants</p>
              <h3 className="text-3xl font-bold text-white">{eventRegistrations.length}</h3>
              <p className="text-blue-400 text-xs mt-2 font-medium">Cap: {event.maxParticipants} participants</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Registration Status</p>
              <h3 className="text-2xl font-bold text-green-400 uppercase tracking-wide">{event.status}</h3>
              <p className="text-gray-400 text-xs mt-2 font-medium">Fee: ₹{event.registrationFee}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Schedule & Time</p>
              <h3 className="text-xl font-bold text-white">{event.startTime} - {event.endTime}</h3>
              <p className="text-gray-400 text-xs mt-2 font-medium">{event.date}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Participants registered ONLY for this event */}
      <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Event Participants</h2>
            <p className="text-xs text-gray-400">Students registered for {event.name}</p>
          </div>
          <Link href="/organizer/winners" className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
            <Trophy className="w-4 h-4" /> Declare Winners &rarr;
          </Link>
        </div>

        {eventRegistrations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No participants registered yet for this event.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-gray-400">
                <tr>
                  <th className="px-4 py-3">Applicant ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">College & Department</th>
                  <th className="px-4 py-3">Contact Email</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {eventRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-blue-400 font-medium">{reg.applicantId}</td>
                    <td className="px-4 py-3 text-white font-semibold">{reg.fullName}</td>
                    <td className="px-4 py-3 text-xs text-gray-300">
                      <div>{reg.college}</div>
                      <div className="text-gray-500">{reg.department} ({reg.year})</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{reg.email}</td>
                    <td className="px-4 py-3 text-center text-xs">
                      <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full font-medium">
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </OrganizerLayout>
  );
}
