import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "INFOGRAM'26 — National Level Technical Symposium",
    template: "%s | INFOGRAM'26",
  },
  description:
    "INFOGRAM'26 is the National Level Technical Symposium organized by the Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology. Register now for exciting technical and non-technical events.",
  keywords: [
    "INFOGRAM'26",
    'National Level Technical Symposium',
    'C. Abdul Hakeem College',
    'Department of Information Technology',
    'Technical Events',
    'Non-Technical Events',
    'Engineering Symposium',
    '2026',
  ],
  authors: [{ name: 'Appziio Technologies', url: 'https://appziio.com' }],
  creator: 'Appziio Technologies',
  publisher: 'Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://infogram26.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: "INFOGRAM'26 — National Level Technical Symposium",
    description:
      "National Level Technical Symposium organized by the Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology.",
    siteName: "INFOGRAM'26",
  },
  twitter: {
    card: 'summary_large_image',
    title: "INFOGRAM'26 — National Level Technical Symposium",
    description:
      "National Level Technical Symposium organized by the Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-[#030712] text-white">
        {/* Aurora Background — global, behind everything */}
        <div className="aurora-bg" aria-hidden="true">
          <div
            className="absolute rounded-full"
            style={{
              width: '70vw',
              height: '70vw',
              background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)',
              top: '-20%',
              right: '-20%',
              filter: 'blur(80px)',
              opacity: 0.12,
              animation: 'aurora-1 20s ease-in-out infinite',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '60vw',
              height: '60vw',
              background: 'radial-gradient(circle, #1d4ed8 0%, transparent 70%)',
              bottom: '-20%',
              left: '-15%',
              filter: 'blur(80px)',
              opacity: 0.1,
              animation: 'aurora-2 25s ease-in-out infinite',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '40vw',
              height: '40vw',
              background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
              top: '40%',
              left: '30%',
              filter: 'blur(100px)',
              opacity: 0.05,
              animation: 'aurora-3 30s ease-in-out infinite',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
        </div>

        <div className="relative z-10">
          {children}
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(10, 15, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
