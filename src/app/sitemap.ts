 mport { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { jobs as dummyJobs, companies as dummyCompanies } from '@/lib/dummy-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
    }
    return 'https://lokertimika.vercel.app'
  }

  const baseUrl = getBaseUrl()

  let dbJobs: any[] = []
  let dbCompanies: any[] = []

  try {
    dbJobs = await prisma.job.findMany({
      where: { status: 'approved' },
      select: { id: true, updatedAt: true }
    })
  } catch (error) {
    console.error('Failed to fetch jobs for sitemap:', error)
  }

  try {
    dbCompanies = await prisma.company.findMany({
      select: { id: true }
    })
  } catch (error) {
    console.error('Failed to fetch companies for sitemap:', error)
  }

  // Gabungkan lowongan dari Database dan Dummy Data
  const allJobsMap = new Map<string, { id: string; updatedAt?: Date }>()
  dummyJobs.forEach(j => allJobsMap.set(j.id, { id: j.id, updatedAt: new Date() }))
  dbJobs.forEach(j => allJobsMap.set(j.id, { id: j.id, updatedAt: j.updatedAt }))

  const jobUrls = Array.from(allJobsMap.values()).map((job) => ({
    url: `${baseUrl}/job/${job.id}`,
    lastModified: job.updatedAt || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Gabungkan profil perusahaan dari Database dan Dummy Data
  const allCompaniesMap = new Map<string, { id: string; updatedAt?: Date }>()
  Object.values(dummyCompanies).forEach(c => allCompaniesMap.set(c.id, { id: c.id, updatedAt: new Date() }))
  dbCompanies.forEach(c => allCompaniesMap.set(c.id, { id: c.id, updatedAt: undefined }))

  const companyUrls = Array.from(allCompaniesMap.values()).map((company) => ({
    url: `${baseUrl}/perusahaan/${company.id}`,
    lastModified: company.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Halaman Statis Utama
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
      url: `${baseUrl}/perusahaan`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
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
      url: `${baseUrl}/panduan-pasang-loker`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  return [...staticUrls, ...jobUrls, ...companyUrls]
}
