'use client';

import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// ── Letter blast animation: each char flies in from random direction ──
const TITLE = 'INFOGRAM';
const YEAR = "'26";

function BlastLetter({ char, index, total }: { char: string; index: number; total: number }) {
  const angle = (index / total) * 360;
  const rad = (angle * Math.PI) / 180;
  const dist = 300 + Math.random() * 200;
  const fromX = Math.cos(rad) * dist;
  const fromY = Math.sin(rad) * dist;

  return (
    <motion.span
      initial={{ x: fromX, y: fromY, opacity: 0, scale: 0, rotate: angle * 2, filter: 'blur(20px)' }}
      animate={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
      transition={{
        delay: 0.1 + index * 0.06,
        duration: 0.9,
        type: 'spring',
        stiffness: 120,
        damping: 14,
      }}
      style={{
        willChange: 'transform',
        display: 'inline-block',
        background: 'linear-gradient(180deg, #ffffff 0%, #00d4ff 65%, #0097c7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {char}
    </motion.span>
  );
}


// ── Shockwave ring ──
function ShockwaveRing({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        top: '50%', left: '50%',
        width: 40, height: 40,
        marginLeft: -20, marginTop: -20,
        border: '2px solid rgba(0,212,255,0.8)',
        boxShadow: '0 0 20px rgba(0,212,255,0.5)',
      }}
      animate={{
        scale: [0, 8, 14],
        opacity: [1, 0.4, 0],
      }}
      transition={{
        delay,
        duration: 1.8,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 4,
      }}
    />
  );
}

// ── Explosion particle burst ──
function ExplosionParticle({ index }: { index: number }) {
  const angle = (index / 24) * 360;
  const rad = (angle * Math.PI) / 180;
  const dist = 80 + Math.random() * 120;
  const isGold = index % 4 === 0;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        top: '38%', left: '50%',
        width: isGold ? 4 : 3,
        height: isGold ? 4 : 3,
        marginLeft: -2, marginTop: -2,
        background: isGold ? '#ffd700' : '#00d4ff',
        boxShadow: isGold
          ? '0 0 8px rgba(255,215,0,1)'
          : '0 0 8px rgba(0,212,255,1)',
      }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: [0, Math.cos(rad) * dist * 0.5, Math.cos(rad) * dist],
        y: [0, Math.sin(rad) * dist * 0.5, Math.sin(rad) * dist],
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        delay: 0.3 + index * 0.012,
        duration: 1.2,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 5 + Math.random() * 2,
      }}
    />
  );
}

