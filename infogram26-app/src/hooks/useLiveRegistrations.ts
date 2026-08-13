import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { listenToCollection, collections } from '@/lib/firebase/firestore';
import type { Registration } from '@/types';

// Registrations are written straight to Firestore by the register/payment
// flow (src/app/register/page.tsx, src/app/payment/page.tsx) — they never
// go through the Zustand eventStore, so admin/organizer views need a live
// Firestore subscription instead of reading useEventStore().registrations.
export function useLiveRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const unsubscribe = listenToCollection<Registration>(collections.registrations, (data) => {
      setRegistrations(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { registrations, loading };
}
