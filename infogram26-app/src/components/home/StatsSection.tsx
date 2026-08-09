'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Calendar, Users, Building, Trophy } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const stats = [
  { id: 1, label: 'Events', value: 15, suffix: '+', icon: Calendar, color: 'text-[#7c3aed]', bg: 'bg-[#7c3aed]/10', border: 'border-[#7c3aed]/20' },
  { id: 2, label: 'Participants', value: 500, suffix: '+', icon: Users, color: 'text-[#059669]', bg: 'bg-[#059669]/10', border: 'border-[#059669]/20' },
  { id: 3, label: 'Sponsors', value: 10, suffix: '+', icon: Building, color: 'text-[#d97706]', bg: 'bg-[#d97706]/10', border: 'border-[#d97706]/20' },
  { id: 4, label: 'Prize Pool', value: 50000, prefix: '₹', suffix: '+', icon: Trophy, color: 'text-[#d97706]', bg: 'bg-[#d97706]/10', border: 'border-[#d97706]/20' },
];

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let raf: number;
    const start = performance.now();
    const duration = 1600;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      setCount(Math.round(easeOut(elapsed) * value));
      if (elapsed < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count >= 1000 ? count.toLocaleString() : count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="relative z-10 section-padding">
      <div className="container-xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileTap={{ scale: 0.96 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  delay: i * 0.08,
                  type: 'spring',
                  stiffness: 300,
                  damping: 24,
                }}
                style={{ willChange: 'transform, opacity', WebkitTapHighlightColor: 'transparent' }}
                className={`glass-card p-4 sm:p-6 md:p-8 rounded-2xl flex flex-col items-center text-center cursor-default select-none border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-900/85 border-purple-500/30 text-white shadow-2xl hover:border-purple-400/50' 
                    : 'bg-white/90 border-slate-200 text-slate-900 shadow-md hover:border-[#7c3aed]/30'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${stat.bg} border ${stat.border} flex items-center justify-center mb-3 sm:mb-4`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <div className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-1 ${
                  isDark && stat.color === 'text-[#7c3aed]' ? 'text-purple-400' : stat.color
                }`} style={{ fontFamily: 'var(--font-display)' }}>
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className={`text-xs sm:text-sm font-black uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-950'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
