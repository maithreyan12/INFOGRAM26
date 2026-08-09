'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
// @ts-ignore
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { useTheme } from '@/context/ThemeContext';

type Sponsor = {
  id: string;
  name: string;
  tier: 'gold' | 'silver' | 'bronze' | 'partner';
  logoUrl?: string;
};

const DEMO_SPONSORS: Sponsor[] = [
  { id: '1', name: 'TechCorp', tier: 'gold' },
  { id: '2', name: 'InnoSystems', tier: 'gold' },
  { id: '3', name: 'DevStudio', tier: 'silver' },
  { id: '4', name: 'CloudNet', tier: 'silver' },
  { id: '5', name: 'DataFlow', tier: 'bronze' },
  { id: '6', name: 'CodeWorks', tier: 'bronze' },
  { id: '7', name: 'EdTech Solutions', tier: 'partner' },
  { id: '8', name: 'FutureMinds', tier: 'partner' },
];

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchSponsors() {
      try {
        if (!isFirebaseConfigured || !db) { setSponsors(DEMO_SPONSORS); return; }
        const snapshot = await getDocs(collection(db, 'sponsors'));
        if (snapshot.empty) {
          setSponsors(DEMO_SPONSORS);
        } else {
          setSponsors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sponsor)));
        }
      } catch (error) {
        setSponsors(DEMO_SPONSORS);
      }
    }
    fetchSponsors();
  }, []);

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getBorderColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'border-amber-400/50';
      case 'silver': return 'border-slate-400/50';
      case 'bronze': return 'border-amber-600/50';
      default: return isDark ? 'border-purple-500/30' : 'border-slate-200';
    }
  };

  return (
    <section className="section-padding overflow-hidden py-20 bg-transparent">
      <div className="container-xl mx-auto px-4 text-center mb-12">
        <span className={`section-badge inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 border ${
          isDark ? 'bg-purple-500/10 border-purple-500/30 text-amber-300' : 'bg-[#7c3aed]/10 border-[#7c3aed]/20 text-[#7c3aed]'
        }`} style={{ fontFamily: 'var(--font-heading)' }}>
          Our Sponsors
        </span>
        <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-display)' }}>
          Trusted by Leading Organizations
        </h2>
      </div>

      <div className="relative flex overflow-x-hidden w-full group py-8">
        <div className="marquee-track flex animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-6 group-hover:[animation-play-state:paused]">
          {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
            <div 
              key={`${sponsor.id}-${index}`}
              className={`glass-card flex items-center gap-3 px-6 py-3 rounded-full border ${getBorderColor(sponsor.tier)} hover:scale-105 transition-all duration-300 shrink-0 ${
                isDark ? 'bg-slate-900/80 text-white shadow-xl' : 'bg-white/90 text-slate-900 shadow-md'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500 overflow-hidden">
                {sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(sponsor.name)
                )}
              </div>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{sponsor.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}} />
    </section>
  );
}
