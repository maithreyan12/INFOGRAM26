'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Ticket } from 'lucide-react';

import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Register', path: '/register' },
  { name: 'My Ticket', path: '/my-ticket' },
  { name: 'Contact', path: '/contact' },
];

const drawerVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto', 
    transition: { type: 'spring', stiffness: 350, damping: 28, staggerChildren: 0.04 } 
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 flex justify-center w-full transform-gpu">
      <div 
        className={`w-full max-w-5xl rounded-full border transition-all duration-300 ${
          isDark
            ? scrolled 
              ? 'bg-slate-900/95 border-purple-500/30 shadow-2xl'
              : 'bg-slate-900/85 border-slate-700/60 shadow-lg'
            : scrolled 
              ? 'bg-white/95 border-slate-200 shadow-xl'
              : 'bg-white/90 border-slate-200/90 shadow-md'
        }`}
        style={{ 
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
        }}
      >
        <div className="px-4 sm:px-6 h-15 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group active:scale-95 transition-transform duration-150 cursor-pointer"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-black border transition-all duration-200 cursor-pointer ${
              isDark ? 'border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'border-[#7c3aed]/40 shadow-sm'
            }`}>
              <img 
                src="/logo.png" 
                alt="INFOGRAM'26 Logo" 
                width={44}
                height={44}
                decoding="async"
                className="w-full h-full object-cover rounded-full transform scale-105 cursor-pointer" 
              />
            </div>
            <span className="text-xs xs:text-sm sm:text-base font-black tracking-wider inline-flex items-center gap-0.5 select-none" style={{ fontFamily: 'var(--font-display)' }}>
              <span className={isDark ? 'text-white' : 'text-slate-950'}>INFOGRAM</span>
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
                  className={`relative px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-150 rounded-full active:scale-95 ${
                    isActive 
                      ? isDark 
                        ? 'bg-purple-500/20 text-amber-300 border border-purple-500/40' 
                        : 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-md'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-900 hover:text-[#7c3aed] hover:bg-slate-100 font-black'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent', fontFamily: 'var(--font-heading)', touchAction: 'manipulation' }}
                >
                  {link.name}
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
              className={`md:hidden p-2 rounded-full focus:outline-none border active:scale-90 transition-all duration-150 ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700 text-slate-100' 
                  : 'bg-slate-100 border-slate-300 text-slate-950 font-black'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.12 }}
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
              className={`md:hidden overflow-hidden rounded-3xl mt-2 border mx-2 mb-2 ${
                isDark 
                  ? 'bg-slate-900/95 border-purple-500/30 text-white shadow-2xl backdrop-blur-xl' 
                  : 'bg-white/98 border-slate-200 text-slate-950 shadow-2xl backdrop-blur-xl'
              }`}
            >
              <div className="px-4 py-4 space-y-1.5">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <motion.div key={link.path} variants={itemVariants}>
                      <Link
                        href={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block w-full px-5 py-3 text-sm font-black uppercase tracking-wider rounded-2xl active:scale-95 transition-transform duration-100 ${
                          isActive 
                            ? isDark 
                              ? 'bg-purple-500/20 text-amber-300 border border-purple-500/40' 
                              : 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-md'
                            : isDark 
                              ? 'text-slate-100 hover:bg-slate-800' 
                              : 'text-slate-950 hover:bg-slate-100'
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent', fontFamily: 'var(--font-heading)', touchAction: 'manipulation' }}
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
      </div>
    </header>
  );
}
