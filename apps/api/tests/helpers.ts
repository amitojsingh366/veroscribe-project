import { db } from "@veroscribe/db";
import { availabilitySlots, physicians } from "@veroscribe/db";
import { sql } from "drizzle-orm";

export async function resetTestDb() {
  await db.execute(sql`
    delete from bookings
    where patient_email in ('jane@example.com')
      or physician_id in (
        select id from physicians where name = 'Dr. Test Physician'
      )
  `);
  await db.execute(sql`
    delete from availability_slots
    where physician_id in (
      select id from physicians where name = 'Dr. Test Physician'
    )
  `);
  await db.execute(sql`delete from physicians where name = 'Dr. Test Physician'`);
}

export async function seedOnePhysicianAndSlot() {
  const [physician] = await db
    .insert(physicians)
    .values({
      name: "Dr. Test Physician",
      specialty: "Family Medicine",
      initials: "TP",
      bio: "Test physician"
    })
    .returning();

  if (!physician) throw new Error("Failed to seed physician");

  const startAt = new Date("2026-05-12T09:30:00-07:00");
  const [slot] = await db
    .insert(availabilitySlots)
    .values({
      physicianId: physician.id,
      startAt,
      endAt: new Date(startAt.getTime() + 30 * 60_000),
      status: "available"
    })
    .returning();

  if (!slot) throw new Error("Failed to seed slot");

  return { physician, slot };
}
