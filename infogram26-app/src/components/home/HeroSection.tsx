'use client';

import { motion, Variants } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-08-22T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden z-10 pt-20 tech-grid">
      {/* Floating particles */}
      <div className="particle" style={{ top: '15%', left: '10%', animationDelay: '0s', animationDuration: '7s' }} />
      <div className="particle" style={{ top: '25%', right: '15%', animationDelay: '1.5s', animationDuration: '9s' }} />
      <div className="particle" style={{ top: '60%', left: '20%', animationDelay: '3s', animationDuration: '6s' }} />
      <div className="particle" style={{ top: '70%', right: '25%', animationDelay: '4.5s', animationDuration: '8s' }} />
      <div className="particle" style={{ top: '40%', left: '50%', animationDelay: '2s', animationDuration: '10s' }} />
      <div className="particle" style={{ top: '80%', left: '40%', animationDelay: '5s', animationDuration: '7.5s' }} />
      <div className="particle" style={{ top: '10%', right: '40%', animationDelay: '6s', animationDuration: '8.5s' }} />

      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00d4ff]/15 rounded-full blur-[100px] float-animation" style={{ willChange: 'transform', transform: 'translateZ(0)' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#0a3d6b]/30 rounded-full blur-[120px] float-animation" style={{ animationDelay: '2s', willChange: 'transform', transform: 'translateZ(0)' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00d4ff]/5 rounded-full blur-[150px]" style={{ willChange: 'transform', transform: 'translateZ(0)' }}></div>

      <motion.div
        className="container-xl section-padding px-4 xs:px-6 w-full flex flex-col items-center text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* College Name */}
        <motion.p 
          variants={itemVariants} 
          className="text-[9px] xs:text-xs sm:text-sm md:text-base text-white/60 font-medium tracking-[0.1em] sm:tracking-[0.2em] uppercase mb-1 max-w-[95%] leading-relaxed" 
          style={{ fontFamily: 'var(--font-heading)', willChange: 'transform, opacity' }}
        >
          C. Abdul Hakeem College of Engineering &amp; Technology
        </motion.p>

        {/* Department */}
        <motion.p 
          variants={itemVariants} 
          className="text-[11px] xs:text-sm sm:text-base md:text-lg text-[#00d4ff] font-semibold tracking-[0.08em] sm:tracking-[0.15em] uppercase mb-4 max-w-[95%] leading-relaxed" 
          style={{ fontFamily: 'var(--font-heading)', willChange: 'transform, opacity' }}
        >
          Department of Information Technology
        </motion.p>

        {/* Main Title — INFOGRAM'26 in Orbitron */}
        <motion.h1
          variants={itemVariants}
          className="text-[clamp(2rem,11vw,9rem)] font-black tracking-tight gradient-text-animated uppercase leading-none"
          style={{ fontFamily: 'var(--font-display)', willChange: 'transform, opacity', textShadow: '0 0 60px rgba(0, 212, 255, 0.3)' }}
        >
          INFOGRAM&apos;26
        </motion.h1>

        {/* Tagline */}
        <motion.p variants={itemVariants} className="text-base sm:text-xl md:text-2xl text-white/80 mt-4 tracking-[0.08em] uppercase px-2" style={{ fontFamily: 'var(--font-heading)', willChange: 'transform, opacity' }}>
          Where Innovation Earns Recognition
        </motion.p>

        {/* Event Date - Gold */}
        <motion.div variants={itemVariants} className="mt-6 flex items-center gap-3" style={{ willChange: 'transform, opacity' }}>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#ffd700]/50" />
          <span className="text-xl sm:text-3xl md:text-4xl font-black text-[#ffd700] tracking-wider glow-text-gold" style={{ fontFamily: 'var(--font-heading)' }}>
            22nd August 2026
          </span>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#ffd700]/50" />
        </motion.div>

        {/* Countdown */}
        <motion.div 
          variants={itemVariants} 
          className="mt-10 sci-fi-frame p-4 xs:p-6 flex items-center justify-center gap-2 xs:gap-4 md:gap-8 w-full max-w-xl bg-[#040d1a]/80 backdrop-blur-md" 
          style={{ willChange: 'transform, opacity' }}
        >
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' },
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-2 xs:gap-4 md:gap-8">
              <div className="flex flex-col items-center min-w-[42px] xs:min-w-[54px] sm:min-w-[60px]">
                <span className="text-xl xs:text-3xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#00d4ff', textShadow: '0 0 15px rgba(0, 212, 255, 0.4)' }}>
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[7px] xs:text-[9px] sm:text-xs text-white/50 uppercase tracking-widest mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {unit.label}
                </span>
              </div>
              {i < 3 && <span className="text-lg xs:text-2xl md:text-4xl text-[#00d4ff]/40 font-light mb-4 shrink-0">:</span>}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6" style={{ willChange: 'transform, opacity' }}>
          <motion.div whileTap={{ scale: 0.93 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
            <Link href="/register" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold" style={{ WebkitTapHighlightColor: 'transparent', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em' }}>
              Register Now
              <ArrowRight size={20} />
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.93 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
            <Link href="/events" className="btn-glass flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/5 backdrop-blur-sm hover:bg-[#00d4ff]/10 transition-colors" style={{ WebkitTapHighlightColor: 'transparent', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em' }}>
              Explore Events
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#00d4ff]/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ willChange: 'transform, opacity' }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
