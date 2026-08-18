'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
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
    // Initial fetch from API
    fetch('/api/admin/sponsors')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.sponsors) && data.sponsors.length > 0) {
          setSponsors(data.sponsors);
        }
      })
      .catch((e) => console.warn('Public sponsors API fetch notice:', e));

    if (!isFirebaseConfigured || !db) {
      return;
    }

    let unsub: (() => void) | undefined;
    try {
      unsub = onSnapshot(
        collection(db, 'sponsors'),
        (snapshot) => {
          if (!snapshot.empty) {
            setSponsors(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor)));
          }
        },
        (err) => {
          console.warn('Live sponsors sync notice:', err);
        }
      );
    } catch (e) {
      console.warn('Live sponsors attach notice:', e);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  function normalizeImageUrl(url?: string): string {
    if (!url) return '';
    let clean = url.trim();
    const gDriveMatch = clean.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    if (gDriveMatch && gDriveMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
    }
    if (clean.includes('dropbox.com')) {
      return clean.replace(/\?dl=0$/, '?raw=1').replace(/&dl=0$/, '&raw=1');
    }
    if (clean.includes('github.com') && clean.includes('/blob/')) {
      return clean.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }
    return clean;
  }

  const [failedImgs, setFailedImgs] = useState<Record<string, boolean>>({});

  const getInitials = (name: string) => {
    return (name || 'SP').substring(0, 3).toUpperCase();
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
        <span className={`section-badge inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 border ${isDark ? 'bg-purple-500/10 border-purple-500/30 text-amber-300' : 'bg-[#7c3aed]/10 border-[#7c3aed]/20 text-[#7c3aed]'
          }`} style={{ fontFamily: 'var(--font-heading)' }}>
          Our Sponsors
        </span>
        <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-display)' }}>
          Trusted by Leading Organizations
        </h2>
      </div>https://127.0.0.1:57874/static/artifacts/de0bf684-cf34-4ab9-a82f-d0267b6e9d28/.user_uploaded/media_1786987988790.png?csrf=27676a07-baee-42e4-9788-d0d4f8517000

      <div className="relative flex overflow-x-hidden w-full group py-8">
        <div className="marquee-track flex animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-6 group-hover:[animation-play-state:paused]">
          {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => {
            const normalized = normalizeImageUrl(sponsor.logoUrl);
            const showImg = normalized && !failedImgs[sponsor.id];

            return (
              <div
                key={`${sponsor.id}-${index}`}
                className={`glass-card flex items-center gap-3 px-6 py-3 rounded-full border ${getBorderColor(sponsor.tier)} hover:scale-105 transition-all duration-300 shrink-0 ${isDark ? 'bg-slate-900/80 text-white shadow-xl' : 'bg-white/90 text-slate-900 shadow-md'
                  }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500 overflow-hidden shrink-0">
                  {showImg ? (
                    <img
                      src={normalized}
                      alt={sponsor.name}
                      className="w-full h-full object-contain p-1"
                      onError={() => setFailedImgs((prev) => ({ ...prev, [sponsor.id]: true }))}
                    />
                  ) : (
                    <span className="text-xs font-mono font-black">{getInitials(sponsor.name)}</span>
                  )}
                </div>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{sponsor.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}} />
    </section>
  );
}
