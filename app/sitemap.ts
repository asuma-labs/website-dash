// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://asuma.my.id'

  const staticRoutes = [
    { url: baseUrl, priority: 1.0, changefreq: 'daily' as const },
    { url: `${baseUrl}/jadibot`, priority: 0.9, changefreq: 'weekly' as const },
    { url: `${baseUrl}/explore`, priority: 0.8, changefreq: 'weekly' as const },
    { url: `${baseUrl}/shop`, priority: 0.8, changefreq: 'weekly' as const },
    { url: `${baseUrl}/i/contact`, priority: 0.5, changefreq: 'monthly' as const },
    { url: `${baseUrl}/i/privacy`, priority: 0.3, changefreq: 'monthly' as const },
    { url: `${baseUrl}/i/terms`, priority: 0.3, changefreq: 'monthly' as const },
  ]

  return staticRoutes.map((route) => ({
    url: route.url,
    lastModified: new Date(),
    changeFrequency: route.changefreq,
    priority: route.priority,
  }))
}