// ── Floating ambient particle ──
function AmbientParticle({ top, left, right, width, height, background, boxShadow, duration, delay }: {
  top?: string; left?: string; right?: string; width: number; height: number;
  background: string; boxShadow: string; duration: number; delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ top, left, right, width, height, background, boxShadow, position: 'absolute' }}
      animate={{ y: [0, -25, 0], opacity: [0, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [glitch, setGlitch] = useState(false);

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

    // Random glitch trigger
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 5000);

    return () => { clearInterval(id); clearInterval(glitchInterval); };
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100svh', background: '#020810' }}>

      {/* ── Deep space background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '100vw', height: '100vw', maxWidth: 700, maxHeight: 700,
            top: '-20%', left: '50%', x: '-50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.22) 0%, rgba(0,100,200,0.1) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Secondary gold glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '80vw', height: '80vw', maxWidth: 500,
            bottom: '-10%', right: '-20%',
            background: 'radial-gradient(circle, rgba(255,180,0,0.12) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Horizon line */}
        <div
          className="absolute"
          style={{
            bottom: '28%', left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.3) 20%, rgba(0,212,255,0.6) 50%, rgba(0,212,255,0.3) 80%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Shockwave rings ── */}
      <ShockwaveRing delay={0.4} />
      <ShockwaveRing delay={1.0} />
      <ShockwaveRing delay={1.6} />

      {/* ── Explosion particles ── */}
      {mounted && [...Array(24)].map((_, i) => <ExplosionParticle key={i} index={i} />)}

      {/* ── Ambient floating particles ── */}
      {mounted && [
        { top: '15%', left: '8%', width: 3, height: 3, background: '#00d4ff', boxShadow: '0 0 8px #00d4ff', duration: 7, delay: 0 },
        { top: '20%', right: '10%', width: 2, height: 2, background: '#ffd700', boxShadow: '0 0 6px #ffd700', duration: 5, delay: 1 },
        { top: '70%', left: '12%', width: 2, height: 2, background: '#00d4ff', boxShadow: '0 0 6px #00d4ff', duration: 9, delay: 2 },
        { top: '75%', right: '15%', width: 3, height: 3, background: '#ffd700', boxShadow: '0 0 8px #ffd700', duration: 6, delay: 3 },
        { top: '45%', left: '3%', width: 2, height: 2, background: '#00d4ff', boxShadow: '0 0 6px #00d4ff', duration: 8, delay: 1.5 },
        { top: '55%', right: '5%', width: 2, height: 2, background: '#00d4ff', boxShadow: '0 0 6px #00d4ff', duration: 7, delay: 4 },
        { top: '85%', left: '40%', width: 3, height: 3, background: '#ffd700', boxShadow: '0 0 10px #ffd700', duration: 6, delay: 2.5 },
        { top: '10%', left: '45%', width: 2, height: 2, background: '#00d4ff', boxShadow: '0 0 6px #00d4ff', duration: 10, delay: 0.5 },
      ].map((p, i) => <AmbientParticle key={`amb-${i}`} {...p} />)}


      {/* ── Scan line sweep ── */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none z-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1.5 }}
      />

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div className="relative z-10 w-full flex flex-col items-center text-center px-4"
        style={{ paddingTop: 'max(70px, calc(env(safe-area-inset-top, 0px) + 70px))', paddingBottom: 60 }}>

        {/* College badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-2"
        >
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 1,
            padding: '5px 14px', borderRadius: 100,
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(0,212,255,0.2)',
            backdropFilter: 'blur(16px)',
          }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              C. Abdul Hakeem College of Engineering &amp; Technology
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 9.5, color: '#00d4ff', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
              Department of Information Technology
            </span>
          </div>
        </motion.div>

        {/* ══ BLAST TITLE: INFOGRAM ══ */}
        <div className="relative mb-0 w-full flex flex-col items-center">
          {/* Title glow bg */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '100%', height: '120%', top: '-10%',
              background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,212,255,0.2) 0%, transparent 65%)',
              filter: 'blur(20px)',
            }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <h1
            className={`relative font-black uppercase ${glitch ? 'glitch-effect' : ''}`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 16vw, 9rem)',
              letterSpacing: '-0.02em',
              lineHeight: 0.88,
              color: 'transparent',
              filter: glitch ? 'hue-rotate(90deg)' : 'none',
              transition: 'filter 0.05s',
            }}
          >
            {TITLE.split('').map((char, i) => (
              <BlastLetter key={i} char={char} index={i} total={TITLE.length} />
            ))}
          </h1>

          {/* '26 with gold */}
          <div className="flex items-center justify-center gap-2 xs:gap-4 w-full" style={{ marginTop: -6 }}>
            <motion.div
              style={{ height: 2, flex: 1, maxWidth: 90, background: 'linear-gradient(90deg, transparent, #ffd700)', borderRadius: 100 }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
            />
            <motion.span
              initial={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.85, duration: 0.9, type: 'spring', stiffness: 120, damping: 14 }}
              className="font-black"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 16vw, 9rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(180deg, #ffe566 0%, #ffd700 50%, #cc9900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {YEAR}
            </motion.span>
            <motion.div
              style={{ height: 2, flex: 1, maxWidth: 90, background: 'linear-gradient(90deg, #ffd700, transparent)', borderRadius: 100 }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-1 mb-1"
        >
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(0.6rem, 2.8vw, 0.85rem)',
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            Where Innovation Earns Recognition
          </p>
        </motion.div>

        {/* Date with pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
          className="flex items-center gap-2 mt-1 mb-3"
        >
          <div style={{ height: 1, width: 28, background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.8))' }} />
          <motion.span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(0.9rem, 4.5vw, 1.4rem)',
              fontWeight: 900,
              color: '#ffd700',
              letterSpacing: '0.06em',
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            22nd August 2026
          </motion.span>
          <div style={{ height: 1, width: 28, background: 'linear-gradient(90deg, rgba(255,215,0,0.8), transparent)' }} />
        </motion.div>

        {/* ══ PREMIUM COUNTDOWN ══ */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.3, type: 'spring', stiffness: 150, damping: 18 }}
          className="w-full mb-3"
          style={{ maxWidth: 340 }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.07) 0%, rgba(0,0,0,0.5) 100%)',
            border: '1px solid rgba(0,212,255,0.25)',
            borderTop: '1px solid rgba(0,212,255,0.5)',
            borderRadius: 16,
            padding: '12px 8px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.05) inset',
            position: 'relative',
          }}>
            {/* Corner accents */}
            {[
              { top: 6, left: 6, borderTop: '1.5px solid #00d4ff', borderLeft: '1.5px solid #00d4ff' },
              { top: 6, right: 6, borderTop: '1.5px solid #00d4ff', borderRight: '1.5px solid #00d4ff' },
              { bottom: 6, left: 6, borderBottom: '1.5px solid #ffd700', borderLeft: '1.5px solid #ffd700' },
              { bottom: 6, right: 6, borderBottom: '1.5px solid #ffd700', borderRight: '1.5px solid #ffd700' },
            ].map((s, i) => (
              <div key={i} className="absolute" style={{ ...s, width: 12, height: 12 }} />
            ))}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              {[
                { v: timeLeft.days, l: 'Days' },
                { v: timeLeft.hours, l: 'Hours' },
                { v: timeLeft.minutes, l: 'Mins' },
                { v: timeLeft.seconds, l: 'Secs' },
              ].map(({ v, l }, i) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 54 }}>
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={v}
                        initial={{ y: -24, opacity: 0, scale: 0.7 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 24, opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.3rem, 6.5vw, 2.2rem)',
                          fontWeight: 900,
                          color: '#00d4ff',
                          textShadow: '0 0 25px rgba(0,212,255,0.8)',
                          lineHeight: 1,
                          display: 'block',
                        }}
                      >
                        {String(v).padStart(2, '0')}
                      </motion.span>
                    </AnimatePresence>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 9,
                      color: 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      marginTop: 4,
                    }}>{l}</span>
                  </div>
                  {i < 3 && (
                    <motion.span
                      style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'rgba(0,212,255,0.4)', marginBottom: 12, marginLeft: 2, marginRight: 2 }}
                      animate={{ opacity: [1, 0.1, 1] }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 300 }}
        >
          {/* Primary — Register */}
          <motion.div
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            <Link href="/register" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px 28px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #00d4ff 0%, #0097c7 50%, #005b8e 100%)',
              border: '1px solid rgba(100,240,255,0.5)',
              color: 'white',
              fontFamily: 'var(--font-heading)',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 4px 30px rgba(0,212,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
              WebkitTapHighlightColor: 'transparent',
            }}>
              Register Now
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <ArrowRight size={18} />
              </motion.span>
            </Link>
          </motion.div>

          {/* Secondary — Events */}
          <motion.div
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            <Link href="/events" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '13px 28px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderTop: '1px solid rgba(255,255,255,0.25)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--font-heading)',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              backdropFilter: 'blur(20px)',
              WebkitTapHighlightColor: 'transparent',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
            }}>
              Explore Events
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 7, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <ChevronDown size={18} color="rgba(0,212,255,0.4)" />
      </motion.div>

      {/* ── Glitch style ── */}
      <style jsx>{`
        .glitch-effect {
          animation: glitch 0.2s ease;
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 1px); filter: hue-rotate(40deg); }
          40% { transform: translate(3px, -1px); filter: hue-rotate(-40deg); }
          60% { transform: translate(-2px, 2px); }
          80% { transform: translate(2px, -2px); filter: hue-rotate(20deg); }
          100% { transform: translate(0); }
        }
      `}</style>
    </section>
  );
}
