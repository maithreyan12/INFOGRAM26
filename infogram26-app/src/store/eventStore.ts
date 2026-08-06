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
  
  // Actions
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'>) => Event;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  addOrganizer: (organizer: Omit<OrganizerData, 'uid' | 'createdAt' | 'isActive'>) => OrganizerData;
  updateOrganizer: (uid: string, updates: Partial<OrganizerData>) => void;
  assignOrganizerToEvent: (organizerUid: string, eventId: string) => void;
  
  getEventByOrganizer: (organizerUid: string | undefined, assignedEventId?: string) => Event | undefined;
  getRegistrationsForEvent: (eventId: string) => Registration[];
}

const INITIAL_ORGANIZERS: OrganizerData[] = [
  {
    uid: 'org-1',
    email: 'alex.hackathon@infogram26.com',
    displayName: 'Alex Rivers (Hackathon Admin)',
    role: 'organizer',
    assignedEventId: 'evt-1',
    assignedEventName: 'Hackathon 2026',
    phone: '+91 9876543210',
    createdAt: new Date(),
    isActive: true,
  },
  {
    uid: 'org-2',
    email: 'sarah.bgmi@infogram26.com',
    displayName: 'Sarah Connor (BGMI Admin)',
    role: 'organizer',
    assignedEventId: 'evt-2',
    assignedEventName: 'BGMI Tournament',
    phone: '+91 9876543211',
    createdAt: new Date(),
    isActive: true,
  },
  {
    uid: 'org-3',
    email: 'david.web@infogram26.com',
    displayName: 'David Miller (Web Dev Admin)',
    role: 'organizer',
    assignedEventId: 'evt-3',
    assignedEventName: 'Webcraft 101',
    phone: '+91 9876543212',
    createdAt: new Date(),
    isActive: true,
  }
];

const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-1',
    slug: 'hackathon-2026',
    name: 'Hackathon 2026',
    category: 'technical',
    description: '24-hour coding challenge to build innovative software solutions using modern AI tools.',
    rules: [
      'Team size: 2-4 participants',
      'Original code must be written during the hackathon',
      'Use of open source tools allowed'
    ],
    venue: 'Main Seminar Hall, IT Block',
    date: '2026-10-15',
    startTime: '09:00',
    endTime: '09:00',
    registrationDeadline: '2026-10-12',
    registrationFee: 250,
    maxParticipants: 100,
    registeredCount: 42,
    coordinatorName: 'Dr. R. Sundar',
    organizerName: 'Alex Rivers',
    contactNumber: '+91 9876543210',
    status: 'live',
    organizerUid: 'org-1',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'evt-2',
    slug: 'bgmi-tournament',
    name: 'BGMI Tournament',
    category: 'non-technical',
    description: 'Squad battle royale esports championship. High-octane action with live casting.',
    rules: [
      'Squad size: 4 players + 1 substitute',
      'Mobile devices only (emulators prohibited)',
      'Custom rooms provided on event day'
    ],
    venue: 'E-Sports Lounge',
    date: '2026-10-16',
    startTime: '11:00',
    endTime: '17:00',
    registrationDeadline: '2026-10-14',
    registrationFee: 200,
    maxParticipants: 64,
    registeredCount: 38,
    coordinatorName: 'Prof. K. Venkatesh',
    organizerName: 'Sarah Connor',
    contactNumber: '+91 9876543211',
    status: 'upcoming',
    organizerUid: 'org-2',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'evt-3',
    slug: 'webcraft-101',
    name: 'Webcraft 101',
    category: 'technical',
    description: 'Hands-on UI/UX and web development workshop focusing on Next.js and Tailwind CSS.',
    rules: [
      'Individual participation',
      'Laptops required with Node.js installed',
      'Participation certificate provided'
    ],
    venue: 'Lab 3, IT Dept',
    date: '2026-10-15',
    startTime: '13:00',
    endTime: '16:00',
    registrationDeadline: '2026-10-13',
    registrationFee: 100,
    maxParticipants: 50,
    registeredCount: 29,
    coordinatorName: 'Dr. M. Priya',
    organizerName: 'David Miller',
    contactNumber: '+91 9876543212',
    status: 'upcoming',
    organizerUid: 'org-3',
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-1',
    applicantId: 'IGR26-1001',
    fullName: 'Rahul Sharma',
    college: 'PSG College of Technology',
    department: 'Information Technology',
    year: '3rd Year',
    registerNumber: '717822IT045',
    email: 'rahul.s@psgtech.ac.in',
    phone: '+91 9812345678',
    gender: 'male',
    selectedEvents: ['evt-1'],
    totalFee: 250,
    status: 'confirmed',
    paymentId: 'PAY-1001',
    ticketId: 'IGR26-TK-101',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'reg-2',
    applicantId: 'IGR26-1002',
    fullName: 'Ananya Ramesh',
    college: 'CIT Coimbatore',
    department: 'Computer Science',
    year: '2nd Year',
    registerNumber: '22CS089',
    email: 'ananya.r@cit.edu.in',
    phone: '+91 9823456789',
    gender: 'female',
    selectedEvents: ['evt-1', 'evt-3'],
    totalFee: 350,
    status: 'confirmed',
    paymentId: 'PAY-1002',
    ticketId: 'IGR26-TK-102',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'reg-3',
    applicantId: 'IGR26-1003',
    fullName: 'Vikas Kumar',
    college: 'SSN College of Engineering',
    department: 'IT',
    year: '4th Year',
    registerNumber: '312219106120',
    email: 'vikas.k@ssn.edu.in',
    phone: '+91 9834567890',
    gender: 'male',
    selectedEvents: ['evt-2'],
    totalFee: 200,
    status: 'confirmed',
    paymentId: 'PAY-1003',
    ticketId: 'IGR26-TK-103',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

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

        set((state) => ({
          events: [newEvent, ...state.events],
        }));

        // If organizer assigned, update organizer record
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
          
          // If organizer updated, sync with organizers list
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

        set((state) => ({
          organizers: [newOrganizer, ...state.organizers],
        }));

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
              return {
                ...evt,
                organizerUid,
                organizerName: targetOrg?.displayName || evt.organizerName,
              };
            }
            return evt;
          });

          const updatedOrganizers = state.organizers.map((org) => {
            if (org.uid === organizerUid) {
              return {
                ...org,
                assignedEventId: eventId,
                assignedEventName: targetEvt?.name,
              };
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
      name: 'infogram26-event-store',
    }
  )
);
