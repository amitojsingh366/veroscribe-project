import { eq, sql } from "drizzle-orm";
import { db } from "./client";
import {
  availabilitySlots,
  bookings,
  physicians,
  type NewBooking,
  type NewPhysician,
  type NewSlot
} from "./schema";

const seedPhysicians: NewPhysician[] = [
  {
    name: "Dr. Amelia Hartwell",
    specialty: "Family Medicine",
    initials: "AH",
    rating: 4.9,
    reviews: 312,
    nextAvailable: "Tomorrow",
    bio: "Preventive care, chronic conditions, women's health.",
    location: "Riverside Clinic · 2.1 mi",
    accepts: ["BlueCross", "Aetna", "Self-pay"],
    avatarTone: "linear-gradient(135deg, #DCE8F4 0%, #EAD9DA 100%)"
  },
  {
    name: "Dr. Marcus Okafor",
    specialty: "Internal Medicine",
    initials: "MO",
    rating: 4.8,
    reviews: 218,
    nextAvailable: "Mon, May 11",
    bio: "Cardiometabolic health, diabetes, hypertension.",
    location: "Downtown Practice · 0.8 mi",
    accepts: ["BlueCross", "United", "Self-pay"],
    avatarTone: "linear-gradient(135deg, #E8E0F2 0%, #DDEAE2 100%)"
  },
  {
    name: "Dr. Priya Sundaram",
    specialty: "Dermatology",
    initials: "PS",
    rating: 5,
    reviews: 184,
    nextAvailable: "Today",
    bio: "Acne, eczema, skin cancer screening, cosmetic consults.",
    location: "Northside Specialty · 3.4 mi",
    accepts: ["Aetna", "Cigna", "Self-pay"],
    avatarTone: "linear-gradient(135deg, #F4DDDC 0%, #E2DAEA 100%)"
  },
  {
    name: "Dr. Jonah Reyes",
    specialty: "Pediatrics",
    initials: "JR",
    rating: 4.9,
    reviews: 426,
    nextAvailable: "Fri, May 9",
    bio: "Newborn through adolescent care, ADHD, asthma.",
    location: "Riverside Clinic · 2.1 mi",
    accepts: ["BlueCross", "United", "Medicaid"],
    avatarTone: "linear-gradient(135deg, #E0EFE4 0%, #F2E5D8 100%)"
  }
];

const prototypeSlots = [
  { label: "8:30 AM", available: true },
  { label: "9:00 AM", available: false },
  { label: "9:30 AM", available: true },
  { label: "10:00 AM", available: true },
  { label: "10:30 AM", available: false },
  { label: "11:00 AM", available: true },
  { label: "1:30 PM", available: true },
  { label: "2:00 PM", available: true },
  { label: "2:30 PM", available: false },
  { label: "3:00 PM", available: true },
  { label: "3:30 PM", available: true },
  { label: "4:00 PM", available: false }
];

const prototypeDays = [
  { label: "Mon, May 11", isoDate: "2026-05-11", available: false },
  { label: "Tue, May 12", isoDate: "2026-05-12", available: true },
  { label: "Wed, May 13", isoDate: "2026-05-13", available: true },
  { label: "Thu, May 14", isoDate: "2026-05-14", available: true },
  { label: "Fri, May 15", isoDate: "2026-05-15", available: false },
  { label: "Sat, May 16", isoDate: "2026-05-16", available: true }
];

