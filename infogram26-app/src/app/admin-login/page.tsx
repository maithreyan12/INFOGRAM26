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
      const user = result.user;
      
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/aurora.svg')] bg-cover bg-center opacity-30 z-0"></div>
      
      <div className="z-10 text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white gradient-text tracking-wider mb-2">INFOGRAM'26</h1>
      </div>

      <div className="z-10 glass-card w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/10 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Admin / Organizer Login</h2>
        <p className="text-gray-300 text-center text-sm mb-8">
          Only authorized Google accounts can access the admin panel
        </p>

        {error ? (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6 text-sm text-center">
            {error}
            <button 
              onClick={() => { setError(null); signOut(); }}
              className="mt-4 flex items-center justify-center w-full bg-red-600/50 hover:bg-red-600/70 text-white py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6">
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
      
      <Link href="/" className="z-10 mt-8 text-gray-400 hover:text-white transition-colors text-sm">
        &larr; Back to Home
      </Link>
    </div>
  );
}
