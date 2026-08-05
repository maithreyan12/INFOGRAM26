'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, query, getDocs, where, limit } from 'firebase/firestore';
// @ts-ignore
import { db, isFirebaseConfigured } from '@/lib/firebase/config';

type Event = {
  id: string;
  slug: string;
  name: string;
  category: 'technical' | 'non-technical';
  date: string;
  venue: string;
  fee: number;
  imageUrl?: string;
};

const DEMO_EVENTS: Event[] = [
  { id: '1', slug: 'paper-presentation', name: 'Paper Presentation', category: 'technical', date: 'March 15, 2026', venue: 'Main Auditorium', fee: 200 },
  { id: '2', slug: 'coding-challenge', name: 'Coding Challenge', category: 'technical', date: 'March 15, 2026', venue: 'Lab 1', fee: 150 },
  { id: '3', slug: 'web-design', name: 'Web Design', category: 'technical', date: 'March 15, 2026', venue: 'Lab 2', fee: 150 },
  { id: '4', slug: 'quiz-bee', name: 'Quiz Bee', category: 'non-technical', date: 'March 16, 2026', venue: 'Seminar Hall', fee: 100 },
  { id: '5', slug: 'hackathon', name: 'Hackathon', category: 'technical', date: 'March 16, 2026', venue: 'Lab 3', fee: 300 },
  { id: '6', slug: 'project-expo', name: 'Project Expo', category: 'technical', date: 'March 16, 2026', venue: 'Exhibition Hall', fee: 250 },
];

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        if (!isFirebaseConfigured || !db) { setEvents(DEMO_EVENTS); return; }
        const q = query(collection(db, 'events'), where('isFeatured', '==', true), limit(6));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setEvents(DEMO_EVENTS);
        } else {
          const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
          setEvents(fetched);
        }
      } catch (error) {
        
        setEvents(DEMO_EVENTS);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="section-padding container-xl mx-auto px-4">
      <div className="text-center mb-12">
        <span className="section-badge inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sky-400 text-sm font-semibold mb-4">
          Featured Events
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Experience the Future of Technology</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-80 rounded-2xl animate-pulse bg-white/5 border border-white/10" />
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {events.map(event => (
            <motion.div key={event.id} variants={cardVariants} className="glass-card rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex flex-col transition-transform hover:-translate-y-1">
              <div className="h-48 w-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 relative">
                {event.imageUrl && <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover opacity-60" />}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${event.category === 'technical' ? 'bg-sky-500/30 text-sky-200 border border-sky-500/50' : 'bg-purple-500/30 text-purple-200 border border-purple-500/50'}`}>
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                <div className="text-white/60 text-sm mb-4 space-y-1">
                  <p>📅 {event.date}</p>
                  <p>📍 {event.venue}</p>
                  <p>💰 ₹{event.fee}</p>
                </div>
                <div className="mt-auto pt-4">
                  <Link href={`/events/${event.slug}`} className="block w-full text-center py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
