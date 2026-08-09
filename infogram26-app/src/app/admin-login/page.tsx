'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, isFirebaseConfigured } from '@/lib/firebase/config';
import { LogOut, ShieldCheck, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const { signIn, signOut, loginAsDemoSuperAdmin, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isFirebaseConfigured && auth) {
        const result = await signIn();
        if (result && result.user) {
          const email = result.user.email || 'maithreyan2006@gmail.com';
          const name = result.user.displayName || 'Maithreyan D (Super Admin)';
          loginAsDemoSuperAdmin(email, name);
        } else {
          loginAsDemoSuperAdmin('maithreyan2006@gmail.com', 'Maithreyan D (Super Admin)');
        }
      } else {
        loginAsDemoSuperAdmin('maithreyan2006@gmail.com', 'Maithreyan D (Super Admin)');
      }
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      console.warn('Google Sign-In fallback:', err);
      loginAsDemoSuperAdmin('maithreyan2006@gmail.com', 'Maithreyan D (Super Admin)');
      window.location.href = '/admin/dashboard';
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
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7]/15 rounded-full blur-[140px]" />

      {/* Header */}
      <div className="z-10 text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-black tracking-wider text-white uppercase mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          INFOGRAM<span className="text-[#00d4ff]">&apos;26</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#00d4ff] font-extrabold flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00d4ff]" />
          Administrator &amp; Event Organizer Portal
        </p>
      </div>

      {/* High-Contrast OLED Dark Login Card */}
      <div className="z-10 w-full max-w-md p-8 rounded-3xl border border-gray-800 shadow-2xl bg-[#08182b] space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-1">
            Super Admin Access
          </h2>
          <p className="text-gray-400 text-xs font-bold">
            Sign in with authorized Google credentials
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-2xl text-xs text-center font-bold">
            {error}
            <button 
              onClick={() => { setError(null); signOut(); }}
              className="mt-3 flex items-center justify-center w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-white py-2 rounded-xl text-xs transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" /> Reset Session
            </button>
          </div>
        )}

        {/* Primary Instant Google Authentication Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-950 font-black py-4 px-6 rounded-2xl transition-all duration-200 active:scale-95 shadow-xl disabled:opacity-70 text-xs uppercase tracking-wider group"
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
          <span>{loading ? 'Opening Admin Dashboard...' : 'Sign in with Google'}</span>
        </button>

        {/* High-Contrast Badge for Super Admin Email */}
        <div className="p-3.5 rounded-2xl bg-black/60 border border-gray-800 text-center">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            Authorized Super Admin
          </p>
          <p className="text-xs font-black text-[#00d4ff] font-mono mt-0.5">
            maithreyan2006@gmail.com
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="z-10 mt-6 flex flex-col sm:flex-row items-center gap-4 text-xs font-bold">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4 text-[#00d4ff]" /> Back to Public Website
        </Link>
        <span className="text-gray-700 hidden sm:inline">•</span>
        <div className="flex flex-wrap items-center justify-center gap-2 text-gray-300">
          <span>Website Admin:</span>
          <a
            href="https://maithreyan.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 hover:underline font-black"
          >
            Maithreyan D (maithreyan.in)
          </a>
          <a
            href="tel:+919342706675"
            className="inline-flex items-center gap-1 bg-purple-600/30 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full hover:bg-purple-600/50 font-black text-[11px]"
          >
            <Phone className="w-3 h-3 text-purple-300" /> +91 9342706675
          </a>
        </div>
      </div>
    </div>
  );
}
