import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin-login', '/organizer', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin-login', '/organizer', '/api/'],
      },
    ],
    sitemap: 'https://infogram26.in/sitemap.xml',
    host: 'https://infogram26.in',
  };
}
