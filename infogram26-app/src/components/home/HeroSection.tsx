'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles, Zap, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

const titleLetters = ['I', 'N', 'F', 'O', 'G', 'R', 'A', 'M'];

// Cinematic letter entrance — 3D flip + blur + spring
const letterContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -90, scale: 0.6, filter: 'blur(16px)' },
  visible: {
    opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 280, damping: 20 },
  },
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay, duration: 0.6, ease: 'easeOut' as const },
  },
});

const floatingBadge = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.6, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { delay, type: 'spring' as const, stiffness: 400, damping: 22 },
  },
});

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax orbs on mouse move
  const orb1X = useTransform(mouseX, [0, 1], [-30, 30]);
  const orb1Y = useTransform(mouseY, [0, 1], [-20, 20]);
  const orb2X = useTransform(mouseX, [0, 1], [30, -30]);
  const orb2Y = useTransform(mouseY, [0, 1], [20, -20]);

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

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  // High-performance particle canvas
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

    const count = Math.min(Math.floor(width / 28), 50);
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.5 ? 270 : 200, // purple or cyan
    }));

    // Star-like connection lines
    let frameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) { cancelAnimationFrame(frameId); frameId = requestAnimationFrame(render); }
      },
      { threshold: 0.05 }
    );
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);
      const alphaMultiplier = isDark ? 0.7 : 0.3;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.alpha * alphaMultiplier;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        grad.addColorStop(0, `hsla(${p.hue}, 90%, 75%, 1)`);
        grad.addColorStop(1, `hsla(${p.hue}, 90%, 75%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Connection lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 120) * 0.12 * alphaMultiplier;
            ctx.strokeStyle = isDark ? `hsl(${p.hue}, 80%, 70%)` : `hsl(${p.hue}, 60%, 50%)`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
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

  return (
    <section
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-[#04060f] text-white' : 'bg-[#f0f4ff] text-slate-950'
      }`}
      style={{ minHeight: '100svh' }}
    >
      {/* ── ANIMATED GRID BACKGROUND ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: isDark
            ? `linear-gradient(rgba(124,58,237,0.07) 1px, transparent 1px),
               linear-gradient(90deg, rgba(124,58,237,0.07) 1px, transparent 1px)`
            : `linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── MORPHING GRADIENT BLOB 1 (parallax) ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '70vw', height: '70vw',
          top: '-20%', left: '-15%',
          x: orb1X, y: orb1Y,
          background: isDark
            ? 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(56,189,248,0.2) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(99,102,241,0.12) 45%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── MORPHING GRADIENT BLOB 2 (parallax opposite) ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '65vw', height: '65vw',
          bottom: '-20%', right: '-15%',
          x: orb2X, y: orb2Y,
          background: isDark
            ? 'radial-gradient(circle, rgba(16,185,129,0.28) 0%, rgba(56,189,248,0.2) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(99,102,241,0.1) 45%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, -12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* ── CENTER RADIAL GLOW ── */}
      {isDark && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '50vw', height: '50vh',
            top: '50%', left: '50%',
            x: '-50%', y: '-50%',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
            zIndex: 0,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* ── PARTICLE CANVAS ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, opacity: mounted ? 1 : 0, transition: 'opacity 0.8s' }}
      />

      {/* ── FLOATING STAT BADGES (decorative, hidden on small screens) ── */}
      <motion.div
        variants={floatingBadge(1.2)}
        initial="hidden"
        animate="visible"
        style={{ position: 'absolute', top: '22%', left: '6%', zIndex: 5 }}
        className="hidden lg:block"
      >
        <motion.div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-xl text-sm font-black
            ${isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white/90 border-slate-200 text-slate-950'}`}
          style={{ backdropFilter: 'blur(12px)' }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <div className="leading-tight">
            <div className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Prize Pool</div>
            <div className={`font-black text-sm ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>₹50,000+</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={floatingBadge(1.4)}
        initial="hidden"
        animate="visible"
        style={{ position: 'absolute', top: '38%', left: '3%', zIndex: 5 }}
        className="hidden lg:block"
      >
        <motion.div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-xl text-sm font-black
            ${isDark ? 'bg-slate-900/90 border-emerald-500/30 text-white' : 'bg-white/90 border-slate-200 text-slate-950'}`}
          style={{ backdropFilter: 'blur(12px)' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <div className="leading-tight">
            <div className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Participants</div>
            <div className={`font-black text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>500+</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={floatingBadge(1.6)}
        initial="hidden"
        animate="visible"
        style={{ position: 'absolute', top: '22%', right: '6%', zIndex: 5 }}
        className="hidden lg:block"
      >
        <motion.div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-xl text-sm font-black
            ${isDark ? 'bg-slate-900/90 border-cyan-500/30 text-white' : 'bg-white/90 border-slate-200 text-slate-950'}`}
          style={{ backdropFilter: 'blur(12px)' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <div className="leading-tight">
            <div className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Events</div>
            <div className={`font-black text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>20+ Live</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={floatingBadge(1.8)}
        initial="hidden"
        animate="visible"
        style={{ position: 'absolute', top: '40%', right: '4%', zIndex: 5 }}
        className="hidden lg:block"
      >
        <motion.div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-xl
            ${isDark ? 'bg-slate-900/90 border-pink-500/30 text-white' : 'bg-white/90 border-slate-200 text-slate-950'}`}
          style={{ backdropFilter: 'blur(12px)' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <Sparkles className="w-4 h-4 text-pink-400" />
          <div className="leading-tight">
            <div className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>National Level</div>
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
          paddingTop: 'max(100px, calc(env(safe-area-inset-top,0px) + 90px))',
          paddingBottom: 70,
        }}
      >
        {/* ── 1. College + Department Badge ── */}
        <motion.div variants={fadeUp(0.15)} initial="hidden" animate="visible" className="mb-5">
          <div
            className={`inline-flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-full border transition-all ${
              isDark
                ? 'bg-slate-900/80 border-purple-500/40 shadow-lg shadow-purple-900/30'
                : 'bg-white border-slate-200 shadow-md'
            }`}
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <span className={`text-[10px] sm:text-xs font-black tracking-[0.15em] uppercase ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              C. Abdul Hakeem College of Engineering &amp; Technology
            </span>
            <span className={`text-[11px] sm:text-[13px] font-black tracking-[0.15em] uppercase flex items-center gap-1.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>
              <Sparkles className="w-3 h-3 text-amber-400" />
              Department of Information Technology
            </span>
          </div>
        </motion.div>

        {/* ── 2. INFOGRAM — Cinematic 3D Letter Entrance ── */}
        <div className="relative w-full flex flex-col items-center mb-0">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={letterContainerVariants}
            className="relative font-black uppercase leading-none text-center select-none flex items-center justify-center"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 14vw, 9.5rem)',
              perspective: '800px',
            }}
          >
            {titleLetters.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block font-black"
                style={{
                  color: isDark ? '#ffffff' : '#04060f',
                  textShadow: isDark
                    ? '0 0 30px rgba(192,132,252,0.7), 0 0 70px rgba(56,189,248,0.4), 0 4px 20px rgba(0,0,0,0.5)'
                    : '0 2px 12px rgba(124,58,237,0.2), 0 4px 24px rgba(0,0,0,0.1)',
                  willChange: 'transform, opacity, filter',
                  display: 'inline-block',
                }}
                whileHover={{
                  scale: 1.12,
                  color: isDark ? '#c084fc' : '#7c3aed',
                  transition: { type: 'spring', stiffness: 600, damping: 18 },
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* ── '26 Row with animated lines ── */}
          <motion.div
            variants={fadeUp(0.9)}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-md -mt-3 sm:-mt-5"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`h-[3px] flex-1 rounded-full origin-right ${isDark ? 'bg-gradient-to-l from-amber-400 to-transparent' : 'bg-gradient-to-l from-amber-600 to-transparent'}`}
            />
            <motion.span
              className="font-black leading-none select-none tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 14vw, 9.5rem)',
                color: isDark ? '#fcd34d' : '#d97706',
                textShadow: isDark
                  ? '0 0 25px rgba(245,158,11,0.7), 0 0 55px rgba(245,158,11,0.4)'
                  : '0 2px 10px rgba(217,119,6,0.35)',
              }}
              animate={{ textShadow: isDark
                ? ['0 0 25px rgba(245,158,11,0.7)', '0 0 45px rgba(245,158,11,1)', '0 0 25px rgba(245,158,11,0.7)']
                : ['0 2px 10px rgba(217,119,6,0.2)', '0 2px 20px rgba(217,119,6,0.5)', '0 2px 10px rgba(217,119,6,0.2)']
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              &apos;26
            </motion.span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`h-[3px] flex-1 rounded-full origin-left ${isDark ? 'bg-gradient-to-r from-amber-400 to-transparent' : 'bg-gradient-to-r from-amber-600 to-transparent'}`}
            />
          </motion.div>
        </div>

        {/* ── 3. Tagline ── */}
        <motion.p
          variants={fadeUp(1.0)}
          initial="hidden"
          animate="visible"
          className={`text-xs sm:text-base font-black uppercase tracking-[0.25em] mt-4 mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Where Innovation Earns Recognition
        </motion.p>

        {/* ── 4. Event Date ── */}
        <motion.div
          variants={fadeUp(1.1)}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 mb-7"
        >
          <motion.div
            className={`h-[2px] w-8 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`}
            animate={{ scaleX: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span
            className="text-sm sm:text-lg font-black tracking-wider uppercase"
            style={{
              color: isDark ? '#fcd34d' : '#d97706',
              textShadow: isDark ? '0 0 12px rgba(252,211,77,0.5)' : 'none',
              fontFamily: 'var(--font-heading)',
            }}
          >
            22nd August 2026
          </span>
          <motion.div
            className={`h-[2px] w-8 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`}
            animate={{ scaleX: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>

        {/* ── 5. Countdown Timer ── */}
        <motion.div
          variants={fadeUp(1.2)}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm sm:max-w-md mb-8"
        >
          {/* Animated glowing border */}
          <div className="relative">
            <motion.div
              className="absolute -inset-[1.5px] rounded-[26px] pointer-events-none"
              style={{
                background: isDark
                  ? 'conic-gradient(from 0deg, #7c3aed, #06b6d4, #10b981, #7c3aed)'
                  : 'conic-gradient(from 0deg, #7c3aed44, #06b6d444, #10b98144, #7c3aed44)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
            <div
              className={`relative rounded-3xl p-4 sm:p-5 ${
                isDark ? 'bg-[#04060f]' : 'bg-white'
              }`}
            >
              <div className="grid grid-cols-4 gap-2 sm:gap-4 items-center text-center">
                {[
                  { v: timeLeft.days, l: 'Days', color: isDark ? 'text-purple-300' : 'text-purple-600' },
                  { v: timeLeft.hours, l: 'Hours', color: isDark ? 'text-cyan-300' : 'text-cyan-600' },
                  { v: timeLeft.minutes, l: 'Mins', color: isDark ? 'text-emerald-300' : 'text-emerald-600' },
                  { v: timeLeft.seconds, l: 'Secs', color: isDark ? 'text-amber-300' : 'text-amber-600' },
                ].map(({ v, l, color }) => (
                  <div key={l} className="flex flex-col items-center">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={v}
                        initial={{ y: -14, opacity: 0, scale: 0.85 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 14, opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className={`text-2xl sm:text-3xl font-black tabular-nums leading-none ${color}`}
                        style={{ fontFamily: 'var(--font-display)' }}
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

        {/* ── 6. CTA Buttons ── */}
        <motion.div
          variants={fadeUp(1.35)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm sm:max-w-md"
        >
          {/* REGISTER NOW — Gradient glow button */}
          <motion.div
            className="w-full sm:w-auto relative group"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {/* Animated glow ring behind button */}
            <motion.div
              className="absolute -inset-[2px] rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, #7c3aed, #06b6d4, #10b981, #7c3aed)',
                opacity: 0.7,
                filter: 'blur(4px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <Link
              href="/register"
              className="relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider w-full sm:w-auto select-none cursor-pointer overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-500 text-white"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </motion.div>

          {/* EXPLORE EVENTS — Outlined button */}
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              href="/events"
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider w-full sm:w-auto border transition-all duration-200 ${
                isDark
                  ? 'bg-slate-900/80 text-white border-purple-500/40 hover:border-purple-400 shadow-lg shadow-purple-950/30'
                  : 'bg-white text-slate-950 border-slate-300 hover:border-[#7c3aed] shadow-md'
              }`}
              style={{
                WebkitTapHighlightColor: 'transparent',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Explore Events</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Animated Scroll Hint ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
        style={{ bottom: 20, zIndex: 10 }}
        animate={{ opacity: [0.3, 0.9, 0.3], y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className={`text-[9px] uppercase tracking-[0.35em] font-black ${isDark ? 'text-slate-400' : 'text-slate-700'}`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Scroll
        </span>
        <ChevronDown className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-[#7c3aed]'}`} />
      </motion.div>
    </section>
  );
}
