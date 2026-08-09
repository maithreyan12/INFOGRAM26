'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEventStore } from '@/store/eventStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, CheckSquare, Users, Trophy, LogOut, Menu, X, Home, Calendar } from 'lucide-react';
import Image from 'next/image';

const NAV_LINKS = [
  { name: 'Dashboard', path: '/organizer/dashboard', icon: LayoutDashboard },
  { name: 'My Event', path: '/organizer/event', icon: CheckSquare },
  { name: 'Participants', path: '/organizer/participants', icon: Users },
  { name: 'Winners', path: '/organizer/winners', icon: Trophy },
];

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const { user, adminUser, loading, isOrganizer, isAdmin, signOut } = useAuth();
  const getEventByOrganizer = useEventStore((state) => state.getEventByOrganizer);
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const assignedEvent = getEventByOrganizer(adminUser?.uid, adminUser?.assignedEventId);

  useEffect(() => {
    if (!loading && !isOrganizer && !isAdmin) {
      router.replace('/admin-login');
    }
  }, [loading, isOrganizer, isAdmin, router]);

  if (loading || (!isOrganizer && !isAdmin)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400 text-sm">Loading Event Admin Portal...</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 z-50 flex items-center justify-between px-4">
        <span className="font-bold text-xl gradient-text">INFOGRAM'26</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-950 border-r border-gray-800 z-40 flex flex-col transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-800 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/50 bg-blue-950/40 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] mb-2">
            <img src="/logo-circle.png" alt="INFOGRAM'26 Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold gradient-text tracking-wider text-center">INFOGRAM'26</h1>
          <div className="mt-2 text-center text-xs font-semibold text-blue-400 bg-blue-900/30 py-1.5 px-3 rounded-full border border-blue-500/30 flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> EVENT ADMIN PORTAL
          </div>
        </div>

        {user && (
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-900/50 border border-blue-500/40 flex items-center justify-center shrink-0">
              {user.photoURL ? (
                <Image src={user.photoURL} alt="Avatar" width={40} height={40} />
              ) : (
                <span className="font-bold text-blue-300">{user.displayName?.charAt(0) || 'O'}</span>
              )}
            </div>
            <div className="overflow-hidden text-sm">
              <p className="font-semibold truncate text-white">{user.displayName || 'Event Organizer'}</p>
              <p className="text-blue-400 text-xs font-medium truncate">
                Assigned: {assignedEvent?.name || adminUser?.assignedEventId || 'Assigned Event'}
              </p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white font-semibold sidebar-link active shadow-lg shadow-blue-600/20' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white sidebar-link'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          {isAdmin && (
            <Link 
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-purple-400 hover:bg-purple-900/30 transition-colors text-xs font-semibold"
            >
              &larr; Switch to Super Admin
            </Link>
          )}
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Public Site
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-10 px-4 md:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
