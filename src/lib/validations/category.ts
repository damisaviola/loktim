import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(50, "Nama kategori maksimal 50 karakter"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
