import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { availabilitySlots } from "@veroscribe/db";
import { eq } from "drizzle-orm";
import { testClient } from "hono/testing";
import { app } from "../src/app";
import { db } from "../src/lib/db";
import { resetTestDb, seedOnePhysicianAndSlot } from "./helpers";

const client = testClient(app);

describe("bookings routes", () => {
  beforeEach(async () => {
    await resetTestDb();
  });

  afterEach(async () => {
    await resetTestDb();
  });

  it("creates a booking with valid payload", async () => {
    const { physician, slot } = await seedOnePhysicianAndSlot();
    const res = await client.api.bookings.$post({
      json: {
        physicianId: physician.id,
        slotId: slot.id,
        patientName: "Jane Roe",
        patientEmail: "jane@example.com",
        patientPhone: "+1 555 010 1234",
        patientDateOfBirth: "1988-04-18",
        reasonForVisit: "Annual checkup",
        visitType: "In-person"
      }
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    if (!("status" in body)) throw new Error("Expected booking response");
    expect(body.status).toBe("pending");
  });

  it("rejects invalid email with 400", async () => {
    const { physician, slot } = await seedOnePhysicianAndSlot();
    const res = await client.api.bookings.$post({
      json: {
        physicianId: physician.id,
        slotId: slot.id,
        patientName: "Jane Roe",
        patientEmail: "not-an-email",
        patientPhone: "+1 555 010 1234",
        patientDateOfBirth: "1988-04-18",
        reasonForVisit: "Annual checkup",
        visitType: "In-person"
      }
    });

    expect(res.status).toBe(400);
  });

  it("allows only one booking to claim an available slot", async () => {
    const { physician, slot } = await seedOnePhysicianAndSlot();
    const payload = {
      physicianId: physician.id,
      slotId: slot.id,
      patientEmail: "jane@example.com",
      patientName: "Jane Roe",
      patientPhone: "+1 555 010 1234",
      patientDateOfBirth: "1988-04-18",
      reasonForVisit: "Annual checkup",
      visitType: "In-person" as const
    };

    const responses = await Promise.all([
      client.api.bookings.$post({ json: payload }),
      client.api.bookings.$post({
        json: {
          ...payload,
          patientEmail: "jane.second@example.com",
          patientName: "Jane Second"
        }
      })
    ]);

    expect(responses.map((response) => response.status).sort()).toEqual([201, 409]);
  });

  it("reschedules a booking into an available slot", async () => {
    const { physician, slot } = await seedOnePhysicianAndSlot();
    const nextStartAt = new Date("2026-05-12T10:00:00-07:00");
    const [nextSlot] = await db
      .insert(availabilitySlots)
      .values({
        physicianId: physician.id,
        startAt: nextStartAt,
        endAt: new Date(nextStartAt.getTime() + 30 * 60_000),
        status: "available"
      })
      .returning();

    if (!nextSlot) throw new Error("Expected reschedule slot");

    const createRes = await client.api.bookings.$post({
      json: {
        physicianId: physician.id,
        slotId: slot.id,
        patientName: "Jane Roe",
        patientEmail: "jane@example.com",
        patientPhone: "+1 555 010 1234",
        patientDateOfBirth: "1988-04-18",
        reasonForVisit: "Annual checkup",
        visitType: "In-person"
      }
    });
    const booking = await createRes.json();
    if (!("id" in booking)) throw new Error("Expected booking response");

    const res = await client.api.bookings[":id"].$patch({
      json: { slotId: nextSlot.id },
      param: { id: booking.id }
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    if (!("slotId" in body)) throw new Error("Expected updated booking response");
    expect(body.slotId).toBe(nextSlot.id);

    const [oldSlot] = await db
      .select()
      .from(availabilitySlots)
      .where(eq(availabilitySlots.id, slot.id));
    const [updatedSlot] = await db
      .select()
      .from(availabilitySlots)
      .where(eq(availabilitySlots.id, nextSlot.id));

    expect(oldSlot?.status).toBe("available");
    expect(updatedSlot?.status).toBe("booked");
  });

  it("rejects rescheduling into a slot that is already booked", async () => {
    const { physician, slot } = await seedOnePhysicianAndSlot();
    const nextStartAt = new Date("2026-05-12T10:00:00-07:00");
    const [nextSlot] = await db
      .insert(availabilitySlots)
      .values({
        physicianId: physician.id,
        startAt: nextStartAt,
        endAt: new Date(nextStartAt.getTime() + 30 * 60_000),
        status: "booked"
      })
      .returning();

    if (!nextSlot) throw new Error("Expected reschedule slot");

    const createRes = await client.api.bookings.$post({
      json: {
        physicianId: physician.id,
        slotId: slot.id,
        patientName: "Jane Roe",
        patientEmail: "jane@example.com",
        patientPhone: "+1 555 010 1234",
        patientDateOfBirth: "1988-04-18",
        reasonForVisit: "Annual checkup",
        visitType: "In-person"
      }
    });
    const booking = await createRes.json();
    if (!("id" in booking)) throw new Error("Expected booking response");

    const res = await client.api.bookings[":id"].$patch({
      json: { slotId: nextSlot.id },
      param: { id: booking.id }
    });

    expect(res.status).toBe(409);

    const [oldSlot] = await db
      .select()
      .from(availabilitySlots)
      .where(eq(availabilitySlots.id, slot.id));
    const [updatedSlot] = await db
      .select()
      .from(availabilitySlots)
      .where(eq(availabilitySlots.id, nextSlot.id));

    expect(oldSlot?.status).toBe("booked");
    expect(updatedSlot?.status).toBe("booked");
  });
});
