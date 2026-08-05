'use client';

import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface SectionHeadingProps {
  badge: string;
  title: string | ReactNode;
  subtitle?: string;
  centered?: boolean;
}

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function SectionHeading({ badge, title, subtitle, centered = true }: SectionHeadingProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'} mb-12`}
    >
      <motion.span
        variants={itemVariants}
        className="section-badge px-3 py-1 text-xs font-semibold tracking-wider text-sky-400 uppercase bg-sky-400/10 border border-sky-400/20 rounded-full mb-4 inline-block"
      >
        {badge}
      </motion.span>
      
      <motion.h2
        variants={itemVariants}
        className="gradient-text text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60"
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          variants={itemVariants}
          className="text-[rgba(255,255,255,0.5)] text-lg max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
