'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
// @ts-ignore
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { useTheme } from '@/context/ThemeContext';
import { Sparkles, ArrowUpRight, Handshake } from 'lucide-react';
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
        <p className="max-w-2xl mx-auto text-sm sm:text-base font-bold text-gray-400 leading-relaxed">
          Proudly powered and supported by visionary enterprises, tech trailblazers, and distinguished partners.
        </p>
      </div>

      {/* ── Running Marquee Track with Differentiated Membership Tier Square Cards ── */}
      <div className="relative w-full overflow-hidden py-6">
        {/* Left & Right Gradient Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-56 bg-gradient-to-r from-[#040d1a] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-56 bg-gradient-to-l from-[#040d1a] to-transparent z-20 pointer-events-none" />

        <div className="marquee-track flex animate-[marquee_40s_linear_infinite] whitespace-nowrap gap-6 group-hover:[animation-play-state:paused] py-4 px-6">
          {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => {
            const normalized = normalizeImageUrl(sponsor.logoUrl);
            const showImg = normalized && !failedImgs[sponsor.id];

            // ── Distinct Template Config by Membership Tier ──
            let tierConfig = {
              cardBg: isDark
                ? 'bg-gradient-to-b from-[#1f1704]/90 via-[#0d1527]/90 to-[#040d1a]/95 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-400 hover:shadow-[0_0_45px_rgba(245,158,11,0.3)]'
                : 'bg-white/95 border-amber-300 shadow-xl hover:border-amber-400',
              topGlow: 'bg-gradient-to-r from-transparent via-amber-400/40 to-transparent',
              cornerAura: 'bg-amber-500/15',
              logoBg: 'bg-gradient-to-b from-amber-500/15 via-black/50 to-black/70 border-amber-500/30 group-hover/card:border-amber-400/60',
              textColor: 'text-amber-100',
              badgeBg: 'bg-gradient-to-r from-amber-500/15 to-yellow-500/15 border-amber-500/40 text-amber-300',
              badgeDot: 'bg-amber-400',
              badgeLabel: 'Principal Partner',
              buttonHover: 'hover:bg-amber-400 hover:text-slate-950',
            };

            if (sponsor.tier === 'silver') {
              tierConfig = {
                cardBg: isDark
                  ? 'bg-gradient-to-b from-[#071d33]/90 via-[#081a2e]/90 to-[#040d1a]/95 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-400 hover:shadow-[0_0_45px_rgba(6,182,212,0.3)]'
                  : 'bg-white/95 border-cyan-300 shadow-xl hover:border-cyan-400',
                topGlow: 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent',
                cornerAura: 'bg-cyan-500/15',
                logoBg: 'bg-gradient-to-b from-cyan-500/15 via-black/50 to-black/70 border-cyan-500/30 group-hover/card:border-cyan-400/60',
                textColor: 'text-cyan-100',
                badgeBg: 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border-cyan-500/40 text-cyan-300',
                badgeDot: 'bg-cyan-400',
                badgeLabel: 'Associate Partner',
                buttonHover: 'hover:bg-cyan-400 hover:text-slate-950',
              };
            } else if (sponsor.tier === 'bronze') {
              tierConfig = {
                cardBg: isDark
                  ? 'bg-gradient-to-b from-[#1b0e2b]/90 via-[#0e1324]/90 to-[#040d1a]/95 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-400 hover:shadow-[0_0_45px_rgba(168,85,247,0.3)]'
                  : 'bg-white/95 border-purple-300 shadow-xl hover:border-purple-400',
                topGlow: 'bg-gradient-to-r from-transparent via-purple-400/40 to-transparent',
                cornerAura: 'bg-purple-500/15',
                logoBg: 'bg-gradient-to-b from-purple-500/15 via-black/50 to-black/70 border-purple-500/30 group-hover/card:border-purple-400/60',
                textColor: 'text-purple-100',
                badgeBg: 'bg-gradient-to-r from-purple-500/15 to-pink-500/15 border-purple-500/40 text-purple-300',
                badgeDot: 'bg-purple-400',
                badgeLabel: 'Innovation Partner',
                buttonHover: 'hover:bg-purple-400 hover:text-white',
              };
            } else if (sponsor.tier === 'partner') {
              tierConfig = {
                cardBg: isDark
                  ? 'bg-gradient-to-b from-[#071c15]/90 via-[#081928]/90 to-[#040d1a]/95 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-400 hover:shadow-[0_0_45px_rgba(16,185,129,0.3)]'
                  : 'bg-white/95 border-emerald-300 shadow-xl hover:border-emerald-400',
                topGlow: 'bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent',
                cornerAura: 'bg-emerald-500/15',
                logoBg: 'bg-gradient-to-b from-emerald-500/15 via-black/50 to-black/70 border-emerald-500/30 group-hover/card:border-emerald-400/60',
                textColor: 'text-emerald-100',
                badgeBg: 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border-emerald-500/40 text-emerald-300',
                badgeDot: 'bg-emerald-400',
                badgeLabel: 'Community Partner',
                buttonHover: 'hover:bg-emerald-400 hover:text-slate-950',
              };
            }

            const CardContent = (
              <div
                className={`relative w-64 sm:w-72 p-6 rounded-3xl border transition-all duration-300 group/card overflow-hidden flex flex-col items-center text-center shrink-0 backdrop-blur-2xl ${tierConfig.cardBg} hover:-translate-y-2.5`}
              >
                {/* Ambient Top Glow Line */}
                <div className={`absolute top-0 inset-x-0 h-px ${tierConfig.topGlow}`} />
                <div className={`absolute top-0 right-0 w-28 h-28 ${tierConfig.cornerAura} rounded-bl-full pointer-events-none group-hover/card:scale-150 transition-transform duration-500`} />

                {/* ── Logo Frame ── */}
                <div className={`w-20 h-20 rounded-2xl border p-2.5 flex items-center justify-center mb-4 transition-all duration-300 shadow-inner group-hover/card:scale-105 ${tierConfig.logoBg}`}>
                  {showImg ? (
                    <img
                      src={normalized}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow rounded-lg"
                      onError={() => setFailedImgs((prev) => ({ ...prev, [sponsor.id]: true }))}
                    />
                  ) : (
                    <span className="font-mono font-black text-sm uppercase">
                      {getInitials(sponsor.name)}
                    </span>
                  )}
                </div>

                {/* ── Company Name ── */}
                <h3
                  className={`text-base font-black tracking-tight mb-3 truncate w-full ${isDark ? 'text-white' : 'text-slate-900'}`}
                  title={sponsor.name}
                >
                  {sponsor.name}
                </h3>

                {/* ── Membership Badge or Interactive Website Link ── */}
                {sponsor.websiteUrl ? (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-black px-4 py-1.5 rounded-full border transition-all mt-auto ${tierConfig.badgeBg} ${tierConfig.buttonHover}`}>
                    Visit Website <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                  </span>
                ) : (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full border mt-auto ${tierConfig.badgeBg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${tierConfig.badgeDot} animate-pulse`} />
                    {tierConfig.badgeLabel}
                  </span>
                )}
              </div>
            );

            if (sponsor.websiteUrl) {
              return (
                <a
                  key={`${sponsor.id}-${index}`}
                  href={sponsor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block shrink-0"
                >
                  {CardContent}
                </a>
              );
            }

            return <div key={`${sponsor.id}-${index}`} className="shrink-0">{CardContent}</div>;
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

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </section>
  );
}

