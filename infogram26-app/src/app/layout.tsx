import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit, Orbitron, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover' as const,
  themeColor: '#020810',
};

// ─── Canonical domain ───────────────────────────────────────
const SITE_URL = 'https://infogram26.in';

export const metadata: Metadata = {
  title: {
    default: "INFogram'26 | National Level Technical Symposium — Dept of IT, CAHCET",
    template: "%s | INFogram'26 — CAHCET",
  },
  description:
    "INFogram'26 is the official National Level Technical Symposium organized by the Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology, Melvisharam. 22nd August 2026. Tech events, coding, hackathon & more. Developed by Maithreyan D — maithreyan.in.",
  keywords: [
    "INFogram'26",
    "INFOGRAM 26",
    "infogram26",
    "infogram26.in",
    "INFogram 2026",
    "National Level Technical Symposium 2026",
    "C. Abdul Hakeem College of Engineering and Technology",
    "CAHCET",
    "CAHCET IT Department",
    "Department of Information Technology Melvisharam",
    "IT Symposium Tamil Nadu",
    "Technical Symposium Vellore",
    "Engineering Symposium 2026",
    "College Fest Melvisharam",
    "Codestorm",
    "Tech Talks CAHCET",
    "Hack Forge",
    "Byte Battle",
    "Quest X Treasure Hunt",
    "Battle Verse BGMI",
    "Maithreyan D",
    "maithreyan.in",
    "Maithreyan Developer Portfolio",
  ],
  authors: [
    { name: 'Maithreyan D', url: 'https://maithreyan.in' },
    { name: 'Department of Information Technology, CAHCET', url: SITE_URL },
  ],
  creator: 'Maithreyan D',
  publisher: 'Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    title: "INFogram'26 | National Level Technical Symposium — CAHCET Dept of IT",
    description:
      "Official portal for INFogram'26 — National Level Technical Symposium by Dept of IT, C. Abdul Hakeem College of Engineering & Technology, Melvisharam. 22nd August 2026. Developed by Maithreyan D (maithreyan.in).",
    siteName: "INFogram'26",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "INFogram'26 — National Level Technical Symposium, CAHCET Dept of IT",
        type: 'image/png',
      },
      {
        url: `${SITE_URL}/og-square.png`,
        width: 800,
        height: 800,
        alt: "INFogram'26 Logo",
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "INFogram'26 | National Level Technical Symposium — CAHCET Dept of IT",
    description:
      "Official symposium portal for INFogram'26 by Dept of IT, CAHCET, Melvisharam. 22nd Aug 2026. Developed by Maithreyan D — maithreyan.in",
    creator: '@maithreyan_d',
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'education',
  other: {
    'author': 'Maithreyan D',
    'developer': 'Maithreyan D',
    'portfolio': 'https://maithreyan.in',
    'college': 'C. Abdul Hakeem College of Engineering & Technology',
    'department': 'Department of Information Technology',
    'event-date': '22nd August 2026',
    'location': 'Melvisharam, Tamil Nadu, India',
  },
};

import { ThemeProvider } from '@/context/ThemeContext';

