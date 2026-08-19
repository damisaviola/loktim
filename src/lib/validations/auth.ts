import { z } from "zod";
import { emailSchema } from "./common";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const adminLoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username / Email admin minimal 3 karakter")
    .max(100, "Username / Email admin maksimal 100 karakter"),
  password: z
    .string()
    .min(6, "Kata sandi minimal 6 karakter")
    .max(100, "Kata sandi maksimal 100 karakter"),
});

export const adminLegacyLoginSchema = adminLoginSchema;

export type LoginInput = z.infer<typeof loginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminLegacyLoginInput = z.infer<typeof adminLegacyLoginSchema>;
