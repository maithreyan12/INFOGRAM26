// ============================================================
// Event & Organizer Store — Zustand with Persistence
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Event, AdminUser, Registration } from '@/types';

import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

export interface OrganizerData extends AdminUser {
  assignedEventName?: string;
}

interface EventState {
  events: Event[];
  organizers: OrganizerData[];
  registrations: Registration[];

  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'>) => Event;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  addOrganizer: (organizer: Omit<OrganizerData, 'uid' | 'createdAt' | 'isActive'>) => OrganizerData;
  updateOrganizer: (uid: string, updates: Partial<OrganizerData>) => void;
  assignOrganizerToEvent: (organizerUid: string, eventId: string) => void;

  getEventByOrganizer: (organizerUid: string | undefined, assignedEventId?: string) => Event | undefined;
  getRegistrationsForEvent: (eventId: string) => Registration[];
}

const INITIAL_ORGANIZERS: OrganizerData[] = [];

const INITIAL_EVENTS: Event[] = [
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

const INITIAL_REGISTRATIONS: Registration[] = [];

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: INITIAL_EVENTS,
      organizers: INITIAL_ORGANIZERS,
      registrations: INITIAL_REGISTRATIONS,

      addEvent: (eventData) => {
        const newId = `evt-${Date.now()}`;
        const newSlug = eventData.slug || eventData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newEvent: Event = {
          ...eventData,
          id: newId,
          slug: newSlug,
          registeredCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ events: [newEvent, ...state.events] }));
        if (eventData.organizerUid) {
          get().assignOrganizerToEvent(eventData.organizerUid, newId);
        }

        if (db && isFirebaseConfigured) {
          try {
            setDoc(doc(db, 'events', newId), {
              ...newEvent,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }).catch((err) => console.error("Firestore sync add error:", err));
          } catch (e) {
            console.error("Firestore add error:", e);
          }
        }

        return newEvent;
      },

      updateEvent: (id, updates) => {
        set((state) => {
          const updatedEvents = state.events.map((evt) =>
            evt.id === id ? { ...evt, ...updates, updatedAt: new Date() } : evt
          );
          let updatedOrganizers = state.organizers;
          if (updates.organizerUid) {
            const assignedEvt = updatedEvents.find((e) => e.id === id);
            updatedOrganizers = state.organizers.map((org) => {
              if (org.uid === updates.organizerUid) {
                return { ...org, assignedEventId: id, assignedEventName: assignedEvt?.name };
              }
              return org;
            });
          }
          return { events: updatedEvents, organizers: updatedOrganizers };
        });

        if (db && isFirebaseConfigured) {
          try {
            setDoc(doc(db, 'events', id), {
              ...updates,
              updatedAt: new Date().toISOString(),
            }, { merge: true }).catch((err) => console.error("Firestore sync update error:", err));
          } catch (e) {
            console.error("Firestore update error:", e);
          }
        }
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((evt) => evt.id !== id),
          organizers: state.organizers.map((org) =>
            org.assignedEventId === id ? { ...org, assignedEventId: undefined, assignedEventName: undefined } : org
          ),
        }));

        if (db && isFirebaseConfigured) {
          try {
            deleteDoc(doc(db, 'events', id)).catch((err) => console.error("Firestore sync delete error:", err));
          } catch (e) {
            console.error("Firestore delete error:", e);
          }
        }
      },

      addOrganizer: (organizerData) => {
        const newUid = `org-${Date.now()}`;
        const assignedEvt = get().events.find((e) => e.id === organizerData.assignedEventId);
        const newOrganizer: OrganizerData = {
          ...organizerData,
          uid: newUid,
          role: 'organizer',
          assignedEventName: assignedEvt?.name,
          createdAt: new Date(),
          isActive: true,
        };
        set((state) => ({ organizers: [newOrganizer, ...state.organizers] }));
        if (organizerData.assignedEventId) {
          get().assignOrganizerToEvent(newUid, organizerData.assignedEventId);
        }

        if (db && isFirebaseConfigured) {
          try {
            setDoc(doc(db, 'users', newUid), {
              ...newOrganizer,
              createdAt: new Date().toISOString(),
            }).catch((err) => console.error("Firestore organizer sync error:", err));
          } catch (e) {
            console.error("Firestore organizer sync error:", e);
          }
        }

        return newOrganizer;
      },

      updateOrganizer: (uid, updates) => {
        set((state) => ({
          organizers: state.organizers.map((org) =>
            org.uid === uid ? { ...org, ...updates } : org
          ),
        }));
      },

      assignOrganizerToEvent: (organizerUid, eventId) => {
        set((state) => {
          const targetEvt = state.events.find((e) => e.id === eventId);
          const targetOrg = state.organizers.find((o) => o.uid === organizerUid);
          const updatedEvents = state.events.map((evt) => {
            if (evt.id === eventId) {
              return { ...evt, organizerUid, organizerName: targetOrg?.displayName || evt.organizerName };
            }
            return evt;
          });
          const updatedOrganizers = state.organizers.map((org) => {
            if (org.uid === organizerUid) {
              return { ...org, assignedEventId: eventId, assignedEventName: targetEvt?.name };
            }
            return org;
          });
          return { events: updatedEvents, organizers: updatedOrganizers };
        });
      },

      getEventByOrganizer: (organizerUid, assignedEventId) => {
        const { events, organizers } = get();
        if (assignedEventId) {
          const evt = events.find((e) => e.id === assignedEventId);
          if (evt) return evt;
        }
        if (organizerUid) {
          const org = organizers.find((o) => o.uid === organizerUid);
          if (org?.assignedEventId) {
            const evt = events.find((e) => e.id === org.assignedEventId);
            if (evt) return evt;
          }
          return events.find((e) => e.organizerUid === organizerUid);
        }
        return events[0];
      },

      getRegistrationsForEvent: (eventId) => {
        const { registrations } = get();
        return registrations.filter((r) => r.selectedEvents.includes(eventId));
      },
    }),
    {
      name: 'infogram26-event-store-v9', // bumped version clears stale localStorage
    }
  )
);
