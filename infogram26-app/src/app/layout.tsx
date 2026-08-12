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

export const metadata: Metadata = {
  title: {
    default: "INFogram'26 — National Level Technical Symposium | CAHCET Dept of IT",
    template: "%s | INFogram'26",
  },
  description:
    "INFogram'26 is the National Level Technical Symposium organized by the Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology. Designed & Engineered by Maithreyan D (https://maithreyan.in). Register now for exciting technical and non-technical events.",
  keywords: [
    "INFogram'26",
    "INFOGRAM'26",
    "INFogram 26",
    "INFOGRAM26",
    'National Level Technical Symposium',
    'C. Abdul Hakeem College of Engineering & Technology',
    'CAHCET',
    'Department of Information Technology',
    'Maithreyan D',
    'Maithreyan D Portfolio',
    'maithreyan.in',
    'Maithreyan Developer',
    'Technical Events',
    'Non-Technical Events',
    'Engineering Symposium',
    'Melvisharam',
    'Codestorm',
    'Tech Talks',
    'Hack Forge',
    'Battle Verse',
    'Quest X',
    '2026',
  ],
  authors: [
    { name: 'Maithreyan D', url: 'https://maithreyan.in' },
    { name: 'Department of IT, CAHCET', url: 'https://cahcet.edu.in' }
  ],
  creator: 'Maithreyan D (https://maithreyan.in)',
  publisher: 'Maithreyan D & Department of Information Technology, CAHCET',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://infogram26.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://infogram26.vercel.app',
    title: "INFogram'26 — National Level Technical Symposium | CAHCET",
    description:
      "Official portal for INFogram'26 National Level Technical Symposium by Department of IT, CAHCET. Engineered & Developed by Maithreyan D (https://maithreyan.in).",
    siteName: "INFogram'26",
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'INFogram26 Symposium Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "INFogram'26 — National Level Technical Symposium | CAHCET",
    description:
      "National Level Technical Symposium by Department of IT, CAHCET. Engineered & Developed by Maithreyan D (https://maithreyan.in).",
    creator: '@maithreyan',
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
  other: {
    'author': 'Maithreyan D',
    'developer': 'Maithreyan D (https://maithreyan.in)',
    'portfolio': 'https://maithreyan.in',
  },
};

import { ThemeProvider } from '@/context/ThemeContext';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://infogram26.vercel.app/#website',
      'url': 'https://infogram26.vercel.app',
      'name': "INFogram'26",
      'description': 'National Level Technical Symposium organized by Department of IT, CAHCET',
      'author': {
        '@type': 'Person',
        '@id': 'https://maithreyan.in/#person',
        'name': 'Maithreyan D',
        'url': 'https://maithreyan.in',
        'jobTitle': 'Website Architect & Software Engineer',
        'sameAs': ['https://maithreyan.in']
      },
      'creator': {
        '@type': 'Person',
        'name': 'Maithreyan D',
        'url': 'https://maithreyan.in'
      }
    },
    {
      '@type': 'Person',
      '@id': 'https://maithreyan.in/#person',
      'name': 'Maithreyan D',
      'url': 'https://maithreyan.in',
      'jobTitle': 'Full Stack Engineer & Web Architect',
      'sameAs': ['https://maithreyan.in']
    },
    {
      '@type': 'Event',
      'name': "INFogram'26 National Level Technical Symposium",
      'startDate': '2026-08-22T09:00:00+05:30',
      'endDate': '2026-08-22T17:00:00+05:30',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'eventStatus': 'https://schema.org/EventScheduled',
      'location': {
        '@type': 'Place',
        'name': 'C. Abdul Hakeem College of Engineering & Technology',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Melvisharam',
          'addressRegion': 'Tamil Nadu',
          'postalCode': '632509',
          'addressCountry': 'IN'
        }
      },
      'organizer': {
        '@type': 'Organization',
        'name': 'Department of Information Technology, CAHCET',
        'url': 'https://infogram26.vercel.app'
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable} ${orbitron.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="author" href="https://maithreyan.in" />
        <meta name="author" content="Maithreyan D" />
        <meta name="developer" content="Maithreyan D (https://maithreyan.in)" />
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
