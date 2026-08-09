'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Calendar, Users, CreditCard, Image as ImageIcon, 
  Star, UserCheck, Bell, Settings, Home, LogOut, Menu, X, ShieldAlert, Sun, Moon 
} from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

const NAV_LINKS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Events', path: '/admin/events', icon: Calendar },
  { name: 'Registrations', path: '/admin/registrations', icon: Users },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  { name: 'Sponsors', path: '/admin/sponsors', icon: Star },
  { name: 'Organizers', path: '/admin/organizers', icon: UserCheck },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, adminUser, loading, isAdmin, isOrganizer, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
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
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-[#04060f] text-white' : 'bg-slate-50 text-slate-900'} p-4`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
        <p className="font-bold text-sm">Verifying Admin Permissions...</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#04060f] text-white' : 'bg-slate-100 text-slate-950'}`}>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-35"
        />
      )}

      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 border-b z-50 flex items-center justify-between px-4 ${
        isDark ? 'bg-slate-950/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
      }`}>
        <span className="font-black text-lg uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
          INFOGRAM<span className="text-amber-400">&apos;26</span>
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-xl border ${isDark ? 'border-slate-800 text-amber-300' : 'border-slate-200 text-slate-700'}`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col transition-transform duration-200 border-r
        ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 border-b border-slate-800/50 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/50 bg-purple-950/40 flex items-center justify-center mb-2">
            <img src="/logo-circle.png" alt="INFOGRAM Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-black tracking-wider text-center" style={{ fontFamily: 'var(--font-display)' }}>
            INFOGRAM<span className="text-amber-400">&apos;26</span>
          </h1>
          <div className="mt-2 text-center text-[10px] font-black uppercase tracking-wider text-purple-300 bg-purple-900/30 py-1 px-3 rounded-full border border-purple-500/30 flex items-center justify-center gap-1">
            <ShieldAlert className="w-3 h-3 text-purple-400" /> SUPER ADMIN
          </div>
        </div>

        {user && (
          <div className="p-4 border-b border-slate-800/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-purple-900/50 border border-purple-500/40 flex items-center justify-center shrink-0">
              {user.photoURL ? (
                <Image src={user.photoURL} alt="Avatar" width={36} height={36} />
              ) : (
                <span className="font-black text-purple-300 text-sm">{user.displayName?.charAt(0) || 'M'}</span>
              )}
            </div>
            <div className="overflow-hidden text-xs">
              <p className={`font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.displayName || 'Maithreyan (Admin)'}</p>
              <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-1 px-3">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-colors ${
                      isActive 
                        ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-600/30' 
                        : isDark 
                          ? 'text-slate-400 hover:bg-slate-900 hover:text-white' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-slate-800/40 space-y-1.5">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${
              isDark ? 'bg-slate-900 border-slate-800 text-amber-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span>{isDark ? 'OLED Dark' : 'Apple Light'}</span>
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <Link 
            href="/"
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
              isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Public Website
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-red-400 hover:bg-red-950/30 transition-colors text-xs font-black uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 lg:ml-64 min-h-screen pt-20 lg:pt-6 pb-12 px-4 md:px-8 ${
        isDark ? 'bg-[#04060f]' : 'bg-[#f0f4ff]'
      }`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
