'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronDown, Zap, Calendar, ArrowRight } from 'lucide-react';
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
    const targetDate = new Date('2026-03-15T00:00:00').getTime();

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
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden z-10 pt-20">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-500/20 rounded-full blur-[100px] float-animation" style={{ willChange: 'transform', transform: 'translateZ(0)' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[120px] float-animation" style={{ animationDelay: '2s', willChange: 'transform', transform: 'translateZ(0)' }}></div>

      <motion.div
        className="container-xl section-padding flex flex-col items-center text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ willChange: 'transform, opacity' }}
      >
        <motion.h1 
          variants={itemVariants}
          className="text-[clamp(2.2rem,10vw,8.75rem)] font-black tracking-tight gradient-text-animated uppercase font-outfit"
          style={{ fontFamily: 'var(--font-outfit), sans-serif', willChange: 'transform, opacity' }}
        >
          INFOGRAM&apos;26
        </motion.h1>

        <motion.p variants={itemVariants} className="text-2xl md:text-3xl text-white/70 mt-4" style={{ willChange: 'transform, opacity' }}>
          National Level Technical Symposium
        </motion.p>
        
        <motion.p variants={itemVariants} className="text-lg text-sky-400 font-medium mt-2" style={{ willChange: 'transform, opacity' }}>
          Department of Information Technology
        </motion.p>

        <motion.p variants={itemVariants} className="text-base text-white/50 mt-1" style={{ willChange: 'transform, opacity' }}>
          C. Abdul Hakeem College of Engineering & Technology
        </motion.p>

        <motion.div variants={itemVariants} className="mt-12 glass-card p-6 flex items-center justify-start md:justify-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide w-full max-w-full" style={{ willChange: 'transform, opacity' }}>
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="countdown-number text-3xl md:text-5xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="countdown-label text-sm text-white/50 uppercase tracking-widest mt-1">Days</span>
          </div>
          <span className="text-2xl md:text-4xl text-white/30 font-light mb-6 shrink-0">:</span>
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="countdown-number text-3xl md:text-5xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="countdown-label text-sm text-white/50 uppercase tracking-widest mt-1">Hours</span>
          </div>
          <span className="text-2xl md:text-4xl text-white/30 font-light mb-6 shrink-0">:</span>
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="countdown-number text-3xl md:text-5xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="countdown-label text-sm text-white/50 uppercase tracking-widest mt-1">Minutes</span>
          </div>
          <span className="text-2xl md:text-4xl text-white/30 font-light mb-6 shrink-0">:</span>
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="countdown-number text-3xl md:text-5xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="countdown-label text-sm text-white/50 uppercase tracking-widest mt-1">Seconds</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6" style={{ willChange: 'transform, opacity' }}>
          <motion.div whileTap={{ scale: 0.93 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
            <Link href="/register" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform" style={{ WebkitTapHighlightColor: 'transparent' }}>
              Register Now
              <ArrowRight size={20} />
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.93 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
            <Link href="/events" className="btn-glass flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors" style={{ WebkitTapHighlightColor: 'transparent' }}>
              Explore Events
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ willChange: 'transform, opacity' }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
