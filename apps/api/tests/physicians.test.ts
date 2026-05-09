import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { availabilitySlots } from "@veroscribe/db";
import { eq } from "drizzle-orm";
import { testClient } from "hono/testing";
import { app } from "../src/app";
import { db } from "../src/lib/db";
import { resetTestDb, seedOnePhysicianAndSlot } from "./helpers";

const client = testClient(app);

describe("physicians routes", () => {
  beforeEach(async () => {
    await resetTestDb();
  });

  afterEach(async () => {
    await resetTestDb();
  });

  it("lists physicians", async () => {
    await seedOnePhysicianAndSlot();
    const res = await client.api.physicians.$get();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.some((physician) => physician.name === "Dr. Test Physician")).toBe(
      true
    );
  });

  it("includes booked slots in physician availability", async () => {
    const { physician, slot } = await seedOnePhysicianAndSlot();
    await db
      .update(availabilitySlots)
      .set({ status: "booked" })
      .where(eq(availabilitySlots.id, slot.id));

    const res = await client.api.physicians[":id"].availability.$get({
      param: { id: physician.id },
      query: {
        from: "2026-05-12T00:00:00.000Z",
        to: "2026-05-13T00:00:00.000Z"
      }
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    if (!Array.isArray(body)) throw new Error("Expected availability response");
    expect(
      body.some((candidate: { status: string }) => candidate.status === "booked")
    ).toBe(true);
  });
});
