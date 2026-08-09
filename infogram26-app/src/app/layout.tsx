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
    },
  },
};

import { ThemeProvider } from '@/context/ThemeContext';

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
      </head>
      <body className="antialiased font-sans transition-colors duration-500">
        <ThemeProvider>
          {/* Aurora Background — global, behind everything */}
          <div className="aurora-bg" aria-hidden="true">
            <div
              className="absolute rounded-full aurora-blob-1"
              style={{
                width: '75vw',
                height: '75vw',
                background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(56,189,248,0.18) 50%, transparent 70%)',
                top: '-15%',
                left: '-15%',
                filter: 'blur(90px)',
                opacity: 0.85,
                willChange: 'transform',
                transform: 'translateZ(0)',
              }}
            />
            <div
              className="absolute rounded-full aurora-blob-2"
              style={{
                width: '70vw',
                height: '70vw',
                background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(52,211,153,0.20) 50%, transparent 70%)',
                bottom: '-15%',
                right: '-15%',
                filter: 'blur(90px)',
                opacity: 0.8,
                willChange: 'transform',
                transform: 'translateZ(0)',
              }}
            />
          </div>

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
