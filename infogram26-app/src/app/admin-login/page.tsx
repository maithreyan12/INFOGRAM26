'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { auth, db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { LogOut, ShieldCheck, UserCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { AdminUser } from '@/types';
import { useEventStore } from '@/store/eventStore';

export default function AdminLogin() {
  const { signIn, signOut, loginAsDemoSuperAdmin, loginAsDemoOrganizer, loading: authLoading } = useAuth();
  const organizers = useEventStore((state) => state.organizers);
  const events = useEventStore((state) => state.events);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn();
      if (!result) {
        // If Firebase is not configured, login as Super Admin demo
        loginAsDemoSuperAdmin();
        router.push('/admin/dashboard');
        return;
      }
      const user = result.user;
      const userEmail = user.email?.toLowerCase() || '';

      if (userEmail === 'maithreyan2006@gmail.com') {
        router.push('/admin/dashboard');
        return;
      }
      
      if (!db) {
        loginAsDemoSuperAdmin();
        router.push('/admin/dashboard');
        return;
      }
      
      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const userData = docSnap.data() as AdminUser;
        
        if (!userData.uid || userData.uid !== user.uid) {
          await updateDoc(docSnap.ref, { uid: user.uid });
        }
        
        if (userData.role === 'super_admin' || userEmail.includes('admin')) {
          router.push('/admin/dashboard');
        } else if (userData.role === 'organizer') {
          router.push('/organizer/dashboard');
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        // Default to super_admin for convenient testing
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSuperAdmin = () => {
    loginAsDemoSuperAdmin();
    router.push('/admin/dashboard');
  };

  const handleDemoOrganizer = (orgUid: string) => {
    loginAsDemoOrganizer(orgUid);
    router.push('/organizer/dashboard');
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
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#00d4ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#0a3d6b]/20 rounded-full blur-[120px]" />

      <div className="z-10 text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-black tracking-wider gradient-text-animated uppercase mb-2">
          INFOGRAM<span className="text-[#00d4ff]">&apos;26</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#00d4ff]/70 font-semibold">
          ADMINISTRATOR & EVENT ORGANIZER PORTAL
        </p>
      </div>

      <div className="z-10 glass-card w-full max-w-lg p-8 rounded-2xl border border-[#00d4ff]/20 shadow-2xl backdrop-blur-md bg-[#040d1a]/90 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white text-center uppercase tracking-wider mb-1">
            Access Portal
          </h2>
          <p className="text-gray-400 text-center text-xs">
            Sign in with authorized credentials or select a demo role
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl text-sm text-center">
            {error}
            <button 
              onClick={() => { setError(null); signOut(); }}
              className="mt-3 flex items-center justify-center w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-white py-2 rounded-xl text-xs transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </button>
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3.5 px-6 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.01] shadow-lg disabled:opacity-70 text-sm uppercase tracking-wider"
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
          {loading ? 'Authenticating Super Admin...' : 'Sign in with Google'}
        </button>

        <p className="text-[11px] text-gray-400 text-center font-bold">
          Authorized Super Admin: <span className="text-amber-300 font-mono">maithreyan2006@gmail.com</span>
        </p>
      </div>

      <div className="z-10 mt-6 flex flex-col sm:flex-row items-center gap-4 text-xs">
        <Link href="/" className="text-white/60 hover:text-amber-300 transition-colors font-bold uppercase tracking-wider">
          &larr; Back to Public Website
        </Link>
        <span className="text-white/30 hidden sm:inline">•</span>
        <div className="flex items-center gap-2 text-white/70 font-bold">
          <span>Website Admin:</span>
          <a
            href="https://maithreyan.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:underline font-black"
          >
            Maithreyan D (maithreyan.in)
          </a>
          <a href="tel:+919342706675" className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full hover:bg-purple-500/30">
            📞 9342706675
          </a>
        </div>
      </div>
    </div>
  );
}
