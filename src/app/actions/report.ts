'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getUserSession } from './auth'
import { jobs as dummyJobs } from '@/lib/dummy-data'

export async function reportJobAction(jobId: string, reason: string, details?: string) {
  try {
    if (!jobId || !reason) {
      return { success: false, error: 'Data laporan tidak lengkap' }
    }

    // Cek apakah job ada di database (bukan dummy job)
    const jobExists = await prisma.job.findUnique({
      where: { id: jobId }
    })

    if (!jobExists) {
      const isDummy = dummyJobs.some(j => j.id === jobId)
      if (isDummy) {
        // Jika ini adalah data dummy, pura-pura sukses saja 
        // karena tidak bisa masuk database (akan error foreign key)
        return { success: true }
      }
      return { success: false, error: 'Lowongan tidak ditemukan' }
    }

    await prisma.jobReport.create({
      data: {
        jobId,
        reason,
        details: details || null,
        status: 'pending'
      }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to report job:', error)
    return { success: false, error: 'Gagal mengirim laporan' }
  }
}

export async function getJobReportsAction() {
  try {
    const user = await getUserSession()
    if (!user) throw new Error('Unauthorized')

    const reports = await prisma.jobReport.findMany({
      include: {
        job: {
          include: {
            company: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return reports.map((r: any) => ({
      ...r,
      createdAt: r.createdAt.toISOString()
    }))
  } catch (error: any) {
    console.error('Failed to get job reports:', error)
    return []
  }
}

export async function resolveReportAction(reportId: string) {
  try {
    const user = await getUserSession()
    if (!user) return { success: false, error: 'Unauthorized' }

    await prisma.jobReport.update({
      where: { id: reportId },
      data: { status: 'resolved' }
    })

    revalidatePath('/admin/reports')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to resolve report:', error)
    return { success: false, error: 'Gagal menandai laporan' }
  }
}

export async function deleteReportAction(reportId: string) {
  try {
    const user = await getUserSession()
    if (!user) return { success: false, error: 'Unauthorized' }

    await prisma.jobReport.delete({
      where: { id: reportId }
    })

    revalidatePath('/admin/reports')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete report:', error)
    return { success: false, error: 'Gagal menghapus laporan' }
  }
}
