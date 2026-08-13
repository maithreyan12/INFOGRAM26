import type { Metadata } from 'next';

const SITE_URL = 'https://infogram26.in';

export const metadata: Metadata = {
  title: "Register — INFogram'26 | Sign Up for Technical Symposium Events",
  description:
    "Register for INFogram'26 — National Level Technical Symposium by Department of IT, C. Abdul Hakeem College of Engineering & Technology, Melvisharam. Register online for Tech Talks, Codestorm, Hack Forge, Byte Battle, Pixel Craft, Open Source & 10+ more events. 22nd August 2026. Developed by Maithreyan D (maithreyan.in).",
  keywords: [
    "INFogram'26 Registration",
    "Register INFogram 26",
    "CAHCET Symposium Registration",
    "Technical Symposium Online Registration",
    "INFogram 2026 Register",
    "Engineering College Event Registration",
    "Melvisharam IT Department Registration",
    "CAHCET IT Events Register",
    "Maithreyan D",
    "maithreyan.in",
  ],
  alternates: { canonical: `${SITE_URL}/register` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/register`,
    title: "Register for INFogram'26 — National Level Technical Symposium | CAHCET",
    description:
      "Register online for INFogram'26 events — Technical Symposium by Dept of IT, CAHCET, Melvisharam. 22nd August 2026. Developed by Maithreyan D.",
    siteName: "INFogram'26",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Register for INFogram'26" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Register — INFogram'26 | CAHCET Dept of IT",
    description: "Register for INFogram'26 National Level Technical Symposium — 22nd Aug 2026, CAHCET, Melvisharam.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

// JSON-LD for registration page
const registerJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/register`,
  'url': `${SITE_URL}/register`,
  'name': "Register — INFogram'26",
  'description': "Online registration for INFogram'26 National Level Technical Symposium events.",
  'isPartOf': { '@id': `${SITE_URL}/#website` },
  'potentialAction': {
    '@type': 'RegisterAction',
    'name': "Register for INFogram'26",
    'target': {
      '@type': 'EntryPoint',
      'urlTemplate': `${SITE_URL}/register`,
      'actionPlatform': ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
    },
    'object': {
      '@type': 'Event',
      'name': "INFogram'26 National Level Technical Symposium",
      'startDate': '2026-08-22',
      'location': {
        '@type': 'Place',
        'name': 'C. Abdul Hakeem College of Engineering & Technology, Melvisharam',
      },
    },
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(registerJsonLd) }}
      />
      {children}
    </>
  );
}
