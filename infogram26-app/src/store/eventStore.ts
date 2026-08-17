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

import { OFFICIAL_EVENTS, isEventMatch } from '@/lib/eventsData';

const INITIAL_ORGANIZERS: OrganizerData[] = [];

const INITIAL_EVENTS: Event[] = OFFICIAL_EVENTS;

const INITIAL_REGISTRATIONS: any[] = [
  {
    id: 'reg_hack_1001',
    applicantId: 'INFO26-HACK-1001',
    fullName: 'Thamaraiselvi',
    studentName: 'Thamaraiselvi',
    email: 'thamaraisanthi1459@gmail.com',
    phone: '9626918439',
    college: 'Vellore Institute of Technology',
    department: 'Software Engineering',
    year: '4th Year',
    personalInfo: {
      fullName: 'Thamaraiselvi',
      email: 'thamaraisanthi1459@gmail.com',
      phone: '9626918439',
      college: 'Vellore Institute of Technology',
      department: 'Software Engineering',
      year: '4th Year',
    },
    events: ['HackForge'],
    eventNames: ['HackForge'],
    selectedEvents: ['hack-forge'],
    totalFee: 100,
    status: 'paid',
    razorpayPaymentId: 'pay_TPu7QIBPv2e69G',
    paymentMethod: 'UPI',
    createdAt: '2026-08-15T03:54:00.000Z',
  },
  {
    id: 'reg_hack_1002',
    applicantId: 'INFO26-HACK-1002',
    fullName: 'Lakshaya A',
    studentName: 'Lakshaya A',
    email: 'lakshaya.arul16@gmail.com',
    phone: '8870333393',
    college: 'Vellore Institute of Technology',
    department: 'Software Engineering',
    year: '2nd Year',
    personalInfo: {
      fullName: 'Lakshaya A',
      email: 'lakshaya.arul16@gmail.com',
      phone: '8870333393',
      college: 'Vellore Institute of Technology',
      department: 'Software Engineering',
      year: '2nd Year',
    },
    events: ['HackForge'],
    eventNames: ['HackForge'],
    selectedEvents: ['hack-forge'],
    totalFee: 100,
    status: 'paid',
    razorpayPaymentId: 'pay_TPuQG0j5pDrsf5',
    paymentMethod: 'UPI',
    createdAt: '2026-08-15T04:11:00.000Z',
  },
  {
    id: 'reg_hack_1003',
    applicantId: 'INFO26-HACK-1003',
    fullName: 'Mithra',
    studentName: 'Mithra',
    email: 'mithrakasi26@gmail.com',
    phone: '7708271028',
    college: 'Vellore Institute of Technology',
    department: 'Software Engineering',
    year: '2nd Year',
    personalInfo: {
      fullName: 'Mithra',
      email: 'mithrakasi26@gmail.com',
      phone: '7708271028',
      college: 'Vellore Institute of Technology',
      department: 'Software Engineering',
      year: '2nd Year',
    },
    events: ['HackForge'],
    eventNames: ['HackForge'],
    selectedEvents: ['hack-forge'],
    totalFee: 100,
    status: 'paid',
    razorpayPaymentId: 'pay_TPuwj3SRgCEJKU',
    paymentMethod: 'UPI',
    createdAt: '2026-08-15T04:42:00.000Z',
  },
  {
    id: 'reg_hack_1004',
    applicantId: 'INFO26-HACK-1004',
    fullName: 'Rithika P T',
    studentName: 'Rithika P T',
    email: 'rithikaparthiban15@gmail.com',
    phone: '8807425155',
    college: 'Vellore Institute of Technology',
    department: 'Software Engineering',
    year: '2nd Year',
    personalInfo: {
      fullName: 'Rithika P T',
      email: 'rithikaparthiban15@gmail.com',
      phone: '8807425155',
      college: 'Vellore Institute of Technology',
      department: 'Software Engineering',
      year: '2nd Year',
    },
    events: ['HackForge'],
    eventNames: ['HackForge'],
    selectedEvents: ['hack-forge'],
    totalFee: 100,
    status: 'paid',
    razorpayPaymentId: 'pay_TPut44rdIWMcfQ',
    paymentMethod: 'UPI',
    createdAt: '2026-08-15T04:39:00.000Z',
  },
  {
    id: 'reg_hack_14423',
    applicantId: 'INFO26-HACK-14423',
    fullName: 'Rohit Rajkumar',
    studentName: 'Rohit Rajkumar',
    email: 'rajkumarrohit965@gmail.com',
    phone: '9740706586',
    college: 'C. Abdul Hakeem College of Engineering & Technology',
    department: 'Information Technology',
    year: '2nd Year',
    personalInfo: {
      fullName: 'Rohit Rajkumar',
      email: 'rajkumarrohit965@gmail.com',
      phone: '9740706586',
      college: 'C. Abdul Hakeem College of Engineering & Technology',
      department: 'Information Technology',
      year: '2nd Year',
    },
    events: ['HackForge'],
    eventNames: ['HackForge'],
    selectedEvents: ['hack-forge'],
    totalFee: 50,
    status: 'paid',
    razorpayPaymentId: 'pay_TQSsGjMXY4BxKi',
    paymentMethod: 'UPI',
    createdAt: '2026-08-16T19:24:00.000Z',
  },
  {
    id: 'reg_evt_73173',
    applicantId: 'INFO26-EVT-73173',
    fullName: 'Swetha Parthiban',
    studentName: 'Swetha Parthiban',
    email: 'swethaparthiban42@gmail.com',
    phone: '8072324512',
    college: 'Kingston Engineering College',
    department: 'Information Technology',
    year: '2nd Year',
    personalInfo: {
      fullName: 'Swetha Parthiban',
      email: 'swethaparthiban42@gmail.com',
      phone: '8072324512',
      college: 'Kingston Engineering College',
      department: 'Information Technology',
      year: '2nd Year',
    },
    events: ['Tech Talks'],
    eventNames: ['Tech Talks'],
    selectedEvents: ['tech-talks'],
    totalFee: 100,
    status: 'paid',
    razorpayPaymentId: 'pay_TQ6VNz1QNvMbYA',
    paymentMethod: 'UPI',
    createdAt: '2026-08-15T16:01:00.000Z',
  },
  {
    id: 'SOrNtS85NAjUIGOaE4xK',
    applicantId: 'INFO26-QSTX-30555',
    fullName: 'Mohammed faizan',
    studentName: 'Mohammed faizan',
    email: 'mohdfaizanfaizu786@gmail.com',
    phone: '6382013260',
    college: 'Islamiah college vaniyambadi',
    department: 'Bsc computer science',
    year: '3rd Year',
    personalInfo: {
      fullName: 'Mohammed faizan',
      email: 'mohdfaizanfaizu786@gmail.com',
      phone: '6382013260',
      college: 'Islamiah college vaniyambadi',
      department: 'Bsc computer science',
      year: '3rd Year',
    },
    events: ['Quest X', 'Fun Fiesta'],
    eventNames: ['Quest X', 'Fun Fiesta'],
    selectedEvents: ['quest-x', 'fun-fiesta'],
    totalFee: 100,
    status: 'paid',
    razorpayPaymentId: 'pay_manual_reconcile_faizan',
    paymentMethod: 'UPI',
    createdAt: '2026-08-17T05:01:48.000Z',
  },
  {
    id: 'Knn0TVhDmHJU5r5B9h1q',
    applicantId: 'INFO26-QSTX-23449',
    fullName: 'Aysha Daniya M',
    studentName: 'Aysha Daniya M',
    email: 'darfmo313@gmail.com',
    phone: '7824984485',
    college: "Islamiah Women's Arts and Science College (Autonomous)",
    department: 'B.Sc Data Science',
    year: '3rd Year',
    personalInfo: {
      fullName: 'Aysha Daniya M',
      email: 'darfmo313@gmail.com',
      phone: '7824984485',
      college: "Islamiah Women's Arts and Science College (Autonomous)",
      department: 'B.Sc Data Science',
      year: '3rd Year',
    },
    events: ['Quest X', 'Fun Fiesta'],
    eventNames: ['Quest X', 'Fun Fiesta'],
    selectedEvents: ['quest-x', 'fun-fiesta'],
    totalFee: 100,
    status: 'paid',
    razorpayPaymentId: 'pay_manual_reconcile_aysha',
    paymentMethod: 'UPI',
    createdAt: '2026-08-17T06:59:24.000Z',
  },
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
        const { registrations, events } = get();
        const targetEvt = events.find((e) => e.id === eventId || e.slug === eventId || e.name.toLowerCase() === eventId.toLowerCase());
        if (!targetEvt) {
          return registrations.filter(
            (r: any) =>
              (Array.isArray(r.selectedEvents) && r.selectedEvents.includes(eventId)) ||
              (Array.isArray(r.events) && r.events.includes(eventId)) ||
              (Array.isArray(r.eventNames) && r.eventNames.includes(eventId))
          );
        }
        return registrations.filter((r: any) => isEventMatch(r, targetEvt));
      },
    }),
    {
      name: 'infogram26-event-store-v17', // bumped version to ensure updated event registration mapping
    }
  )
);
