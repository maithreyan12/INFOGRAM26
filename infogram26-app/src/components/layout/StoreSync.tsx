'use client';

/**
 * StoreSync — Firestore → Zustand hydration on every page load
 *
 * Fetches the `organizers` collection from Firestore and keeps the
 * Zustand eventStore in sync. This ensures that on Vercel (fresh
 * browser session with empty localStorage) all organizer data is
 * available to useAuth, the dashboard, and other admin pages.
 */
import { useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEventStore } from '@/store/eventStore';

export default function StoreSync() {
  const setOrganizers = useEventStore((s) => s.setOrganizers);

  useEffect(() => {
    if (!db) return;

    // Live-sync organizers from Firestore into Zustand store
    const unsub = onSnapshot(
      collection(db, 'organizers'),
      (snap) => {
        if (snap.empty) return;
        const list = snap.docs.map((d) => ({
          uid: d.id,
          ...d.data(),
        })) as any[];
        setOrganizers(list);
      },
      (err) => {
        console.warn('[StoreSync] organizers sync error:', err);
      }
    );

    return () => unsub();
  }, [setOrganizers]);

  return null; // renders nothing
}
