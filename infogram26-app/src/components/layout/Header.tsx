'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Register', path: '/register' },
  { name: 'Contact', path: '/contact' },
];

const drawerVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto', 
    transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.05 } 
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 28 } }
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItemClass = (path: string) => {
    const isActive = pathname === path;
    if (isDark) {
      return `relative px-4 py-2 text-sm font-semibold transition-colors ${
        isActive ? 'text-amber-300' : 'text-slate-300 hover:text-white'
      }`;
    }
    return `relative px-4 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-[#7c3aed]' : 'text-slate-700 hover:text-slate-900'
    }`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 flex justify-center w-full">
      <motion.div 
        whileHover={{ scale: 1.008 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`w-full max-w-5xl rounded-full border transition-all duration-300 ${
          isDark
            ? scrolled 
              ? 'bg-slate-900/90 border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]'
              : 'bg-slate-900/75 border-slate-700/60 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]'
            : scrolled 
              ? 'bg-white/90 border-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.08),inset_0_1px_0_#ffffff]'
              : 'bg-white/75 border-white/70 shadow-[0_4px_20px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]'
        }`}
        style={{ 
          backdropFilter: 'saturate(190%) blur(28px)',
          WebkitBackdropFilter: 'saturate(190%) blur(28px)'
        }}
      >
        <div className="px-5 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center overflow-hidden p-1 shrink-0 group-hover:scale-105 transition-transform ${
              isDark ? 'bg-slate-950 border border-purple-500/40 shadow-sm' : 'bg-white/90 border border-slate-200/90 shadow-sm'
            }`}>
              <img 
                src="/logo.png" 
                alt="INFOGRAM'26 Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-wider hidden sm:inline-block" style={{ fontFamily: 'var(--font-display)' }}>
              <span className={isDark ? 'text-white' : 'text-slate-900'}>INFOGRAM</span>
              <span className={isDark ? 'text-amber-300' : 'text-[#7c3aed]'}>&apos;26</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={navItemClass(link.path)}
                  style={{ WebkitTapHighlightColor: 'transparent', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute left-2 right-2 bottom-1 h-[2.5px] rounded-full ${
                        isDark ? 'bg-gradient-to-r from-amber-300 via-purple-400 to-emerald-400' : 'bg-gradient-to-r from-[#7c3aed] to-[#059669]'
                      }`}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <motion.span
                    whileHover={{ scale: isActive ? 1.02 : 1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.name}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Right Area: Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={`md:hidden p-2 rounded-full focus:outline-none border transition-colors ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white' 
                  : 'bg-white/80 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`md:hidden overflow-hidden rounded-2xl mt-2 border mx-2 mb-2 ${
                isDark 
                  ? 'bg-slate-900/95 border-purple-500/30 text-white shadow-2xl backdrop-blur-xl' 
                  : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl backdrop-blur-xl'
              }`}
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <motion.div key={link.path} variants={itemVariants}>
                      <Link
                        href={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block w-full px-4 py-2.5 text-base font-semibold rounded-xl active:scale-95 transition-transform duration-100 ${
                          isActive 
                            ? isDark ? 'bg-purple-500/20 text-amber-300 font-bold' : 'bg-[#7c3aed]/10 text-[#7c3aed] font-bold'
                            : isDark ? 'text-slate-200 hover:bg-white/10 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
