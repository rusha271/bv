import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: process.env.NODE_ENV === 'production' ? 'https://bharmaspace.com/sitemap.xml' : 'http://localhost:3000/sitemap.xml',
  };
}
