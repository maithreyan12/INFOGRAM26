import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/config';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { AdminUser } from '@/types';
import { useEventStore } from '@/store/eventStore';

// Local storage key for demo mode session
const DEMO_USER_KEY = 'infogram26_demo_user';

export interface DemoSession {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'organizer';
  assignedEventId?: string;
  assignedEventName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'super_admin' | 'organizer' | null>(null);
  const organizers = useEventStore((state) => state.organizers);

  useEffect(() => {
    // Check if demo user session exists in localStorage
    if (typeof window !== 'undefined') {
      const savedDemo = localStorage.getItem(DEMO_USER_KEY);
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo) as DemoSession;
          setUser({
            uid: parsed.uid,
            email: parsed.email,
            displayName: parsed.displayName,
            photoURL: null,
          });
          setAdminUser({
            uid: parsed.uid,
            email: parsed.email,
            displayName: parsed.displayName,
            role: parsed.role,
            assignedEventId: parsed.assignedEventId,
            createdAt: new Date(),
            isActive: true,
          });
          setRole(parsed.role);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Error reading demo session:", e);
        }
      }
    }

    if (!auth) {
      // Default fallback demo super admin if Firebase is unconfigured and no demo session
      setUser({
        uid: 'super-admin-1',
        email: 'admin@infogram26.com',
        displayName: 'Super Admin',
        photoURL: null,
      });
      setAdminUser({
        uid: 'super-admin-1',
        email: 'admin@infogram26.com',
        displayName: 'Super Admin',
        role: 'super_admin',
        createdAt: new Date(),
        isActive: true,
      });
      setRole('super_admin');
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true);
        if (firebaseUser) {
          setUser(firebaseUser);
          const emailLower = firebaseUser.email?.toLowerCase() || '';
          const isSuperAdminEmail = emailLower === 'maithreyan2006@gmail.com' || emailLower.includes('admin');

          try {
            if (db) {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                const data = userDoc.data() as AdminUser;
                // If it's maithreyan2006@gmail.com, ensure role is super_admin
                if (isSuperAdminEmail) {
                  setAdminUser({ ...data, role: 'super_admin' });
                  setRole('super_admin');
                } else {
                  setAdminUser(data);
                  setRole(data.role as 'super_admin' | 'organizer');
                }
              } else {
                // Check if email matches any pre-configured organizer in store
                const matchedOrg = organizers.find((o) => o.email.toLowerCase() === emailLower);
                if (matchedOrg && !isSuperAdminEmail) {
                  setAdminUser(matchedOrg);
                  setRole('organizer');
                } else {
                  // Default to super_admin for admin/maithreyan2006@gmail.com
                  setRole('super_admin');
                  setAdminUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || 'maithreyan2006@gmail.com',
                    displayName: firebaseUser.displayName || 'Maithreyan (Admin)',
                    role: 'super_admin',
                    createdAt: new Date(),
                    isActive: true,
                  });
                }
              }
            } else {
              setRole('super_admin');
              setAdminUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || 'maithreyan2006@gmail.com',
                displayName: firebaseUser.displayName || 'Maithreyan (Admin)',
                role: 'super_admin',
                createdAt: new Date(),
                isActive: true,
              });
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
            setRole('super_admin');
          }
        } else {
          // Check if demo user session exists in localStorage
          const savedDemo = typeof window !== 'undefined' ? localStorage.getItem(DEMO_USER_KEY) : null;
          if (savedDemo) {
            try {
              const parsed = JSON.parse(savedDemo) as DemoSession;
              setUser({
                uid: parsed.uid,
                email: parsed.email,
                displayName: parsed.displayName,
                photoURL: null,
              });
              setAdminUser({
                uid: parsed.uid,
                email: parsed.email,
                displayName: parsed.displayName,
                role: parsed.role,
                assignedEventId: parsed.assignedEventId,
                createdAt: new Date(),
                isActive: true,
              });
              setRole(parsed.role);
            } catch (e) {
              setUser(null);
              setAdminUser(null);
              setRole(null);
            }
          } else {
            setUser(null);
            setAdminUser(null);
            setRole(null);
          }
        }
        setLoading(false);
      });
    } catch (e) {
      console.warn("Firebase Auth listener error:", e);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [organizers]);

  const signIn = async () => {
    if (!auth) {
      return null;
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const loginAsDemoSuperAdmin = (customEmail?: string, customName?: string) => {
    const emailToUse = customEmail || 'maithreyan2006@gmail.com';
    const nameToUse = customName || 'Maithreyan D (Super Admin)';
    const demoUser: DemoSession = {
      uid: 'super-admin-1',
      email: emailToUse,
      displayName: nameToUse,
      role: 'super_admin',
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    setUser({
      uid: demoUser.uid,
      email: demoUser.email,
      displayName: demoUser.displayName,
      photoURL: null,
    });
    setAdminUser({
      uid: demoUser.uid,
      email: demoUser.email,
      displayName: demoUser.displayName,
      role: 'super_admin',
      createdAt: new Date(),
      isActive: true,
    });
    setRole('super_admin');
    setLoading(false);
  };

  const loginAsDemoOrganizer = (organizerUid: string) => {
    const targetOrg = organizers.find((o) => o.uid === organizerUid) || organizers[0];
    const demoUser: DemoSession = {
      uid: targetOrg.uid,
      email: targetOrg.email,
      displayName: targetOrg.displayName,
      role: 'organizer',
      assignedEventId: targetOrg.assignedEventId,
      assignedEventName: targetOrg.assignedEventName,
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    setUser({
      uid: demoUser.uid,
      email: demoUser.email,
      displayName: demoUser.displayName,
      photoURL: null,
    });
    setAdminUser(targetOrg);
    setRole('organizer');
    setLoading(false);
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_USER_KEY);
    }
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error("SignOut error:", e);
      }
    }
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
    loginAsDemoSuperAdmin,
    loginAsDemoOrganizer,
    signOut,
  };
}
