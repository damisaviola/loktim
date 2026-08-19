import { z } from "zod";
import { emailSchema } from "./common";

export const newsletterSchema = z.object({
  email: emailSchema,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
