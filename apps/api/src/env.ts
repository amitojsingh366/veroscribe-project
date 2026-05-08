import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  API_PORT: z.coerce.number().int().positive().default(3001),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().url()
});

export const env = envSchema.parse(process.env);
