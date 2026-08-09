'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cpu, Palette, ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useEventStore } from '@/store/eventStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } }
};

export default function FeaturedEvents() {
  const { events } = useEventStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const technicalEvents = events.filter(e => e.category === 'technical');
  const nonTechnicalEvents = events.filter(e => e.category === 'non-technical');

  return (
    <section className="section-padding container-xl mx-auto px-4 relative tech-grid">
      <div className="text-center mb-12 relative z-10">
        <span className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 border ${
          isDark ? 'bg-purple-500/10 border-purple-500/30 text-amber-300' : 'bg-[#7c3aed]/10 border-[#7c3aed]/25 text-[#7c3aed]'
        }`} style={{ fontFamily: 'var(--font-heading)' }}>
          Events Lineup
        </span>
        <h2 className={`text-3xl md:text-5xl font-black uppercase mb-3 ${
          isDark ? 'text-white' : 'text-slate-950'
        }`} style={{ fontFamily: 'var(--font-display)' }}>
          Event Categories
        </h2>
        <p className={`max-w-xl mx-auto font-black text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-800'}`} style={{ fontFamily: 'var(--font-heading)' }}>
          {events.length} events across technical and non-technical categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Technical Events */}
        <motion.div
          className={`rounded-3xl overflow-hidden border p-6 transition-all duration-200 ${
            isDark ? 'bg-slate-900/90 border-purple-500/30 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
          }`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/25 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <h3 className="text-xl font-black text-[#7c3aed] uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
              Technical Events
            </h3>
          </div>

          <div className="space-y-1">
            {technicalEvents.map((event, idx) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Link
                  href={`/events/${event.slug}`}
                  className={`group flex items-center gap-4 py-3 px-4 rounded-2xl transition-all duration-200 border ${
                    isDark 
                      ? 'border-transparent hover:border-purple-500/30 hover:bg-slate-800/60' 
                      : 'border-transparent hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="text-[#7c3aed] font-black text-sm tabular-nums w-6 shrink-0" style={{ fontFamily: 'var(--font-display)' }}>
                    {idx + 1}.
                  </span>
                  <span className={`${isDark ? 'text-white' : 'text-slate-950'} font-black text-base sm:text-lg uppercase tracking-wide group-hover:text-[#7c3aed] transition-colors`} style={{ fontFamily: 'var(--font-heading)' }}>
                    {event.name}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#7c3aed]" />
                </Link>
              </motion.div>
            ))}
            {technicalEvents.length === 0 && (
              <p className="text-slate-500 text-sm py-4 px-4 font-bold">No technical events added yet</p>
            )}
          </div>
        </motion.div>

        {/* Non-Technical Events */}
        <motion.div
          className={`rounded-3xl overflow-hidden border p-6 transition-all duration-200 ${
            isDark ? 'bg-slate-900/90 border-teal-500/30 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
          }`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center">
              <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
              Non-Technical Events
            </h3>
          </div>

          <div className="space-y-1">
            {nonTechnicalEvents.map((event, idx) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Link
                  href={`/events/${event.slug}`}
                  className={`group flex items-center gap-4 py-3 px-4 rounded-2xl transition-all duration-200 border ${
                    isDark 
                      ? 'border-transparent hover:border-teal-500/30 hover:bg-slate-800/60' 
                      : 'border-transparent hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="text-teal-600 dark:text-teal-400 font-black text-sm tabular-nums w-6 shrink-0" style={{ fontFamily: 'var(--font-display)' }}>
                    {idx + 1}.
                  </span>
                  <span className={`${isDark ? 'text-white' : 'text-slate-950'} font-black text-base sm:text-lg uppercase tracking-wide group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors`} style={{ fontFamily: 'var(--font-heading)' }}>
                    {event.name}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-teal-600 dark:text-teal-400" />
                </Link>
              </motion.div>
            ))}
            {nonTechnicalEvents.length === 0 && (
              <p className="text-slate-500 text-sm py-4 px-4 font-bold">No non-technical events added yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="text-center mt-10 relative z-10">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-lg hover:brightness-110 transition-all"
        >
          <span>View All Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
