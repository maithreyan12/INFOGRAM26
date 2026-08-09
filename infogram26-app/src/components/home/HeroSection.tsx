'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
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

  // ── Canvas particle system (GPU-accelerated, zero React re-renders) ──
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

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; gold: boolean; life: number; maxLife: number };
    const particles: Particle[] = [];
    const MAX = 40;

    const spawn = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.38;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.8;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2,
        gold: Math.random() < 0.25,
        life: 0,
        maxLife: 100 + Math.random() * 120,
      });
    };

    let frameId: number;
    let frame = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (frame % 4 === 0 && particles.length < MAX) spawn();
      frame++;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.003;
        p.life++;
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }

        const alpha = p.life < 20
          ? p.life / 20
          : 1 - (p.life - 20) / (p.maxLife - 20);
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = p.gold ? '#d97706' : '#7c3aed';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [mounted]);

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] },
  });

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        minHeight: '100svh',
        background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(192,132,252,0.28) 0%, rgba(52,211,153,0.18) 50%, #f6f8fc 90%)',
        contain: 'layout style',
      }}
    >
      {/* ── Canvas particles (zero-overhead) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, opacity: mounted ? 1 : 0, transition: 'opacity 1s' }}
      />

      {/* ── Animated scan line ── */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(124,58,237,0.35),transparent)',
          zIndex: 2,
        }}
        animate={{ top: ['5%', '95%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
      />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.4) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.04,
          zIndex: 0,
        }}
      />

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div
        className="relative flex flex-col items-center text-center w-full px-3"
        style={{ zIndex: 10, paddingTop: 'max(72px, calc(env(safe-area-inset-top,0px) + 72px))', paddingBottom: 52 }}
      >
        {/* ── College badge ── */}
        <motion.div {...stagger(0)} className="mb-3">
          <div
            style={{
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '6px 16px', borderRadius: 100,
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: '0 4px 20px rgba(15,23,42,0.05)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 8.5, color: '#475569', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
              C. Abdul Hakeem College of Engineering &amp; Technology
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 10, color: '#7c3aed', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 800 }}>
              Department of Information Technology
            </span>
          </div>
        </motion.div>

        {/* ══ INFOGRAM — forced single line ══ */}
        <motion.div
          {...stagger(1)}
          className="relative w-full flex flex-col items-center"
          style={{ marginBottom: 0 }}
        >
          {/* Glow behind */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: 0,
              background: 'radial-gradient(ellipse 90% 100% at 50% 50%, rgba(124,58,237,0.18) 0%, transparent 65%)',
              filter: 'blur(20px)',
            }}
          />

          {/* INFOGRAM — single line FORCED */}
          <motion.h1
            className="relative font-black uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              /* Use vw so it always fits — tested: 11vw * 8chars in Orbitron fits 360px+ screens */
              fontSize: 'clamp(2.1rem, 11.5vw, 7.5rem)',
              letterSpacing: '-0.01em',
              lineHeight: 1,
              whiteSpace: 'nowrap',           /* ← forces single line */
              background: 'linear-gradient(180deg,#0f172a 0%,#6d28d9 55%,#059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 4px 25px rgba(124,58,237,0.2)',
              transform: 'translateZ(0)',      /* GPU layer */
            }}
          >
            INFOGRAM
          </motion.h1>

          {/* '26 row with gold dividers */}
          <div className="flex items-center justify-center gap-3 w-full" style={{ marginTop: 2 }}>
            <motion.div
              style={{ height: 2, flex: 1, maxWidth: 80, background: 'linear-gradient(90deg,transparent,#ffd700)', borderRadius: 100, transformOrigin: 'right' }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
            <motion.span
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65, duration: 0.6, type: 'spring', stiffness: 200 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.1rem, 11.5vw, 7.5rem)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.01em',
                background: 'linear-gradient(180deg,#ffe566 0%,#ffd700 50%,#cc9900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.6))',
              }}
            >
              &apos;26
            </motion.span>
            <motion.div
              style={{ height: 2, flex: 1, maxWidth: 80, background: 'linear-gradient(90deg,#ffd700,transparent)', borderRadius: 100, transformOrigin: 'left' }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p {...stagger(2)} style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(0.58rem, 2.8vw, 0.85rem)',
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginTop: 8, marginBottom: 4,
        }}>
          Where Innovation Earns Recognition
        </motion.p>

        {/* Date */}
        <motion.div {...stagger(3)} className="flex items-center gap-2" style={{ marginBottom: 10 }}>
          <div style={{ height: 1, width: 24, background: 'linear-gradient(90deg,transparent,rgba(255,215,0,0.8))' }} />
          <motion.span
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(0.85rem, 4.2vw, 1.3rem)', fontWeight: 900, color: '#ffd700', letterSpacing: '0.06em' }}
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            22nd August 2026
          </motion.span>
          <div style={{ height: 1, width: 24, background: 'linear-gradient(90deg,rgba(255,215,0,0.8),transparent)' }} />
        </motion.div>

        {/* ══ COUNTDOWN ══ */}
        <motion.div
          {...stagger(4)}
          style={{ width: '100%', maxWidth: 340, marginBottom: 10 }}
        >
          <div style={{
            background: 'linear-gradient(135deg,rgba(0,212,255,0.07),rgba(0,0,0,0.55))',
            border: '1px solid rgba(0,212,255,0.28)',
            borderTop: '1px solid rgba(0,212,255,0.55)',
            borderRadius: 14,
            padding: '10px 8px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            position: 'relative',
            boxShadow: '0 6px 30px rgba(0,0,0,0.4)',
            transform: 'translateZ(0)',
          }}>
            {/* Corner marks */}
            {[
              { top: 5, left: 5, borderTop: '1.5px solid #00d4ff', borderLeft: '1.5px solid #00d4ff' },
              { top: 5, right: 5, borderTop: '1.5px solid #00d4ff', borderRight: '1.5px solid #00d4ff' },
              { bottom: 5, left: 5, borderBottom: '1.5px solid #ffd700', borderLeft: '1.5px solid #ffd700' },
              { bottom: 5, right: 5, borderBottom: '1.5px solid #ffd700', borderRight: '1.5px solid #ffd700' },
            ].map((s, i) => <div key={i} className="absolute" style={{ ...s, width: 10, height: 10 }} />)}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              {[
                { v: timeLeft.days, l: 'Days' },
                { v: timeLeft.hours, l: 'Hours' },
                { v: timeLeft.minutes, l: 'Mins' },
                { v: timeLeft.seconds, l: 'Secs' },
              ].map(({ v, l }, i) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50 }}>
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={v}
                        initial={{ y: -18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 18, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.2rem, 6vw, 2rem)',
                          fontWeight: 900,
                          color: '#00d4ff',
                          textShadow: '0 0 20px rgba(0,212,255,0.7)',
                          lineHeight: 1,
                          display: 'block',
                          transform: 'translateZ(0)',
                        }}
                      >
                        {String(v).padStart(2, '0')}
                      </motion.span>
                    </AnimatePresence>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 3 }}>
                      {l}
                    </span>
                  </div>
                  {i < 3 && (
                    <motion.span
                      style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'rgba(0,212,255,0.4)', marginBottom: 10, marginLeft: 1, marginRight: 1, display: 'block' }}
                      animate={{ opacity: [1, 0.15, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >:</motion.span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══ CTA BUTTONS ══ */}
        <motion.div
          {...stagger(5)}
          style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 300 }}
        >
          {/* Register Now */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            style={{ transform: 'translateZ(0)' }}
          >
            <Link
              href="/register"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '13px 24px',
                borderRadius: 13,
                background: 'linear-gradient(135deg,#00d4ff 0%,#0097c7 50%,#005b8e 100%)',
                border: '1px solid rgba(100,240,255,0.45)',
                borderTop: '1px solid rgba(180,255,255,0.6)',
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(0,212,255,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none' as const,
                transform: 'translateZ(0)',
              }}
            >
              <span style={{ color: '#ffffff', fontWeight: 800 }}>Register Now</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'flex', alignItems: 'center', color: '#ffffff' }}
              >
                <ArrowRight size={16} color="#ffffff" />
              </motion.span>
            </Link>
          </motion.div>

          {/* Explore Events */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            style={{ transform: 'translateZ(0)' }}
          >
            <Link
              href="/events"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
                borderRadius: 13,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderTop: '1px solid rgba(255,255,255,0.24)',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-heading)',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                textDecoration: 'none',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none' as const,
                transform: 'translateZ(0)',
              }}
            >
              Explore Events
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        style={{ bottom: 12, zIndex: 10 }}
        animate={{ opacity: [0.2, 0.7, 0.2], y: [0, 5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 7, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <ChevronDown size={16} color="rgba(0,212,255,0.35)" />
      </motion.div>
    </section>
  );
}
