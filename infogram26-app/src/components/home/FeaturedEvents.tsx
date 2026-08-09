'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cpu, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useEventStore } from '@/store/eventStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariantsLeft = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

const itemVariantsRight = {
  hidden: { opacity: 0, x: 15 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function FeaturedEvents() {
  const { events } = useEventStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const technicalEvents = events.filter(e => e.category === 'technical');
  const nonTechnicalEvents = events.filter(e => e.category === 'non-technical');

  return (
    <section className="section-padding container-xl mx-auto px-4 relative tech-grid">
      <div className="text-center mb-14 relative z-10">
        <span className={`section-badge inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 border ${
          isDark ? 'bg-purple-500/10 border-purple-500/30 text-amber-300' : 'bg-[#7c3aed]/10 border-[#7c3aed]/20 text-[#7c3aed]'
        }`} style={{ fontFamily: 'var(--font-heading)' }}>
          Events Lineup
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          <span className={isDark ? 'gradient-text-animated' : 'gradient-text'}>Event Categories</span>
        </h2>
        <p className={`max-w-xl mx-auto font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`} style={{ fontFamily: 'var(--font-heading)' }}>
          {events.length} events across technical and non-technical categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Technical Events */}
        <motion.div
          className={`glass-card rounded-2xl overflow-hidden border ${
            isDark ? 'bg-slate-900/80 border-purple-500/30 shadow-2xl' : 'bg-white/80 border-slate-200/80 shadow-md'
          }`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#7c3aed]" />
              </div>
              <h3 className="text-xl font-bold text-[#7c3aed] uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-heading)' }}>
                Technical
              </h3>
            </div>
          </div>
          <div className="px-6 pb-6 space-y-1">
            {technicalEvents.map((event, idx) => (
              <motion.div key={event.id} variants={itemVariantsLeft}>
                <Link
                  href={`/events/${event.slug}`}
                  className="group flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-[#7c3aed]/8 transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="text-[#7c3aed] font-bold text-sm tabular-nums w-6 shrink-0" style={{ fontFamily: 'var(--font-display)' }}>
                    {idx + 1}.
                  </span>
                  <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-base sm:text-lg uppercase tracking-[0.08em] group-hover:text-[#7c3aed] transition-colors`} style={{ fontFamily: 'var(--font-heading)' }}>
                    {event.name}
                  </span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#7c3aed]">→</span>
                </Link>
              </motion.div>
            ))}
            {technicalEvents.length === 0 && (
              <p className="text-slate-400 text-sm py-4 px-4">No technical events added yet</p>
            )}
          </div>
        </motion.div>

        {/* Non-Technical Events */}
        <motion.div
          className={`glass-card rounded-2xl overflow-hidden border ${
            isDark ? 'bg-slate-900/80 border-teal-500/30 shadow-2xl' : 'bg-white/80 border-slate-200/80 shadow-md'
          }`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-teal-500 uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-heading)' }}>
                Non-Technical
              </h3>
            </div>
          </div>
          <div className="px-6 pb-6 space-y-1">
            {nonTechnicalEvents.map((event, idx) => (
              <motion.div key={event.id} variants={itemVariantsRight}>
                <Link
                  href={`/events/${event.slug}`}
                  className="group flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-teal-500/10 transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="text-teal-500 font-bold text-sm tabular-nums w-6 shrink-0" style={{ fontFamily: 'var(--font-display)' }}>
                    {idx + 1}.
                  </span>
                  <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-base sm:text-lg uppercase tracking-[0.08em] group-hover:text-teal-500 transition-colors`} style={{ fontFamily: 'var(--font-heading)' }}>
                    {event.name}
                  </span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-teal-600">→</span>
                </Link>
              </motion.div>
            ))}
            {nonTechnicalEvents.length === 0 && (
              <p className="text-slate-400 text-sm py-4 px-4">No non-technical events added yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="text-center mt-10 relative z-10">
        <Link
          href="/events"
          className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-full"
          style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.08em' }}
        >
          View All Events →
        </Link>
      </div>
    </section>
  );
}
