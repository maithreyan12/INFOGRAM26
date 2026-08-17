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

export const AUTHORIZED_SUPER_ADMIN_EMAILS = [
  'maithreyan2006@gmail.com',
  'farnavith@gmail.com',
  'infoappziio@gmail.com',
  'farish.sharieef@gmail.com',
];

export function isAuthorizedSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return AUTHORIZED_SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim());
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
          const parsedEmail = (parsed.email || '').toLowerCase().trim();
          const isSuper = isAuthorizedSuperAdmin(parsedEmail);
          const matchedOrg = (organizers || []).find((o) => o.email.toLowerCase().trim() === parsedEmail);

          if (isSuper && parsed.role === 'super_admin') {
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
              role: 'super_admin',
              assignedEventId: parsed.assignedEventId,
              createdAt: new Date(),
              isActive: true,
            });
            setRole('super_admin');
            setLoading(false);
            return;
          } else if (matchedOrg && parsed.role === 'organizer') {
            setUser({
              uid: parsed.uid,
              email: parsed.email,
              displayName: parsed.displayName,
              photoURL: null,
            });
            setAdminUser(matchedOrg);
            setRole('organizer');
            setLoading(false);
            return;
          } else {
            // Unauthorized stored session - purge it!
            localStorage.removeItem(DEMO_USER_KEY);
          }
        } catch (e) {
          console.error("Error reading demo session:", e);
          localStorage.removeItem(DEMO_USER_KEY);
        }
      }
    }

    if (!auth) {
      setUser(null);
      setAdminUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true);
        if (firebaseUser) {
          const emailLower = (firebaseUser.email || '').toLowerCase().trim();
          const isSuperAdminEmail = isAuthorizedSuperAdmin(emailLower);
          const matchedOrg = (organizers || []).find((o) => o.email.toLowerCase().trim() === emailLower);

          if (isSuperAdminEmail) {
            const adminTitle = emailLower === 'maithreyan2006@gmail.com'
              ? 'Maithreyan D (Main Admin)'
              : emailLower === 'farnavith@gmail.com'
              ? 'Farnavith (Co-Admin)'
              : emailLower === 'farish.sharieef@gmail.com'
              ? 'Farish Sharieef (Co-Admin)'
              : 'Appziio (Co-Admin)';

            setUser(firebaseUser);
            setAdminUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || emailLower,
              displayName: firebaseUser.displayName || adminTitle,
              role: 'super_admin',
              createdAt: new Date(),
              isActive: true,
            });
            setRole('super_admin');
            setLoading(false);
            return;
          }

          if (matchedOrg) {
            setUser(firebaseUser);
            setAdminUser(matchedOrg);
            setRole('organizer');
            setLoading(false);
            return;
          }

          // ── Unauthorized Account ──
          // Reject and forcibly sign out non-whitelisted emails
          console.warn(`Unauthorized login attempt blocked for: ${emailLower}`);
          setUser(null);
          setAdminUser(null);
          setRole(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem(DEMO_USER_KEY);
          }
          if (auth) {
            try { await firebaseSignOut(auth); } catch {}
          }
          setLoading(false);
          return;
        } else {
          // Check if demo user session exists in localStorage
          const savedDemo = typeof window !== 'undefined' ? localStorage.getItem(DEMO_USER_KEY) : null;
          if (savedDemo) {
            try {
              const parsed = JSON.parse(savedDemo) as DemoSession;
              const parsedEmail = (parsed.email || '').toLowerCase().trim();
              const isSuper = isAuthorizedSuperAdmin(parsedEmail);
              const matchedOrg = (organizers || []).find((o) => o.email.toLowerCase().trim() === parsedEmail);

              if (isSuper && parsed.role === 'super_admin') {
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
                  role: 'super_admin',
                  assignedEventId: parsed.assignedEventId,
                  createdAt: new Date(),
                  isActive: true,
                });
                setRole('super_admin');
              } else if (matchedOrg && parsed.role === 'organizer') {
                setUser({
                  uid: parsed.uid,
                  email: parsed.email,
                  displayName: parsed.displayName,
                  photoURL: null,
                });
                setAdminUser(matchedOrg);
                setRole('organizer');
              } else {
                localStorage.removeItem(DEMO_USER_KEY);
                setUser(null);
                setAdminUser(null);
                setRole(null);
              }
            } catch (e) {
              localStorage.removeItem(DEMO_USER_KEY);
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
      throw new Error("Firebase Auth is not initialized.");
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(auth, provider);
  };

  const loginAsDemoSuperAdmin = (customEmail?: string, customName?: string) => {
    const emailToUse = (customEmail || 'maithreyan2006@gmail.com').toLowerCase().trim();
    if (!isAuthorizedSuperAdmin(emailToUse)) {
      throw new Error(`Unauthorized: ${emailToUse} is not authorized for Super Admin access.`);
    }
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
    const targetOrg = (organizers || []).find((o) => o.uid === organizerUid) || organizers[0];
    if (!targetOrg) {
      throw new Error("Organizer not found.");
    }
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
