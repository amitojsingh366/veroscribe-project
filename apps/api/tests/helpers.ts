import { db } from "@veroscribe/db";
import { availabilitySlots, bookings, physicians } from "@veroscribe/db";

export async function resetTestDb() {
  await db.delete(bookings);
  await db.delete(availabilitySlots);
  await db.delete(physicians);
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
