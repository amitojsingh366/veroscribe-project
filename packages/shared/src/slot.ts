import { z } from "zod";

export const slotStatusSchema = z.enum(["available", "held", "booked"]);

export const slotSchema = z.object({
  id: z.string().uuid(),
  physicianId: z.string().uuid(),
  startAt: z.string().datetime().or(z.date()),
  endAt: z.string().datetime().or(z.date()),
  status: slotStatusSchema
});
export type Slot = z.infer<typeof slotSchema>;

export const availabilityQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional()
});
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
