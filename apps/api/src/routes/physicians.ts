import { zValidator } from "@hono/zod-validator";
import { availabilitySlots, physicians as physiciansTable } from "@veroscribe/db";
import { availabilityQuerySchema } from "@veroscribe/shared";
import { and, eq, gte, lte } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../lib/db";
import { validationError } from "../lib/errors";

const paramSchema = z.object({ id: z.string().uuid() });

export const physicians = new Hono()
  .get("/", async (c) => {
    const rows = await db.select().from(physiciansTable).orderBy(physiciansTable.name);
    return c.json(rows);
  })
  .get(
    "/:id",
    zValidator("param", paramSchema, (result, c) => {
      if (!result.success) return validationError(c, result.error.issues);
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const [row] = await db
        .select()
        .from(physiciansTable)
        .where(eq(physiciansTable.id, id));

      if (!row) return c.json({ error: "Physician not found" }, 404);
      return c.json(row);
    }
  )
  .get(
    "/:id/availability",
    zValidator("param", paramSchema, (result, c) => {
      if (!result.success) return validationError(c, result.error.issues);
    }),
    zValidator("query", availabilityQuerySchema, (result, c) => {
      if (!result.success) return validationError(c, result.error.issues);
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const { from, to } = c.req.valid("query");
      const fromDate = from ? new Date(from) : new Date();
      const toDate = to
        ? new Date(to)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const [physician] = await db
        .select()
        .from(physiciansTable)
        .where(eq(physiciansTable.id, id));

      if (!physician) return c.json({ error: "Physician not found" }, 404);

      const slots = await db
        .select()
        .from(availabilitySlots)
        .where(
          and(
            eq(availabilitySlots.physicianId, id),
            gte(availabilitySlots.startAt, fromDate),
            lte(availabilitySlots.startAt, toDate)
          )
        )
        .orderBy(availabilitySlots.startAt);

      return c.json(slots);
    }
  );
