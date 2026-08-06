import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/config';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { AdminUser } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'super_admin' | 'organizer' | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true);
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            if (db) {
              // Check if user is in our admin/organizer collection
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                const data = userDoc.data() as AdminUser;
                setAdminUser(data);
                setRole(data.role as 'super_admin' | 'organizer');
              } else {
                setRole(null);
                setAdminUser(null);
              }
            } else {
              setRole(null);
              setAdminUser(null);
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
          }
        } else {
          setUser(null);
          setAdminUser(null);
          setRole(null);
        }
        setLoading(false);
      });
    } catch (e) {
      console.warn("Firebase Auth is unconfigured, skipping listener:", e);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signIn = async () => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized.");
      return;
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    setUser(null);
    setAdminUser(null);
    setRole(null);
  };

  return {
    user,
    adminUser,
    loading,
    role,
    isAdmin: role === 'super_admin',
    isOrganizer: role === 'organizer',
    signIn,
    signOut
  };
}
