'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PublicLayout from '@/components/layout/PublicLayout';
import { Calendar, MapPin, IndianRupee, Clock, Users, Phone, AlertCircle, ArrowLeft, Trophy } from 'lucide-react';
import { Event } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

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
    coordinatorName: 'Shyam Sundar & Maithreyan', organizerName: 'IT Association', contactNumber: '9345837870, 9342706675',
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

export default function EventDetailPage() {
  const params = useParams();
  const rawSlug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

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
        if (db) {
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
        <div className="min-h-screen bg-black flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <Link href="/events" className="text-blue-400 hover:underline">Return to Events</Link>
        </div>
      </PublicLayout>
    );
  }

  const isTechnical = event.category === 'technical';
  const seatsLeft = event.maxParticipants - (event.registeredCount || 0);
  const seatsPercentage = (seatsLeft / event.maxParticipants) * 100;
  
  let progressColor = 'bg-green-500';
  if (seatsPercentage < 10) progressColor = 'bg-red-500';
  else if (seatsPercentage < 50) progressColor = 'bg-yellow-500';

  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white pb-24">
        {/* Banner */}
        <div 
          className={`w-full h-64 md:h-80 relative ${
            event.bannerUrl 
              ? 'bg-cover bg-center' 
              : isTechnical ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-sky-900' : 'bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-900'
          }`}
          style={event.bannerUrl ? { backgroundImage: `url('${event.bannerUrl}')` } : {}}
        >
          <div className={`absolute inset-0 ${event.bannerUrl ? 'bg-black/60' : 'bg-black/40'}`}></div>
          <div className="container-xl h-full relative z-10 px-4 flex flex-col justify-end pb-8">
            <Link href="/events" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors w-fit group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              All Events
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/10 border border-white/20`}>
                {event.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
                isTechnical ? 'bg-blue-500/20 text-blue-100 border-blue-400/30' : 'bg-purple-500/20 text-purple-100 border-purple-400/30'
              }`}>
                {isTechnical ? 'Technical' : 'Non-Technical'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{event.name}</h1>
          </div>
        </div>

        <div className="container-xl px-4 mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT COLUMN (7) */}
            <div className="w-full lg:w-7/12 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 md:p-8 rounded-3xl"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-blue-400" />
                  About the Event
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {event.description}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 md:p-8 rounded-3xl"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Trophy className="w-6 h-6 mr-3 text-blue-400" />
                  Rules &amp; Guidelines
                </h2>
                <ul className="space-y-3 text-gray-300">
                  {event.rules && event.rules.length > 0 ? (
                    event.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-base leading-relaxed">
                        <span className="text-[#00d4ff] font-bold shrink-0">{idx + 1}.</span>
                        <span>{rule}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">Standard symposium rules apply.</li>
                  )}
                </ul>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="glass-card p-6 rounded-2xl">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#00d4ff] mb-2">Student Coordinators</div>
                  <div className="text-lg font-bold text-white mb-1">{event.coordinatorName}</div>
                  {event.contactNumber && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.contactNumber.split(',').map((num, i) => {
                        const cleanNum = num.trim();
                        return (
                          <a
                            key={i}
                            href={`tel:+91${cleanNum}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/20 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            {cleanNum}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Organizing Department</div>
                  <div className="text-base font-bold text-white mb-1">
                    {event.organizerName || 'Department of IT & Info Club'}
                  </div>
                  <div className="text-xs text-white/50">C. Abdul Hakeem College of Engg. &amp; Tech.</div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN (5) */}
            <div className="w-full lg:w-5/12">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-24 space-y-6"
              >
                {event.status === 'live' && (
                  <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl flex items-center justify-center animate-pulse">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-red-400 font-bold tracking-wider">LIVE NOW</span>
                  </div>
                )}
                
                {event.status === 'completed' && (
                  <div className="glass-card bg-white/5 border-gray-500/30 p-4 rounded-2xl text-center">
                    <span className="text-gray-300 font-bold">Event Completed</span>
                  </div>
                )}

                <div className="glass-card p-6 md:p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Event Details</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 mr-4 text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-400">Date</div>
                        <div className="font-medium text-white">{event.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 mr-4 text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-400">Time</div>
                        <div className="font-medium text-white">{event.startTime} - {event.endTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-4 text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-400">Venue</div>
                        <div className="font-medium text-white">{event.venue}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <IndianRupee className="w-5 h-5 mr-4 text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-400">Registration Fee</div>
                        <div className="font-medium text-white text-xl">₹{event.registrationFee}</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Seats Available</span>
                        <span className="font-bold text-white">{seatsLeft} / {event.maxParticipants}</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${progressColor}`}
                          style={{ width: `${100 - seatsPercentage}%` }}
                        ></div>
                      </div>
                      {seatsPercentage < 20 && seatsLeft > 0 && (
                        <p className="text-xs text-red-400 mt-2">Hurry! Almost full.</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    {event.status === 'upcoming' ? (
                      seatsLeft > 0 ? (
                        <Link href={`/register?event=${event.slug}`} className="btn-primary w-full block text-center py-4 rounded-xl text-lg font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                          Register for this Event
                        </Link>
                      ) : (
                        <button disabled className="w-full bg-gray-800 text-gray-500 py-4 rounded-xl text-lg font-bold cursor-not-allowed">
                          Registration Full
                        </button>
                      )
                    ) : null}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Need help?</div>
                    <div className="font-medium text-white">Contact Organizer</div>
                  </div>
                  <a href={`tel:${event.contactNumber}`} className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
