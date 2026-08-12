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

import { OFFICIAL_EVENTS } from '@/lib/eventsData';

const INITIAL_ORGANIZERS: OrganizerData[] = [];

const INITIAL_EVENTS: Event[] = OFFICIAL_EVENTS;

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
      name: 'infogram26-event-store-v11', // bumped version clears stale localStorage
    }
  )
);