const seedBookings = [
  {
    patient: "Eleanor Chen",
    email: "eleanor.chen@example.com",
    phone: "(415) 555-0182",
    initials: "EC",
    date: "Tue, May 12",
    time: "9:30 AM",
    duration: 30,
    reason: "Annual physical & lab review",
    status: "confirmed",
    visitType: "In-person",
    requested: "2026-05-06T14:14:00-07:00",
    insurance: "BlueCross",
    flagged: false,
    notes: "Patient requests blood draw same visit."
  },
  {
    patient: "Marcus Whitfield",
    email: "marcus.whitfield@example.com",
    phone: "(415) 555-0114",
    initials: "MW",
    date: "Tue, May 12",
    time: "10:00 AM",
    duration: 20,
    reason: "Persistent cough, 2 weeks",
    status: "pending",
    visitType: "In-person",
    requested: "2026-05-07T09:02:00-07:00",
    insurance: "Aetna",
    flagged: true,
    notes: "First-time patient. Needs intake form."
  },
  {
    patient: "Sofia Reyes",
    email: "sofia.reyes@example.com",
    phone: "(415) 555-0138",
    initials: "SR",
    date: "Tue, May 12",
    time: "11:00 AM",
    duration: 20,
    reason: "Medication refill - sertraline",
    status: "confirmed",
    visitType: "Telehealth",
    requested: "2026-05-05T16:30:00-07:00",
    insurance: "Self-pay",
    flagged: false,
    notes: ""
  },
  {
    patient: "Daniel Park",
    email: "daniel.park@example.com",
    phone: "(415) 555-0150",
    initials: "DP",
    date: "Tue, May 12",
    time: "1:30 PM",
    duration: 30,
    reason: "Follow-up - knee MRI results",
    status: "pending",
    visitType: "In-person",
    requested: "2026-05-07T11:48:00-07:00",
    insurance: "United",
    flagged: false,
    notes: ""
  },
  {
    patient: "Aisha Bello",
    email: "aisha.bello@example.com",
    phone: "(415) 555-0121",
    initials: "AB",
    date: "Tue, May 12",
    time: "2:00 PM",
    duration: 20,
    reason: "Tension headaches, 3+ weeks",
    status: "confirmed",
    visitType: "In-person",
    requested: "2026-05-04T10:11:00-07:00",
    insurance: "BlueCross",
    flagged: false,
    notes: ""
  },
  {
    patient: "Theo Lindgren",
    email: "theo.lindgren@example.com",
    phone: "(415) 555-0199",
    initials: "TL",
    date: "Wed, May 13",
    time: "8:30 AM",
    duration: 20,
    reason: "Travel vaccinations - Southeast Asia",
    status: "cancelled",
    visitType: "In-person",
    requested: "2026-05-03T18:22:00-07:00",
    insurance: "Self-pay",
    flagged: false,
    notes: "Patient cancelled - rescheduling next week."
  },
  {
    patient: "Nadia Rosenbaum",
    email: "nadia.rosenbaum@example.com",
    phone: "(415) 555-0188",
    initials: "NR",
    date: "Wed, May 13",
    time: "9:00 AM",
    duration: 30,
    reason: "New patient consult",
    status: "pending",
    visitType: "In-person",
    requested: "2026-05-07T15:55:00-07:00",
    insurance: "Cigna",
    flagged: true,
    notes: "Needs records transfer from previous PCP."
  },
  {
    patient: "Wesley Ahmadi",
    email: "wesley.ahmadi@example.com",
    phone: "(415) 555-0147",
    initials: "WA",
    date: "Wed, May 13",
    time: "10:30 AM",
    duration: 20,
    reason: "Sleep difficulty, fatigue",
    status: "completed",
    visitType: "Telehealth",
    requested: "2026-05-06T08:01:00-07:00",
    insurance: "BlueCross",
    flagged: false,
    notes: ""
  }
] as const;

function slotDateTime(isoDate: string, label: string) {
  const [time, period] = label.split(" ");
  const [hourText, minuteText] = time!.split(":");
  let hour = Number(hourText);
  const minute = Number(minuteText);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return new Date(
    `${isoDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-07:00`
  );
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

async function main() {
  console.log("Wiping existing data");
  await db.delete(bookings);
  await db.delete(availabilitySlots);
  await db.delete(physicians);
  await db.execute(sql`create extension if not exists pgcrypto`);

  console.log("Inserting physicians");
  const insertedPhysicians = await db
    .insert(physicians)
    .values(seedPhysicians)
    .returning();

  const hartwell = insertedPhysicians[0];
  if (!hartwell) throw new Error("Expected at least one physician");

  const bookingsBySlot = new Map(
    seedBookings.map((booking) => [`${booking.date}:${booking.time}`, booking])
  );
  const slotByKey = new Map<string, string>();

  console.log("Generating prototype availability");
  for (const physician of insertedPhysicians) {
    const rows: NewSlot[] = [];

    for (const day of prototypeDays) {
      for (const slot of prototypeSlots) {
        const startAt = slotDateTime(day.isoDate, slot.label);
        const booking = physician.id === hartwell.id
          ? bookingsBySlot.get(`${day.label}:${slot.label}`)
          : undefined;
        const isBooked = Boolean(booking && booking.status !== "cancelled");

        rows.push({
          physicianId: physician.id,
          startAt,
          endAt: addMinutes(startAt, 30),
          status: day.available && slot.available && !isBooked ? "available" : "booked"
        });
      }
    }

    const insertedSlots = await db.insert(availabilitySlots).values(rows).returning();

    if (physician.id === hartwell.id) {
      for (const slot of insertedSlots) {
        const day = prototypeDays.find(
          (candidate) => candidate.isoDate === slot.startAt.toISOString().slice(0, 10)
        );
        const label = prototypeSlots.find((candidate) => {
          const date = slotDateTime(day?.isoDate ?? "", candidate.label);
          return date.getTime() === slot.startAt.getTime();
        });
        if (day && label) {
          slotByKey.set(`${day.label}:${label.label}`, slot.id);
        }
      }
    }

    console.log(`  ${physician.name}: ${rows.length} slots`);
  }

  console.log("Inserting demo bookings");
  const bookingRows: NewBooking[] = seedBookings.map((booking) => {
    const slotId = slotByKey.get(`${booking.date}:${booking.time}`);
    if (!slotId) throw new Error(`Missing slot for ${booking.date} ${booking.time}`);

    return {
      physicianId: hartwell.id,
      slotId,
      patientName: booking.patient,
      patientEmail: booking.email,
      patientPhone: booking.phone,
      reasonForVisit: booking.reason,
      visitType: booking.visitType,
      durationMinutes: booking.duration,
      insurance: booking.insurance,
      flagged: booking.flagged,
      notes: booking.notes || null,
      status: booking.status,
      createdAt: new Date(booking.requested)
    };
  });

  await db.insert(bookings).values(bookingRows);

  const [cancelled] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.status, "cancelled"));

  if (cancelled) {
    await db
      .update(availabilitySlots)
      .set({ status: "available" })
      .where(eq(availabilitySlots.id, cancelled.slotId));
  }

  console.log("Seed complete");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
