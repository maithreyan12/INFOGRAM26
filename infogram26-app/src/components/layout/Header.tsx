'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap } from 'lucide-react';

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItemClass = (path: string) => {
    const isActive = pathname === path;
    return `relative px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-sky-400' : 'text-gray-300 hover:text-white'
    }`;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[rgba(3,7,18,0.7)] shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-saturate-[2] backdrop-blur-2xl'
          : 'bg-transparent'
      }`}
      style={{ 
        backdropFilter: scrolled ? 'saturate(200%) blur(32px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(200%) blur(32px)' : 'none' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="bg-sky-500/10 p-2 rounded-xl">
              <Zap className="w-6 h-6 text-sky-400" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              INFOGRAM'26
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={navItemClass(link.path)}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 right-0 bottom-0 h-[2px] bg-sky-400"
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
            <Link
              href="/admin-login"
              className="ml-4 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white focus:outline-none"
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
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-6 h-6" />
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
            className="md:hidden overflow-hidden bg-[rgba(5,10,20,0.92)] shadow-xl border-b border-white/[0.05]"
            style={{ 
              backdropFilter: 'saturate(180%) blur(32px)',
              WebkitBackdropFilter: 'saturate(180%) blur(32px)'
            }}
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <motion.div key={link.path} variants={itemVariants}>
                    <Link
                      href={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block w-full px-4 py-3.5 text-base font-medium rounded-xl active:scale-95 transition-transform duration-100 ${
                        isActive 
                          ? 'bg-sky-500/10 text-sky-400' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div variants={itemVariants} className="pt-4">
                <Link
                  href="/admin-login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3.5 text-center text-base font-medium rounded-xl bg-white/10 text-white active:scale-95 transition-transform duration-100"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  Admin Login
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
