'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
// @ts-ignore
import { db, isFirebaseConfigured } from '@/lib/firebase/config';

type Announcement = {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  createdAt: any;
  dateStr?: string;
};

const DEMO_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'Early Bird Registration Open', content: 'Register before Feb 1st to get a 20% discount on all technical events.', type: 'success', createdAt: null, dateStr: 'Jan 15, 2026' },
  { id: '2', title: 'Hackathon Problem Statements Released', content: 'The problem statements for the 24-hour hackathon are now available on the events page.', type: 'info', createdAt: null, dateStr: 'Jan 10, 2026' },
  { id: '3', title: 'Schedule Update', content: 'The Quiz Bee prelims have been moved to Seminar Hall 2 due to overwhelming response.', type: 'warning', createdAt: null, dateStr: 'Jan 05, 2026' },
];

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        if (!isFirebaseConfigured || !db) { setAnnouncements(DEMO_ANNOUNCEMENTS); return; }
        const q = query(
          collection(db, 'announcements'),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setAnnouncements(DEMO_ANNOUNCEMENTS);
        } else {
          setAnnouncements(snapshot.docs.map(doc => {
            const data = doc.data();
            const dateStr = data.createdAt ? new Date(data.createdAt.toMillis()).toLocaleDateString() : 'Recent';
            return { id: doc.id, ...data, dateStr } as Announcement;
          }));
        }
      } catch (error) {
        
        setAnnouncements(DEMO_ANNOUNCEMENTS);
      }
    }
    fetchAnnouncements();
  }, []);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'info': return { border: 'border-l-sky-500', icon: <Info className="text-sky-500" size={24} /> };
      case 'warning': return { border: 'border-l-amber-500', icon: <AlertTriangle className="text-amber-500" size={24} /> };
      case 'success': return { border: 'border-l-green-500', icon: <CheckCircle className="text-green-500" size={24} /> };
      case 'urgent': return { border: 'border-l-red-500', icon: <Bell className="text-red-500" size={24} /> };
      default: return { border: 'border-l-white', icon: <Info className="text-white" size={24} /> };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section className="section-padding container-xl mx-auto px-4 max-w-4xl">
      <div className="mb-10">
        <span className="section-badge inline-block px-4 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] text-sm font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Latest Announcements
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Stay Updated</h2>
      </div>

      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {announcements.map(announcement => {
          const styles = getTypeStyles(announcement.type);
          return (
            <motion.div 
              key={announcement.id} 
              variants={itemVariants}
              className={`glass-card p-6 rounded-xl border-l-4 ${styles.border} bg-white/5 backdrop-blur-sm border-y border-r border-white/10 flex gap-4`}
            >
              <div className="shrink-0 mt-1">
                {styles.icon}
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
                  <span className="text-xs text-white/50">{announcement.dateStr}</span>
                </div>
                <p className="text-white/70">{announcement.content}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
