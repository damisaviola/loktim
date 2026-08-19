import { z } from "zod";

/**
 * Reusable primitive schemas
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email wajib diisi")
  .email("Format email tidak valid. Contoh: nama@perusahaan.com")
  .max(255, "Email terlalu panjang (maksimal 255 karakter)");

export const phoneSchema = z
  .string()
  .trim()
  .min(9, "Nomor telepon / WhatsApp minimal 9 digit")
  .max(16, "Nomor telepon / WhatsApp maksimal 16 digit")
  .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid. Gunakan angka dan tanda + jika perlu");

export const whatsappSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .or(z.literal(""))
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      const digitsOnly = val.replace(/\D/g, "");
      return digitsOnly.length >= 9 && digitsOnly.length <= 15;
    },
    { message: "Nomor WhatsApp belum benar. Isi 9-15 angka, contoh: 081234567890" }
  );

export const urlSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .or(z.literal(""))
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      try {
        const parsed = new URL(val);
        return (parsed.protocol === "http:" || parsed.protocol === "https:") && val.length <= 2048;
      } catch {
        return false;
      }
    },
    { message: "Link belum benar. Harus berupa URL valid diawali http:// atau https://" }
  );

/**
 * Helper to convert ZodError into a structured field-to-message map
 */
export function formatZodErrors(error: z.ZodError): {
  fieldErrors: Record<string, string>;
  generalErrors: string[];
} {
  const fieldErrors: Record<string, string> = {};
  const generalErrors: string[] = [];

  for (const issue of error.issues) {
    if (issue.path && issue.path.length > 0) {
      const fieldKey = issue.path.join(".");
      if (!fieldErrors[fieldKey]) {
        fieldErrors[fieldKey] = issue.message;
      }
    } else {
      generalErrors.push(issue.message);
    }
  }

  return { fieldErrors, generalErrors };
}
