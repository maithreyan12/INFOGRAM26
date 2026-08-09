'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
// @ts-ignore
import { db, isFirebaseConfigured } from '@/lib/firebase/config';

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
      case 'gold': return 'border-yellow-400/30';
      case 'silver': return 'border-gray-400/30';
      case 'bronze': return 'border-orange-400/30';
      default: return 'border-white/10';
    }
  };

  return (
    <section className="section-padding overflow-hidden py-20 bg-transparent">
      <div className="container-xl mx-auto px-4 text-center mb-12">
        <span className="section-badge inline-block px-4 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed] text-sm font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Our Sponsors
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Trusted by Leading Organizations</h2>
      </div>

      <div className="relative flex overflow-x-hidden w-full group py-8">
        <div className="marquee-track flex animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-6 group-hover:[animation-play-state:paused]">
          {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
            <div 
              key={`${sponsor.id}-${index}`}
              className={`glass-card flex items-center gap-3 px-6 py-3 rounded-full border ${getBorderColor(sponsor.tier)} hover:scale-105 transition-transform shrink-0`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-800 overflow-hidden">
                {sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(sponsor.name)
                )}
              </div>
              <span className="text-slate-900 font-bold">{sponsor.name}</span>
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
