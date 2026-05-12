import { z } from "zod";

const envSchema = z.object({
  API_INTERNAL_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3001")
});

export const env = envSchema.parse({
  API_INTERNAL_URL: process.env.API_INTERNAL_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
});
