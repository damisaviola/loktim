import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://lokertimika.vercel.app').replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/manage/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
