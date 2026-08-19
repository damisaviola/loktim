import { z } from "zod";

export const reportJobSchema = z.object({
  jobId: z
    .string()
    .trim()
    .min(1, "ID Lowongan tidak valid"),
  reason: z
    .string()
    .trim()
    .min(3, "Alasan pelaporan minimal 3 karakter")
    .max(200, "Alasan pelaporan maksimal 200 karakter"),
  details: z
    .string()
    .trim()
    .max(1000, "Rincian laporan maksimal 1000 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type ReportJobInput = z.infer<typeof reportJobSchema>;
