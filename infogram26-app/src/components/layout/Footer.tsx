'use client';

import Link from 'next/link';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

const socialLinks = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: '#',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
];

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Register', path: '/register' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const legalLinks = [
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms & Conditions', path: '/terms' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-gradient-to-b from-transparent to-black/30 text-white/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 group w-fit"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="w-9 h-9 bg-sky-500/15 rounded-xl flex items-center justify-center group-hover:bg-sky-500/25 transition-colors">
                <Zap className="w-5 h-5 text-sky-400" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                INFOGRAM<span className="text-sky-400">&apos;26</span>
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
                  aria-label={s.label}
                  className="w-[44px] h-[44px] flex items-center justify-center rounded-full bg-white/5 border border-white/8 text-white/50 hover:bg-sky-400/10 hover:text-sky-400 hover:border-sky-400/30 transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="min-h-[40px] flex items-center text-sm text-white/50 hover:text-sky-400 transition-colors"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Legal</h3>
            <ul className="space-y-1 mb-6">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="min-h-[40px] flex items-center text-sm text-white/50 hover:text-sky-400 transition-colors"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/admin-login"
              className="min-h-[40px] flex items-center text-sm text-white/30 hover:text-white/60 transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Admin Login →
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-sm text-white/50 leading-relaxed">
                  Hakeem Nagar, Melvisharam,<br />
                  Ranipet District,<br />
                  Tamil Nadu – 632 509
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href="tel:+914172267387"
                  className="text-sm text-white/50 hover:text-sky-400 transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  +91 4172 267387
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href="mailto:info@cahcet.edu.in"
                  className="text-sm text-white/50 hover:text-sky-400 transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  info@cahcet.edu.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {currentYear} INFOGRAM&apos;26 · Department of Information Technology, CAHCET. All rights reserved.</p>
          <p>
            Designed &amp; Developed by{' '}
            <a
              href="https://appziio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
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
