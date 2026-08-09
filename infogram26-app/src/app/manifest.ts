import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "INFOGRAM'26 | National Level Technical Symposium",
    short_name: "INFOGRAM'26",
    description: "National Level Technical Symposium organized by the Department of Information Technology, C. Abdul Hakeem College of Engineering & Technology.",
    start_url: '/',
    display: 'standalone',
    background_color: '#020810',
    theme_color: '#020810',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
