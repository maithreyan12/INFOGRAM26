'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PublicLayout from '@/components/layout/PublicLayout';
import { Calendar, MapPin, IndianRupee, Clock, Users, Phone, AlertCircle, ArrowLeft, Trophy, UserCheck } from 'lucide-react';
import { Event } from '@/types';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { useEventStore } from '@/store/eventStore';

import { OFFICIAL_EVENTS, formatTimeRange } from '@/lib/eventsData';
const demoEvents: Event[] = OFFICIAL_EVENTS;

import { useTheme } from '@/context/ThemeContext';

export default function EventDetailPage() {
  const params = useParams();
  const rawSlug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { events: storeEvents } = useEventStore();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const normSlug = rawSlug ? rawSlug.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
        
        // 1. Always resolve base event from official demoEvents list to guarantee 100% brochure accuracy
        let localEvent = demoEvents.find(e => {
          const eNorm = e.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
          return eNorm === normSlug || e.id === rawSlug;
        });

        if (!localEvent) {
          localEvent = storeEvents.find(e => {
            const eNorm = e.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
            return eNorm === normSlug || e.id === rawSlug;
          });
        }

        let resultEvent = localEvent ? { ...localEvent } : null;

        // 2. Check Firebase if configured for live metrics
        if (db && isFirebaseConfigured) {
          try {
            const eventsRef = collection(db, 'events');
            const snapshot = await getDocs(eventsRef);
            if (!snapshot.empty) {
              const firestoreMatch = snapshot.docs.find(doc => {
                const data = doc.data();
                const dNorm = (data.slug || doc.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                return dNorm === normSlug || doc.id === rawSlug || doc.id === localEvent?.id;
              });

              if (firestoreMatch) {
                const dbData = firestoreMatch.data() as Event;
                const dbSlugNorm = (dbData.slug || firestoreMatch.id).toLowerCase().replace(/[^a-z0-9]/g, '');
                
                // Always map to official brochure definition from demoEvents
                const brochureMatch = demoEvents.find(e => {
                  const eNorm = e.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
                  return eNorm === dbSlugNorm || eNorm === normSlug || e.id === firestoreMatch.id;
                }) || localEvent;

                if (brochureMatch) {
                  resultEvent = {
                    ...brochureMatch,
                    id: firestoreMatch.id,
                    registeredCount: dbData.registeredCount ?? brochureMatch.registeredCount,
                    bannerUrl: dbData.bannerUrl || brochureMatch.bannerUrl,
                    status: dbData.status || brochureMatch.status,
                  };
                }
              }
            }
          } catch (err) {
            console.error("Firestore error:", err);
          }
        }

        setEvent(resultEvent);
      } catch (error) {
        console.error("Error fetching event:", error);
        const normSlug = rawSlug ? rawSlug.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
        const fallback = demoEvents.find(
          e => e.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === normSlug
        );
        setEvent(fallback || null);
      } finally {
        setLoading(false);
      }
    };

    if (rawSlug) {
      fetchEvent();
    }
  }, [rawSlug, storeEvents]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-transparent flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-transparent flex flex-col justify-center items-center text-slate-900">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <Link href="/events" className="text-[#7c3aed] hover:underline font-bold">Return to Events</Link>
        </div>
      </PublicLayout>
    );
  }

  const isTechnical = event.category === 'technical';
  const seatsLeft = event.maxParticipants - (event.registeredCount || 0);
  const seatsPercentage = (seatsLeft / event.maxParticipants) * 100;
  
  let progressColor = 'bg-emerald-500';
  if (seatsPercentage < 10) progressColor = 'bg-red-500';
  else if (seatsPercentage < 50) progressColor = 'bg-amber-500';

  return (
    <PublicLayout>
      <div className={`min-h-screen bg-transparent pb-24 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {/* ── Clean compact event header (no coloured banner) ── */}
        <div className={`w-full pt-24 pb-6 px-4 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="container-xl">
            <Link
              href="/events"
              className={`inline-flex items-center gap-2 text-sm font-bold mb-4 group transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-150" />
              All Events
            </Link>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                {event.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isTechnical
                  ? (isDark ? 'bg-purple-500/15 border-purple-500/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700')
                  : (isDark ? 'bg-teal-500/15 border-teal-500/30 text-teal-300' : 'bg-teal-50 border-teal-200 text-teal-700')
              }`}>
                {isTechnical ? 'Technical' : 'Non-Technical'}
              </span>
            </div>
            <h1 className={`text-3xl sm:text-5xl font-black ${
              isDark ? 'text-white' : 'text-slate-900'
            }`} style={{ fontFamily: 'var(--font-display)' }}>
              {event.name}
            </h1>
          </div>
        </div>

        <div className="container-xl px-4 mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT COLUMN (7) */}
            <div className="w-full lg:w-7/12 space-y-8">
              <div className={`p-6 md:p-8 rounded-3xl border ${
                isDark ? 'bg-slate-900/90 border-purple-500/30 text-white shadow-2xl' : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <AlertCircle className={`w-6 h-6 mr-3 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                  About the Event
                </h2>
                <p className={`leading-relaxed text-lg font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {event.description}
                </p>
              </div>

              <div className={`p-6 md:p-8 rounded-3xl border ${
                isDark ? 'bg-slate-900/90 border-purple-500/30 text-white shadow-2xl' : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Trophy className={`w-6 h-6 mr-3 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                  Rules &amp; Guidelines
                </h2>
                <ul className={`space-y-3 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {event.rules && event.rules.length > 0 ? (
                    event.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-base leading-relaxed">
                        <span className={`font-bold shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>{idx + 1}.</span>
                        <span>{rule}</span>
                      </li>
                    ))
                  ) : (
                    <li className={isDark ? 'text-slate-400' : 'text-slate-500'}>Standard symposium rules apply.</li>
                  )}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`glass-card p-6 rounded-2xl border ${isDark ? 'bg-slate-900/90 border-purple-500/30' : 'bg-white/90 border-slate-200'}`}>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>Student Coordinators</div>
                  {(() => {
                    const names = event.coordinatorName
                      ? event.coordinatorName.split(/&|,|\band\b/i).map((n) => n.trim()).filter(Boolean)
                      : [];
                    const numbers = event.contactNumber
                      ? event.contactNumber.split(/,|\//).map((n) => n.trim()).filter(Boolean)
                      : [];

                    if (names.length === 0) {
                      return <div className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Student Coordinator</div>;
                    }

                    return (
                      <div className="space-y-2.5">
                        {names.map((name, i) => {
                          const phone = numbers[i] || numbers[0] || '';
                          return (
                            <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl border ${
                              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-100/70 border-slate-200/80'
                            }`}>
                              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{name}</span>
                              {phone && (
                                <a
                                  href={`tel:+91${phone}`}
                                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all w-fit ${
                                    isDark 
                                      ? 'bg-purple-500/20 border-purple-500/40 text-amber-300 hover:bg-purple-500/30' 
                                      : 'bg-[#7c3aed]/10 border-[#7c3aed]/30 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white'
                                  }`}
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  Call {phone}
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
                <div className={`glass-card p-6 rounded-2xl border ${isDark ? 'bg-slate-900/90 border-purple-500/30' : 'bg-white/90 border-slate-200'}`}>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>Organizing Department</div>
                  <div className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {event.organizerName || 'Department of IT & Info Club'}
                  </div>
                  <div className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>C. Abdul Hakeem College of Engineering &amp; Technology</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (5) */}
            <div className="w-full lg:w-5/12">
              <div className="sticky top-24 space-y-6">
                {event.status === 'live' && (
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center justify-center animate-pulse">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-red-500 font-bold tracking-wider">LIVE NOW</span>
                  </div>
                )}
                
                {event.status === 'completed' && (
                  <div className={`glass-card p-4 rounded-2xl text-center border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                    <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Event Completed</span>
                  </div>
                )}

                <div className={`glass-card p-6 md:p-8 rounded-3xl border transition-colors duration-300 ${
                  isDark ? 'bg-slate-900/90 border-purple-500/30 text-white shadow-2xl' : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'
                }`}>
                  <h3 className={`text-xl font-bold mb-6 border-b pb-4 ${isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'}`}>Event Details</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Calendar className={`w-5 h-5 mr-4 mt-0.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                      <div>
                        <div className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date</div>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className={`w-5 h-5 mr-4 mt-0.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                      <div>
                        <div className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Time</div>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatTimeRange(event.startTime, event.endTime)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className={`w-5 h-5 mr-4 mt-0.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                      <div>
                        <div className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Venue</div>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.venue}</div>
                      </div>
                    </div>

                    {event.staffIncharge && (
                      <div className="flex items-start">
                        <UserCheck className={`w-5 h-5 mr-4 mt-0.5 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                        <div>
                          <div className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Staff In-charge</div>
                          <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.staffIncharge.replace(/;/g, ', ')}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start">
                      <IndianRupee className={`w-5 h-5 mr-4 mt-0.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                      <div>
                        <div className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Registration Fee</div>
                        <div className="font-extrabold text-amber-500 text-xl">₹{event.registrationFee}</div>
                      </div>
                    </div>

                    <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Seats Available</span>
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{seatsLeft} / {event.maxParticipants}</span>
                      </div>
                      <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-slate-200'}`}>
                        <div 
                          className={`h-full rounded-full ${progressColor}`}
                          style={{ width: `${100 - seatsPercentage}%` }}
                        ></div>
                      </div>
                      {seatsPercentage < 20 && seatsLeft > 0 && (
                        <p className="text-xs text-red-500 font-bold mt-2">Hurry! Almost full.</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    {event.status === 'upcoming' ? (
                      seatsLeft > 0 ? (
                        <Link href={`/register?event=${event.slug}`} className="btn-primary w-full block text-center py-4 rounded-full text-lg font-bold shadow-lg">
                          Register for this Event
                        </Link>
                      ) : (
                        <button disabled className={`w-full py-4 rounded-full text-lg font-bold cursor-not-allowed ${
                          isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-400'
                        }`}>
                          Registration Full
                        </button>
                      )
                    ) : null}
                  </div>
                </div>

                <div className={`glass-card p-6 rounded-2xl space-y-3 border ${isDark ? 'bg-slate-900/90 border-purple-500/30' : 'bg-white/90 border-slate-200'}`}>
                  <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Need help? Contact Event Organizers</div>
                  {(() => {
                    const names = event.coordinatorName
                      ? event.coordinatorName.split(/&|,|\band\b/i).map((n) => n.trim()).filter(Boolean)
                      : [];
                    const numbers = event.contactNumber
                      ? event.contactNumber.split(/,|\//).map((n) => n.trim()).filter(Boolean)
                      : [];

                    if (names.length === 0 && numbers.length === 0) {
                      return (
                        <a href="tel:+919360257573" className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                          isDark ? 'bg-slate-950/70 border-slate-800 hover:bg-slate-800' : 'bg-slate-100/70 border-slate-200 hover:bg-slate-200/80'
                        }`}>
                          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Main Help Desk</span>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isDark ? 'bg-purple-500/20 text-amber-300' : 'bg-[#7c3aed]/10 text-[#7c3aed]'}`}>Call 9360257573</span>
                        </a>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        {(names.length > 0 ? names : numbers).map((nameOrNum, i) => {
                          const name = names[i] || `Coordinator ${i + 1}`;
                          const phone = numbers[i] || numbers[0] || '9360257573';
                          return (
                            <div key={i} className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border ${
                              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-100/70 border-slate-200/80'
                            }`}>
                              <div>
                                <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{name}</div>
                                <div className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Coordinator · {phone}</div>
                              </div>
                              <a
                                href={`tel:+91${phone}`}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                                  isDark ? 'bg-purple-500/20 text-amber-300 hover:bg-purple-500/30' : 'bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white'
                                }`}
                                title={`Call ${name} (${phone})`}
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
