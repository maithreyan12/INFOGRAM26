'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse tracking for subtle 3D parallax physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

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

  // ── CINEMATIC LIQUID PARTICLES & REFRACTION CANVAS ANIMATION ──
  useEffect(() => {
    if (!canvasRef.current || !mounted) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate 60 liquid glass particles
    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#c084fc' : '#38bdf8',
    }));

    const startTime = performance.now();
    let frameId: number;

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h * 0.4;

      ctx.clearRect(0, 0, w, h);

      // Intro Refraction Wave (First 1.5 seconds)
      if (elapsed < 1.5) {
        const progress = elapsed / 1.5;
        const waveRadius = progress * (Math.min(w, h) * 0.45);
        const alpha = (1 - progress) * 0.5;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // Draw floating liquid glass particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (isDark ? 0.6 : 0.3);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [mounted, isDark]);

  // Fast, crisp choreographed reveal for all 9 content items
  const getItemVariants = (order: number) => ({
    hidden: { 
      opacity: 0, 
      y: 24, 
      scale: 0.96,
      filter: 'blur(10px)',
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        delay: 0.15 + order * 0.08, 
        duration: 0.55, 
        ease: [0.22, 1, 0.36, 1] as const
      } 
    },
  });

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ${
        isDark ? 'bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'
      }`}
      style={{
        minHeight: '100svh',
        contain: 'layout style',
      }}
    >
      {/* ── Dynamic Particle Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, opacity: mounted ? 1 : 0, transition: 'opacity 0.8s' }}
      />

      {/* ── Background Ambient Light Mesh ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[750px] h-[450px] rounded-full blur-[140px] transition-all duration-1000 ${
            isDark ? 'bg-purple-900/30 opacity-80' : 'bg-purple-300/35 opacity-70'
          }`}
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 30}px), calc(-50% + ${mousePos.y * 30}px))`,
          }}
        />
        <div 
          className={`absolute top-1/3 left-1/3 w-[55vw] max-w-[550px] h-[350px] rounded-full blur-[130px] transition-all duration-1000 ${
            isDark ? 'bg-cyan-900/20 opacity-70' : 'bg-cyan-200/45 opacity-60'
          }`}
          style={{
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          }}
        />
      </div>

      {/* ══════════════════════════════════
          MAIN CHOREOGRAPHED CONTENT
      ══════════════════════════════════ */}
      <motion.div
        className="relative flex flex-col items-center text-center w-full px-4 max-w-5xl mx-auto"
        style={{ 
          zIndex: 10, 
          paddingTop: 'max(84px, calc(env(safe-area-inset-top,0px) + 84px))', 
          paddingBottom: 60,
          transform: `perspective(1000px) rotateX(${mousePos.y * -4}deg) rotateY(${mousePos.x * 4}deg)`,
          transition: 'transform 0.2s ease-out',
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
            className={`inline-flex flex-col items-center gap-0.5 px-6 py-2.5 rounded-full border transition-all duration-300 ${
              isDark
                ? 'bg-slate-900/85 border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-purple-400/50'
                : 'bg-white/90 border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#7c3aed]/30'
            }`}
            style={{
              backdropFilter: 'blur(24px) saturate(190%)',
              WebkitBackdropFilter: 'blur(24px) saturate(190%)',
            }}
          >
            {/* ITEM 1: College Name */}
            <span 
              className={`text-[9px] sm:text-[11px] font-bold tracking-[0.18em] uppercase ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              C. Abdul Hakeem College of Engineering &amp; Technology
            </span>

            {/* ITEM 2: Department Name */}
            <span 
              className={`text-[10px] sm:text-[12px] font-black tracking-[0.18em] uppercase flex items-center gap-1.5 ${
                isDark ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]' : 'text-[#7c3aed]'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              Department of Information Technology
            </span>
          </div>
        </motion.div>

        {/* 3. Title (INFOGRAM) & 4. Year ('26) Row */}
        <div className="relative w-full flex flex-col items-center my-1">
          {/* 3. INFOGRAM Title */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={getItemVariants(3)}
            className="relative font-black uppercase tracking-tight leading-none text-center select-none"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 12vw, 8rem)',
            }}
          >
            <span
              style={
                isDark
                  ? {
                      background: 'linear-gradient(180deg, #ffffff 0%, #c084fc 50%, #38bdf8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                      display: 'inline-block',
                      filter: 'drop-shadow(0 8px 30px rgba(192,132,252,0.35))',
                    }
                  : {
                      color: '#0f172a',
                      WebkitTextFillColor: '#0f172a',
                      display: 'inline-block',
                      filter: 'drop-shadow(0 2px 10px rgba(15,23,42,0.1))',
                    }
              }
            >
              INFOGRAM
            </span>
          </motion.h1>

          {/* 4. '26 Identity Row */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={getItemVariants(4)}
            className="flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-md -mt-1 sm:-mt-3"
          >
            <div className={`h-[2.5px] flex-1 rounded-full ${
              isDark ? 'bg-gradient-to-r from-transparent via-amber-400 to-amber-300' : 'bg-gradient-to-r from-transparent via-amber-500 to-amber-600'
            }`} />
            
            <span
              className="font-black leading-none select-none tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 12vw, 8rem)',
                color: isDark ? undefined : '#d97706',
                WebkitTextFillColor: isDark ? 'transparent' : '#d97706',
                background: isDark ? 'linear-gradient(180deg, #fef08a 0%, #f59e0b 50%, #b45309 100%)' : 'none',
                WebkitBackgroundClip: isDark ? 'text' : undefined,
                backgroundClip: isDark ? 'text' : undefined,
                filter: isDark ? 'drop-shadow(0 0 16px rgba(245,158,11,0.55))' : 'drop-shadow(0 2px 8px rgba(217,119,6,0.25))',
              }}
            >
              &apos;26
            </span>

            <div className={`h-[2.5px] flex-1 rounded-full ${
              isDark ? 'bg-gradient-to-l from-transparent via-amber-400 to-amber-300' : 'bg-gradient-to-l from-transparent via-amber-500 to-amber-600'
            }`} />
          </motion.div>
        </div>

        {/* 5. Tagline */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={getItemVariants(5)}
          className={`text-xs sm:text-base font-black uppercase tracking-[0.22em] mt-3 mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
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
          <div className="h-[1.5px] w-6 bg-gradient-to-r from-transparent to-amber-500" />
          <span
            className="text-sm sm:text-lg font-black tracking-wider text-amber-500 uppercase"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            22nd August 2026
          </span>
          <div className="h-[1.5px] w-6 bg-gradient-to-l from-transparent to-amber-500" />
        </motion.div>

        {/* 7. Countdown */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={getItemVariants(7)}
          className="w-full max-w-md mb-8"
        >
          <div
            className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 ${
              isDark
                ? 'bg-slate-900/85 border-purple-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]'
                : 'bg-white/90 border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]'
            }`}
            style={{
              backdropFilter: 'blur(28px) saturate(190%)',
              WebkitBackdropFilter: 'blur(28px) saturate(190%)',
            }}
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
                      initial={{ y: -14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 14, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className={`text-xl sm:text-3xl font-black tabular-nums leading-none ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {String(v).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                  <span
                    className={`text-[9px] sm:text-xs font-black uppercase tracking-widest mt-1.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
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
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/register"
              className={`
                group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 
                rounded-full font-black text-sm uppercase tracking-wider w-full sm:w-auto
                overflow-hidden transition-all duration-300 select-none cursor-pointer border
                ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white border-white/30 shadow-[0_8px_30px_rgba(124,58,237,0.45),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_12px_45px_rgba(124,58,237,0.6)]'
                    : 'bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#059669] text-white border-white/40 shadow-[0_8px_30px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_12px_40px_rgba(124,58,237,0.5)]'
                }
              `}
              style={{
                backdropFilter: 'blur(28px) saturate(190%)',
                WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-0">
                <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] transition-all duration-700 ease-out group-hover:left-[100%]" />
              </span>
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
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/events"
              className={`
                inline-flex items-center justify-center gap-2 px-8 py-3.5 
                rounded-full font-black text-sm uppercase tracking-wider w-full sm:w-auto
                transition-all duration-300 select-none cursor-pointer border
                ${
                  isDark
                    ? 'bg-slate-900/80 text-white border-slate-700/80 hover:bg-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'bg-white/90 text-slate-900 border-slate-300 hover:bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]'
                }
              `}
              style={{
                backdropFilter: 'blur(28px) saturate(190%)',
                WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span>Explore Events</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        style={{ bottom: 16, zIndex: 10 }}
        animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span 
          className={`text-[8px] uppercase tracking-[0.3em] font-black ${
            isDark ? 'text-slate-400' : 'text-slate-600'
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
