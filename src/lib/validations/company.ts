import { z } from "zod";
import { emailSchema, phoneSchema, urlSchema } from "./common";

export const registerCompanySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Nama perusahaan minimal 3 karakter")
      .max(120, "Nama perusahaan maksimal 120 karakter"),
    industry: z
      .string()
      .trim()
      .min(2, "Silakan pilih kategori industri perusahaan"),
    location: z
      .string()
      .trim()
      .min(3, "Alamat / lokasi penempatan di Mimika minimal 3 karakter")
      .max(200, "Alamat terlalu panjang (maksimal 200 karakter)"),
    about: z
      .string()
      .trim()
      .min(20, "Deskripsi singkat profil perusahaan minimal 20 karakter")
      .max(3000, "Deskripsi perusahaan maksimal 3000 karakter"),
    website: urlSchema,
    picName: z
      .string()
      .trim()
      .min(3, "Nama penanggung jawab / pemilik minimal 3 karakter")
      .max(100, "Nama penanggung jawab maksimal 100 karakter"),
    phone: phoneSchema,
    email: emailSchema,
    password: z
      .string()
      .min(6, "Kata sandi minimal 6 karakter")
      .max(100, "Kata sandi maksimal 100 karakter"),
    confirmPassword: z
      .string()
      .min(1, "Konfirmasi kata sandi wajib diisi"),
    logoUrl: urlSchema,
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "Anda harus menyetujui syarat & komitmen pemasangan lowongan",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;

export const loginCompanySchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export type LoginCompanyInput = z.infer<typeof loginCompanySchema>;

export const updateCompanyProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama perusahaan minimal 3 karakter")
    .max(120, "Nama perusahaan maksimal 120 karakter"),
  industry: z
    .string()
    .trim()
    .min(2, "Silakan pilih kategori industri"),
  location: z
    .string()
    .trim()
    .min(3, "Alamat minimal 3 karakter")
    .max(200, "Alamat maksimal 200 karakter"),
  about: z
    .string()
    .trim()
    .min(20, "Deskripsi profil minimal 20 karakter")
    .max(3000, "Deskripsi profil maksimal 3000 karakter"),
  website: urlSchema,
  picName: z
    .string()
    .trim()
    .min(3, "Nama penanggung jawab / pemilik minimal 3 karakter")
    .max(100, "Nama penanggung jawab maksimal 100 karakter"),
  phone: phoneSchema,
  logoUrl: urlSchema,
});

export type UpdateCompanyProfileInput = z.infer<typeof updateCompanyProfileSchema>;
