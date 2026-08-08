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
          const data = snapshot.docs[0].data() as Event;
          const demoMatch = demoEvents.find(e => e.slug === slug);
          setEvent({ 
            ...data,
            id: snapshot.docs[0].id, 
            bannerUrl: data.bannerUrl || demoMatch?.bannerUrl
          });
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
