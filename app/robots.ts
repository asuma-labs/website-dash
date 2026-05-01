import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://asuma.my.id';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/_next/',
        '/api/',
        '/login',
        '/register',
        '/dashboard/',
        '/settings/',
        '/private/',
        '/*/settings',
        '/*/edit',
        '/*/private',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
