'use client';

import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    setMounted(true);
    const targetDate = new Date('2026-08-22T00:00:00').getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const d = targetDate - now;
      if (d < 0) { clearInterval(interval); return; }
      setTimeLeft({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        minutes: Math.floor((d % 3600000) / 60000),
        seconds: Math.floor((d % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 200, damping: 22 } },
  };

  const CountUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -20, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative"
      >
        <span
          className="text-3xl xs:text-4xl sm:text-5xl font-black tabular-nums"
          style={{
            fontFamily: 'var(--font-display)',
            color: '#00d4ff',
            textShadow: '0 0 30px rgba(0,212,255,0.7), 0 0 60px rgba(0,212,255,0.3)',
          }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </motion.div>
      <span
        className="text-[8px] xs:text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1 font-medium"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden z-10 tech-grid"
      style={{ paddingTop: 'max(72px, env(safe-area-inset-top, 0px) + 72px)' }}
    >
      {/* ── Deep glow orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '70vw', height: '70vw', maxWidth: 600, maxHeight: 600,
            top: '5%', left: '50%', x: '-50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, rgba(0,180,220,0.08) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '50vw', height: '50vw', maxWidth: 400,
            bottom: '10%', right: '-10%',
            background: 'radial-gradient(circle, rgba(0,100,200,0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      {/* ── Animated scan line ── */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }}
        animate={{ top: ['10%', '90%', '10%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Particles ── */}
      {mounted && [
        { top: '12%', left: '8%', delay: '0s', dur: '7s', size: 3 },
        { top: '22%', right: '12%', delay: '1.5s', dur: '9s', size: 2 },
        { top: '65%', left: '18%', delay: '3s', dur: '6s', size: 4 },
        { top: '72%', right: '22%', delay: '4.5s', dur: '8s', size: 2 },
        { top: '38%', left: '48%', delay: '2s', dur: '10s', size: 3 },
        { top: '85%', left: '35%', delay: '5s', dur: '7.5s', size: 2 },
        { top: '8%', right: '38%', delay: '6s', dur: '8.5s', size: 3 },
        { top: '50%', left: '5%', delay: '3.5s', dur: '9s', size: 2 },
        { top: '30%', right: '5%', delay: '7s', dur: '6.5s', size: 3 },
      ].map((p, i) => (
        <div
          key={i}
          className="particle absolute rounded-full"
          style={{
            top: p.top, left: (p as any).left, right: (p as any).right,
            width: p.size, height: p.size,
            background: 'rgba(0, 212, 255, 0.8)',
            boxShadow: '0 0 6px rgba(0,212,255,0.8)',
            animationDelay: p.delay, animationDuration: p.dur,
          }}
        />
      ))}

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 w-full flex flex-col items-center text-center px-4"
        style={{ y: titleY, opacity: titleOpacity }}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* College badge */}
        <motion.div variants={item} className="mb-5">
          <div
            className="inline-flex flex-col items-center gap-1 px-5 py-2 rounded-full"
            style={{
              background: 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.2)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span
              className="text-[9px] xs:text-[10px] text-white/50 tracking-[0.2em] uppercase"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              C. Abdul Hakeem College of Engineering &amp; Technology
            </span>
            <span
              className="text-[11px] xs:text-xs font-bold tracking-[0.15em] uppercase"
              style={{ fontFamily: 'var(--font-heading)', color: '#00d4ff' }}
            >
              Department of Information Technology
            </span>
          </div>
        </motion.div>

        {/* ══ MASSIVE INFOGRAM'26 TITLE ══ */}
        <motion.div variants={item} className="relative w-full mb-3">
          {/* Glow behind text */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,255,0.15) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* INFOGRAM */}
          <motion.h1
            className="relative gradient-text-animated font-black uppercase leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.2rem, 18vw, 10rem)',
              letterSpacing: '-0.02em',
              textShadow: '0 0 80px rgba(0,212,255,0.5), 0 4px 30px rgba(0,0,0,0.8)',
              lineHeight: 0.9,
            }}
            animate={{
              textShadow: [
                '0 0 40px rgba(0,212,255,0.4), 0 4px 30px rgba(0,0,0,0.8)',
                '0 0 90px rgba(0,212,255,0.7), 0 0 120px rgba(0,212,255,0.3), 0 4px 30px rgba(0,0,0,0.8)',
                '0 0 40px rgba(0,212,255,0.4), 0 4px 30px rgba(0,0,0,0.8)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            INFOGRAM
          </motion.h1>

          {/* '26 — separate line, extra punch */}
          <motion.div
            className="relative flex items-center justify-center gap-2 xs:gap-4"
            style={{ marginTop: '-4px' }}
          >
            <motion.div
              className="h-px flex-1 max-w-[60px] xs:max-w-[100px]"
              style={{ background: 'linear-gradient(90deg, transparent, #ffd700)' }}
              animate={{ opacity: [0.5, 1, 0.5], scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <span
              className="font-black gradient-text-animated"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.2rem, 18vw, 10rem)',
                letterSpacing: '-0.02em',
                lineHeight: 0.9,
                textShadow: '0 0 60px rgba(255,215,0,0.5)',
              }}
            >
              &apos;26
            </span>
            <motion.div
              className="h-px flex-1 max-w-[60px] xs:max-w-[100px]"
              style={{ background: 'linear-gradient(90deg, #ffd700, transparent)' }}
              animate={{ opacity: [0.5, 1, 0.5], scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="text-sm xs:text-base sm:text-xl text-white/70 tracking-[0.12em] uppercase mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Where Innovation Earns Recognition
        </motion.p>

        {/* Date */}
        <motion.div variants={item} className="flex items-center gap-3 mb-8">
          <div className="h-px w-10 sm:w-16" style={{ background: 'linear-gradient(90deg, transparent, #ffd700)' }} />
          <motion.span
            className="text-xl xs:text-2xl sm:text-3xl font-black"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#ffd700',
              textShadow: '0 0 30px rgba(255,215,0,0.6)',
              letterSpacing: '0.05em',
            }}
            animate={{ textShadow: ['0 0 20px rgba(255,215,0,0.4)', '0 0 50px rgba(255,215,0,0.8)', '0 0 20px rgba(255,215,0,0.4)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            22nd August 2026
          </motion.span>
          <div className="h-px w-10 sm:w-16" style={{ background: 'linear-gradient(90deg, #ffd700, transparent)' }} />
        </motion.div>

        {/* ══ Countdown ══ */}
        <motion.div
          variants={item}
          className="w-full max-w-sm xs:max-w-md mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(0,100,200,0.04))',
            border: '1px solid rgba(0,212,255,0.2)',
            borderTop: '1px solid rgba(0,212,255,0.4)',
            borderRadius: 20,
            backdropFilter: 'blur(24px)',
            padding: '20px 24px',
            boxShadow: '0 0 40px rgba(0,212,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Corner accents */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-4 h-4" style={{ borderTop: '2px solid #00d4ff', borderLeft: '2px solid #00d4ff' }} />
            <div className="absolute -top-3 -right-3 w-4 h-4" style={{ borderTop: '2px solid #00d4ff', borderRight: '2px solid #00d4ff' }} />
            <div className="absolute -bottom-3 -left-3 w-4 h-4" style={{ borderBottom: '2px solid #ffd700', borderLeft: '2px solid #ffd700' }} />
            <div className="absolute -bottom-3 -right-3 w-4 h-4" style={{ borderBottom: '2px solid #ffd700', borderRight: '2px solid #ffd700' }} />

            <div className="flex items-center justify-around gap-2">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' },
              ].map((u, i) => (
                <div key={u.label} className="flex items-center gap-2 xs:gap-3">
                  <CountUnit value={u.value} label={u.label} />
                  {i < 3 && (
                    <motion.span
                      className="text-2xl xs:text-3xl font-bold mb-4"
                      style={{ color: 'rgba(0,212,255,0.5)', fontFamily: 'var(--font-display)' }}
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      :
                    </motion.span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══ CTA Buttons ══ */}
        <motion.div variants={item} className="flex flex-col xs:flex-row gap-3 xs:gap-4 w-full max-w-xs xs:max-w-sm">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Link
              href="/register"
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', WebkitTapHighlightColor: 'transparent' }}
            >
              Register Now
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Link
              href="/events"
              className="btn-glass w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', WebkitTapHighlightColor: 'transparent' }}
            >
              Explore Events
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ opacity: [0.4, 0.9, 0.4], y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[9px] text-white/30 uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Scroll</span>
        <ChevronDown size={22} className="text-[#00d4ff]/50" />
      </motion.div>
    </section>
  );
}
