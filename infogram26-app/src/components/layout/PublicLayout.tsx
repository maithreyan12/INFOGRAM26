'use client';
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';

interface PublicLayoutProps { children: ReactNode; }

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen" style={{ isolation: 'isolate' }}>
      <ScrollProgress />
      <Header />
      <main className="flex-grow pt-20" style={{ contain: 'layout' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
