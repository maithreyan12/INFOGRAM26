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

const demoEvents: Event[] = [
  { id: '1', slug: 'paper-presentation', name: 'Paper Presentation', category: 'technical', description: 'Present your innovative ideas and research papers. Share your knowledge with the technical community. This event encourages original research and creative thinking among students from various disciplines.', rules: ['Teams of 1-3 allowed', 'PPT must be submitted 2 days before', 'Time limit: 10 minutes presentation + 5 min Q&A', 'Topic must be from current technology domains', 'Plagiarism will result in disqualification'], registrationFee: 150, maxParticipants: 50, registeredCount: 20, date: '2026-03-15', startTime: '09:00', endTime: '12:00', registrationDeadline: '2026-03-10', venue: 'IT Block, Seminar Hall', coordinatorName: 'Dr. A. Sharma', organizerName: 'John Doe', contactNumber: '9876543210', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', slug: 'coding-challenge', name: 'Coding Challenge', category: 'technical', description: 'Test your problem-solving skills with algorithmic challenges. Code your way to the top and showcase your programming expertise to experts and peers.', rules: ['Individual participation only', 'C, C++, Java, Python allowed', '3 problems to solve in 2 hours', 'No internet access permitted', 'Pre-installed IDE will be provided'], registrationFee: 100, maxParticipants: 100, registeredCount: 85, date: '2026-03-15', startTime: '10:00', endTime: '13:00', registrationDeadline: '2026-03-10', venue: 'IT Lab 1 & 2', coordinatorName: 'Prof. R. Johnson', organizerName: 'Jane Smith', contactNumber: '9876543211', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', slug: 'hackathon', name: 'Hackathon', category: 'technical', description: '24-hour coding marathon to build innovative solutions. Bring your ideas to life and solve real-world problems with technology.', rules: ['Teams of 2-4 members', 'Any tech stack allowed', 'Problem statement revealed at the start', 'Prototype/Demo required at end', 'Code to be submitted on GitHub'], registrationFee: 300, maxParticipants: 60, registeredCount: 45, date: '2026-03-15', startTime: '09:00', endTime: '09:00', registrationDeadline: '2026-03-10', venue: 'Main Auditorium', coordinatorName: 'Dr. K. Williams', organizerName: 'Alice Johnson', contactNumber: '9876543212', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', slug: 'web-design', name: 'Web Design', category: 'technical', description: 'Design and develop responsive websites. Show off your UI/UX and frontend skills in this exciting competition.', rules: ['Individual or pairs', 'HTML/CSS/JS only (no frameworks)', 'Theme revealed on event day', '3 hours to complete', 'Responsiveness will be judged'], registrationFee: 150, maxParticipants: 50, registeredCount: 25, date: '2026-03-15', startTime: '13:00', endTime: '16:00', registrationDeadline: '2026-03-10', venue: 'IT Lab 3', coordinatorName: 'Prof. S. Brown', organizerName: 'Bob Williams', contactNumber: '9876543213', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', slug: 'database-design', name: 'Database Design', category: 'technical', description: 'Create efficient database schemas for complex scenarios. Master the art of data modeling and database optimization.', rules: ['Individual only', 'MySQL or PostgreSQL', 'ER diagram must be submitted', '2 hours time limit', 'Normalization rules apply'], registrationFee: 100, maxParticipants: 40, registeredCount: 15, date: '2026-03-15', startTime: '14:00', endTime: '16:00', registrationDeadline: '2026-03-10', venue: 'IT Lab 4', coordinatorName: 'Dr. P. Davis', organizerName: 'Charlie Brown', contactNumber: '9876543214', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', slug: 'algorithm-contest', name: 'Algorithm Contest', category: 'technical', description: 'Solve complex algorithmic puzzles. Compete with the best minds in algorithmic thinking and data structures.', rules: ['Individual participation', 'Any language allowed', 'Online Judge scoring system', '3 hours duration', 'Top 3 win prizes'], registrationFee: 150, maxParticipants: 50, registeredCount: 30, date: '2026-03-15', startTime: '09:00', endTime: '12:00', registrationDeadline: '2026-03-10', venue: 'IT Lab 5', coordinatorName: 'Prof. V. Miller', organizerName: 'Diana Davis', contactNumber: '9876543215', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '7', slug: 'quiz-bee', name: 'Quiz Bee', category: 'non-technical', description: 'Test your general knowledge and tech trivia. A fun and engaging quiz competition with exciting prizes.', rules: ['Teams of 2', 'Multiple elimination rounds', 'No phones/devices allowed', 'Buzzer round included in finals', 'Organizer decision is final'], registrationFee: 50, maxParticipants: 100, registeredCount: 90, date: '2026-03-15', startTime: '11:00', endTime: '13:00', registrationDeadline: '2026-03-10', venue: 'Mini Auditorium', coordinatorName: 'Dr. N. Wilson', organizerName: 'Eve Miller', contactNumber: '9876543216', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '8', slug: 'treasure-hunt', name: 'Treasure Hunt', category: 'non-technical', description: 'Solve clues and find the hidden treasure around the campus. An adventurous team event that tests your thinking.', rules: ['Teams of 3-5 members', 'Campus-wide hunt', 'Clues must not be damaged or moved', 'Mobile phones allowed for photography', 'First team to complete wins'], registrationFee: 150, maxParticipants: 80, registeredCount: 60, date: '2026-03-15', startTime: '14:00', endTime: '17:00', registrationDeadline: '2026-03-10', venue: 'Campus Ground', coordinatorName: 'Prof. L. Moore', organizerName: 'Frank Wilson', contactNumber: '9876543217', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '9', slug: 'photography', name: 'Photography', category: 'non-technical', description: 'Capture the best moments of the symposium. Show your photography skills and win exciting prizes.', rules: ['Individual competition', 'Any camera/smartphone allowed', 'Submit best 5 photos', 'Light editing allowed', 'AI-generated images disqualified'], registrationFee: 100, maxParticipants: 30, registeredCount: 20, date: '2026-03-15', startTime: '09:00', endTime: '16:00', registrationDeadline: '2026-03-10', venue: 'Campus Wide', coordinatorName: 'Dr. M. Taylor', organizerName: 'Grace Moore', contactNumber: '9876543218', status: 'upcoming', isFeatured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '10', slug: 'drawing', name: 'Drawing', category: 'non-technical', description: 'Express your creativity on canvas. A drawing competition with exciting themes and prizes for winners.', rules: ['Individual competition', 'Themes revealed on event day', 'Bring your own materials', '2 hours to complete', 'Digital art not allowed'], registrationFee: 50, maxParticipants: 40, registeredCount: 15, date: '2026-03-15', startTime: '10:00', endTime: '12:00', registrationDeadline: '2026-03-10', venue: 'Drawing Hall', coordinatorName: 'Prof. C. Anderson', organizerName: 'Harry Taylor', contactNumber: '9876543219', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '11', slug: 'debate', name: 'Debate', category: 'non-technical', description: 'Argue your points on interesting topics. A platform to showcase your speaking skills, critical thinking, and persuasion.', rules: ['Teams of 2 (for and against)', 'Topic revealed 30 minutes before', '5 min prep time after topic reveal', 'Each speaker gets 4 minutes', 'Judge decision is final'], registrationFee: 50, maxParticipants: 20, registeredCount: 10, date: '2026-03-15', startTime: '13:00', endTime: '15:00', registrationDeadline: '2026-03-10', venue: 'Seminar Hall 2', coordinatorName: 'Dr. R. Thomas', organizerName: 'Ivy Anderson', contactNumber: '9876543220', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '12', slug: 'just-a-minute', name: 'Just a Minute', category: 'non-technical', description: 'Speak on a given topic for one minute without hesitation or repetition. A fun and energetic speaking challenge.', rules: ['Individual competition', 'Topics assigned randomly on the spot', 'No notes allowed', 'Strictly 1 minute - timer used', 'Hesitation, repetition, deviation penalized'], registrationFee: 50, maxParticipants: 30, registeredCount: 25, date: '2026-03-15', startTime: '15:00', endTime: '17:00', registrationDeadline: '2026-03-10', venue: 'Seminar Hall 2', coordinatorName: 'Prof. H. Jackson', organizerName: 'Jack Thomas', contactNumber: '9876543221', status: 'upcoming', isFeatured: false, createdAt: new Date(), updatedAt: new Date() }
];


export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, where('slug', '==', slug));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setEvent({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Event);
        } else {
          // Fallback to demo data
          const demoEvent = demoEvents.find(e => e.slug === slug);
          if (demoEvent) {
            setEvent(demoEvent);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        const demoEvent = demoEvents.find(e => e.slug === slug);
        if (demoEvent) {
          setEvent(demoEvent);
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

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
        <div className={`w-full h-64 md:h-80 relative ${isTechnical ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-sky-900' : 'bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-900'}`}>
          <div className="absolute inset-0 bg-black/40"></div>
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
                <p className="text-gray-300 leading-relaxed mt-4">
                  Join us for an exciting opportunity to showcase your skills and compete with the best. This event is designed to challenge your limits and provide a platform for networking and learning. Bring your A-game and stand a chance to win exciting prizes and certificates.
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
                  Rules & Guidelines
                </h2>
                <ul className="space-y-4 text-gray-300 list-decimal list-inside">
                  <li>Participants must carry their valid college ID cards.</li>
                  <li>Decision of the judges will be final and binding.</li>
                  <li>Use of unfair means will lead to immediate disqualification.</li>
                  <li>Teams must report 30 minutes before the scheduled start time.</li>
                  <li>Bring your own laptops/equipment if specified by coordinators.</li>
                </ul>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="glass-card p-6 rounded-2xl">
                  <div className="text-sm text-gray-400 mb-1">Event Coordinator</div>
                  <div className="text-lg font-semibold text-white">{event.coordinatorName}</div>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <div className="text-sm text-gray-400 mb-1">Student Organizer</div>
                  <div className="text-lg font-semibold text-white">{event.organizerName}</div>
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
