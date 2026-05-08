import { beforeEach, describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";
import { app } from "../src/app";
import { resetTestDb, seedOnePhysicianAndSlot } from "./helpers";

const client = testClient(app);

describe("physicians routes", () => {
  beforeEach(async () => {
    await resetTestDb();
  });

  it("lists physicians", async () => {
    await seedOnePhysicianAndSlot();
    const res = await client.api.physicians.$get();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
  });
});
