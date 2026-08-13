import type { Metadata } from 'next';

const SITE_URL = 'https://infogram26.in';

export const metadata: Metadata = {
  title: "Events — INFogram'26 | All Technical & Non-Technical Events",
  description:
    "Explore all 16+ events at INFogram'26 — National Level Technical Symposium by Dept of IT, CAHCET, Melvisharam. Tech Talks, Codestorm, Hack Forge, Byte Battle, Pixel Craft, Open Source, Battle Verse, Mind Matrix, Quest X, Frame Craft, Flavour Fusion, Artistry, Mic Drop, Reel It Feel It & more. 22nd August 2026.",
  keywords: [
    "INFogram'26 Events",
    "CAHCET Technical Events 2026",
    "Tech Talks",
    "Codestorm",
    "Hack Forge",
    "Pixel Craft",
    "Byte Battle",
    "Open Source",
    "Clash of Minds",
    "Mind Matrix",
    "Quest X Treasure Hunt",
    "Frame Craft Photography",
    "Flavour Fusion Fireless Cooking",
    "Artistry Mehendi",
    "Battle Verse BGMI Free Fire",
    "Mic Drop Open Mic",
    "Reel It Feel It",
    "Fun Fiesta",
    "INFogram 26 Technical Symposium",
    "CAHCET IT Department Events",
  ],
  alternates: { canonical: `${SITE_URL}/events` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/events`,
    title: "Events — INFogram'26 | 16+ Technical & Non-Technical Events",
    description:
      "Explore all events at INFogram'26 National Level Technical Symposium — CAHCET Dept of IT, 22nd Aug 2026. Coding, Hackathon, Gaming, Photography & more.",
    siteName: "INFogram'26",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "INFogram'26 Events" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Events — INFogram'26 | CAHCET Dept of IT",
    description: "16+ events at INFogram'26 — Tech Talks, Hackathon, Gaming & more. 22nd Aug 2026, CAHCET.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
