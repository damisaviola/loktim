import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { jobs as dummyJobs } from '@/lib/dummy-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lokertimika.com'

  let dbJobs: any[] = []
  try {
    dbJobs = await prisma.job.findMany({
      where: { status: 'approved' },
      select: { id: true, updatedAt: true }
    })
  } catch (error) {
    console.error('Failed to fetch jobs for sitemap:', error)
  }

  const allJobsMap = new Map<string, { id: string; updatedAt?: Date }>()
  dummyJobs.forEach(j => allJobsMap.set(j.id, { id: j.id, updatedAt: new Date() }))
  dbJobs.forEach(j => allJobsMap.set(j.id, { id: j.id, updatedAt: j.updatedAt }))

  const jobUrls = Array.from(allJobsMap.values()).map((job) => ({
    url: `${baseUrl}/job/${job.id}`,
    lastModified: job.updatedAt || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/post`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ketentuan-pasang-loker`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/panduan-pasang-loker`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  return [...staticUrls, ...jobUrls]
}
