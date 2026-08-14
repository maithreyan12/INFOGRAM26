import type { Metadata } from 'next';

const SITE_URL = 'https://infogram26.in';

export const metadata: Metadata = {
  title: "Contact — INFogram'26 | Get in Touch | CAHCET Dept of IT",
  description:
    "Contact the INFogram'26 team — National Level Technical Symposium by Department of IT, C. Abdul Hakeem College of Engineering & Technology, Melvisharam. Reach out to event coordinators, staff coordinator Mr. M. Mohamed Rafe (AP/IT), or our student team. 22nd August 2026.",
  keywords: [
    "Contact INFogram'26",
    "INFogram 26 Contact",
    "CAHCET IT Department Contact",
    "Mr. M. Mohamed Rafe AP IT",
    "INFogram 2026 Organizers",
    "CAHCET Symposium Contact",
    "Melvisharam Technical Symposium Contact",
  ],
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/contact`,
    title: "Contact — INFogram'26 | CAHCET Dept of IT",
    description:
      "Contact the INFogram'26 organizing team — Dept of IT, CAHCET, Melvisharam. Reach coordinators, HOD & student team.",
    siteName: "INFogram'26",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Contact INFogram'26" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact — INFogram'26 | CAHCET",
    description: "Get in touch with INFogram'26 organizing team — CAHCET Dept of IT, Melvisharam.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
