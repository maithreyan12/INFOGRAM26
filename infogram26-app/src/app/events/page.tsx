'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublicLayout from '@/components/layout/PublicLayout';
import EventCard from '@/components/events/EventCard';
import { Search } from 'lucide-react';
import { Event } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const demoEvents: Event[] = [
  {
    id: 'tech-1',
    slug: 'techtalks',
    name: 'TechTalks',
    category: 'technical',
    description: 'Present your innovative ideas and research papers. Share your knowledge with the technical community and get feedback from industry experts.',
    rules: ['Teams of 1-3 allowed', 'PPT presentation required', 'Time limit: 8 minutes presentation + 2 mins Q&A', 'Topic must be from emerging technology domains'],
    registrationFee: 150,
    maxParticipants: 50,
    registeredCount: 12,
    date: '2026-08-22',
    startTime: '09:30',
    endTime: '12:30',
    registrationDeadline: '2026-08-20',
    venue: 'IT Block, Seminar Hall',
    coordinatorName: 'Naveeth Khan',
    organizerName: 'IT Association',
    contactNumber: '9360257573',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tech-2',
    slug: 'bytebattle',
    name: 'ByteBattle',
    category: 'technical',
    description: 'A competitive programming contest that tests your algorithmic problem-solving speed and accuracy.',
    rules: ['Individual participation only', 'C, C++, Java, Python allowed', '3 problems to solve in 2 hours', 'No internet access allowed'],
    registrationFee: 100,
    maxParticipants: 100,
    registeredCount: 45,
    date: '2026-08-22',
    startTime: '10:00',
    endTime: '12:00',
    registrationDeadline: '2026-08-20',
    venue: 'IT Lab 1',
    coordinatorName: 'Farish Sharif',
    organizerName: 'IT Association',
    contactNumber: '9487233290',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tech-3',
    slug: 'pixelcraft',
    name: 'PixelCraft',
    category: 'technical',
    description: 'Design and develop responsive websites. Show off your UI/UX and frontend engineering skills.',
    rules: ['Individual or pairs', 'HTML/CSS/JS or Figma mockup', 'Theme will be revealed on-spot', 'Time limit: 2.5 hours'],
    registrationFee: 150,
    maxParticipants: 50,
    registeredCount: 22,
    date: '2026-08-22',
    startTime: '13:00',
    endTime: '15:30',
    registrationDeadline: '2026-08-20',
    venue: 'IT Lab 2',
    coordinatorName: 'Kafil Ahmed',
    organizerName: 'IT Association',
    contactNumber: '8940210491',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tech-4',
    slug: 'codestorm',
    name: 'CodeStorm',
    category: 'technical',
    description: 'A team-based hackathon-style challenge to build innovative software solutions addressing local or global problems.',
    rules: ['Teams of 2-4 members', 'Any tech stack allowed', 'Problem statements provided at start', 'Working prototype/Demo required'],
    registrationFee: 200,
    maxParticipants: 40,
    registeredCount: 18,
    date: '2026-08-22',
    startTime: '09:00',
    endTime: '16:00',
    registrationDeadline: '2026-08-20',
    venue: 'IT Lab 3',
    coordinatorName: 'Thameem',
    organizerName: 'IT Association',
    contactNumber: '9361900720',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tech-5',
    slug: 'open-source',
    name: 'Open Source',
    category: 'technical',
    description: 'Showcase your open source contributions, custom GitHub projects, or innovative software/hardware solutions to the panel.',
    rules: ['Teams of 1-3 members', 'Working project model required', 'GitHub repository link must be provided', 'Presentation time: 8 minutes'],
    registrationFee: 150,
    maxParticipants: 30,
    registeredCount: 10,
    date: '2026-08-22',
    startTime: '11:00',
    endTime: '14:00',
    registrationDeadline: '2026-08-20',
    venue: 'IT Lab 4',
    coordinatorName: 'Naveeth Khan',
    organizerName: 'IT Association',
    contactNumber: '9360257573',
    bannerUrl: '/events/open-source.jpeg',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tech-6',
    slug: 'hackforge',
    name: 'HackForge',
    category: 'technical',
    description: 'Solve debugging challenges, configure virtual environments, and build rapid setups under strict timelines.',
    rules: ['Individual participation', 'Pre-configured bugs must be resolved', 'Maximum 90 minutes', 'Score based on speed and completion'],
    registrationFee: 100,
    maxParticipants: 60,
    registeredCount: 25,
    date: '2026-08-22',
    startTime: '14:00',
    endTime: '15:30',
    registrationDeadline: '2026-08-20',
    venue: 'IT Lab 5',
    coordinatorName: 'Farish Sharif',
    organizerName: 'IT Association',
    contactNumber: '9487233290',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nontech-1',
    slug: 'mind-matrix',
    name: 'Mind Matrix',
    category: 'non-technical',
    description: 'The ultimate general knowledge and pop culture quiz competition to test your speed, trivia, and memory.',
    rules: ['Teams of 2 members', 'Written prelims followed by stage finals', 'No electronic devices allowed', 'Quick buzzer rounds'],
    registrationFee: 100,
    maxParticipants: 80,
    registeredCount: 52,
    date: '2026-08-22',
    startTime: '10:00',
    endTime: '12:00',
    registrationDeadline: '2026-08-20',
    venue: 'Mini Auditorium',
    coordinatorName: 'Kafil Ahmed',
    organizerName: 'IT Association',
    contactNumber: '8940210491',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nontech-2',
    slug: 'battleverse',
    name: 'BattleVerse',
    category: 'non-technical',
    description: 'Step into the gaming arena and face off against rivals in popular multiplayer combat matches.',
    rules: ['Individual or team depending on game', 'Own device/controllers recommended for mobile games', 'Knockout format', 'Strict fair-play rules'],
    registrationFee: 150,
    maxParticipants: 120,
    registeredCount: 78,
    date: '2026-08-22',
    startTime: '09:30',
    endTime: '16:00',
    registrationDeadline: '2026-08-20',
    venue: 'Seminar Hall 2',
    coordinatorName: 'Thameem',
    organizerName: 'IT Association',
    contactNumber: '9361900720',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nontech-3',
    slug: 'flavour-fusion',
    name: 'Flavour Fusion',
    category: 'non-technical',
    description: 'A culinary challenge to prepare and present delicious recipes without fire or stove cooking.',
    rules: ['Teams of 2 members', 'No flame/fire allowed', 'Bring your own raw ingredients', 'Time limit: 60 minutes for preparation'],
    registrationFee: 150,
    maxParticipants: 40,
    registeredCount: 15,
    date: '2026-08-22',
    startTime: '11:00',
    endTime: '12:30',
    registrationDeadline: '2026-08-20',
    venue: 'College Courtyard',
    coordinatorName: 'Naveeth Khan',
    organizerName: 'IT Association',
    contactNumber: '9360257573',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nontech-4',
    slug: 'framecraft',
    name: 'FrameCraft',
    category: 'non-technical',
    description: 'Capture the spirit and vibrant atmosphere of INFOGRAM\'26 inside the campus boundaries.',
    rules: ['Individual participation', 'Photos must be taken on event day within campus', 'No heavy digital manipulation', 'Submit best 3 frames by 15:30'],
    registrationFee: 100,
    maxParticipants: 50,
    registeredCount: 18,
    date: '2026-08-22',
    startTime: '09:00',
    endTime: '15:30',
    registrationDeadline: '2026-08-20',
    venue: 'Campus Wide',
    coordinatorName: 'Farish Sharif',
    organizerName: 'IT Association',
    contactNumber: '9487233290',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nontech-5',
    slug: 'quest-x',
    name: 'Quest X',
    category: 'non-technical',
    description: 'Solve mysterious puzzles, crack complex codes, and hunt for hidden checkpoints across the college campus.',
    rules: ['Teams of 3-5 members', 'Campus-bound search area', 'Do not move/disturb checkpoint markers', 'Solve clues in correct sequence'],
    registrationFee: 200,
    maxParticipants: 40,
    registeredCount: 30,
    date: '2026-08-22',
    startTime: '13:30',
    endTime: '15:30',
    registrationDeadline: '2026-08-20',
    venue: 'Main Campus Grounds',
    coordinatorName: 'Kafil Ahmed',
    organizerName: 'IT Association',
    contactNumber: '8940210491',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nontech-6',
    slug: 'artistry',
    name: 'Artistry',
    category: 'non-technical',
    description: 'Showcase your fine art talent in drawing, sketching, painting, or creative craft illustration.',
    rules: ['Individual participation', 'Theme announced at start', 'Bring your own canvas/colors (sheets provided)', 'Duration: 2 hours'],
    registrationFee: 100,
    maxParticipants: 40,
    registeredCount: 14,
    date: '2026-08-22',
    startTime: '10:00',
    endTime: '12:00',
    registrationDeadline: '2026-08-20',
    venue: 'Drawing Hall',
    coordinatorName: 'Thameem',
    organizerName: 'IT Association',
    contactNumber: '9361900720',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nontech-7',
    slug: 'reel-it-feel-it',
    name: 'Reel It Feel It',
    category: 'non-technical',
    description: 'Create engaging, high-energy reels or short videos showcasing the fun, highlights, and energy of the symposium.',
    rules: ['Individual or teams', 'Video length: 30-60 seconds', 'Must incorporate INFOGRAM\'26 logo or banners', 'Submit by 16:00'],
    registrationFee: 100,
    maxParticipants: 50,
    registeredCount: 20,
    date: '2026-08-22',
    startTime: '09:00',
    endTime: '16:00',
    registrationDeadline: '2026-08-20',
    venue: 'Campus Wide',
    coordinatorName: 'Naveeth Khan',
    organizerName: 'IT Association',
    contactNumber: '9360257573',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nontech-8',
    slug: 'mic-drop',
    name: 'Mic Drop',
    category: 'non-technical',
    description: 'An open-mic performance contest for solo singing, stand-up comedy, or inspirational speech.',
    rules: ['Individual performance', 'Time limit: 4 minutes', 'No offensive content or language', 'Karaoke tracks allowed for singing'],
    registrationFee: 100,
    maxParticipants: 30,
    registeredCount: 15,
    date: '2026-08-22',
    startTime: '13:00',
    endTime: '15:00',
    registrationDeadline: '2026-08-20',
    venue: 'Mini Auditorium',
    coordinatorName: 'Farish Sharif',
    organizerName: 'IT Association',
    contactNumber: '9487233290',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nontech-9',
    slug: 'funfiesta',
    name: 'FunFiesta',
    category: 'non-technical',
    description: 'A collection of exciting, high-energy mini-games and spots for all attendees to join and win instant prizes.',
    rules: ['Spot registration/entry', 'Various simple challenges', 'Instant gifts and badges', 'Open throughout the day'],
    registrationFee: 50,
    maxParticipants: 300,
    registeredCount: 110,
    date: '2026-08-22',
    startTime: '09:30',
    endTime: '16:00',
    registrationDeadline: '2026-08-20',
    venue: 'Main Lawn',
    coordinatorName: 'Kafil Ahmed',
    organizerName: 'IT Association',
    contactNumber: '8940210491',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Technical' | 'Non-Technical'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!db) {
          setEvents(demoEvents);
          setLoading(false);
          return;
        }
        const eventsRef = collection(db, 'events');
        const snapshot = await getDocs(eventsRef);
        if (snapshot.empty) {
          setEvents(demoEvents);
        } else {
          const eventsData = snapshot.docs.map(doc => {
            const data = doc.data() as Event;
            const demoMatch = demoEvents.find(e => e.slug === data.slug);
            return { 
              ...data,
              id: doc.id, 
              bannerUrl: data.bannerUrl || demoMatch?.bannerUrl
            };
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
  }, []);

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
      <div className="min-h-screen text-white pb-20">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-12 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/10 z-0 blur-3xl"></div>
          <div className="container-xl relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6" style={{ fontFamily: 'var(--font-display)' }}>Explore Events</h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover the perfect challenge for your skills from our wide range of technical and non-technical events.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CONTROLS SECTION */}
        <section className="container-xl px-4 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 glass-card p-4 rounded-2xl">
            {/* TABS */}
            <div className="flex space-x-2 bg-white/5 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
              {['All', 'Technical', 'Non-Technical'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
        </section>

        {/* EVENTS GRID */}
        <section className="container-xl px-4">
          <div className="mb-6 text-gray-400 font-medium">
            {filteredEvents.length} events found
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
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
              <h3 className="text-xl font-bold mb-2">No events found</h3>
              <p className="text-gray-400">Try adjusting your search or filters.</p>
            </div>
          )}
        </section>
      </div>
    </PublicLayout>
  );
}
