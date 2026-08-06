'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { auth, db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { AdminUser } from '@/types';

export default function AdminLogin() {
  const { signIn, signOut, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn();
      if (!result) {
        alert("Firebase is not configured. Bypassing login in mock mode...");
        router.push('/admin/dashboard');
        return;
      }
      const user = result.user;
      
      if (!db) {
        setError('Database is not configured. Cannot verify role.');
        return;
      }
      // Check Firestore users collection by UID
      let userDocRef = doc(db, 'users', user.uid);
      
      // We will fetch all users to see if they exist by email, and map their UID if not mapped
      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const userData = docSnap.data() as AdminUser;
        
        // Map UID if it's a new login for a pre-registered organizer
        if (!userData.uid || userData.uid !== user.uid) {
          await updateDoc(docSnap.ref, { uid: user.uid });
        }
        
        if (userData.role === 'super_admin') {
          router.push('/admin/dashboard');
        } else if (userData.role === 'organizer') {
          router.push('/organizer/dashboard');
        } else {
          setError('Your account is not authorized as an admin or organizer.');
        }
      } else {
        setError('Your Google account is not authorized. Please contact the administrator.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040d1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4ff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#040d1a] text-white p-4 relative overflow-hidden tech-grid">
      {/* Aurora effects */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#00d4ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#0a3d6b]/20 rounded-full blur-[120px]" />

      <div className="z-10 text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-black tracking-wider gradient-text-animated uppercase mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          INFOGRAM<span className="text-[#00d4ff]">&apos;26</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#00d4ff]/60" style={{ fontFamily: 'var(--font-heading)' }}>
          Department of Information Technology
        </p>
      </div>

      <div className="z-10 glass-card w-full max-w-md p-8 rounded-2xl border border-[#00d4ff]/15 shadow-2xl backdrop-blur-md bg-[#040d1a]/85">
        <h2 className="text-xl font-bold text-white mb-2 text-center uppercase tracking-[0.08em]" style={{ fontFamily: 'var(--font-heading)' }}>Admin Portal</h2>
        <p className="text-white/50 text-center text-sm mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Authorized administrator or organizer sign-in
        </p>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
            <button 
              onClick={() => { setError(null); signOut(); }}
              className="mt-4 flex items-center justify-center w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-white py-2 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? 'Authenticating...' : 'Continue with Google'}
          </button>
        )}
      </div>
      
      <Link href="/" className="z-10 mt-8 text-white/50 hover:text-[#00d4ff] transition-colors text-sm" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
        &larr; Back to Home
      </Link>
    </div>
  );
}
