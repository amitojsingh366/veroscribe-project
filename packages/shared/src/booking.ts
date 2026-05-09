import { z } from "zod";
import { physicianSchema } from "./physician";
import { slotSchema } from "./slot";

export const bookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "completed"
]);
export type BookingStatus = z.infer<typeof bookingStatusSchema>;

export const visitTypeSchema = z.enum(["In-person", "Telehealth"]);
export type VisitType = z.infer<typeof visitTypeSchema>;

export const createBookingInputSchema = z.object({
  physicianId: z.string().uuid(),
  slotId: z.string().uuid(),
  patientName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(120),
  patientEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  patientPhone: z
    .string()
    .trim()
    .min(7, "Phone too short")
    .max(32)
    .regex(/^[+\d\s().-]+$/, "Phone may contain digits, spaces, +, -, () only"),
  patientDateOfBirth: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  reasonForVisit: z
    .string()
    .trim()
    .min(5, "Please describe your reason (5+ chars)")
    .max(2000),
  visitType: visitTypeSchema.default("In-person"),
  insurance: z.string().trim().max(80).optional()
});
export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;

export const updateBookingStatusInputSchema = z
  .object({
    status: z.enum(["confirmed", "cancelled", "completed"]).optional(),
    notes: z.string().trim().max(2000).optional(),
    slotId: z.string().uuid().optional()
  })
  .refine((input) => input.status || input.notes !== undefined || input.slotId, {
    message: "Provide a status, notes, or slotId"
  });
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusInputSchema>;

export const bookingSchema = z.object({
  id: z.string().uuid(),
  physicianId: z.string().uuid(),
  slotId: z.string().uuid(),
  patientName: z.string(),
  patientEmail: z.string().email(),
  patientPhone: z.string(),
  patientDateOfBirth: z.string().nullable(),
  reasonForVisit: z.string(),
  visitType: visitTypeSchema,
  insurance: z.string().nullable(),
  flagged: z.boolean(),
  notes: z.string().nullable(),
  status: bookingStatusSchema,
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date())
});
export type Booking = z.infer<typeof bookingSchema>;

export const bookingWithRelationsSchema = bookingSchema.extend({
  physician: physicianSchema.optional(),
  slot: slotSchema.optional()
});
export type BookingWithRelations = z.infer<typeof bookingWithRelationsSchema>;
