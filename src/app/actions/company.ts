'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { getClientIp, checkRateLimit } from '@/lib/rate-limit';
import { revalidatePath } from 'next/cache';

import { registerCompanySchema, type RegisterCompanyInput } from '@/lib/validations/company';
import { getUserSession } from '@/app/actions/auth';

export async function registerCompanyAction(rawData: {
  name: string;
  industry: string;
  location: string;
  about: string;
  website?: string | null;
  picName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  logoUrl?: string | null;
  agreeTerms: boolean;
}) {
  try {
    // 1. Rate Limiting
    const ip = await getClientIp();
    const rateLimit = checkRateLimit('register_company', ip, 6, 15 * 60 * 1000); // max 6 registrations per 15 mins
    if (!rateLimit.success) {
      return {
        success: false,
        error: rateLimit.error || 'Terlalu banyak permintaan pendaftaran. Silakan coba lagi nanti.',
      };
    }

    // 2. Schema Validation
    const validation = registerCompanySchema.safeParse(rawData);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Data pendaftaran belum valid.';
      const errors = validation.error.issues.map((i) => i.message);
      return {
        success: false,
        error: firstError,
        errors,
      };
    }

    const data = validation.data;

    // 3. Check existing Company in Prisma by email
    const existingCompany = await prisma.company.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existingCompany && existingCompany.authUserId) {
      return {
        success: false,
        error: 'Email ini sudah terhubung dengan akun perusahaan yang terdaftar. Silakan login.',
        isExistingUser: true,
      };
    }

    const supabase = await createClient();

    // 4. Register Supabase Auth user
    let authUserId: string | null = null;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.picName,
          company_name: data.name,
          phone: data.phone,
          industry: data.industry,
        },
      },
    });

    if (signUpError) {
      if (
        signUpError.message.toLowerCase().includes('already registered') ||
        signUpError.message.toLowerCase().includes('already exists')
      ) {
        return {
          success: false,
          error: 'Email ini sudah terdaftar. Silakan login ke akun perusahaan Anda.',
          isExistingUser: true,
        };
      }
      return {
        success: false,
        error: signUpError.message || 'Gagal mendaftarkan akun di sistem autentikasi.',
      };
    }

    authUserId = signUpData?.user?.id || null;

    // 5. Generate fallback logo if none provided
    const finalLogoUrl =
      data.logoUrl && data.logoUrl.trim() !== ''
        ? data.logoUrl.trim()
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            data.name
          )}&backgroundColor=026ca0&textColor=ffffff`;

    // 6. Create or Link Company record in Database
    let savedCompany;
    if (existingCompany && !existingCompany.authUserId) {
      // If company previously posted as guest with matching email and no auth link, attach authUserId
      savedCompany = await prisma.company.update({
        where: { id: existingCompany.id },
        data: {
          authUserId,
          name: data.name || existingCompany.name,
          location: data.location || existingCompany.location,
          about: data.about || existingCompany.about,
          logoUrl: finalLogoUrl || existingCompany.logoUrl,
          email: data.email,
          picName: data.picName || existingCompany.picName,
        },
      });
    } else {
      savedCompany = await prisma.company.create({
        data: {
          name: data.name,
          location: data.location,
          email: data.email,
          about: data.about,
          logoUrl: finalLogoUrl,
          picName: data.picName || null,
          authUserId,
        },
      });
    }

    // 7. Auto-login if session wasn't automatically populated
    if (!signUpData.session) {
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
    }

    revalidatePath('/', 'layout');
    revalidatePath('/perusahaan', 'page');
    revalidatePath('/dashboard', 'page');

    return {
      success: true,
      companyId: savedCompany.id,
      companyName: savedCompany.name,
      redirectUrl: '/dashboard',
      message: 'Perusahaan berhasil didaftarkan!',
    };
  } catch (error: any) {
    console.error('Error in registerCompanyAction:', error);
    return {
      success: false,
      error: error?.message || 'Terjadi kesalahan sistem saat mendaftarkan perusahaan.',
    };
  }
}

export async function deleteCompanyAction(companyId: string) {
  try {
    if (!companyId) {
      return { success: false, error: 'ID Perusahaan tidak valid.' };
    }

    // Check admin authorization
    const admin = await getUserSession();
    if (!admin) {
      return { success: false, error: 'Akses ditolak: Anda harus login sebagai admin.' };
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { jobs: { select: { id: true } } },
    });

    if (!company) {
      return { success: false, error: 'Perusahaan tidak ditemukan di database.' };
    }

    const jobIds = company.jobs.map((j) => j.id);

    // Atomic transaction for deleting company and associated jobs/reports
    await prisma.$transaction(async (tx) => {
      if (jobIds.length > 0) {
        // 1. Delete job reports for company's jobs
        await tx.jobReport.deleteMany({
          where: { jobId: { in: jobIds } },
        });

        // 2. Delete all jobs for this company
        await tx.job.deleteMany({
          where: { companyId },
        });
      }

      // 3. Delete company record
      await tx.company.delete({
        where: { id: companyId },
      });
    });

    // 4. Safely attempt to delete Supabase auth user if authUserId is present
    if (company.authUserId) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && serviceRoleKey) {
          const { createClient: createSupabaseAdminClient } = await import('@supabase/supabase-js');
          const adminSupabase = createSupabaseAdminClient(supabaseUrl, serviceRoleKey);
          await adminSupabase.auth.admin.deleteUser(company.authUserId);
        }
      } catch (authErr) {
        console.warn('Non-fatal: Error deleting Supabase auth user:', authErr);
      }
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin/companies', 'page');
    revalidatePath('/jobs', 'page');

    return {
      success: true,
      message: `Perusahaan "${company.name}" dan seluruh lowongannya berhasil dihapus!`,
    };
  } catch (error: any) {
    console.error('Error in deleteCompanyAction:', error);
    return {
      success: false,
      error: error?.message || 'Gagal menghapus perusahaan.',
    };
  }
}
