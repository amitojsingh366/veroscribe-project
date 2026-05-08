import { z } from "zod";

export const physicianSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  specialty: z.string(),
  initials: z.string(),
  photoUrl: z.string().url().nullable(),
  bio: z.string().nullable(),
  rating: z.number().nullable(),
  reviews: z.number().nullable(),
  nextAvailable: z.string().nullable(),
  location: z.string().nullable(),
  accepts: z.array(z.string()),
  avatarTone: z.string().nullable()
});
export type Physician = z.infer<typeof physicianSchema>;
