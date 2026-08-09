'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/infogram_2k26?utm_source=qr&igsh=N2JqNW5zOWF0cHIw',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Register', path: '/register' },
  { name: 'Contact', path: '/contact' },
];

const legalLinks = [
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms & Conditions', path: '/terms' },
];

const contactPersons = [
  { name: 'Naveeth Khan', phone: '9360257573' },
  { name: 'Farish Sharif', phone: '9487233290' },
  { name: 'Kafil Ahmed', phone: '8940210491' },
  { name: 'MD Thameem', phone: '9361900720' },
];

const officials = [
  { title: 'Chief Patron', names: ['Janab Dr. S. Ziauddeen Ahmed, Chairman', 'Janab V. Mohammed Rizwanullah, Correspondent'] },
  { title: 'Patron', names: ['Dr. M. Sasikumar, Principal', 'Dr. A. Md Muzaffar Hussain, Vice-Principal'] },
  { title: 'HOD', names: ['Dr. S. Umamaheswari, Prof & Head/IT'] },
  { title: 'Convenors', names: ['Mr. M. Mohamed Rafee, AP/IT', 'Mr. I. Abdulla, AP/IT'] },
  { title: 'Student Coordinators', names: ['Final Year IT Students'] },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t transition-colors duration-500 mt-20 ${
      isDark ? 'border-purple-500/20 bg-slate-950 text-slate-300' : 'border-slate-200/80 bg-gradient-to-b from-transparent to-slate-100/70 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 group w-fit"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border shadow-sm flex items-center justify-center overflow-hidden p-1 shrink-0 group-hover:scale-105 transition-transform ${
                isDark ? 'bg-slate-950 border-purple-500/40' : 'bg-white border-slate-200'
              }`}>
                <img 
                  src="/logo.png" 
                  alt="INFOGRAM'26 Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className={`text-xl font-black tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-display)' }}>
                INFOGRAM<span className={isDark ? 'text-amber-300' : 'text-[#7c3aed]'}>&apos;26</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed font-medium max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              The premier national-level technical symposium hosted by the Department of Information Technology, CAHCET.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  className={`w-[44px] h-[44px] flex items-center justify-center rounded-full border transition-all duration-200 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-purple-500/20 hover:text-amber-300 hover:border-amber-300/40' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-[#7c3aed]/10 hover:text-[#7c3aed] hover:border-[#7c3aed]/40'
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
            <h3 className={`font-bold text-sm uppercase tracking-widest mb-5 ${isDark ? 'text-amber-300' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-heading)' }}>Quick Links</h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={`min-h-[40px] flex items-center text-sm font-medium transition-colors ${
                      isDark ? 'text-slate-400 hover:text-amber-300' : 'text-slate-600 hover:text-[#7c3aed]'
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
            <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Contact</h3>
            <ul className="space-y-3">
              {contactPersons.map((person) => (
                <li key={person.name} className="flex items-center gap-3">
                  <Phone className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                  <div>
                    <span className="text-sm text-slate-900 font-bold">{person.name}</span>
                    <span className="text-slate-400 mx-1.5">·</span>
                    <a
                      href={`tel:+91${person.phone}`}
                      className="text-sm text-slate-600 hover:text-[#7c3aed] font-semibold transition-colors"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {person.phone}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="block text-sm text-slate-500 hover:text-[#7c3aed] font-medium transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Location</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600 font-medium leading-relaxed">
                  Hakeem Nagar, Melvisharam,<br />
                  Ranipet District,<br />
                  Tamil Nadu – 632 509
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#7c3aed] shrink-0" />
                <a
                  href="tel:+914172267387"
                  className="text-sm text-slate-600 hover:text-[#7c3aed] font-semibold transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  +91 4172 267387
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#7c3aed] shrink-0" />
                <a
                  href="mailto:info@cahcet.edu.in"
                  className="text-sm text-slate-600 hover:text-[#7c3aed] font-semibold transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  info@cahcet.edu.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <p>© {currentYear} INFOGRAM&apos;26 · Department of Information Technology, CAHCET. All rights reserved.</p>
          <p>
            Designed &amp; Developed by{' '}
            <a
              href="https://appziio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7c3aed] hover:text-[#6d28d9] font-bold transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Appziio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
