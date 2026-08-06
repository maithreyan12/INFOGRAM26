'use client';

import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 50, filter: 'blur(12px)' },
    visible: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 180, damping: 20 },
    },
  };

  const CountUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center min-w-[52px] xs:min-w-[60px]">
      <motion.span
        key={value}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="block font-black tabular-nums"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 8vw, 3rem)',
          color: '#00d4ff',
          textShadow: '0 0 30px rgba(0,212,255,0.8), 0 0 60px rgba(0,212,255,0.4)',
          lineHeight: 1,
          display: 'block',
        }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span
        className="text-[8px] xs:text-[10px] uppercase tracking-[0.25em] mt-1.5"
        style={{ fontFamily: 'var(--font-heading)', color: 'rgba(255,255,255,0.4)' }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* ══════════════════════════════
          VIDEO BACKGROUND
      ══════════════════════════════ */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: videoScale }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 1.5s ease' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Fallback gradient when no video */}
        {!videoLoaded && (
          <div
            className="absolute inset-0 tech-grid"
            style={{
              background: 'radial-gradient(ellipse 120% 80% at 50% 20%, rgba(0,212,255,0.18) 0%, rgba(0,50,120,0.15) 40%, #020810 70%)',
            }}
          />
        )}

        {/* Dark overlay — lets text pop */}
        <div
          className="absolute inset-0"
          style={{
            background: videoLoaded
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 50%, rgba(2,8,16,0.92) 100%)'
              : 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(2,8,16,0.6) 100%)',
          }}
        />

        {/* Vignette edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 120px rgba(0,0,0,0.6), inset 0 0 300px rgba(0,0,0,0.3)',
          }}
        />
      </motion.div>

      {/* ══════════════════════════════
          ANIMATED PARTICLES OVERLAY
      ══════════════════════════════ */}
      {mounted && (
        <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? '#ffd700' : '#00d4ff',
                boxShadow: i % 3 === 0
                  ? '0 0 6px rgba(255,215,0,0.8)'
                  : '0 0 6px rgba(0,212,255,0.8)',
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Horizontal scan lines */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`scan-${i}`}
              className="absolute left-0 right-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.3) 30%, rgba(0,212,255,0.6) 50%, rgba(0,212,255,0.3) 70%, transparent 100%)',
              }}
              animate={{ top: ['0%', '100%'] }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                delay: i * 2,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* ══════════════════════════════
          MAIN CONTENT
      ══════════════════════════════ */}
      <motion.div
        className="relative z-10 w-full flex flex-col items-center text-center px-4 pt-20"
        style={{ y: contentY, opacity: contentOpacity }}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* College badge */}
        <motion.div variants={item} className="mb-6">
          <div
            className="inline-flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(0,212,255,0.25)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 20px rgba(0,212,255,0.1)',
            }}
          >
            <span
              className="text-[9px] xs:text-[10px] text-white/55 tracking-[0.2em] uppercase"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              C. Abdul Hakeem College of Engineering &amp; Technology
            </span>
            <span
              className="text-[11px] xs:text-xs font-bold tracking-[0.18em] uppercase"
              style={{ fontFamily: 'var(--font-heading)', color: '#00d4ff' }}
            >
              Department of Information Technology
            </span>
          </div>
        </motion.div>

        {/* ══ CINEMATIC TITLE ══ */}
        <motion.div variants={item} className="relative mb-2 w-full">
          {/* Background glow ring */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,212,255,0.2) 0%, transparent 65%)',
              filter: 'blur(30px)',
            }}
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.h1
            className="relative font-black uppercase gradient-text-animated"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 20vw, 11rem)',
              letterSpacing: '-0.02em',
              lineHeight: 0.88,
              textShadow: '0 4px 40px rgba(0,0,0,0.8)',
            }}
            animate={{
              textShadow: [
                '0 4px 40px rgba(0,0,0,0.8), 0 0 60px rgba(0,212,255,0.4)',
                '0 4px 40px rgba(0,0,0,0.8), 0 0 120px rgba(0,212,255,0.7)',
                '0 4px 40px rgba(0,0,0,0.8), 0 0 60px rgba(0,212,255,0.4)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            INFOGRAM
          </motion.h1>
        </motion.div>

        {/* '26 with gold dividers */}
        <motion.div variants={item} className="flex items-center justify-center gap-3 xs:gap-5 w-full mb-4">
          <motion.div
            className="h-[2px] flex-1 max-w-[80px] xs:max-w-[120px] sm:max-w-[180px] rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #ffd700)' }}
            animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="font-black gradient-text-animated"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 20vw, 11rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              textShadow: '0 0 60px rgba(255,215,0,0.5), 0 4px 30px rgba(0,0,0,0.8)',
            }}
          >
            &apos;26
          </motion.span>
          <motion.div
            className="h-[2px] flex-1 max-w-[80px] xs:max-w-[120px] sm:max-w-[180px] rounded-full"
            style={{ background: 'linear-gradient(90deg, #ffd700, transparent)' }}
            animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="text-sm xs:text-base sm:text-lg text-white/75 tracking-[0.15em] uppercase mb-2"
          style={{ fontFamily: 'var(--font-heading)', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
        >
          Where Innovation Earns Recognition
        </motion.p>

        {/* Date */}
        <motion.div variants={item} className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 sm:w-14" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.7))' }} />
          <motion.span
            className="font-black"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.1rem, 5vw, 1.8rem)',
              color: '#ffd700',
              letterSpacing: '0.08em',
              textShadow: '0 0 30px rgba(255,215,0,0.8)',
            }}
            animate={{ textShadow: ['0 0 20px rgba(255,215,0,0.5)', '0 0 50px rgba(255,215,0,1)', '0 0 20px rgba(255,215,0,0.5)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            22nd August 2026
          </motion.span>
          <div className="h-px w-8 sm:w-14" style={{ background: 'linear-gradient(90deg, rgba(255,215,0,0.7), transparent)' }} />
        </motion.div>

        {/* ══ COUNTDOWN ══ */}
        <motion.div
          variants={item}
          className="w-full max-w-[340px] xs:max-w-sm mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,20,50,0.5))',
            border: '1px solid rgba(0,212,255,0.25)',
            borderTop: '1px solid rgba(0,212,255,0.5)',
            borderRadius: 20,
            backdropFilter: 'blur(28px)',
            padding: '20px 16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,212,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
            position: 'relative',
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-3 h-3" style={{ borderTop: '1.5px solid #00d4ff', borderLeft: '1.5px solid #00d4ff' }} />
          <div className="absolute top-2 right-2 w-3 h-3" style={{ borderTop: '1.5px solid #00d4ff', borderRight: '1.5px solid #00d4ff' }} />
          <div className="absolute bottom-2 left-2 w-3 h-3" style={{ borderBottom: '1.5px solid #ffd700', borderLeft: '1.5px solid #ffd700' }} />
          <div className="absolute bottom-2 right-2 w-3 h-3" style={{ borderBottom: '1.5px solid #ffd700', borderRight: '1.5px solid #ffd700' }} />

          <div className="flex items-center justify-around">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Mins' },
              { value: timeLeft.seconds, label: 'Secs' },
            ].map((u, i) => (
              <div key={u.label} className="flex items-center">
                <CountUnit value={u.value} label={u.label} />
                {i < 3 && (
                  <motion.span
                    className="text-xl xs:text-2xl font-bold mx-1 xs:mx-2 mb-4"
                    style={{ color: 'rgba(0,212,255,0.5)', fontFamily: 'var(--font-display)' }}
                    animate={{ opacity: [1, 0.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    :
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ══ CTA BUTTONS ══ */}
        <motion.div variants={item} className="flex flex-col xs:flex-row gap-3 w-full max-w-[320px] xs:max-w-sm">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Link
              href="/register"
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', WebkitTapHighlightColor: 'transparent' }}
            >
              Register Now
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </Link>
          </motion.div>

          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Link
              href="/events"
              className="btn-glass w-full flex items-center justify-center py-4 rounded-2xl font-bold text-base"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', WebkitTapHighlightColor: 'transparent' }}
            >
              Explore Events
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ══ MUTE BUTTON (video control) ══ */}
      {videoLoaded && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={toggleMute}
          className="absolute bottom-16 right-5 z-20 p-2.5 rounded-full"
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            color: 'rgba(255,255,255,0.7)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </motion.button>
      )}

      {/* ══ SCROLL INDICATOR ══ */}
      <motion.div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[8px] text-white/30 uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-heading)' }}>
          Scroll
        </span>
        <ChevronDown size={20} className="text-white/40" />
      </motion.div>
    </section>
  );
}
