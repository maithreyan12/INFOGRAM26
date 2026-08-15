'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Register', path: '/register' },
  { name: 'Contact', path: '/contact' },
];

const contactPersons = [
  { name: 'Naveeth Khan', phone: '9360257573' },
  { name: 'Farish Sharif', phone: '9487233290' },
  { name: 'Kafil Ahmed', phone: '8940210491' },
  { name: 'MD Thameem', phone: '9361900720' },
];

const legalLinks = [
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms & Conditions', path: '/terms' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/infogram_26/',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = 2026;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`pt-16 pb-12 border-t transition-colors duration-300 relative z-10 ${isDark ? 'bg-[#04060e] border-purple-500/20 text-white' : 'bg-white border-slate-200 text-slate-950'
      }`}>
      <div className="container-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group w-fit"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border shadow-sm flex items-center justify-center overflow-hidden shrink-0 bg-black transition-all duration-200 ${isDark ? 'border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'border-[#7c3aed]/40'
                }`}>
                <img
                  src="/logo.png"
                  alt="INFOGRAM'26 Logo"
                  width={48}
                  height={48}
                  decoding="async"
                  className="w-full h-full object-cover rounded-full transform scale-105"
                />
              </div>
              <span className={`text-xl font-black tracking-wider ${isDark ? 'text-white' : 'text-slate-950'}`} style={{ fontFamily: 'var(--font-display)' }}>
                INFOGRAM<span className={isDark ? 'text-amber-300' : 'text-[#7c3aed]'}>&apos;26</span>
              </span>
            </Link>

            <p className={`text-sm leading-relaxed font-bold max-w-xs ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              National Level Technical Symposium organized by the Department of Information Technology at C. Abdul Hakeem College of Engineering &amp; Technology.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  className={`w-[44px] h-[44px] flex items-center justify-center rounded-full border transition-all duration-200 ${isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-purple-500/20 hover:text-amber-300 hover:border-amber-300/40'
                      : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-[#7c3aed]/10 hover:text-[#7c3aed] hover:border-[#7c3aed]/40'
                    }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-black text-xs uppercase tracking-widest mb-5 ${isDark ? 'text-amber-300' : 'text-slate-950'}`} style={{ fontFamily: 'var(--font-heading)' }}>
              Quick Links
            </h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={`min-h-[40px] flex items-center text-sm font-black transition-colors ${isDark ? 'text-slate-300 hover:text-amber-300' : 'text-slate-900 hover:text-[#7c3aed]'
                      }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Persons */}
          <div>
            <h3 className={`font-black text-xs uppercase tracking-widest mb-5 ${isDark ? 'text-amber-300' : 'text-slate-950'}`} style={{ fontFamily: 'var(--font-heading)' }}>
              Contact
            </h3>
            <ul className="space-y-3">
              {contactPersons.map((person) => (
                <li key={person.name} className="flex items-center gap-2.5">
                  <Phone className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>{person.name}</span>
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>·</span>
                    <a
                      href={`tel:+91${person.phone}`}
                      className={`text-sm font-black transition-colors ${isDark ? 'text-slate-200 hover:text-amber-300' : 'text-slate-900 hover:text-[#7c3aed]'
                        }`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {person.phone}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`block text-xs font-black uppercase tracking-wider transition-colors ${isDark ? 'text-slate-300 hover:text-amber-300' : 'text-slate-800 hover:text-[#7c3aed]'
                    }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className={`font-black text-xs uppercase tracking-widest mb-5 ${isDark ? 'text-amber-300' : 'text-slate-950'}`} style={{ fontFamily: 'var(--font-heading)' }}>
              Location
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                <div>
                  <span className={`text-sm font-black leading-relaxed block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    C. Abdul Hakeem College<br />
                    Hakeem Nagar, Melvisharam,<br />
                    Ranipet District, TN – 632 509
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href="https://www.google.com/maps/place/C.+Abdul+Hakeem+College+of+Engineering+%26+Technology,+Melvisharam,+Ranipet,+Tamil+Nadu+632509/data=!4m2!3m1!1s0x3bad35d34059d16f:0xb443fab6e00b313f"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 transition-colors shadow-xs"
                    >
                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335" />
                        <circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
                      </svg>
                      <span>Google Maps</span>
                    </a>
                    <a
                      href="https://maps.apple.com/p/~nwAp4fu74pyaQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-950 text-white hover:bg-slate-800 border border-slate-700 transition-colors shadow-xs"
                    >
                      <svg className="w-3 h-3 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.1-.97.04-2.17.65-2.86 1.45-.61.71-1.15 1.87-.99 2.99 1.09.08 2.22-.53 2.86-1.34z" />
                      </svg>
                      <span>Apple Maps</span>
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-2 min-w-0">
                <Phone className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                <a
                  href="tel:+919043293530"
                  className={`text-[10px] sm:text-xs font-black whitespace-nowrap transition-colors ${isDark ? 'text-slate-200 hover:text-amber-300' : 'text-slate-900 hover:text-[#7c3aed]'
                    }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  title="Assistant Professor: Mr. M. Mohamed Rafe (9043293530)"
                >
                  Assistant Professor: Mr. M. Mohamed Rafe (9043293530)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`} />
                <a
                  href="mailto:info@cahcet.edu.in"
                  className={`text-sm font-black transition-colors ${isDark ? 'text-slate-200 hover:text-amber-300' : 'text-slate-900 hover:text-[#7c3aed]'
                    }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  info@cahcet.edu.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-black ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-300 text-slate-800'
          }`}>
          <p>© {currentYear} INFogram&apos;26 · Department of Information Technology, CAHCET. All rights reserved.</p>

          <p className="flex items-center gap-2 text-xs font-black">
            <span>Designed &amp; Developed by</span>
            <a
              href="https://appziio.com"
              target="_blank"
              rel="noopener noreferrer"
              title="appziio — Web & App Development Studio"
              aria-label="Developed by appziio"
              className={`font-black text-xs uppercase tracking-widest transition-all px-3 py-1 rounded-full border ${isDark
                  ? 'bg-purple-500/20 text-amber-300 border-purple-500/40 hover:bg-purple-500/30 shadow-[0_0_12px_rgba(252,211,77,0.4)]'
                  : 'bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30 hover:bg-[#7c3aed]/20 shadow-xs'
                }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              appziio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
