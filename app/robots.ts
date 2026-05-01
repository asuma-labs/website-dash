import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://asuma.my.id';

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/*/', // Mengizinkan halaman profil (e.g., /ditss)
      ],
      disallow: [
        // Auth & System
        '/_next/',
        '/login',
        '/register',
        '/api/',
        
        // Global Panels
        '/dashboard/',
        '/settings/',
        '/private/',

        // User-specific Private Areas (GitHub Style)
        '/*/settings',
        '/*/edit',
        '/*/private',
        
        // Anti-Duplicate Content
        '/*?*', 
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
