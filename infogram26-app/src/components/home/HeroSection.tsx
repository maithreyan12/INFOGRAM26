'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

const titleLetters = ['I', 'N', 'F', 'O', 'G', 'R', 'A', 'M'];

const letterContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.12,
    },
  },
};

const letterVariants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    scale: 0.82,
    filter: 'blur(10px)',
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: 'blur(0px)',
    transition: { 
      type: 'spring' as const,
      stiffness: 360,
      damping: 22,
    },
  },
};

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Countdown timer calculation
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

  // ── HIGH-PERFORMANCE 60FPS LIQUID PARTICLES CANVAS ──
  useEffect(() => {
    if (!canvasRef.current || !mounted) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // 35 lightweight floating ambient particles
    const particleCount = Math.min(Math.floor(width / 35), 35);
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.2,
      color: Math.random() > 0.5 ? 'rgba(192, 132, 252, ' : 'rgba(56, 189, 248, ',
    }));

    let frameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(frameId);
          frameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        ctx.fillStyle = `${p.color}${p.alpha * (isDark ? 0.6 : 0.35)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted, isDark]);

  // Fast, hardware-accelerated item reveal variants
  const getItemVariants = (order: number) => ({
    hidden: { 
      opacity: 0, 
      y: 16,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.05 + order * 0.06, 
        duration: 0.45, 
        ease: 'easeOut' as const
      } 
    },
  });

  return (
    <section
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#070913] text-white' : 'bg-[#f8fafc] text-slate-950'
      }`}
      style={{
        minHeight: '100svh',
        contain: 'layout style',
      }}
    >
      {/* ── High-Speed Particle Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none transform-gpu"
        style={{ zIndex: 1, opacity: mounted ? 1 : 0, transition: 'opacity 0.5s' }}
      />

      {/* ══════════════════════════════════
          MAIN CHOREOGRAPHED CONTENT
      ══════════════════════════════════ */}
      <div
        className="relative flex flex-col items-center text-center w-full px-4 max-w-5xl mx-auto transform-gpu z-10"
        style={{ 
          paddingTop: 'max(84px, calc(env(safe-area-inset-top,0px) + 84px))', 
          paddingBottom: 60,
        }}
      >
        {/* 1. College Name & 2. Department Name Badge Container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={getItemVariants(1)}
          className="mb-4"
        >
          <div
            className={`inline-flex flex-col items-center gap-0.5 px-6 py-2.5 rounded-full border transition-all duration-200 ${
              isDark
                ? 'bg-slate-900/90 border-purple-500/30 shadow-lg text-white'
                : 'bg-white border-slate-200 shadow-md text-slate-950'
            }`}
          >
            {/* ITEM 1: College Name */}
            <span 
              className={`text-[10px] sm:text-[12px] font-black tracking-[0.16em] uppercase ${
                isDark ? 'text-slate-200' : 'text-slate-900'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              C. Abdul Hakeem College of Engineering &amp; Technology
            </span>

            {/* ITEM 2: Department Name */}
            <span 
              className={`text-[11px] sm:text-[13px] font-black tracking-[0.16em] uppercase flex items-center gap-1.5 ${
                isDark ? 'text-amber-300' : 'text-[#7c3aed]'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Department of Information Technology
            </span>
          </div>
        </motion.div>

        {/* 3. Title (INFOGRAM) & 4. Year ('26) Row */}
        <div className="relative w-full flex flex-col items-center my-1">
          {/* 3. INFOGRAM Title - CINEMATIC LETTER WAVE REVEAL */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={letterContainerVariants}
            className="relative font-black uppercase tracking-tight leading-none text-center select-none flex items-center justify-center"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 12vw, 8rem)',
            }}
          >
            {titleLetters.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className={`inline-block font-black transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
                style={{
                  color: isDark ? '#ffffff' : '#070913',
                  textShadow: isDark 
                    ? '0 0 25px rgba(192, 132, 252, 0.6), 0 0 55px rgba(56, 189, 248, 0.35)' 
                    : '0 2px 10px rgba(15, 23, 42, 0.12)',
                  willChange: 'transform, opacity, filter',
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* 4. '26 Identity Row */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={getItemVariants(4)}
            className="flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-md -mt-1 sm:-mt-3"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className={`h-[2.5px] flex-1 rounded-full ${
                isDark ? 'bg-amber-400' : 'bg-amber-600'
              }`} 
            />
            
            <span
              className="font-black leading-none select-none tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 12vw, 8rem)',
                color: isDark ? '#fcd34d' : '#d97706',
                textShadow: isDark 
                  ? '0 0 20px rgba(245, 158, 11, 0.6)' 
                  : '0 2px 8px rgba(217, 119, 6, 0.3)',
              }}
            >
              &apos;26
            </span>

            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className={`h-[2.5px] flex-1 rounded-full ${
                isDark ? 'bg-amber-400' : 'bg-amber-600'
              }`} 
            />
          </motion.div>
        </div>

        {/* 5. Tagline */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={getItemVariants(5)}
          className={`text-xs sm:text-base font-black uppercase tracking-[0.22em] mt-3 mb-2 ${
            isDark ? 'text-slate-200' : 'text-slate-900'
          }`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Where Innovation Earns Recognition
        </motion.p>

        {/* 6. Date */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={getItemVariants(6)}
          className="flex items-center gap-2 mb-6"
        >
          <div className="h-[1.5px] w-6 bg-amber-500" />
          <span
            className="text-sm sm:text-lg font-black tracking-wider text-amber-500 uppercase"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            22nd August 2026
          </span>
          <div className="h-[1.5px] w-6 bg-amber-500" />
        </motion.div>

        {/* 7. Countdown */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={getItemVariants(7)}
          className="w-full max-w-md mb-8"
        >
          <div
            className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 ${
              isDark
                ? 'bg-slate-900/90 border-purple-500/30 shadow-xl'
                : 'bg-white border-slate-200 shadow-lg'
            }`}
          >
            <div className="grid grid-cols-4 gap-2 sm:gap-4 items-center text-center">
              {[
                { v: timeLeft.days, l: 'Days' },
                { v: timeLeft.hours, l: 'Hours' },
                { v: timeLeft.minutes, l: 'Mins' },
                { v: timeLeft.seconds, l: 'Secs' },
              ].map(({ v, l }) => (
                <div key={l} className="flex flex-col items-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={v}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`text-xl sm:text-3xl font-black tabular-nums leading-none ${
                        isDark ? 'text-white' : 'text-slate-950'
                      }`}
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {String(v).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                  <span
                    className={`text-[9px] sm:text-xs font-black uppercase tracking-widest mt-1.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-700'
                    }`}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 8. REGISTER NOW & 9. EXPLORE EVENTS Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm sm:max-w-md">
          {/* ITEM 8: REGISTER NOW Button */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={getItemVariants(8)}
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/register"
              className={`
                group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 
                rounded-full font-black text-sm uppercase tracking-wider w-full sm:w-auto
                overflow-hidden transition-all duration-200 select-none cursor-pointer border
                ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white border-white/30 shadow-lg'
                    : 'bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#059669] text-white border-white/40 shadow-md'
                }
              `}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span className="relative z-10">Register Now</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* ITEM 9: EXPLORE EVENTS Button */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={getItemVariants(9)}
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/events"
              className={`
                inline-flex items-center justify-center gap-2 px-8 py-3.5 
                rounded-full font-black text-sm uppercase tracking-wider w-full sm:w-auto
                transition-all duration-200 select-none cursor-pointer border
                ${
                  isDark
                    ? 'bg-slate-900 text-white border-slate-700 hover:bg-slate-800 shadow-md'
                    : 'bg-white text-slate-950 border-slate-300 hover:bg-slate-50 shadow-md font-black'
                }
              `}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span>Explore Events</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        style={{ bottom: 16, zIndex: 10 }}
        animate={{ opacity: [0.4, 0.9, 0.4], y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span 
          className={`text-[9px] uppercase tracking-[0.3em] font-black ${
            isDark ? 'text-slate-400' : 'text-slate-800'
          }`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Scroll
        </span>
        <ChevronDown className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-[#7c3aed]'}`} />
      </motion.div>
    </section>
  );
}
