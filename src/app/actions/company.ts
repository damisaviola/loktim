'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { getClientIp, checkRateLimit } from '@/lib/rate-limit';
import { revalidatePath } from 'next/cache';

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Format email perusahaan tidak valid. Contoh: hrd@perusahaan.com')
  .max(255, 'Email terlalu panjang');

const phoneSchema = z
  .string()
  .trim()
  .min(9, 'Nomor WhatsApp / telepon minimal 9 angka')
  .max(16, 'Nomor WhatsApp / telepon maksimal 16 angka')
  .regex(/^[0-9+\-\s()]+$/, 'Format nomor telepon tidak valid');

const registerCompanySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Nama perusahaan minimal 3 karakter')
      .max(120, 'Nama perusahaan maksimal 120 karakter'),
    industry: z
      .string()
      .trim()
      .min(2, 'Silakan pilih atau masukkan kategori industri perusahaan'),
    location: z
      .string()
      .trim()
      .min(3, 'Alamat / lokasi penempatan di Mimika minimal 3 karakter')
      .max(200, 'Alamat terlalu panjang'),
    about: z
      .string()
      .trim()
      .min(20, 'Deskripsi singkat profil perusahaan minimal 20 karakter')
      .max(3000, 'Deskripsi perusahaan maksimal 3000 karakter'),
    website: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal(''))
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          try {
            const parsed = new URL(val);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
          } catch {
            return false;
          }
        },
        { message: 'Website harus berupa URL valid dengan awalan http:// atau https://' }
      ),
    picName: z
      .string()
      .trim()
      .min(3, 'Nama kontak HRD / PIC minimal 3 karakter')
      .max(100, 'Nama PIC terlalu panjang'),
    phone: phoneSchema,
    email: emailSchema,
    password: z
      .string()
      .min(6, 'Kata sandi minimal 6 karakter')
      .max(100, 'Kata sandi terlalu panjang'),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
    logoUrl: z.string().trim().optional().nullable().or(z.literal('')),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'Anda harus menyetujui komitmen & syarat ketentuan pasang loker',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok dengan kata sandi',
    path: ['confirmPassword'],
  });

export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;

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

    // 3. Check existing Company in Prisma
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { email: data.email },
          { name: { equals: data.name, mode: 'insensitive' } },
        ],
      },
    });

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
      // If user already exists in Supabase Auth, try signing in to verify if they own it
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
    if (existingCompany) {
      // If company existed without auth link, attach authUserId
      savedCompany = await prisma.company.update({
        where: { id: existingCompany.id },
        data: {
          authUserId: authUserId ?? existingCompany.authUserId,
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
