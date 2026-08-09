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

const demoEvents: Event[] = [
  // ── TECHNICAL ──
  {
    id: 'tech-1', slug: 'tech-talks', name: 'Tech Talks', category: 'technical',
    description: 'Present your innovative ideas and research papers to a panel of industry experts.',
    rules: [
      'Maximum of 2 members | ₹100 per head',
      'Submit a soft copy of the paper prior to presentation.',
      'Teams are allotted 5 minutes to present, followed by 2 minutes for questions.',
      'Topics: Quantum Computing, Generative AI, Cybersecurity, or any IT domain topic.'
    ],
    venue: 'IT Block, Seminar Hall', date: '2026-08-22', startTime: '09:30', endTime: '12:30',
    registrationDeadline: '2026-08-20', registrationFee: 100, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Mohammed Dhaniyal & Masood Nawaz', organizerName: 'IT Association', contactNumber: '7010155779, 9944410994',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-2', slug: 'clash-of-minds', name: 'Clash of Minds', category: 'technical',
    description: 'Test your technical knowledge and debate skills on on-the-spot topics.',
    rules: [
      'Maximum of 2 members | ₹50 per head',
      'On-the-spot topic: One member speaks for the topic and the other speaks against it.',
      'Time limit: 6 minutes per team to present.'
    ],
    venue: 'IT Lab 1', date: '2026-08-22', startTime: '10:00', endTime: '12:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Amirtha Varshini & Keerthana', organizerName: 'IT Association', contactNumber: '9597010159, 9629909942',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-3', slug: 'codestorm', name: 'CodeStorm', category: 'technical',
    description: 'Two-round coding challenge testing speed, accuracy, and problem-solving skills.',
    rules: [
      'Maximum of 2 members | ₹50 per head',
      'Round 1: 20 questions in 30 minutes.',
      'Round 2: Solve 5 coding questions in 1 hour using any programming language.',
      'Computers will be provided.'
    ],
    venue: 'IT Lab 2', date: '2026-08-22', startTime: '09:00', endTime: '16:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Mohammed Irfan & Thoufeeque Ahmed', organizerName: 'IT Association', contactNumber: '9042469482, 9150654995',
    bannerUrl: '/events/codestorm.jpeg',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-4', slug: 'pixel-craft', name: 'Pixel Craft', category: 'technical',
    description: 'Design and develop responsive websites. Show off your UI/UX and frontend skills.',
    rules: [
      'Maximum of 2 members | ₹100 per head',
      'Participants must bring their own laptops. No templates will be provided.',
      'Topics will be given on the spot.'
    ],
    venue: 'IT Lab 3', date: '2026-08-22', startTime: '13:00', endTime: '15:30',
    registrationDeadline: '2026-08-20', registrationFee: 100, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Mathin S & Manikandan T', organizerName: 'IT Association', contactNumber: '6381880659, 8825940089',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-5', slug: 'open-source', name: 'Open Source', category: 'technical',
    description: 'Single 90-minute round to find, fix, and improve a given codebase using GitHub workflow.',
    rules: [
      'Maximum of 2 members | ₹100 per head',
      'Single 90-minute round: Find, fix, and improve a given codebase.',
      'Complete open-source workflow: Fork → Code → Commit → Push → Pull Request.',
      'Bring a laptop with Git, GitHub access, and required coding tools.'
    ],
    venue: 'IT Lab 4', date: '2026-08-22', startTime: '11:00', endTime: '14:00',
    registrationDeadline: '2026-08-20', registrationFee: 100, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Saheem & Zahid', organizerName: 'IT Association', contactNumber: '9489016294, 7639412328',
    bannerUrl: '/events/open-source.jpeg',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-6', slug: 'byte-battle', name: 'Byte Battle', category: 'technical',
    description: 'Fast-paced technical contest testing your knowledge.',
    rules: [
      'Maximum of 2 members | ₹50 per head',
      'Participants should bring mobile phone.',
      'Use of AI and extra gadgets is strictly prohibited.'
    ],
    venue: 'IT Lab 5', date: '2026-08-22', startTime: '10:00', endTime: '12:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Ezhilarasan & Dinesh Babu', organizerName: 'IT Association', contactNumber: '9080249831, 6374468780',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-7', slug: 'hack-force', name: 'Hack Force', category: 'technical',
    description: 'Open innovation pitching contest across two rapid evaluation rounds.',
    rules: [
      'Maximum of 3 members (Individual / 2-3 members) | ₹100 per head',
      'Open innovation event featuring two rounds.',
      'Round 1: 5-minute prototype pitch.',
      'Round 2: 1-minute final pitch.'
    ],
    venue: 'IT Lab 6', date: '2026-08-22', startTime: '14:00', endTime: '15:30',
    registrationDeadline: '2026-08-20', registrationFee: 100, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Kashif', organizerName: 'IT Association', contactNumber: '6380028607',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  // ── NON-TECHNICAL ──
  {
    id: 'nontech-1', slug: 'mind-matrix', name: 'Mind Matrix', category: 'non-technical',
    description: 'Connect displayed images on screen to solve non-technical trivia and puzzles.',
    rules: [
      'Maximum of 2 members | ₹50 per head',
      'Answer non-technical questions/hints by connecting images displayed on screen.'
    ],
    venue: 'Mini Auditorium', date: '2026-08-22', startTime: '10:00', endTime: '12:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Naushin & Hema Malini', organizerName: 'IT Association', contactNumber: '7358170392, 7418575021',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-2', slug: 'flavour-fusion', name: 'Flavour Fusion', category: 'non-technical',
    description: 'No-fire culinary contest focusing on taste, presentation, and cleanliness.',
    rules: [
      'Maximum of 4 members | ₹50 per head',
      'Pre-cooked food is not allowed; bring your own raw ingredients and supplies.',
      'Judging criteria: Food taste, presentation, cleanliness of area, and number of dishes prepared.'
    ],
    venue: 'College Courtyard', date: '2026-08-22', startTime: '11:00', endTime: '12:30',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Jeevitha & Poorna Sree', organizerName: 'IT Association', contactNumber: '9384505002, 9600889789',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-3', slug: 'quest-x', name: 'Quest X', category: 'non-technical',
    description: 'Team treasure hunt across campus following sequential clues.',
    rules: [
      'Maximum of 4 members | ₹50 per head',
      'Follow clues in sequential order — no skipping allowed.',
      'Teams must stay together throughout the hunt.',
      'First team to locate the treasure wins.'
    ],
    venue: 'Main Campus Grounds', date: '2026-08-22', startTime: '13:30', endTime: '15:30',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Shyam Sundar & Maithreyan & Afnaan Saaqib', organizerName: 'IT Association', contactNumber: '9345837870, 9342706675, 9150032643',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-4', slug: 'battle-verse', name: 'Battle Verse', category: 'non-technical',
    description: 'Battle Royale gaming tournament with strict fair-play guidelines.',
    rules: [
      'Maximum of 4 members | ₹160 per team or ₹50 per person (Solo)',
      'Only Battle Royale (BR) matches are permitted.',
      'Character skills and emotes are strictly prohibited (emotes result in disqualification). Gun skins are allowed.',
      'Skirmishes or quarrels will result in immediate elimination.',
      'Winners (1st and 2nd) selected based on Booyah, Chicken Dinner, and Runner-up standings.'
    ],
    venue: 'Seminar Hall 2', date: '2026-08-22', startTime: '09:30', endTime: '16:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Meshak & Sanjay V', organizerName: 'IT Association', contactNumber: '6383598812, 6382143386',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-5', slug: 'frame-craft', name: 'Frame Craft', category: 'non-technical',
    description: 'On-spot photography contest inside campus matching the theme.',
    rules: [
      'Maximum of 1 member | ₹50 per head',
      'Topics will be provided on the spot.',
      'Only mobile photos taken inside the college campus matching the theme are accepted.'
    ],
    venue: 'Campus Wide', date: '2026-08-22', startTime: '09:00', endTime: '15:30',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Jeysha & Siddharth', organizerName: 'IT Association', contactNumber: '9345110882, 8925441089',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-6', slug: 'fun-fiesta', name: 'Fun Fiesta', category: 'non-technical',
    description: 'High-energy mini-games and spot challenges with instant prizes.',
    rules: [
      'Maximum of 4 members | ₹50 per head',
      'Spot entry mini-games and challenges throughout the day.'
    ],
    venue: 'Main Lawn', date: '2026-08-22', startTime: '09:30', endTime: '16:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Jaffreen & Talha', organizerName: 'IT Association', contactNumber: '9344814392, 8610117244',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-7', slug: 'artistry', name: 'Artistry', category: 'non-technical',
    description: 'Fine art and creative illustration contest.',
    rules: [
      'Maximum of 1 member | ₹50 per head',
      'Participants must bring their own required materials.',
      'Phones and reference materials are strictly prohibited.'
    ],
    venue: 'Drawing Hall', date: '2026-08-22', startTime: '10:00', endTime: '12:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Haniya Nikhat & Harshitha', organizerName: 'IT Association', contactNumber: '8248478615, 9629136470',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-8', slug: 'mic-drop', name: 'Mic Drop', category: 'non-technical',
    description: 'Open-mic contest for solo singing, poetry, or stand-up comedy.',
    rules: [
      '₹50 per head',
      'Strictly for singing, poetry, comedy, etc.',
      'Dancing and heavy acts are not permitted.'
    ],
    venue: 'Mini Auditorium', date: '2026-08-22', startTime: '13:00', endTime: '15:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Garnet & Heena', organizerName: 'IT Association', contactNumber: '6374139336, 8072672922',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-9', slug: 'reel-it-feel-it', name: 'Reel It Feel It', category: 'non-technical',
    description: 'Short mobile video/reel contest on an on-the-spot topic inside campus.',
    rules: [
      'Maximum of 2 members | ₹50 per head',
      'On-the-spot topic will be provided.',
      'Only videos shot on mobile phones inside the college campus matching the topic are permitted.'
    ],
    venue: 'Campus Wide', date: '2026-08-22', startTime: '09:00', endTime: '16:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 200, registeredCount: 0,
    coordinatorName: 'Naveeth Khan & Faizal Ahmed', organizerName: 'IT Association', contactNumber: '9360257573, 9003710032',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
];

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
          if (storeMatch) {
            return {
              ...demo,
              registeredCount: storeMatch.registeredCount ?? demo.registeredCount,
              bannerUrl: storeMatch.bannerUrl || demo.bannerUrl,
              status: storeMatch.status || demo.status,
            };
          }
          return demo;
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
              return {
                ...localEv,
                id: firestoreMatch.id,
                registeredCount: dbData.registeredCount ?? localEv.registeredCount,
                bannerUrl: dbData.bannerUrl || localEv.bannerUrl,
                status: dbData.status || localEv.status,
              };
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
                className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4 uppercase" 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  background: isDark
                    ? 'linear-gradient(180deg, #ffffff 0%, #c084fc 50%, #38bdf8 100%)'
                    : 'linear-gradient(180deg, #0f172a 0%, #6d28d9 55%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block',
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
