'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
// @ts-ignore
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { useTheme } from '@/context/ThemeContext';
import { Sparkles, ArrowUpRight, Building2, Handshake, LayoutGrid, Layers, Cpu, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

type Sponsor = {
  id: string;
  name: string;
  websiteUrl?: string;
  tier: 'gold' | 'silver' | 'bronze' | 'partner';
  logoUrl?: string;
};

const DEFAULT_SPONSORS: Sponsor[] = [
  { id: 'sp_appziio', name: 'Appziio Technologies', websiteUrl: 'https://appziio.com', tier: 'gold', logoUrl: '' },
  { id: 'sp_cahcet_alumni', name: 'CAHCET IT Alumni', websiteUrl: 'https://cahcet.in', tier: 'gold', logoUrl: '' },
  { id: 'sp_codeforge', name: 'CodeForge Studio', websiteUrl: 'https://codeforge.dev', tier: 'silver', logoUrl: '' },
  { id: 'sp_cloudscale', name: 'CloudScale Systems', websiteUrl: 'https://cloudscale.io', tier: 'silver', logoUrl: '' },
  { id: 'sp_devmatrix', name: 'DevMatrix Labs', websiteUrl: 'https://devmatrix.org', tier: 'bronze', logoUrl: '' },
  { id: 'sp_hackindia', name: 'Hackathon India', websiteUrl: 'https://hackathonindia.com', tier: 'partner', logoUrl: '' },
];

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

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(DEFAULT_SPONSORS);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [failedImgs, setFailedImgs] = useState<Record<string, boolean>>({});
  
  // Template Selector state: 'cyber' | 'streamline' | 'holographic'
  const [template, setTemplate] = useState<'cyber' | 'streamline' | 'holographic'>('cyber');

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

    if (!isFirebaseConfigured || !db) return;

    let unsub: (() => void) | undefined;
    try {
      unsub = onSnapshot(
        collection(db, 'sponsors'),
        (snapshot) => {
          if (!snapshot.empty) {
            setSponsors(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor)));
          }
        },
        (err) => console.warn('Live sponsors sync notice:', err)
      );
    } catch (e) {
      console.warn('Live sponsors attach notice:', e);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const getInitials = (name: string) => {
    return (name || 'SP').substring(0, 3).toUpperCase();
  };

  return (
    <section className="relative overflow-hidden py-24 bg-transparent select-none">
      {/* Ambient Neon Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#7c3aed]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#00d4ff]/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="container-xl mx-auto px-4 text-center mb-10 relative z-10">
        {/* Section Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 border border-purple-500/30 text-[#00d4ff] shadow-lg shadow-purple-500/5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Official Event Sponsors &amp; Partners</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        </div>

        {/* Section Title */}
        <h2
          className={`text-3xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight ${
            isDark ? 'text-white' : 'text-slate-950'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Backed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-purple-300 to-amber-300">Industry Leaders</span>
        </h2>

        {/* Section Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base font-bold text-gray-400 leading-relaxed mb-6">
          Proudly powered and supported by visionary enterprises, tech trailblazers, and distinguished partners.
        </p>

        {/* ── Template Switcher Buttons ── */}
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#08182b]/80 border border-gray-800 backdrop-blur-xl gap-1.5 shadow-xl">
          <button
            onClick={() => setTemplate('cyber')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              template === 'cyber'
                ? 'bg-gradient-to-r from-[#00d4ff] to-[#0096c7] text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Cyber Glass
          </button>
          <button
            onClick={() => setTemplate('streamline')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              template === 'streamline'
                ? 'bg-gradient-to-r from-[#00d4ff] to-[#0096c7] text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Streamline Pills
          </button>
          <button
            onClick={() => setTemplate('holographic')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              template === 'holographic'
                ? 'bg-gradient-to-r from-[#00d4ff] to-[#0096c7] text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Holographic Bento
          </button>
        </div>
      </div>

      {/* ── Running Marquee Track (Dynamic Template Display) ── */}
      <div className="relative w-full overflow-hidden py-6">
        {/* Left & Right Gradient Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-56 bg-gradient-to-r from-[#040d1a] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-56 bg-gradient-to-l from-[#040d1a] to-transparent z-20 pointer-events-none" />

        <div className="marquee-track flex animate-[marquee_40s_linear_infinite] whitespace-nowrap gap-6 group-hover:[animation-play-state:paused] py-4 px-6">
          {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => {
            const normalized = normalizeImageUrl(sponsor.logoUrl);
            const showImg = normalized && !failedImgs[sponsor.id];

            // ── TEMPLATE 1: CYBER GLASS (Deep Frosted Glass with Glow Sheen) ──
            if (template === 'cyber') {
              const CyberCard = (
                <div
                  className={`relative w-72 sm:w-80 p-5 rounded-3xl border transition-all duration-300 group/card overflow-hidden flex flex-col items-center shrink-0 ${
                    isDark
                      ? 'bg-slate-900/40 backdrop-blur-2xl border-white/[0.08] shadow-2xl hover:border-[#00d4ff]/50 hover:shadow-[0_0_35px_rgba(0,212,255,0.2)]'
                      : 'bg-white/80 backdrop-blur-xl border-slate-200 shadow-xl hover:border-[#7c3aed]/40'
                  } hover:-translate-y-2`}
                >
                  {/* Subtle top light refraction */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d4ff]/10 rounded-bl-full pointer-events-none group-hover/card:scale-150 transition-transform duration-700" />

                  {/* Glassy Logo Stage (No harsh bright white) */}
                  <div className="w-full h-24 rounded-2xl bg-black/40 border border-white/[0.08] p-3 flex items-center justify-center mb-4 group-hover/card:border-[#00d4ff]/40 transition-all duration-300 relative overflow-hidden backdrop-blur-md shadow-inner">
                    {showImg ? (
                      <img
                        src={normalized}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow group-hover/card:scale-105 transition-transform duration-300"
                        onError={() => setFailedImgs((prev) => ({ ...prev, [sponsor.id]: true }))}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] font-black text-base flex items-center justify-center font-mono">
                        {getInitials(sponsor.name)}
                      </div>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black tracking-tight mb-2 truncate max-w-full text-white">
                    {sponsor.name}
                  </h3>

                  {sponsor.websiteUrl ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#00d4ff] hover:text-[#38bdf8] bg-[#00d4ff]/10 border border-[#00d4ff]/30 px-3.5 py-1 rounded-full transition-all mt-auto">
                      Visit Partner <ArrowUpRight className="w-3 h-3 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-white/[0.04] border border-white/[0.08] px-3.5 py-1 rounded-full mt-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Official Partner
                    </span>
                  )}
                </div>
              );

              if (sponsor.websiteUrl) {
                return (
                  <a key={`${sponsor.id}-${index}`} href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="block shrink-0">
                    {CyberCard}
                  </a>
                );
              }
              return <div key={`${sponsor.id}-${index}`} className="shrink-0">{CyberCard}</div>;
            }

            // ── TEMPLATE 2: STREAMLINE PILLS (Sleek Horizontal Tech Badge) ──
            if (template === 'streamline') {
              const PillCard = (
                <div
                  className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 shrink-0 hover:scale-105 ${
                    isDark
                      ? 'bg-gradient-to-r from-slate-900/70 via-[#08182b]/80 to-slate-900/70 backdrop-blur-xl border-white/[0.1] shadow-xl hover:border-[#00d4ff]/50'
                      : 'bg-white/90 border-slate-200 shadow-md'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/15 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-inner">
                    {showImg ? (
                      <img
                        src={normalized}
                        alt={sponsor.name}
                        className="w-full h-full object-contain"
                        onError={() => setFailedImgs((prev) => ({ ...prev, [sponsor.id]: true }))}
                      />
                    ) : (
                      <span className="text-xs font-mono font-black text-[#00d4ff]">{getInitials(sponsor.name)}</span>
                    )}
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="font-black text-base text-white tracking-tight flex items-center gap-1.5">
                      {sponsor.name}
                      {sponsor.websiteUrl && <ArrowUpRight className="w-3.5 h-3.5 text-[#00d4ff]" />}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Event Partner
                    </span>
                  </div>
                </div>
              );

              if (sponsor.websiteUrl) {
                return (
                  <a key={`${sponsor.id}-${index}`} href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="block shrink-0">
                    {PillCard}
                  </a>
                );
              }
              return <div key={`${sponsor.id}-${index}`} className="shrink-0">{PillCard}</div>;
            }

            // ── TEMPLATE 3: HOLOGRAPHIC BENTO (Translucent 3D Glowing Card) ──
            const BentoCard = (
              <div
                className={`relative w-64 p-6 rounded-3xl border transition-all duration-300 group/bento overflow-hidden flex flex-col items-center text-center shrink-0 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0c2038]/60 via-[#061220]/70 to-[#030912]/80 backdrop-blur-2xl border-cyan-500/20 shadow-2xl hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]'
                    : 'bg-white/95 border-slate-200 shadow-xl'
                } hover:-translate-y-2`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent border border-white/15 p-2 flex items-center justify-center mb-4 group-hover/bento:scale-110 transition-transform duration-300">
                  {showImg ? (
                    <img
                      src={normalized}
                      alt={sponsor.name}
                      className="w-full h-full object-contain"
                      onError={() => setFailedImgs((prev) => ({ ...prev, [sponsor.id]: true }))}
                    />
                  ) : (
                    <span className="text-sm font-mono font-black text-cyan-400">{getInitials(sponsor.name)}</span>
                  )}
                </div>

                <h3 className="text-base font-black text-white tracking-tight mb-2 truncate max-w-full">
                  {sponsor.name}
                </h3>

                <span className="text-[10px] font-black uppercase tracking-widest text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/25 px-3 py-1 rounded-full mt-auto">
                  Official Sponsor
                </span>
              </div>
            );

            if (sponsor.websiteUrl) {
              return (
                <a key={`${sponsor.id}-${index}`} href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="block shrink-0">
                  {BentoCard}
                </a>
              );
            }
            return <div key={`${sponsor.id}-${index}`} className="shrink-0">{BentoCard}</div>;
          })}
        </div>
      </div>

      {/* ── Sponsor CTA Banner ── */}
      <div className="container-xl mx-auto px-4 mt-12 relative z-10">
        <div className="max-w-4xl mx-auto p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-cyan-950/40 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Handshake className="w-5 h-5 text-[#00d4ff]" />
              <h3 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Partner with INFOGRAM&apos;26
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-400 max-w-lg">
              Showcase your brand to 1,500+ aspiring engineers, developers, and innovators across Tamil Nadu.
            </p>
          </div>

          <Link
            href="/contact"
            className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-[#00d4ff] to-[#00b4d8] hover:from-[#00b4d8] hover:to-[#0096c7] text-slate-950 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00d4ff]/25 active:scale-95 transition-all"
          >
            Become a Sponsor <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </section>
  );
}



