'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

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

  return (
    <footer className="border-t border-[#00d4ff]/[0.08] bg-gradient-to-b from-transparent to-[#020a14] text-white/50 mt-20">
      {/* Officials Section 
      <div className="border-b border-[#00d4ff]/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h3 className="text-center text-[#00d4ff] font-bold text-sm uppercase tracking-[0.2em] mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
            Organizing Committee
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {officials.map((official) => (
              <div key={official.title}>
                <h4 className="text-[#00d4ff] font-semibold text-xs uppercase tracking-[0.15em] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {official.title}
                </h4>
                {official.names.map((name, i) => (
                  <p key={i} className="text-white/40 text-xs leading-relaxed">{name}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>*/}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 group w-fit"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="w-11 h-11 rounded-full overflow-hidden border border-[#00d4ff]/40 bg-[#00d4ff]/10 flex items-center justify-center shadow-[0_0_12px_rgba(0,212,255,0.4)] group-hover:border-[#00d4ff] transition-all">
                <img 
                  src="/logo-circle.png" 
                  alt="INFOGRAM'26 Logo" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                />
              </div>
              <span className="text-xl font-black tracking-wider text-white" style={{ fontFamily: 'var(--font-display)' }}>
                INFOGRAM<span className="text-[#00d4ff]">&apos;26</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
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
                  className="w-[44px] h-[44px] flex items-center justify-center rounded-full bg-white/5 border border-[#00d4ff]/10 text-white/50 hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] hover:border-[#00d4ff]/30 transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Quick Links</h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="min-h-[40px] flex items-center text-sm text-white/50 hover:text-[#00d4ff] transition-colors"
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
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Contact</h3>
            <ul className="space-y-3">
              {contactPersons.map((person) => (
                <li key={person.name} className="flex items-center gap-3">
                  <Phone className="w-3.5 h-3.5 text-[#00d4ff] shrink-0" />
                  <div>
                    <span className="text-sm text-white/70 font-medium">{person.name}</span>
                    <span className="text-white/40 mx-1.5">·</span>
                    <a
                      href={`tel:+91${person.phone}`}
                      className="text-sm text-white/50 hover:text-[#00d4ff] transition-colors"
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
                  className="block text-sm text-white/30 hover:text-[#00d4ff] transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Location</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00d4ff] shrink-0 mt-0.5" />
                <span className="text-sm text-white/50 leading-relaxed">
                  Hakeem Nagar, Melvisharam,<br />
                  Ranipet District,<br />
                  Tamil Nadu – 632 509
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#00d4ff] shrink-0" />
                <a
                  href="tel:+914172267387"
                  className="text-sm text-white/50 hover:text-[#00d4ff] transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  +91 4172 267387
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#00d4ff] shrink-0" />
                <a
                  href="mailto:info@cahcet.edu.in"
                  className="text-sm text-white/50 hover:text-[#00d4ff] transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  info@cahcet.edu.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#00d4ff]/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {currentYear} INFOGRAM&apos;26 · Department of Information Technology, CAHCET. All rights reserved.</p>
          <p>
            Designed &amp; Developed by{' '}
            <a
              href="https://appziio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00d4ff] hover:text-[#00e5ff] font-semibold transition-colors"
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
