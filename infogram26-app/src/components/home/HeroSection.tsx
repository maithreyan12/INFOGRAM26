'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [introFinished, setIntroFinished] = useState(false);

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

  // ── CINEMATIC LIQUID GLASS INTRO ANIMATION & FLUID CANVAS ──
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

    const startTime = performance.now();
    let frameId: number;

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000; // seconds
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h * 0.4;

      ctx.clearRect(0, 0, w, h);

      if (elapsed < 1.2) {
        // Phase 1: Point of light expanding into liquid glass sphere
        const progress = Math.min(elapsed / 1.2, 1);
        const radius = 4 + progress * (Math.min(w, h) * 0.28);
        const glowAlpha = Math.sin(progress * Math.PI) * 0.85;

        // Inner liquid glass refraction gradient
        const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        radGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * glowAlpha})`);
        radGrad.addColorStop(0.3, `rgba(168, 85, 247, ${0.6 * glowAlpha})`);
        radGrad.addColorStop(0.7, `rgba(56, 189, 248, ${0.4 * glowAlpha})`);
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (elapsed < 2.5) {
        // Phase 2: Fluid glass morphing into flowing ribbons
        const ribbonProgress = (elapsed - 1.2) / 1.3;
        const waveCount = 5;

        for (let i = 0; i < waveCount; i++) {
          ctx.save();
          ctx.beginPath();
          const offset = i * 0.4;
          const yPos = cy + Math.sin(ribbonProgress * Math.PI * 2 + offset) * 40;

          ctx.moveTo(0, yPos);
          for (let x = 0; x <= w; x += 30) {
            const waveY = yPos + Math.sin(x * 0.008 + ribbonProgress * 4 + offset) * 35;
            ctx.lineTo(x, waveY);
          }

          const alpha = (1 - ribbonProgress) * 0.4;
          const colors = [
            `rgba(192, 132, 252, ${alpha})`,
            `rgba(56, 189, 248, ${alpha})`,
            `rgba(234, 179, 8, ${alpha * 0.7})`,
            `rgba(124, 58, 237, ${alpha})`,
            `rgba(52, 211, 153, ${alpha})`
          ];

          ctx.strokeStyle = colors[i % colors.length];
          ctx.lineWidth = 3 + i * 2;
          ctx.stroke();
          ctx.restore();
        }
      } else if (!introFinished) {
        setIntroFinished(true);
      }

      // Continuous ambient fluid glass particle aura
      if (elapsed >= 2.0) {
        const time = elapsed * 0.5;
        const count = 30;
        for (let i = 0; i < count; i++) {
          const px = cx + Math.cos(time + i) * (120 + i * 8);
          const py = cy + Math.sin(time * 1.2 + i * 1.5) * (60 + i * 4);
          const size = 1.5 + (i % 3);
          const pAlpha = 0.2 + Math.sin(time * 2 + i) * 0.15;

          ctx.fillStyle = i % 4 === 0 
            ? `rgba(234, 179, 8, ${pAlpha})` 
            : `rgba(168, 85, 247, ${pAlpha})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [mounted, introFinished]);

  // Choreographed reveal timing for the 9 content items
  const getItemVariants = (order: number) => ({
    hidden: { 
      opacity: 0, 
      y: 35, 
      scale: 0.94,
      filter: 'blur(16px)',
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        delay: 2.2 + order * 0.18, 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1] as const
      } 
    },
  });

  return (
    <section
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ${
        isDark ? 'bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'
      }`}
      style={{
        minHeight: '100svh',
        contain: 'layout style',
      }}
    >
      {/* ── Fluid Intro & Ambient Glass Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, opacity: mounted ? 1 : 0, transition: 'opacity 1s' }}
      />

      {/* ── Subtle Background Mesh Glow ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[800px] h-[500px] rounded-full blur-[140px] transition-opacity duration-1000 ${
            isDark ? 'bg-purple-900/25 opacity-70' : 'bg-purple-300/30 opacity-60'
          }`}
        />
        <div 
          className={`absolute top-1/3 left-1/3 w-[60vw] max-w-[600px] h-[400px] rounded-full blur-[130px] transition-opacity duration-1000 ${
            isDark ? 'bg-cyan-900/20 opacity-60' : 'bg-cyan-200/40 opacity-50'
          }`}
        />
      </div>

      {/* ══════════════════════════════════
          MAIN CHOREOGRAPHED CONTENT
      ══════════════════════════════════ */}
      <div
        className="relative flex flex-col items-center text-center w-full px-4 max-w-5xl mx-auto"
        style={{ zIndex: 10, paddingTop: 'max(84px, calc(env(safe-area-inset-top,0px) + 84px))', paddingBottom: 60 }}
      >
        {/* 1. College Name & 2. Department Name Badge Container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={getItemVariants(1)}
          className="mb-4"
        >
          <div
            className={`inline-flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-full border transition-all duration-300 ${
              isDark
                ? 'bg-slate-900/80 border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]'
                : 'bg-white/80 border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]'
            }`}
            style={{
              backdropFilter: 'blur(24px) saturate(190%)',
              WebkitBackdropFilter: 'blur(24px) saturate(190%)',
            }}
          >
            {/* ITEM 1: College Name */}
            <span 
              className={`text-[9px] sm:text-[11px] font-bold tracking-[0.18em] uppercase ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              C. Abdul Hakeem College of Engineering &amp; Technology
            </span>

            {/* ITEM 2: Department Name */}
            <span 
              className={`text-[10px] sm:text-[12px] font-extrabold tracking-[0.18em] uppercase ${
                isDark ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]' : 'text-[#7c3aed]'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
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
              background: isDark
                ? 'linear-gradient(180deg, #ffffff 0%, #c084fc 50%, #38bdf8 100%)'
                : 'linear-gradient(180deg, #0f172a 0%, #6d28d9 55%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: isDark 
                ? 'drop-shadow(0 8px 30px rgba(192,132,252,0.35))'
                : 'drop-shadow(0 4px 20px rgba(124,58,237,0.15))',
            }}
          >
            INFOGRAM
          </motion.h1>

          {/* 4. '26 Identity Row */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={getItemVariants(4)}
            className="flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-md -mt-1 sm:-mt-3"
          >
            <div className={`h-[2px] flex-1 rounded-full ${
              isDark ? 'bg-gradient-to-r from-transparent via-amber-400 to-amber-300' : 'bg-gradient-to-r from-transparent to-[#7c3aed]'
            }`} />
            
            <span
              className="font-black leading-none select-none tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 12vw, 8rem)',
                background: 'linear-gradient(180deg, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 16px rgba(245,158,11,0.55))',
              }}
            >
              &apos;26
            </span>

            <div className={`h-[2px] flex-1 rounded-full ${
              isDark ? 'bg-gradient-to-l from-transparent via-amber-400 to-amber-300' : 'bg-gradient-to-l from-transparent to-[#7c3aed]'
            }`} />
          </motion.div>
        </div>

        {/* 5. Tagline */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={getItemVariants(5)}
          className={`text-xs sm:text-base font-bold uppercase tracking-[0.22em] mt-3 mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
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
                ? 'bg-slate-900/80 border-purple-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]'
                : 'bg-white/80 border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]'
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
                    className={`text-[9px] sm:text-xs font-bold uppercase tracking-widest mt-1.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
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
          >
            <Link
              href="/register"
              className={`
                group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 
                rounded-full font-extrabold text-sm uppercase tracking-wider w-full sm:w-auto
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
          >
            <Link
              href="/events"
              className={`
                inline-flex items-center justify-center gap-2 px-8 py-3.5 
                rounded-full font-bold text-sm uppercase tracking-wider w-full sm:w-auto
                transition-all duration-300 select-none cursor-pointer border
                ${
                  isDark
                    ? 'bg-slate-900/80 text-white border-slate-700/80 hover:bg-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'bg-white/80 text-slate-900 border-slate-200 hover:bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]'
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
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        style={{ bottom: 16, zIndex: 10 }}
        animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span 
          className={`text-[8px] uppercase tracking-[0.3em] font-bold ${
            isDark ? 'text-slate-400' : 'text-slate-500'
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