// ─── Structured Data (JSON-LD) ───────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // Website entity
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      'url': SITE_URL,
      'name': "INFogram'26",
      'alternateName': ["INFOGRAM 26", "INFogram 2026", "infogram26"],
      'description': "Official National Level Technical Symposium portal of Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology, Melvisharam. 22nd August 2026.",
      'inLanguage': 'en-IN',
      'image': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}/og-image.png`,
        'width': 1200,
        'height': 630,
      },
      'creator': {
        '@type': 'Person',
        '@id': 'https://maithreyan.in/#person',
        'name': 'Maithreyan D',
        'url': 'https://maithreyan.in',
        'jobTitle': 'Full Stack Web Engineer & Developer',
        'sameAs': ['https://maithreyan.in'],
      },
      'publisher': {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        'name': 'Department of Information Technology, CAHCET',
        'url': SITE_URL,
      },
    },
    // Developer / Person entity
    {
      '@type': 'Person',
      '@id': 'https://maithreyan.in/#person',
      'name': 'Maithreyan D',
      'url': 'https://maithreyan.in',
      'jobTitle': 'Full Stack Web Engineer & Developer',
      'description': "Maithreyan D is the developer and architect of INFogram'26 (infogram26.in), the official symposium portal of the Department of IT, CAHCET, Melvisharam. Visit portfolio: maithreyan.in",
      'sameAs': ['https://maithreyan.in'],
      'worksFor': {
        '@type': 'Organization',
        'name': 'Department of Information Technology, CAHCET',
        'url': SITE_URL,
      },
      'knowsAbout': ['Next.js', 'React', 'TypeScript', 'Full Stack Development', 'UI/UX Design', 'Web Architecture'],
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': 'https://maithreyan.in',
      },
    },
    // Organization (College Department)
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      'name': 'Department of Information Technology',
      'alternateName': 'IT Dept, CAHCET',
      'description': 'Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology, Melvisharam, Tamil Nadu.',
      'url': SITE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}/logo.png`,
        'width': 1254,
        'height': 1254,
      },
      'image': `${SITE_URL}/og-image.png`,
      'parentOrganization': {
        '@type': 'CollegeOrUniversity',
        'name': 'C. Abdul Hakeem College of Engineering & Technology',
        'alternateName': 'CAHCET',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Melvisharam',
          'addressLocality': 'Melvisharam',
          'addressRegion': 'Tamil Nadu',
          'postalCode': '632509',
          'addressCountry': 'IN',
        },
      },
    },
    // Event entity
    {
      '@type': 'Event',
      '@id': `${SITE_URL}/#event`,
      'name': "INFogram'26 — National Level Technical Symposium",
      'alternateName': "INFOGRAM 2026",
      'description': "INFogram'26 is the National Level Technical Symposium organized by the Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology, Melvisharam. Features 16+ events including coding, hackathon, gaming, photography, and more.",
      'url': SITE_URL,
      'image': `${SITE_URL}/og-image.png`,
      'startDate': '2026-08-22T09:30:00+05:30',
      'endDate': '2026-08-22T17:00:00+05:30',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'eventStatus': 'https://schema.org/EventScheduled',
      'isAccessibleForFree': false,
      'location': {
        '@type': 'Place',
        'name': 'C. Abdul Hakeem College of Engineering & Technology',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Melvisharam',
          'addressLocality': 'Melvisharam',
          'addressRegion': 'Tamil Nadu',
          'postalCode': '632509',
          'addressCountry': 'IN',
        },
      },
      'organizer': {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        'name': 'Department of Information Technology, CAHCET',
        'url': SITE_URL,
      },
      'offers': {
        '@type': 'Offer',
        'url': `${SITE_URL}/register`,
        'price': '50',
        'priceCurrency': 'INR',
        'availability': 'https://schema.org/InStock',
        'validFrom': '2026-08-01',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable} ${orbitron.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Canonical & Author */}
        <link rel="canonical" href={SITE_URL} />
        <link rel="author" href="https://maithreyan.in" />

        {/* Developer meta */}
        <meta name="author" content="Maithreyan D" />
        <meta name="developer" content="Maithreyan D — https://maithreyan.in" />
        <meta name="portfolio" content="https://maithreyan.in" />

        {/* College & Event meta */}
        <meta name="college" content="C. Abdul Hakeem College of Engineering & Technology" />
        <meta name="department" content="Department of Information Technology" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Melvisharam, Tamil Nadu, India" />
        <meta name="geo.position" content="12.9367;79.0156" />
        <meta name="ICBM" content="12.9367, 79.0156" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans transition-colors duration-500">
        <ThemeProvider>
          {/* Aurora Background — global pseudo-element blobs via CSS */}
          <div className="aurora-bg" aria-hidden="true" />

          <div className="relative z-10 min-h-screen">
            {children}
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                borderRadius: '16px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
