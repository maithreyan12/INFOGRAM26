'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Register', path: '/register' },
  { name: 'Gallery', path: '/gallery' },
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
    // passive:true — never blocks scroll thread
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItemClass = (path: string) => {
    const isActive = pathname === path;
    return `relative px-4 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-[#00d4ff]' : 'text-gray-300 hover:text-white'
    }`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 flex justify-center w-full">
      <div 
        className={`w-full max-w-5xl rounded-full border transition-all duration-300 ${
          scrolled 
            ? 'bg-[rgba(4,13,26,0.85)] border-[#00d4ff]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-[rgba(4,13,26,0.4)] border-white/5 shadow-[0_2px_15px_rgba(0,0,0,0.2)]'
        }`}
        style={{ 
          backdropFilter: 'saturate(150%) blur(20px)',
          WebkitBackdropFilter: 'saturate(150%) blur(20px)'
        }}
      >
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="bg-[#00d4ff]/10 p-1.5 rounded-full border border-[#00d4ff]/20">
              <svg className="w-4 h-4 text-[#00d4ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-bold tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-white">INFOGRAM</span>
              <span className="text-[#00d4ff]">&apos;26</span>
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
                      className="absolute left-2 right-2 bottom-1 h-[2px] bg-[#00d4ff]"
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

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-full text-gray-400 hover:text-white focus:outline-none bg-white/5 border border-white/10"
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

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden overflow-hidden bg-[rgba(4,13,26,0.95)] rounded-2xl mt-2 border border-[#00d4ff]/[0.15] mx-2 mb-2"
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
                            ? 'bg-[#00d4ff]/10 text-[#00d4ff]' 
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
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
      </div>
    </header>
  );
}
