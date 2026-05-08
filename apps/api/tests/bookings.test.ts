import { beforeEach, describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";
import { app } from "../src/app";
import { resetTestDb, seedOnePhysicianAndSlot } from "./helpers";

const client = testClient(app);

describe("bookings routes", () => {
  beforeEach(async () => {
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
        reasonForVisit: "Annual checkup",
        visitType: "In-person"
      }
    });

    expect(res.status).toBe(201);
    const body = await res.json();
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
        reasonForVisit: "Annual checkup",
        visitType: "In-person"
      }
    });

    expect(res.status).toBe(400);
  });
});
