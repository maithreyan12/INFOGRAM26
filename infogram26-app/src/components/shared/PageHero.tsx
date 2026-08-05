'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

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
  return (
    <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
      {/* Background aurora effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0F19]/80 to-[#0B0F19]" />
      </div>

      <div className="container-xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.href}>
                  <Link href={crumb.href} className="hover:text-primary-400 transition-colors">
                    {crumb.label}
                  </Link>
                  {idx < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600" />}
                </React.Fragment>
              ))}
            </nav>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text pb-2">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
