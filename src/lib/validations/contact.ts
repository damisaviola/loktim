import { z } from "zod";
import { emailSchema, phoneSchema } from "./common";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const digitsOnly = val.replace(/\D/g, "");
        return digitsOnly.length >= 9 && digitsOnly.length <= 16;
      },
      { message: "Nomor WhatsApp / telepon tidak valid (9-16 digit)" }
    ),
  organization: z
    .string()
    .trim()
    .max(150, "Nama instansi / organisasi maksimal 150 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  category: z
    .string()
    .trim()
    .min(1, "Kategori pesan wajib dipilih"),
  subject: z
    .string()
    .trim()
    .min(3, "Subjek pesan minimal 3 karakter")
    .max(200, "Subjek pesan maksimal 200 karakter"),
  message: z
    .string()
    .trim()
    .min(10, "Isi pesan minimal 10 karakter")
    .max(5000, "Isi pesan maksimal 5000 karakter"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
