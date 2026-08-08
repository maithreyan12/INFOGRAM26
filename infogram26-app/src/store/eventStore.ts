// ============================================================
// Event & Organizer Store — Zustand with Persistence
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Event, AdminUser, Registration } from '@/types';

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
    rules: ['Maximum of 2 members', 'Per head 100/-', 'PPT presentation required', 'Time limit: 8 min + 2 min Q&A'],
    venue: 'IT Block, Seminar Hall', date: '2026-08-22', startTime: '09:30', endTime: '12:30',
    registrationDeadline: '2026-08-20', registrationFee: 100, maxParticipants: 50, registeredCount: 0,
    coordinatorName: 'Mohammed Dhaniyal & Masood Nawaz', organizerName: 'IT Association', contactNumber: '7010155779, 9944410994',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-2', slug: 'clash-of-minds', name: 'Clash of Minds', category: 'technical',
    description: 'Test your technical knowledge and quick thinking in this fast-paced quiz.',
    rules: ['Maximum of 2 members', 'Per head 50/-', 'Multiple rounds including buzzer round'],
    venue: 'IT Lab 1', date: '2026-08-22', startTime: '10:00', endTime: '12:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 100, registeredCount: 0,
    coordinatorName: 'Amirtha Varshini & Keerthana', organizerName: 'IT Association', contactNumber: '9597010159, 9629909942',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-3', slug: 'codestorm', name: 'CodeStorm', category: 'technical',
    description: 'Team-based hackathon to build innovative solutions addressing real-world problems.',
    rules: ['Maximum of 2 members', 'Per head 50/-', 'Any tech stack allowed', 'Working prototype required'],
    venue: 'IT Lab 2', date: '2026-08-22', startTime: '09:00', endTime: '16:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 40, registeredCount: 0,
    coordinatorName: 'Mohammed Irfan & Thoufeeque Ahmed', organizerName: 'IT Association', contactNumber: '9042469482, 9150654995',
    bannerUrl: '/events/codestorm.jpeg',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-4', slug: 'pixel-craft', name: 'Pixel Craft', category: 'technical',
    description: 'Design and develop responsive websites. Show off your UI/UX and frontend skills.',
    rules: ['Maximum of 2 members', 'Per head 100/-', 'HTML/CSS/JS or Figma mockup', 'Theme revealed on-spot', 'Time: 2.5 hrs'],
    venue: 'IT Lab 3', date: '2026-08-22', startTime: '13:00', endTime: '15:30',
    registrationDeadline: '2026-08-20', registrationFee: 100, maxParticipants: 50, registeredCount: 0,
    coordinatorName: 'Mathin S & Manikandan T', organizerName: 'IT Association', contactNumber: '6381880659, 8825940089',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-5', slug: 'open-source', name: 'Open Source', category: 'technical',
    description: 'Showcase your open source contributions, custom GitHub projects, or innovative solutions.',
    rules: ['Maximum of 2 members', 'Per head 100/-', 'Working project model required', 'GitHub repo link must be provided'],
    venue: 'IT Lab 4', date: '2026-08-22', startTime: '11:00', endTime: '14:00',
    registrationDeadline: '2026-08-20', registrationFee: 100, maxParticipants: 30, registeredCount: 0,
    coordinatorName: 'Saheem & Zahid', organizerName: 'IT Association', contactNumber: '9489016294, 7639412328',
    bannerUrl: '/events/open-source.jpeg',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-6', slug: 'byte-battle', name: 'Byte Battle', category: 'technical',
    description: 'Competitive programming contest testing algorithmic problem-solving speed and accuracy.',
    rules: ['Maximum of 2 members', 'Per head 50/-', 'C, C++, Java, Python allowed', '3 problems in 2 hours'],
    venue: 'IT Lab 5', date: '2026-08-22', startTime: '10:00', endTime: '12:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 100, registeredCount: 0,
    coordinatorName: 'Ezhilarasan & Dinesh Babu', organizerName: 'IT Association', contactNumber: '9080249831, 6374468780',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'tech-7', slug: 'hack-force', name: 'Hack Force', category: 'technical',
    description: 'Solve debugging challenges and build rapid setups under strict timelines.',
    rules: ['Maximum of 3 members', 'Per head 100/-', 'Pre-configured bugs must be resolved', 'Max 90 minutes'],
    venue: 'IT Lab 6', date: '2026-08-22', startTime: '14:00', endTime: '15:30',
    registrationDeadline: '2026-08-20', registrationFee: 100, maxParticipants: 60, registeredCount: 0,
    coordinatorName: 'Kashif', organizerName: 'IT Association', contactNumber: '6380028607',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  // ── NON-TECHNICAL ──
  {
    id: 'nontech-1', slug: 'mind-matrix', name: 'Mind Matrix', category: 'non-technical',
    description: 'Ultimate general knowledge and pop culture quiz to test speed, trivia, and memory.',
    rules: ['Maximum of 2 members', 'Per head 50/-', 'Written prelims then stage finals', 'No electronic devices'],
    venue: 'Mini Auditorium', date: '2026-08-22', startTime: '10:00', endTime: '12:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 80, registeredCount: 0,
    coordinatorName: 'Naushin & Hema Malini', organizerName: 'IT Association', contactNumber: '7358170392, 7418575021',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-2', slug: 'flavour-fusion', name: 'Flavour Fusion', category: 'non-technical',
    description: 'A culinary challenge to prepare and present delicious no-fire recipes.',
    rules: ['Maximum of 4 members', 'Per head 50/-', 'No flame/fire allowed', 'Bring your own raw ingredients', 'Time: 60 min'],
    venue: 'College Courtyard', date: '2026-08-22', startTime: '11:00', endTime: '12:30',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 40, registeredCount: 0,
    coordinatorName: 'Jeevitha & Poorna Sree', organizerName: 'IT Association', contactNumber: '9384505002, 9600889789',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-3', slug: 'quest-x', name: 'Quest X', category: 'non-technical',
    description: 'Solve mysterious puzzles, crack codes, and hunt for hidden checkpoints across campus.',
    rules: ['Maximum of 4 members', 'Per head 50/-', 'Campus-bound search area', 'Solve clues in correct sequence'],
    venue: 'Main Campus Grounds', date: '2026-08-22', startTime: '13:30', endTime: '15:30',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 40, registeredCount: 0,
    coordinatorName: 'Shyam Sundar & Maithreyan', organizerName: 'IT Association', contactNumber: '9345837870, 9342706675',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-4', slug: 'battle-verse', name: 'Battle Verse', category: 'non-technical',
    description: 'Step into the gaming arena and face off against rivals in popular multiplayer combat matches.',
    rules: ['Maximum of 4 members', 'Per team 160/-', 'Per person (Solo) 50/-', 'Knockout format', 'Strict fair-play rules'],
    venue: 'Seminar Hall 2', date: '2026-08-22', startTime: '09:30', endTime: '16:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 120, registeredCount: 0,
    coordinatorName: 'Meshak & Sanjay V', organizerName: 'IT Association', contactNumber: '6383598812, 6382143386',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-5', slug: 'frame-craft', name: 'Frame Craft', category: 'non-technical',
    description: "Capture the spirit and vibrant atmosphere of INFOGRAM'26 inside campus boundaries.",
    rules: ['Maximum of 1 members', 'Per head 50/-', 'Photos taken on event day within campus', 'Submit best 3 frames by 15:30'],
    venue: 'Campus Wide', date: '2026-08-22', startTime: '09:00', endTime: '15:30',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 50, registeredCount: 0,
    coordinatorName: 'Jeysha & Siddharth', organizerName: 'IT Association', contactNumber: '9345110882, 8925441089',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-6', slug: 'fun-fiesta', name: 'Fun Fiesta', category: 'non-technical',
    description: 'Exciting, high-energy mini-games and spots for all attendees to join and win instant prizes.',
    rules: ['Maximum of 4 members', 'Per head 50/-', 'Various simple challenges', 'Instant gifts and badges', 'Open throughout day'],
    venue: 'Main Lawn', date: '2026-08-22', startTime: '09:30', endTime: '16:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 300, registeredCount: 0,
    coordinatorName: 'Jaffreen & Talha', organizerName: 'IT Association', contactNumber: '9344814392, 8610117244',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-7', slug: 'artistry', name: 'Artistry', category: 'non-technical',
    description: 'Showcase your fine art talent in drawing, sketching, painting, or creative illustration.',
    rules: ['Maximum of 1 members', 'Per head 50/-', 'Theme announced at start', 'Duration: 2 hours'],
    venue: 'Drawing Hall', date: '2026-08-22', startTime: '10:00', endTime: '12:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 40, registeredCount: 0,
    coordinatorName: 'Haniya Nikhat & Harshitha', organizerName: 'IT Association', contactNumber: '8248478615, 9629136470',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-8', slug: 'mic-drop', name: 'Mic Drop', category: 'non-technical',
    description: 'Open-mic performance contest for solo singing, stand-up comedy, or inspirational speech.',
    rules: ['Per head 50/-', 'Time limit: 4 minutes', 'No offensive content', 'Karaoke tracks allowed'],
    venue: 'Mini Auditorium', date: '2026-08-22', startTime: '13:00', endTime: '15:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 30, registeredCount: 0,
    coordinatorName: 'Garnet & Heena', organizerName: 'IT Association', contactNumber: '6374139336, 8072672922',
    status: 'upcoming', isFeatured: true, organizerUid: '', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'nontech-9', slug: 'reel-it-feel-it', name: 'Reel It Feel It', category: 'non-technical',
    description: 'Create engaging reels or short videos showcasing the fun and energy of the symposium.',
    rules: ['Maximum of 2 members', 'Per head 50/-', 'Video length: 30-60 seconds', "Must include INFOGRAM'26 logo", 'Submit by 16:00'],
    venue: 'Campus Wide', date: '2026-08-22', startTime: '09:00', endTime: '16:00',
    registrationDeadline: '2026-08-20', registrationFee: 50, maxParticipants: 50, registeredCount: 0,
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
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((evt) => evt.id !== id),
          organizers: state.organizers.map((org) =>
            org.assignedEventId === id ? { ...org, assignedEventId: undefined, assignedEventName: undefined } : org
          ),
        }));
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
      name: 'infogram26-event-store-v3', // bumped version clears stale localStorage
    }
  )
);
