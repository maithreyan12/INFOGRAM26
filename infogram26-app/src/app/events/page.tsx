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
  { id: '1', slug: 'paper-presentation', name: 'Paper Presentation', category: 'technical', description: 'Present your innovative ideas and research papers. Share your knowledge with the technical community.', rules: ['Teams of 1-3 allowed', 'PPT required', 'Time limit: 10 minutes', 'Q&A session follows'], registrationFee: 150, maxParticipants: 50, registeredCount: 20, date: '2026-03-15', startTime: '09:00', endTime: '12:00', registrationDeadline: '2026-03-10', venue: 'IT Block, Seminar Hall', coordinatorName: 'Dr. A. Sharma', organizerName: 'John Doe', contactNumber: '9876543210', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', slug: 'coding-challenge', name: 'Coding Challenge', category: 'technical', description: 'Test your problem-solving skills with algorithmic challenges. Code your way to the top.', rules: ['Individual participation', 'C, C++, Java, Python allowed', '3 problems in 2 hours', 'No internet access'], registrationFee: 100, maxParticipants: 100, registeredCount: 85, date: '2026-03-15', startTime: '10:00', endTime: '13:00', registrationDeadline: '2026-03-10', venue: 'IT Lab 1 & 2', coordinatorName: 'Prof. R. Johnson', organizerName: 'Jane Smith', contactNumber: '9876543211', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', slug: 'hackathon', name: 'Hackathon', category: 'technical', description: '24-hour coding marathon to build innovative solutions. Bring your ideas to life.', rules: ['Teams of 2-4', 'Any tech stack', 'Problem statement revealed at start', 'Demo required'], registrationFee: 300, maxParticipants: 60, registeredCount: 45, date: '2026-03-15', startTime: '09:00', endTime: '09:00', registrationDeadline: '2026-03-10', venue: 'Main Auditorium', coordinatorName: 'Dr. K. Williams', organizerName: 'Alice Johnson', contactNumber: '9876543212', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', slug: 'web-design', name: 'Web Design', category: 'technical', description: 'Design and develop responsive websites. Show off your UI/UX and frontend skills.', rules: ['Individual or pairs', 'HTML/CSS/JS only', 'Theme revealed on day', '3 hours'], registrationFee: 150, maxParticipants: 50, registeredCount: 25, date: '2026-03-15', startTime: '13:00', endTime: '16:00', registrationDeadline: '2026-03-10', venue: 'IT Lab 3', coordinatorName: 'Prof. S. Brown', organizerName: 'Bob Williams', contactNumber: '9876543213', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', slug: 'database-design', name: 'Database Design', category: 'technical', description: 'Create efficient database schemas for complex scenarios. Master the art of data modeling.', rules: ['Individual only', 'MySQL / PostgreSQL', 'ER diagram required', '2 hours'], registrationFee: 100, maxParticipants: 40, registeredCount: 15, date: '2026-03-15', startTime: '14:00', endTime: '16:00', registrationDeadline: '2026-03-10', venue: 'IT Lab 4', coordinatorName: 'Dr. P. Davis', organizerName: 'Charlie Brown', contactNumber: '9876543214', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', slug: 'algorithm-contest', name: 'Algorithm Contest', category: 'technical', description: 'Solve complex algorithmic puzzles. Compete with the best minds in algorithmic thinking.', rules: ['Individual', 'Any language', 'Online Judge scoring', '3 hours'], registrationFee: 150, maxParticipants: 50, registeredCount: 30, date: '2026-03-15', startTime: '09:00', endTime: '12:00', registrationDeadline: '2026-03-10', venue: 'IT Lab 5', coordinatorName: 'Prof. V. Miller', organizerName: 'Diana Davis', contactNumber: '9876543215', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '7', slug: 'quiz-bee', name: 'Quiz Bee', category: 'non-technical', description: 'Test your general knowledge and tech trivia. A fun and engaging quiz competition.', rules: ['Teams of 2', 'Multiple rounds', 'No phones', 'Buzzer round included'], registrationFee: 50, maxParticipants: 100, registeredCount: 90, date: '2026-03-15', startTime: '11:00', endTime: '13:00', registrationDeadline: '2026-03-10', venue: 'Mini Auditorium', coordinatorName: 'Dr. N. Wilson', organizerName: 'Eve Miller', contactNumber: '9876543216', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '8', slug: 'treasure-hunt', name: 'Treasure Hunt', category: 'non-technical', description: 'Solve clues and find the hidden treasure around the campus. An adventurous team event.', rules: ['Teams of 3-5', 'Campus-wide hunt', 'Clues must not be damaged', 'Mobile allowed'], registrationFee: 150, maxParticipants: 80, registeredCount: 60, date: '2026-03-15', startTime: '14:00', endTime: '17:00', registrationDeadline: '2026-03-10', venue: 'Campus Ground', coordinatorName: 'Prof. L. Moore', organizerName: 'Frank Wilson', contactNumber: '9876543217', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '9', slug: 'photography', name: 'Photography', category: 'non-technical', description: 'Capture the best moments of the symposium. Show your photography skills.', rules: ['Individual', 'Any camera allowed', 'Submit 5 photos', 'Editing allowed'], registrationFee: 100, maxParticipants: 30, registeredCount: 20, date: '2026-03-15', startTime: '09:00', endTime: '16:00', registrationDeadline: '2026-03-10', venue: 'Campus Wide', coordinatorName: 'Dr. M. Taylor', organizerName: 'Grace Moore', contactNumber: '9876543218', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '10', slug: 'drawing', name: 'Drawing', category: 'non-technical', description: 'Express your creativity on canvas. A drawing competition with exciting themes.', rules: ['Individual', 'Themes revealed on day', 'Own materials', '2 hours'], registrationFee: 50, maxParticipants: 40, registeredCount: 15, date: '2026-03-15', startTime: '10:00', endTime: '12:00', registrationDeadline: '2026-03-10', venue: 'Drawing Hall', coordinatorName: 'Prof. C. Anderson', organizerName: 'Harry Taylor', contactNumber: '9876543219', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '11', slug: 'debate', name: 'Debate', category: 'non-technical', description: 'Argue your points on interesting topics. A platform to showcase your speaking skills.', rules: ['Teams of 2', 'Topic revealed 30 min before', '5 min prep time', 'Judge decision final'], registrationFee: 50, maxParticipants: 20, registeredCount: 10, date: '2026-03-15', startTime: '13:00', endTime: '15:00', registrationDeadline: '2026-03-10', venue: 'Seminar Hall 2', coordinatorName: 'Dr. R. Thomas', organizerName: 'Ivy Anderson', contactNumber: '9876543220', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '12', slug: 'just-a-minute', name: 'Just a Minute', category: 'non-technical', description: 'Speak on a given topic for one minute without hesitation or repetition. A fun speaking challenge.', rules: ['Individual', 'Topics assigned randomly', 'No notes allowed', 'Strictly 1 minute'], registrationFee: 50, maxParticipants: 30, registeredCount: 25, date: '2026-03-15', startTime: '15:00', endTime: '17:00', registrationDeadline: '2026-03-10', venue: 'Seminar Hall 2', coordinatorName: 'Prof. H. Jackson', organizerName: 'Jack Thomas', contactNumber: '9876543221', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() }
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Technical' | 'Non-Technical'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const snapshot = await getDocs(eventsRef);
        if (snapshot.empty) {
          setEvents(demoEvents);
        } else {
          const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
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
      <div className="min-h-screen bg-black text-white pb-20">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-12 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/10 z-0 blur-3xl"></div>
          <div className="container-xl relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">Explore Events</h1>
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
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
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
