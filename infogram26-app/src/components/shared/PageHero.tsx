'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative pt-32 pb-14 md:pt-40 md:pb-18 overflow-hidden">
      {/* Background aurora effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] ${
          isDark ? 'bg-purple-600/15' : 'bg-purple-400/10'
        }`} />
        <div className={`absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] ${
          isDark ? 'bg-cyan-500/15' : 'bg-indigo-400/10'
        }`} />
      </div>

      <div className="container-xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-6 px-4 py-2 rounded-full border shadow-sm ${
              isDark ? 'bg-slate-900/90 border-purple-500/30 text-amber-300' : 'bg-white border-slate-200 text-[#7c3aed]'
            }`}>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.href}>
                  <Link href={crumb.href} className="hover:underline transition-all">
                    {crumb.label}
                  </Link>
                  {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </React.Fragment>
              ))}
            </nav>
          )}

          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-black uppercase mb-3 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`} 
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h1>
          
          {subtitle && (
            <p className={`text-base md:text-xl font-black max-w-2xl ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
