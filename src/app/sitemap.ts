import type { MetadataRoute } from 'next'

/** Public, canonical routes only; private and redirecting routes are omitted. */
const PUBLIC_PATHS: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/site/platform', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/site/solutions', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/site/work', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/site/pricing', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/site/insights', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/site/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/site/careers', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/site/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/site/press', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/site/diagrams', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/design', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/brand', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/invoice', priority: 0.3, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.alolabs.net').replace(/\/+$/, '')
  const lastModified = new Date()
  return PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
