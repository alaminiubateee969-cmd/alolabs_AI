import { afterEach, describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'

const originalUrl = process.env.NEXT_PUBLIC_APP_URL

afterEach(() => {
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL
  else process.env.NEXT_PUBLIC_APP_URL = originalUrl
})

describe('public sitemap', () => {
  it('lists canonical public routes once and excludes private and redirecting routes', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com///'
    const urls = sitemap().map((entry) => entry.url)
    expect(urls).toContain('https://example.com')
    expect(urls).toContain('https://example.com/site/platform')
    expect(urls).not.toContain('https://example.com/site')
    expect(urls).not.toContain('https://example.com/login')
    expect(urls).not.toContain('https://example.com/dashboard')
    expect(new Set(urls).size).toBe(urls.length)
  })
})
