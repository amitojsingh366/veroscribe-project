import { zValidator } from "@hono/zod-validator";
import { availabilitySlots, bookings as bookingsTable } from "@veroscribe/db";
import {
  bookingStatusSchema,
  createBookingInputSchema,
  type BookingStatus,
  updateBookingStatusInputSchema
} from "@veroscribe/shared";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../lib/db";
import { validationError } from "../lib/errors";

const paramSchema = z.object({ id: z.string().uuid() });
const listQuerySchema = z.object({
  status: bookingStatusSchema.optional(),
  physicianId: z.string().uuid().optional()
});

const legalTransitions: Record<
  BookingStatus,
  Array<"confirmed" | "cancelled" | "completed">
> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["cancelled", "completed"],
  cancelled: [],
  completed: []
} as const;

function hasDatabaseCode(error: unknown, code: string): boolean {
  if (!error || typeof error !== "object") return false;
  const record = error as { cause?: unknown; code?: unknown };
  return record.code === code || hasDatabaseCode(record.cause, code);
}

export const bookings = new Hono()
  .post(
    "/",
    zValidator("json", createBookingInputSchema, (result, c) => {
      if (!result.success) return validationError(c, result.error.issues);
    }),
    async (c) => {
      const input = c.req.valid("json");

      try {
        const result = await db.transaction(async (tx) => {
          const [claimedSlot] = await tx
            .update(availabilitySlots)
            .set({ status: "booked" })
            .where(
              and(
                eq(availabilitySlots.id, input.slotId),
                eq(availabilitySlots.physicianId, input.physicianId),
                eq(availabilitySlots.status, "available")
              )
            )
            .returning({ id: availabilitySlots.id });

          if (!claimedSlot) {
            const [slot] = await tx
              .select({ id: availabilitySlots.id })
              .from(availabilitySlots)
              .where(
                and(
                  eq(availabilitySlots.id, input.slotId),
                  eq(availabilitySlots.physicianId, input.physicianId)
                )
              );

            return { kind: slot ? "slot-unavailable" : "slot-not-found" } as const;
          }

          const [row] = await tx
            .insert(bookingsTable)
            .values({
              physicianId: input.physicianId,
              slotId: input.slotId,
              patientName: input.patientName,
              patientEmail: input.patientEmail,
              patientPhone: input.patientPhone,
              patientDateOfBirth: input.patientDateOfBirth,
              reasonForVisit: input.reasonForVisit,
              visitType: input.visitType,
              insurance: input.insurance ?? null,
              status: "pending"
            })
            .returning();

          if (!row) throw new Error("Failed to create booking");
          return { kind: "created", row } as const;
        });

        if (result.kind === "slot-not-found") {
          return c.json({ error: "Slot not found" }, 404);
        }

        if (result.kind === "slot-unavailable") {
          return c.json({ error: "Slot already booked" }, 409);
        }

        return c.json(result.row, 201);
      } catch (error) {
        if (hasDatabaseCode(error, "23505")) {
          return c.json({ error: "Slot already booked" }, 409);
        }
        throw error;
      }
    }
  )
  .get(
    "/",
    zValidator("query", listQuerySchema, (result, c) => {
      if (!result.success) return validationError(c, result.error.issues);
    }),
    async (c) => {
      const { status, physicianId } = c.req.valid("query");
      const rows = await db.query.bookings.findMany({
        where: (booking, { and, eq }) =>
          and(
            status ? eq(booking.status, status) : undefined,
            physicianId ? eq(booking.physicianId, physicianId) : undefined
          ),
        with: { physician: true, slot: true },
        orderBy: (booking, { desc }) => [desc(booking.createdAt)]
      });

      return c.json(rows);
    }
  )
  .get(
    "/:id",
    zValidator("param", paramSchema, (result, c) => {
      if (!result.success) return validationError(c, result.error.issues);
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const row = await db.query.bookings.findFirst({
        where: (booking, { eq }) => eq(booking.id, id),
        with: { physician: true, slot: true }
      });

      if (!row) return c.json({ error: "Booking not found" }, 404);
      return c.json(row);
    }
  )
  .patch(
    "/:id",
    zValidator("param", paramSchema, (result, c) => {
      if (!result.success) return validationError(c, result.error.issues);
    }),
    zValidator("json", updateBookingStatusInputSchema, (result, c) => {
      if (!result.success) return validationError(c, result.error.issues);
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const { status, notes, slotId } = c.req.valid("json");
      const [existing] = await db
        .select()
        .from(bookingsTable)
        .where(eq(bookingsTable.id, id));

      if (!existing) return c.json({ error: "Booking not found" }, 404);

      if (status && !legalTransitions[existing.status].includes(status)) {
        return c.json(
          { error: `Illegal transition ${existing.status} -> ${status}` },
          409
        );
      }

      if (slotId && existing.status !== "pending" && existing.status !== "confirmed") {
        return c.json({ error: "Terminal bookings cannot be rescheduled" }, 409);
      }

      if (status === "cancelled" && slotId && slotId !== existing.slotId) {
        return c.json({ error: "Cannot reschedule while cancelling" }, 409);
      }

      try {
        const result = await db.transaction(async (tx) => {
          if (slotId && slotId !== existing.slotId) {
            const [claimedSlot] = await tx
              .update(availabilitySlots)
              .set({ status: "booked" })
              .where(
                and(
                  eq(availabilitySlots.id, slotId),
                  eq(availabilitySlots.physicianId, existing.physicianId),
                  eq(availabilitySlots.status, "available")
                )
              )
              .returning({ id: availabilitySlots.id });

            if (!claimedSlot) {
              const [nextSlot] = await tx
                .select({ id: availabilitySlots.id })
                .from(availabilitySlots)
                .where(
                  and(
                    eq(availabilitySlots.id, slotId),
                    eq(availabilitySlots.physicianId, existing.physicianId)
                  )
                );

              return {
                kind: nextSlot ? "slot-unavailable" : "slot-not-found"
              } as const;
            }

            await tx
              .update(availabilitySlots)
              .set({ status: "available" })
              .where(eq(availabilitySlots.id, existing.slotId));
          }

          if (status === "cancelled") {
            await tx
              .update(availabilitySlots)
              .set({ status: "available" })
              .where(eq(availabilitySlots.id, existing.slotId));
          }

          const [row] = await tx
            .update(bookingsTable)
            .set({
              ...(status ? { status } : {}),
              ...(slotId ? { slotId } : {}),
              notes: notes ?? existing.notes
            })
            .where(eq(bookingsTable.id, id))
            .returning();

          if (!row) throw new Error("Failed to update booking");
          return { kind: "updated", row } as const;
        });

        if (result.kind === "slot-not-found") {
          return c.json({ error: "Slot not found" }, 404);
        }

        if (result.kind === "slot-unavailable") {
          return c.json({ error: "Slot already booked" }, 409);
        }

        return c.json(result.row);
      } catch (error) {
        if (hasDatabaseCode(error, "23505")) {
          return c.json({ error: "Slot already booked" }, 409);
        }
        throw error;
      }
    }
  );
