export default async function sitemap() {
  const baseUrl = 'https://asuma.my.id';

  const staticRoutes = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/jadibot', priority: 0.9, changefreq: 'weekly' },
    { url: '/shop', priority: 0.8, changefreq: 'weekly' },
    { url: '/i/contact', priority: 0.5, changefreq: 'monthly' },
    { url: '/i/privacy', priority: 0.3, changefreq: 'monthly' },
    { url: '/i/terms', priority: 0.3, changefreq: 'monthly' },
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changefreq,
    priority: route.priority,
  }));
}
