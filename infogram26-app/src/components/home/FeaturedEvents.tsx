'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cpu, Palette } from 'lucide-react';

const technicalEvents = [
  { id: 1, name: 'TechTalks', slug: 'techtalks' },
  { id: 2, name: 'ByteBattle', slug: 'bytebattle' },
  { id: 3, name: 'PixelCraft', slug: 'pixelcraft' },
  { id: 4, name: 'CodeStorm', slug: 'codestorm' },
  { id: 5, name: 'Open Source', slug: 'open-source' },
  { id: 6, name: 'HackForge', slug: 'hackforge' },
];

const nonTechnicalEvents = [
  { id: 1, name: 'Mind Matrix', slug: 'mind-matrix' },
  { id: 2, name: 'BattleVerse', slug: 'battleverse' },
  { id: 3, name: 'Flavour Fusion', slug: 'flavour-fusion' },
  { id: 4, name: 'FrameCraft', slug: 'framecraft' },
  { id: 5, name: 'Quest X', slug: 'quest-x' },
  { id: 6, name: 'Artistry', slug: 'artistry' },
  { id: 7, name: 'Reel It Feel It', slug: 'reel-it-feel-it' },
  { id: 8, name: 'Mic Drop', slug: 'mic-drop' },
  { id: 9, name: 'FunFiesta', slug: 'funfiesta' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const itemVariantsRight = {
  hidden: { opacity: 0, x: 15 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function FeaturedEvents() {
  return (
    <section className="section-padding container-xl mx-auto px-4 relative tech-grid">
      <div className="text-center mb-14 relative z-10">
        <span className="section-badge inline-block px-4 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] text-sm font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Events Lineup
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="gradient-text">Event Categories</span>
        </h2>
        <p className="text-white/50 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-heading)' }}>
          15 events across technical and non-technical categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Technical Events */}
        <motion.div
          className="glass-card rounded-2xl overflow-hidden border border-[#00d4ff]/15"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Header Badge */}
          <div className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#00d4ff]" />
              </div>
              <h3 className="text-xl font-bold text-[#00d4ff] uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-heading)' }}>
                Technical
              </h3>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-1">
            {technicalEvents.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Link
                  href={`/events/${event.slug}`}
                  className="group flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-[#00d4ff]/5 transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="text-[#00d4ff]/60 font-bold text-sm tabular-nums w-6 shrink-0" style={{ fontFamily: 'var(--font-display)' }}>
                    {event.id}.
                  </span>
                  <span className="text-white/90 font-semibold text-base sm:text-lg uppercase tracking-[0.08em] group-hover:text-[#00d4ff] transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                    {event.name}
                  </span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#00d4ff]">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Non-Technical Events */}
        <motion.div
          className="glass-card rounded-2xl overflow-hidden border border-[#00d4ff]/15"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Header Badge */}
          <div className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-purple-400 uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-heading)' }}>
                Non-Technical
              </h3>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-1">
            {nonTechnicalEvents.map((event) => (
              <motion.div key={event.id} variants={itemVariantsRight}>
                <Link
                  href={`/events/${event.slug}`}
                  className="group flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-purple-400/5 transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="text-purple-400/60 font-bold text-sm tabular-nums w-6 shrink-0" style={{ fontFamily: 'var(--font-display)' }}>
                    {event.id}.
                  </span>
                  <span className="text-white/90 font-semibold text-base sm:text-lg uppercase tracking-[0.08em] group-hover:text-purple-400 transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                    {event.name}
                  </span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">→</span>
                </Link>
              </motion.div>
            ))}
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
