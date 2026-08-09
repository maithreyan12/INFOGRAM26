'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05, translateY: -1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      aria-label="Toggle Dark/Light Theme"
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        WebkitTapHighlightColor: 'transparent',
      }}
      className={`
        relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 select-none border cursor-pointer
        ${
          isDark
            ? 'bg-slate-900/80 text-amber-300 border-purple-500/30 shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-purple-400/50'
            : 'bg-white/85 text-slate-800 border-slate-200 shadow-[0_4px_16px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#7c3aed]/30'
        }
      `}
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.4, ease: 'backOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-purple-300 fill-purple-300/20" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
        )}
      </motion.div>
      <span className="hidden sm:inline font-semibold tracking-wider uppercase text-[10px]">
        {isDark ? 'OLED Dark' : 'Liquid Light'}
      </span>
    </motion.button>
  );
}
