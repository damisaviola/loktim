'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getUserSession } from './auth'
import { jobs as dummyJobs, companies as dummyCompanies } from '@/lib/dummy-data'
import { sendEmail } from '@/lib/email'
import JobReportedEmail from '@/emails/JobReportedEmail'
import DOMPurify from '@/lib/sanitize'
import { getClientIp, checkRateLimit } from '@/lib/rate-limit'
import { reportJobSchema } from '@/lib/validations/report'

export interface JobReportItem {
  id: string
  jobId: string
  reason: string
  details: string | null
  status: string // 'pending' | 'resolved'
  createdAt: string
  job?: {
    id: string
    title: string
    category?: string
    type?: string
    location?: string | null
    status?: string | null
    company?: {
      id?: string
      name: string
      logoUrl?: string | null
      location?: string | null
    } | null
  } | null
}

export async function reportJobAction(jobId: string, reason: string, details?: string) {
  try {
    const ip = await getClientIp();
    const rateLimit = checkRateLimit('report_job', ip, 5, 10 * 60 * 1000); // 5 reports per 10 mins
    if (!rateLimit.success) {
      return { success: false, error: rateLimit.error };
    }
    const rawData = { jobId, reason, details };
    const validatedData = reportJobSchema.safeParse(rawData);

    if (!validatedData.success) {
      const errorMessage = validatedData.error.issues.map(err => err.message).join(", ");
      return { success: false, error: errorMessage };
    }

    const safeReason = DOMPurify.sanitize(validatedData.data.reason.trim());
    const safeDetails = validatedData.data.details ? DOMPurify.sanitize(validatedData.data.details.trim()) : null;

    // 1. Cek apakah job ada di database
    let jobExists: any = null;
    try {
      jobExists = await prisma.job.findUnique({
        where: { id: validatedData.data.jobId },
        include: { company: true }
      });
    } catch (dbErr) {
      console.warn("Database lookup warning for report job:", dbErr);
    }

    // 2. Jika lowongan belum ada di DB tapi ada di dummy data, sinkronkan ke DB agar relasi FK tersimpan
    if (!jobExists) {
      const dummy = dummyJobs.find(j => j.id === validatedData.data.jobId);
      if (dummy) {
        try {
          const compData = dummy.company || (dummy.companyId ? (dummyCompanies as any)[dummy.companyId] : null);
          const compId = dummy.companyId || compData?.id || 'c_default';
          
          await prisma.company.upsert({
            where: { id: compId },
            update: {},
            create: {
              id: compId,
              name: compData?.name || 'Perusahaan Mitra',
              location: compData?.location || 'Timika, Papua Tengah',
              logoUrl: compData?.logoUrl || null,
              about: compData?.about || null,
            }
          });

          jobExists = await prisma.job.upsert({
            where: { id: dummy.id },
            update: {},
            create: {
              id: dummy.id,
              title: dummy.title,
              companyId: compId,
              type: dummy.type || 'Penuh Waktu',
              category: dummy.category || 'Umum',
              education: dummy.education || 'SMA/SMK',
              experience: dummy.experience || 'Fresh Graduate',
              gender: dummy.gender || 'Semua',
              ageRange: dummy.ageRange || 'Semua Usia',
              salaryMin: dummy.salaryMin || null,
              salaryMax: dummy.salaryMax || null,
              description: dummy.description || '',
              requirements: Array.isArray(dummy.requirements) ? dummy.requirements : [],
              location: dummy.location || 'Timika',
              contactUrl: dummy.contactUrl || '',
              status: 'approved',
            },
            include: { company: true }
          });
        } catch (seedErr) {
          console.error('Failed to auto-sync dummy job for report:', seedErr);
        }
      }
    }

    if (!jobExists) {
      return { success: false, error: 'Lowongan tidak ditemukan' };
    }

    // 3. Simpan laporan ke database
    await prisma.jobReport.create({
      data: {
        jobId: jobExists.id,
        reason: safeReason,
        details: safeDetails,
        status: 'pending'
      }
    });

    // 4. Kirim notifikasi email ke admin (asynchronous)
    const adminEmail = process.env.ADMIN_EMAIL || 'damimaturbongs@gmail.com';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lokertimika.com';
    
    sendEmail({
      to: adminEmail,
      subject: `🚨 Laporan Lowongan Baru: ${jobExists.title}`,
      react: JobReportedEmail({
        jobTitle: jobExists.title,
        reportReason: safeReason,
        reportDetails: safeDetails || undefined,
        adminLink: `${baseUrl}/admin/reports` 
      }) as any
    }).catch((emailErr) => {
      console.warn("Report email notification warning:", emailErr);
    });

    revalidatePath('/admin/reports');
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    console.error('Failed to report job:', error);
    return { success: false, error: 'Gagal mengirim laporan. Silakan coba lagi.' };
  }
}

export async function getJobReportsAction(): Promise<JobReportItem[]> {
  try {
    const user = await getUserSession();
    if (!user) {
      console.warn('Unauthorized attempt to fetch job reports');
      return [];
    }

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
    });

    return reports.map((r: any) => {
      let jobData = r.job;
      // Fallback ke data dummy jika relasi job null di database
      if (!jobData) {
        const dummy = dummyJobs.find(j => j.id === r.jobId);
        if (dummy) {
          jobData = dummy;
        }
      }

      return {
        id: r.id,
        jobId: r.jobId,
        reason: r.reason,
        details: r.details || null,
        status: r.status || 'pending',
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        job: jobData ? {
          id: jobData.id,
          title: jobData.title,
          category: jobData.category || 'Umum',
          type: jobData.type || 'Penuh Waktu',
          location: jobData.location || null,
          status: jobData.status || null,
          company: jobData.company ? {
            id: jobData.company.id,
            name: jobData.company.name,
            logoUrl: jobData.company.logoUrl || null,
            location: jobData.company.location || null,
          } : null
        } : null
      };
    });
  } catch (error: any) {
    console.error('Failed to get job reports:', error);
    return [];
  }
}

export async function updateReportStatusAction(reportId: string, status: 'pending' | 'resolved') {
  try {
    const user = await getUserSession();
    if (!user) return { success: false, error: 'Unauthorized: Sesi admin tidak valid' };

    await prisma.jobReport.update({
      where: { id: reportId },
      data: { status }
    });

    revalidatePath('/admin/reports');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update report status:', error);
    return { success: false, error: 'Gagal memperbarui status laporan' };
  }
}

export async function resolveReportAction(reportId: string) {
  return updateReportStatusAction(reportId, 'resolved');
}

export async function deleteReportAction(reportId: string) {
  try {
    const user = await getUserSession();
    if (!user) return { success: false, error: 'Unauthorized: Sesi admin tidak valid' };

    await prisma.jobReport.delete({
      where: { id: reportId }
    });

    revalidatePath('/admin/reports');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete report:', error);
    return { success: false, error: 'Gagal menghapus laporan' };
  }
}
