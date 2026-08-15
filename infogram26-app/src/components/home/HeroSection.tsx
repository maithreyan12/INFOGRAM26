'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles, Zap, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

const titleLetters = ['I', 'N', 'F', 'O', 'G', 'R', 'A', 'M'];
const yearLetters = ["'", '2', '6'];

const letterContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.065, delayChildren: 0.28 },
  },
};

// '26 letters animate after INFOGRAM completes (8 letters × 0.065s stagger + 0.28 delay ≈ 0.8s)
const yearContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.95 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.7, filter: 'blur(12px)' },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

// Year letters animate upward with amber glow — same spring physics
const yearLetterVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.6, filter: 'blur(14px)' },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 280, damping: 20 },
  },
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1, y: 0,
    transition: { delay, duration: 0.55, ease: 'easeOut' as const },
  },
});

const floatingBadge = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.7, y: 16 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { delay, type: 'spring' as const, stiffness: 380, damping: 24 },
  },
});

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    const target = new Date('2026-08-22T09:00:00').getTime();
    const tick = () => {
      const d = target - Date.now();
      if (d < 0) return;
      setTimeLeft({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        minutes: Math.floor((d % 3600000) / 60000),
        seconds: Math.floor((d % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Ultra-optimised particle canvas — NO connection lines, low particle count
  useEffect(() => {
    if (!canvasRef.current || !mounted) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Device pixel ratio capped at 1 for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let cssW = window.innerWidth;
    let cssH = window.innerHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Low particle count — 18 max even on desktop, 10 on mobile
    const isMobile = cssW < 768;
    const count = isMobile ? 10 : 18;

    interface Particle {
      x: number; y: number;
      radius: number;
      speedX: number; speedY: number;
      alpha: number; hue: number;
    }

    const particles: Particle[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * cssW,
      y: Math.random() * cssH,
      radius: Math.random() * 1.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.15,
      hue: Math.random() > 0.5 ? 270 : 195,
    }));

    let frameId: number;
    let isVisible = true;
    let lastTime = 0;
    const FPS_CAP = 30; // Cap at 30fps to save battery on mobile
    const INTERVAL = 1000 / FPS_CAP;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) { cancelAnimationFrame(frameId); frameId = requestAnimationFrame(render); }
        else cancelAnimationFrame(frameId);
      },
      { threshold: 0.05 }
    );
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const alphaMultiplier = isDark ? 0.65 : 0.45;

    const render = (now: number) => {
      if (!isVisible) return;
      frameId = requestAnimationFrame(render);
      if (now - lastTime < INTERVAL) return; // throttle to 30fps
      lastTime = now;

      ctx.clearRect(0, 0, cssW, cssH);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = cssW;
        else if (p.x > cssW) p.x = 0;
        if (p.y < 0) p.y = cssH;
        else if (p.y > cssH) p.y = 0;

        ctx.globalAlpha = p.alpha * alphaMultiplier;
        ctx.fillStyle = `hsl(${p.hue}, 85%, 72%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted, isDark]);

  return (
    <section
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#04060f] text-white' : 'bg-[#f0f4ff] text-slate-950'
      }`}
      style={{
        minHeight: '100svh',
        // GPU composite layer for the whole section
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        contain: 'layout style',
      }}
    >
      {/* ── STATIC GRID (CSS only, zero JS) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: isDark
            ? `linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)`
            : `linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          transform: 'translateZ(0)',
        }}
      />

      {/* ── BLOB 1 — Pure CSS animation (no JS, no JS rAF) ── */}
      <div
        className="absolute rounded-full pointer-events-none hero-blob-1"
        style={{
          width: '60vw', height: '60vw',
          top: '-18%', left: '-12%',
          background: isDark
            ? 'radial-gradient(circle, rgba(124,58,237,0.28) 0%, rgba(56,189,248,0.16) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, rgba(99,102,241,0.09) 50%, transparent 70%)',
          filter: 'blur(70px)',
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      {/* ── BLOB 2 — Pure CSS animation ── */}
      <div
        className="absolute rounded-full pointer-events-none hero-blob-2"
        style={{
          width: '55vw', height: '55vw',
          bottom: '-18%', right: '-12%',
          background: isDark
            ? 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(56,189,248,0.16) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)',
          filter: 'blur(70px)',
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      {/* ── PARTICLE CANVAS (30fps capped) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, opacity: mounted ? 1 : 0, transition: 'opacity 0.6s', transform: 'translateZ(0)' }}
      />

      {/* ── FLOATING STAT BADGES (Desktop only) ── */}
      <motion.div
        variants={floatingBadge(1.1)}
        initial="hidden"
        animate="visible"
        className="hidden lg:block absolute"
        style={{ top: '22%', left: '5%', zIndex: 5 }}
      >
        <motion.div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-lg text-sm font-black ${
            isDark ? 'bg-slate-900/95 border-purple-500/30 text-white' : 'bg-white/95 border-slate-200 text-slate-950'
          }`}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        >
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="leading-tight">
            <div className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Official Event</div>
            <div className={`font-black text-sm ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>Trophies &amp; Awards</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={floatingBadge(1.3)}
        initial="hidden"
        animate="visible"
        className="hidden lg:block absolute"
        style={{ bottom: '30%', left: '4%', zIndex: 5 }}
      >
        <motion.div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-lg text-sm font-black ${
            isDark ? 'bg-slate-900/95 border-emerald-500/30 text-white' : 'bg-white/95 border-slate-200 text-slate-950'
          }`}
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        >
          <Users className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="leading-tight">
            <div className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Participants</div>
            <div className={`font-black text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>500+</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={floatingBadge(1.2)}
        initial="hidden"
        animate="visible"
        className="hidden lg:block absolute"
        style={{ top: '22%', right: '5%', zIndex: 5 }}
      >
        <motion.div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-lg text-sm font-black ${
            isDark ? 'bg-slate-900/95 border-cyan-500/30 text-white' : 'bg-white/95 border-slate-200 text-slate-950'
          }`}
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        >
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="leading-tight">
            <div className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Events</div>
            <div className={`font-black text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>20+ Live</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={floatingBadge(1.4)}
        initial="hidden"
        animate="visible"
        className="hidden lg:block absolute"
        style={{ bottom: '30%', right: '4%', zIndex: 5 }}
      >
        <motion.div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-lg ${
            isDark ? 'bg-slate-900/95 border-pink-500/30 text-white' : 'bg-white/95 border-slate-200 text-slate-950'
          }`}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        >
          <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
          <div className="leading-tight">
            <div className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>National Level</div>
            <div className={`font-black text-sm ${isDark ? 'text-pink-300' : 'text-pink-600'}`}>Symposium</div>
          </div>
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div
        className="relative flex flex-col items-center text-center w-full px-4 max-w-5xl mx-auto z-10"
        style={{
          paddingTop: 'max(72px, calc(env(safe-area-inset-top, 0px) + 68px))',
          paddingBottom: 56,
        }}
      >
        {/* ── INFOGRAM Letter Animation — TOP ── */}
        <div className="relative w-full flex flex-col items-center mb-1">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={letterContainerVariants}
            className="relative font-black uppercase leading-none text-center select-none flex items-center justify-center"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 13vw, 9rem)',
              willChange: 'opacity',
            }}
          >
            {titleLetters.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block font-black cursor-pointer select-none"
                style={{
                  color: isDark ? '#ffffff' : '#04060f',
                  textShadow: isDark
                    ? '0 0 28px rgba(192,132,252,0.55), 0 0 60px rgba(56,189,248,0.3)'
                    : '0 0 20px rgba(124,58,237,0.22), 0 2px 14px rgba(124,58,237,0.15)',
                  willChange: 'transform',
                  display: 'inline-block',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
                whileHover={{
                  scale: 1.2,
                  y: -10,
                  filter: isDark
                    ? 'brightness(1.6) drop-shadow(0 0 16px rgba(192,132,252,0.9))'
                    : 'brightness(1.0) drop-shadow(0 0 12px rgba(124,58,237,0.6))',
                  transition: { type: 'spring', stiffness: 600, damping: 18 },
                }}
                whileTap={{
                  scale: 0.88,
                  y: 4,
                  filter: isDark
                    ? 'brightness(2.0) drop-shadow(0 0 20px rgba(192,132,252,1))'
                    : 'brightness(0.85) drop-shadow(0 0 16px rgba(124,58,237,0.8))',
                  transition: { type: 'spring', stiffness: 800, damping: 20 },
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* '26 Row — animated letter-by-letter */}
          <div className="flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-md -mt-2 sm:-mt-4">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.85, delay: 1.35, ease: 'easeOut' }}
              className={`h-[3px] flex-1 rounded-full origin-right ${isDark ? 'bg-gradient-to-l from-amber-400 to-transparent' : 'bg-gradient-to-l from-amber-600 to-transparent'}`}
            />
            <motion.div
              initial="hidden"
              animate="visible"
              variants={yearContainerVariants}
              className="flex items-baseline justify-center leading-none select-none"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 13vw, 9rem)',
                willChange: 'opacity',
              }}
            >
              {yearLetters.map((char, index) => (
                <motion.span
                  key={index}
                  variants={yearLetterVariants}
                  className="inline-block font-black cursor-pointer select-none"
                  style={{
                    color: isDark ? '#fcd34d' : '#d97706',
                    textShadow: isDark
                      ? '0 0 24px rgba(252,211,77,0.7), 0 0 55px rgba(252,211,77,0.35)'
                      : '0 2px 10px rgba(217,119,6,0.35)',
                    willChange: 'transform',
                    display: 'inline-block',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                  }}
                  whileHover={{
                    scale: 1.2,
                    y: -10,
                    filter: isDark
                      ? 'brightness(1.5) drop-shadow(0 0 18px rgba(252,211,77,1))'
                      : 'brightness(1.1) drop-shadow(0 0 14px rgba(217,119,6,0.7))',
                    transition: { type: 'spring', stiffness: 600, damping: 18 },
                  }}
                  whileTap={{
                    scale: 0.88,
                    y: 5,
                    filter: isDark
                      ? 'brightness(2.0) drop-shadow(0 0 24px rgba(252,211,77,1))'
                      : 'brightness(0.85) drop-shadow(0 0 18px rgba(217,119,6,0.9))',
                    transition: { type: 'spring', stiffness: 800, damping: 20 },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.85, delay: 1.35, ease: 'easeOut' }}
              className={`h-[3px] flex-1 rounded-full origin-left ${isDark ? 'bg-gradient-to-r from-amber-400 to-transparent' : 'bg-gradient-to-r from-amber-600 to-transparent'}`}
            />
          </div>
        </div>

        {/* ── INFORMATION TECHNOLOGY — subtitle below INFOGRAM '26 ── */}
        <motion.div
          variants={fadeUp(0.95)}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-0.5 mb-3"
        >
          <div
            className="font-black uppercase tracking-[0.18em] leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.75rem, 3.2vw, 1.35rem)',
              color: isDark ? '#a78bfa' : '#7c3aed',
            }}
          >
            INFORMATION TECHNOLOGY
          </div>
          <div
            className="font-black uppercase tracking-[0.12em]"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(0.6rem, 2.2vw, 0.9rem)',
              color: isDark ? '#94a3b8' : '#64748b',
            }}
          >
            C. Abdul Hakeem College of Engineering &amp; Technology
          </div>
        </motion.div>

        {/* ── Tagline ── */}
        <motion.p
          variants={fadeUp(0.95)}
          initial="hidden"
          animate="visible"
          className={`text-xs sm:text-base font-black uppercase tracking-[0.24em] mt-4 mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Where Innovation Earns Recognition
        </motion.p>

        {/* ── Event Date ── */}
        <motion.div
          variants={fadeUp(1.05)}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 mb-7"
        >
          <div className={`h-[2px] w-7 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} />
          <span
            className="text-sm sm:text-lg font-black tracking-wider uppercase"
            style={{
              color: isDark ? '#fcd34d' : '#d97706',
              fontFamily: 'var(--font-heading)',
            }}
          >
            22nd August 2026
          </span>
          <div className={`h-[2px] w-7 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} />
        </motion.div>

        {/* ── Countdown — CSS spinning border (no JS rotate) ── */}
        <motion.div
          variants={fadeUp(1.15)}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm sm:max-w-md mb-8"
        >
          <div className="relative p-[2px] rounded-[26px] overflow-hidden">
            {/* Spinning conic ring — pure CSS, no JS */}
            <div
              className="absolute inset-0 rounded-[26px] countdown-ring"
              style={{
                background: isDark
                  ? 'conic-gradient(from 0deg, #7c3aed, #06b6d4, #10b981, #f59e0b, #7c3aed)'
                  : 'conic-gradient(from 0deg, #7c3aed55, #06b6d455, #10b98155, #f59e0b55, #7c3aed55)',
                opacity: isDark ? 0.9 : 0.6,
              }}
            />
            <div
              className={`relative rounded-3xl px-4 py-4 sm:py-5 ${isDark ? 'bg-[#04060f]' : 'bg-white'}`}
            >
              <div className="grid grid-cols-4 gap-2 sm:gap-4 items-center text-center">
                {[
                  { v: timeLeft.days, l: 'Days', c: isDark ? '#a78bfa' : '#7c3aed' },
                  { v: timeLeft.hours, l: 'Hours', c: isDark ? '#67e8f9' : '#0891b2' },
                  { v: timeLeft.minutes, l: 'Mins', c: isDark ? '#6ee7b7' : '#059669' },
                  { v: timeLeft.seconds, l: 'Secs', c: isDark ? '#fcd34d' : '#d97706' },
                ].map(({ v, l, c }) => (
                  <div key={l} className="flex flex-col items-center">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={v}
                        initial={{ y: -12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 12, opacity: 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="text-2xl sm:text-3xl font-black tabular-nums leading-none"
                        style={{ fontFamily: 'var(--font-display)', color: c }}
                      >
                        {String(v).padStart(2, '0')}
                      </motion.span>
                    </AnimatePresence>
                    <span
                      className={`text-[9px] sm:text-[11px] font-black uppercase tracking-widest mt-1.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CTA Buttons ── */}
        <motion.div
          variants={fadeUp(1.28)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm sm:max-w-md"
        >
          {/* Register Now — CSS gradient glow (not JS spinning ring) */}
          <motion.div
            className="w-full sm:w-auto group relative"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ willChange: 'transform' }}
          >
            <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-500 opacity-70 blur-[3px] group-hover:opacity-100 transition-opacity duration-200" />
            <Link
              href="/register"
              className="relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider w-full sm:w-auto bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-500 text-white"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-150" />
            </Link>
          </motion.div>

          {/* Explore Events */}
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ willChange: 'transform' }}
          >
            <Link
              href="/events"
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider w-full sm:w-auto border transition-colors duration-150 ${
                isDark
                  ? 'bg-slate-900/90 text-white border-purple-500/40 hover:border-purple-400 shadow-lg'
                  : 'bg-white/90 text-slate-950 border-slate-300 hover:border-[#7c3aed] shadow-md'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Explore Events</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll Hint ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
        style={{ bottom: 18, zIndex: 10 }}
        animate={{ opacity: [0.3, 0.85, 0.3], y: [0, 5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className={`text-[9px] uppercase tracking-[0.32em] font-black ${isDark ? 'text-slate-400' : 'text-slate-700'}`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Scroll
        </span>
        <ChevronDown className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-[#7c3aed]'}`} />
      </motion.div>
    </section>
  );
}
