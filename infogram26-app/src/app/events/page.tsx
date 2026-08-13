'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublicLayout from '@/components/layout/PublicLayout';
import EventCard from '@/components/events/EventCard';
import { Search } from 'lucide-react';
import { Event } from '@/types';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

import { useEventStore } from '@/store/eventStore';

import { OFFICIAL_EVENTS } from '@/lib/eventsData';
const demoEvents: Event[] = OFFICIAL_EVENTS;

import { useTheme } from '@/context/ThemeContext';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Technical' | 'Non-Technical'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { events: storeEvents } = useEventStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const initialList = demoEvents.map(demo => {
          const normDemoSlug = demo.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
          const storeMatch = storeEvents.find(
            s => s.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === normDemoSlug || s.id === demo.id
          );
          // Live store data (what admin/organizer edits write to) always wins over the brochure.
          return storeMatch ? { ...demo, ...storeMatch } : demo;
        });

        if (!db || !isFirebaseConfigured) {
          setEvents(initialList);
          setLoading(false);
          return;
        }

        const eventsRef = collection(db, 'events');
        const snapshot = await getDocs(eventsRef);
        if (snapshot.empty) {
          setEvents(initialList);
        } else {
          const eventsData = initialList.map(localEv => {
            const normLocalSlug = localEv.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
            const firestoreMatch = snapshot.docs.find(doc => {
              const d = doc.data();
              const dNorm = (d.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              return dNorm === normLocalSlug || doc.id === localEv.id;
            });

            if (firestoreMatch) {
              const dbData = firestoreMatch.data() as Event;
              // Firestore is the cross-device source of truth — it wins over the local/store copy.
              return { ...localEv, ...dbData, id: firestoreMatch.id };
            }
            return localEv;
          });
          setEvents(eventsData);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents(demoEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [storeEvents]);

  const filteredEvents = events.filter(event => {
    const matchesTab = activeTab === 'All' || 
      (activeTab === 'Technical' && event.category === 'technical') ||
      (activeTab === 'Non-Technical' && event.category === 'non-technical');
    
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesTab && matchesSearch;
  });

  return (
    <PublicLayout>
      <div className={`min-h-screen pb-20 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {/* HERO SECTION */}
        <section className="relative pt-28 pb-12 flex flex-col items-center justify-center overflow-hidden">
          <div className="container-xl relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 
                className={`text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4 uppercase ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
                style={{ 
                  fontFamily: 'var(--font-display)',
                  textShadow: isDark 
                    ? '0 0 20px rgba(192, 132, 252, 0.5)' 
                    : '0 2px 8px rgba(15, 23, 42, 0.1)',
                }}
              >
                Explore Events
              </h1>
              <p className={`text-base sm:text-xl max-w-2xl mx-auto font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Discover the perfect challenge for your skills from our wide range of technical and non-technical events.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CONTROLS SECTION */}
        <section className="container-xl px-4 mb-10">
          <div className={`flex flex-col md:flex-row justify-between items-center gap-5 p-4 sm:p-5 rounded-3xl border transition-colors duration-300 ${
            isDark ? 'bg-slate-900/90 border-purple-500/30 shadow-2xl backdrop-blur-2xl' : 'bg-white/95 border-slate-200 shadow-xl backdrop-blur-2xl'
          }`}>
            {/* TABS */}
            <div className={`flex space-x-2 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto border ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-300'
            }`}>
              {['All', 'Technical', 'Non-Technical'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? isDark 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-md'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/80 font-bold'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-auto md:min-w-[320px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className={`w-full rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold transition-all border ${
                  isDark 
                    ? 'bg-slate-950/90 border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white focus:outline-none focus:border-[#7c3aed] shadow-xs'
                }`}
              />
            </div>
          </div>
        </section>

        {/* EVENTS GRID */}
        <section className="container-xl px-4">
          <div className={`mb-6 text-sm font-black uppercase tracking-wider ${isDark ? 'text-amber-300' : 'text-slate-800'}`}>
            {filteredEvents.length} events found
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center rounded-3xl">
              <h3 className="text-xl font-bold mb-2 text-slate-900">No events found</h3>
              <p className="text-slate-600">Try adjusting your search or filters.</p>
            </div>
          )}
        </section>
      </div>
    </PublicLayout>
  );
}
