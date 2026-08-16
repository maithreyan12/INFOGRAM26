'use client';
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import MusicPlayer from '@/components/home/MusicPlayer';
import { useTheme } from '@/context/ThemeContext';

interface PublicLayoutProps { children: ReactNode; }

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div 
      className={`flex flex-col min-h-screen transition-colors duration-300 relative ${
        isDark ? 'bg-[#070913] text-white' : 'bg-[#f8fafc] text-slate-950'
      }`} 
      style={{ isolation: 'isolate' }}
    >
      {/* ⚡ High-Performance GPU Radial Ambient Glows (Zero Blur Filter Overhead) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
        {isDark ? (
          <>
            <div 
              className="absolute -top-40 -right-20 w-[600px] h-[600px] opacity-40"
              style={{ background: 'radial-gradient(circle, rgba(126, 34, 206, 0.25) 0%, rgba(7, 9, 19, 0) 70%)' }}
            />
            <div 
              className="absolute top-1/3 -left-30 w-[500px] h-[500px] opacity-30"
              style={{ background: 'radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, rgba(7, 9, 19, 0) 70%)' }}
            />
            <div 
              className="absolute -bottom-20 -right-20 w-[550px] h-[550px] opacity-35"
              style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(7, 9, 19, 0) 70%)' }}
            />
          </>
        ) : (
          <>
            <div 
              className="absolute -top-40 -right-20 w-[600px] h-[600px] opacity-50"
              style={{ background: 'radial-gradient(circle, rgba(192, 132, 252, 0.2) 0%, rgba(248, 250, 252, 0) 70%)' }}
            />
            <div 
              className="absolute -bottom-20 -left-20 w-[500px] h-[500px] opacity-40"
              style={{ background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(248, 250, 252, 0) 70%)' }}
            />
          </>
        )}
      </div>

      <ScrollProgress />
      <Header />
      <main className="flex-grow pt-20 relative z-10" style={{ contain: 'layout' }}>
        {children}
      </main>
      <Footer />
      <MusicPlayer />
    </div>
  );
}
