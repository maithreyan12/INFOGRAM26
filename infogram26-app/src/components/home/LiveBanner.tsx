'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
// @ts-ignore
import { db, isFirebaseConfigured } from '@/lib/firebase/config';

type LiveEvent = {
  id: string;
  slug: string;
  name: string;
  venue: string;
};

export default function LiveBanner() {
  const [liveEvent, setLiveEvent] = useState<LiveEvent | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    try {
      const q = query(collection(db, 'events'), where('status', '==', 'live'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setLiveEvent({ id: doc.id, ...doc.data() } as LiveEvent);
        } else {
          setLiveEvent(null);
        }
      }, () => { /* silently ignore Firebase errors */ });
      return () => unsubscribe();
    } catch {
      // Firebase not available — no live banner
    }
  }, []);

  return (
    <AnimatePresence>
      {liveEvent && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none"
        >
          <div className="pointer-events-auto bg-black/80 backdrop-blur-md border border-red-500/50 rounded-full px-6 py-3 flex items-center gap-4 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-[pulse-glow_2s_infinite]">
            <div className="flex items-center gap-2">
              <span className="live-dot w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              <span className="text-red-500 font-bold text-sm tracking-widest">LIVE NOW</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="text-white text-sm font-medium">
              {liveEvent.name} <span className="text-white/50 hidden md:inline">• {liveEvent.venue}</span>
            </div>
            <Link href={`/events/${liveEvent.slug}`} className="ml-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors">
              Join Now
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
