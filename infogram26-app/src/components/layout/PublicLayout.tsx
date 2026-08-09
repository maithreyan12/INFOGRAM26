'use client';
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import { useTheme } from '@/context/ThemeContext';

interface PublicLayoutProps { children: ReactNode; }

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div 
      className={`flex flex-col min-h-screen transition-colors duration-500 relative ${
        isDark ? 'bg-[#070913] text-white' : 'bg-[#f8fafc] text-slate-900'
      }`} 
      style={{ isolation: 'isolate' }}
    >
      {/* Dynamic Background Ambient Lighting */}
      {isDark ? (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-sky-500/10 rounded-full blur-[150px]" />
        </div>
      ) : (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[150px]" />
        </div>
      )}

      <ScrollProgress />
      <Header />
      <main className="flex-grow pt-20 relative z-10" style={{ contain: 'layout' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
