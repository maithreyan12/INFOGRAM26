'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Calendar, Users, CreditCard, Image as ImageIcon, 
  Star, UserCheck, Bell, Settings, Home, LogOut, Menu, X, ShieldAlert 
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Events', path: '/admin/events', icon: Calendar },
  { name: 'Registrations', path: '/admin/registrations', icon: Users },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  { name: 'Sponsors', path: '/admin/sponsors', icon: Star },
  { name: 'Organizers', path: '/admin/organizers', icon: UserCheck },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, adminUser, loading, isAdmin, isOrganizer, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (isOrganizer) {
        router.replace('/organizer/dashboard');
      } else if (!isAdmin) {
        router.replace('/admin-login');
      }
    }
  }, [loading, isAdmin, isOrganizer, router]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#040d1a] text-white p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4ff] mb-4"></div>
        <p className="font-bold text-sm text-gray-300">Verifying Admin Permissions...</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  return (
    <div className="min-h-screen flex bg-[#040d1a] text-white">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-35"
        />
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-gray-800/80 z-50 flex items-center justify-between px-4 bg-[#08182b]">
        <span className="font-black text-lg uppercase tracking-wider text-white" style={{ fontFamily: 'var(--font-display)' }}>
          INFOGRAM<span className="text-[#00d4ff]">&apos;26</span>
        </span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col transition-transform duration-200 border-r border-gray-800/80 bg-[#08182b]
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 border-b border-gray-800/80 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00d4ff]/50 bg-black flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            <img src="/logo-circle.png" alt="INFOGRAM Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-black tracking-wider text-center text-white" style={{ fontFamily: 'var(--font-display)' }}>
            INFOGRAM<span className="text-[#00d4ff]">&apos;26</span>
          </h1>
          <div className="mt-2 text-center text-[10px] font-black uppercase tracking-wider text-[#00d4ff] bg-[#00d4ff]/10 py-1 px-3 rounded-full border border-[#00d4ff]/30 flex items-center justify-center gap-1">
            <ShieldAlert className="w-3 h-3 text-[#00d4ff]" /> SUPER ADMIN
          </div>
        </div>

        {user && (
          <div className="p-4 border-b border-gray-800/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-purple-900/50 border border-purple-500/40 flex items-center justify-center shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'Admin'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">
                  {(user.displayName || user.email || 'A').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-black text-xs text-white truncate">{user.displayName || 'Maithreyan D'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user.email || 'maithreyan2006@gmail.com'}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all ${
                  isActive
                    ? 'bg-[#00d4ff] text-slate-950 shadow-lg shadow-[#00d4ff]/20'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800/80 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
          >
            <Home className="w-4 h-4 text-[#00d4ff]" />
            <span>Public Site</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-8 pt-20 lg:pt-8 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
