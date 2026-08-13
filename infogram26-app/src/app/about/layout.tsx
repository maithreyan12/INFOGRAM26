import type { Metadata } from 'next';

const SITE_URL = 'https://infogram26.in';

export const metadata: Metadata = {
  title: "About CAHCET & INFogram'26 | C. Abdul Hakeem College of Engineering & Technology",
  description:
    "Learn about C. Abdul Hakeem College of Engineering & Technology (CAHCET), Melvisharam, Ranipet, Tamil Nadu — established 1998, affiliated to Anna University, approved by AICTE. Home of the INFogram'26 National Level Technical Symposium organized by the Department of Information Technology.",
  keywords: [
    'C. Abdul Hakeem College of Engineering and Technology',
    'CAHCET',
    'CAHCET Melvisharam',
    'CAHCET IT Department',
    'Department of Information Technology CAHCET',
    'Engineering College Melvisharam',
    'Anna University Affiliated College',
    'AICTE Approved College Tamil Nadu',
    'Ranipet Engineering College',
    'Melvisharam Muslim Educational Society',
    'MMES',
    "INFogram'26",
    'Technical Symposium CAHCET',
    'Dr. S. Umamaheswari HOD IT',
    'Maithreyan D',
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/about`,
    title: "About CAHCET — C. Abdul Hakeem College of Engineering & Technology",
    description:
      "CAHCET, Melvisharam (est. 1998) — Anna University affiliated, AICTE approved engineering college. Department of IT proudly presents INFogram'26 National Level Technical Symposium.",
    siteName: "INFogram'26",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "INFogram'26 — C. Abdul Hakeem College of Engineering & Technology",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "About CAHCET | C. Abdul Hakeem College of Engineering & Technology",
    description: "CAHCET, Melvisharam — est. 1998. Anna University affiliated. INFogram'26 organized by Dept of IT.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

// JSON-LD for CAHCET college details — helps Google show rich Knowledge Panel
const cahcetJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollegeOrUniversity',
      '@id': 'https://cahcet.edu.in/#college',
      'name': 'C. Abdul Hakeem College of Engineering & Technology',
      'alternateName': ['CAHCET', 'C. Abdul Hakeem College', 'CAHCET Melvisharam'],
      'description':
        "C. Abdul Hakeem College of Engineering & Technology (CAHCET) is a premier engineering institution established in 1998 under the Melvisharam Muslim Educational Society (MMES), located in Hakeem Nagar, Melvisharam, Ranipet District, Tamil Nadu. Affiliated to Anna University, approved by AICTE, and certified by TÜV SÜD ISO 21001.",
      'url': 'https://cahcet.edu.in',
      'sameAs': [
        'https://cahcet.edu.in',
        'https://www.google.com/maps/place/C.+Abdul+Hakeem+College+of+Engineering',
      ],
      'foundingDate': '1998',
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}/logo.png`,
      },
      'image': `${SITE_URL}/og-image.png`,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Hakeem Nagar, Melvisharam',
        'addressLocality': 'Melvisharam',
        'addressRegion': 'Tamil Nadu',
        'postalCode': '632509',
        'addressCountry': 'IN',
      },
      'telephone': '+918248963928',
      'email': 'info@cahcet.edu.in',
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '12.9367',
        'longitude': '79.0156',
      },
      'hasMap': 'https://www.google.com/maps/place/C.+Abdul+Hakeem+College+of+Engineering+%26+Technology,+Melvisharam',
      'department': {
        '@type': 'Organization',
        'name': 'Department of Information Technology',
        'description': "The Department of Information Technology at CAHCET organizes INFogram'26, a National Level Technical Symposium held on 22nd August 2026.",
        'url': SITE_URL,
      },
      'accreditedBy': [
        {
          '@type': 'Organization',
          'name': 'AICTE',
          'description': 'All India Council for Technical Education',
        },
        {
          '@type': 'Organization',
          'name': 'UGC',
          'description': 'University Grants Commission — Listed under 2(F) & 12(B)',
        },
      ],
      'member': {
        '@type': 'Organization',
        'name': 'Anna University',
        'description': 'Affiliated to Anna University, Chennai, Tamil Nadu',
      },
      'keywords': 'CAHCET, Melvisharam, Engineering College, Tamil Nadu, Anna University, AICTE, IT Department, INFogram 26',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/about`,
      'url': `${SITE_URL}/about`,
      'name': "About CAHCET & INFogram'26",
      'description': "About page for INFogram'26 and C. Abdul Hakeem College of Engineering & Technology",
      'isPartOf': { '@id': `${SITE_URL}/#website` },
      'about': { '@id': 'https://cahcet.edu.in/#college' },
    },
  ],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cahcetJsonLd) }}
      />
      {children}
    </>
  );
}
