import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/config';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { AdminUser } from '@/types';
import { useEventStore } from '@/store/eventStore';
import { isAuthorizedSuperAdminEmail } from '@/lib/authorizedAdmins';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'super_admin' | 'organizer' | null>(null);
  const organizers = useEventStore((state) => state.organizers);

  useEffect(() => {
    if (!auth) {
      // Firebase Auth failed to initialize — no identity to verify, so no access.
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
          setUser(firebaseUser);
          const emailLower = firebaseUser.email?.toLowerCase() || '';
          const isSuperAdminEmail = isAuthorizedSuperAdminEmail(emailLower);

          // ── Core admin: instant access, no Firestore check needed ──
          if (emailLower === 'maithreyan2006@gmail.com') {
            setAdminUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Maithreyan D',
              role: 'super_admin',
              createdAt: new Date(),
              isActive: true,
            });
            setRole('super_admin');
            setLoading(false);
            return;
          }

          try {
            if (db) {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                const data = userDoc.data() as AdminUser;
                // If it's an authorized super admin email, ensure role is super_admin
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
                } else if (isSuperAdminEmail) {
                  setRole('super_admin');
                  setAdminUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    displayName: firebaseUser.displayName || 'Super Admin',
                    role: 'super_admin',
                    createdAt: new Date(),
                    isActive: true,
                  });
                } else {
                  // Not an authorized email — deny access and force sign-out.
                  setRole(null);
                  setAdminUser(null);
                  firebaseSignOut(auth).catch(() => {});
                }
              }
            } else if (isSuperAdminEmail) {
              setRole('super_admin');
              setAdminUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'Super Admin',
                role: 'super_admin',
                createdAt: new Date(),
                isActive: true,
              });
            } else {
              setRole(null);
              setAdminUser(null);
              firebaseSignOut(auth).catch(() => {});
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
            setRole(isSuperAdminEmail ? 'super_admin' : null);
          }
        } else {
          setUser(null);
          setAdminUser(null);
          setRole(null);
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

  const signOut = async () => {
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
    signOut,
  };
}
