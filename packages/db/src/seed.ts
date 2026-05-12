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
  { label: "8:30 AM" },
  { label: "9:00 AM" },
  { label: "9:30 AM" },
  { label: "10:00 AM" },
  { label: "10:30 AM" },
  { label: "11:00 AM" },
  { label: "1:30 PM" },
  { label: "2:00 PM" },
  { label: "2:30 PM" },
  { label: "3:00 PM" },
  { label: "3:30 PM" },
  { label: "4:00 PM" }
];

const prototypeMayStartDate = new Date("2026-05-01T12:00:00-07:00");
const prototypeMayDays = 31;
const prototypeDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "America/Vancouver",
  weekday: "short"
});

function addPrototypeDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

const prototypeDays = Array.from({ length: prototypeMayDays }, (_, index) => {
  const date = addPrototypeDays(prototypeMayStartDate, index);

  return {
    isoDate: date.toISOString().slice(0, 10),
    label: prototypeDateFormatter.format(date),
    weekday: date.getUTCDay()
  };
});

type AvailabilityProfile = {
  availableWeekdays: number[];
  blockedByWeekday: Record<number, string[] | undefined>;
  blockedTimes: string[];
};

const availabilityProfiles: AvailabilityProfile[] = [
  {
    availableWeekdays: [2, 3, 4, 6],
    blockedByWeekday: {},
    blockedTimes: ["9:00 AM", "10:30 AM", "2:30 PM", "4:00 PM"]
  },
  {
    availableWeekdays: [1, 2, 4, 5],
    blockedByWeekday: {
      2: ["8:30 AM", "1:30 PM"],
      4: ["3:30 PM"]
    },
    blockedTimes: ["11:00 AM", "4:00 PM"]
  },
  {
    availableWeekdays: [2, 3, 5, 6],
    blockedByWeekday: {
      3: ["9:30 AM", "10:00 AM", "10:30 AM"],
      6: ["2:00 PM"]
    },
    blockedTimes: ["8:30 AM", "3:00 PM"]
  },
  {
    availableWeekdays: [1, 3, 4, 6],
    blockedByWeekday: {
      1: ["10:00 AM", "2:30 PM"],
      6: ["11:00 AM", "3:30 PM"]
    },
    blockedTimes: ["9:30 AM", "4:00 PM"]
  }
];

function isSlotAvailable(
  physicianIndex: number,
  day: (typeof prototypeDays)[number],
  slot: (typeof prototypeSlots)[number]
) {
  const profile =
    availabilityProfiles[physicianIndex % availabilityProfiles.length] ??
    availabilityProfiles[0];
  if (!profile) return false;
  return (
    profile.availableWeekdays.includes(day.weekday) &&
    !profile.blockedTimes.includes(slot.label) &&
    !(profile.blockedByWeekday[day.weekday] ?? []).includes(slot.label)
  );
}

const seedBookings = [
  {
    physicianInitials: "AH",
    patient: "Eleanor Chen",
    email: "eleanor.chen@example.com",
    phone: "(415) 555-0182",
    dateOfBirth: "1989-04-18",
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
    physicianInitials: "AH",
    patient: "Marcus Whitfield",
    email: "marcus.whitfield@example.com",
    phone: "(415) 555-0114",
    dateOfBirth: "1989-04-18",
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
    physicianInitials: "AH",
    patient: "Theo Lindgren",
    email: "theo.lindgren@example.com",
    phone: "(415) 555-0199",
    dateOfBirth: "1978-06-09",
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
    physicianInitials: "AH",
    patient: "Wesley Ahmadi",
    email: "wesley.ahmadi@example.com",
    phone: "(415) 555-0147",
    dateOfBirth: "1986-01-29",
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
  },
  {
    physicianInitials: "MO",
    patient: "Grace Thompson",
    email: "grace.thompson@example.com",
    phone: "(415) 555-0162",
    dateOfBirth: "1972-09-21",
    initials: "GT",
    date: "Mon, May 11",
    time: "9:00 AM",
    duration: 30,
    reason: "Diabetes follow-up and A1C review",
    status: "confirmed",
    visitType: "In-person",
    requested: "2026-05-04T13:18:00-07:00",
    insurance: "BlueCross",
    flagged: false,
    notes: "Bring home glucose logs."
  },
  {
    physicianInitials: "MO",
    patient: "Omar Haddad",
    email: "omar.haddad@example.com",
    phone: "(415) 555-0176",
    dateOfBirth: "1968-03-14",
    initials: "OH",
    date: "Tue, May 12",
    time: "10:00 AM",
    duration: 20,
    reason: "Blood pressure medication adjustment",
    status: "pending",
    visitType: "In-person",
    requested: "2026-05-07T10:36:00-07:00",
    insurance: "United",
    flagged: true,
    notes: "Recent home readings elevated."
  },
  {
    physicianInitials: "MO",
    patient: "Lena Morales",
    email: "lena.morales@example.com",
    phone: "(415) 555-0107",
    dateOfBirth: "1981-07-02",
    initials: "LM",
    date: "Thu, May 14",
    time: "2:00 PM",
    duration: 30,
    reason: "Follow-up for chest tightness",
    status: "confirmed",
    visitType: "Telehealth",
    requested: "2026-05-06T12:24:00-07:00",
    insurance: "Self-pay",
    flagged: false,
    notes: "Cardiology referral already sent."
  },
  {
    physicianInitials: "MO",
    patient: "Ivy Singh",
    email: "ivy.singh@example.com",
    phone: "(415) 555-0159",
    dateOfBirth: "1994-10-05",
    initials: "IS",
    date: "Fri, May 15",
    time: "9:30 AM",
    duration: 20,
    reason: "Annual labs and thyroid panel",
    status: "cancelled",
    visitType: "In-person",
    requested: "2026-05-05T09:42:00-07:00",
    insurance: "Aetna",
    flagged: false,
    notes: "Patient cancelled after finding a closer lab."
  },
  {
    physicianInitials: "PS",
    patient: "Maya Patel",
    email: "maya.patel@example.com",
    phone: "(415) 555-0191",
    dateOfBirth: "1998-05-22",
    initials: "MP",
    date: "Tue, May 12",
    time: "9:00 AM",
    duration: 20,
    reason: "Acne flare and treatment options",
    status: "pending",
    visitType: "In-person",
    requested: "2026-05-07T08:27:00-07:00",
    insurance: "Aetna",
    flagged: false,
    notes: ""
  },
  {
    physicianInitials: "PS",
    patient: "Calvin Brooks",
    email: "calvin.brooks@example.com",
    phone: "(415) 555-0131",
    dateOfBirth: "1979-01-12",
    initials: "CB",
    date: "Fri, May 15",
    time: "1:30 PM",
    duration: 30,
    reason: "Changing mole check",
    status: "confirmed",
    visitType: "In-person",
    requested: "2026-05-05T15:09:00-07:00",
    insurance: "Cigna",
    flagged: true,
    notes: "Patient uploaded photos in intake packet."
  },
  {
    physicianInitials: "PS",
    patient: "Rachel Kim",
    email: "rachel.kim@example.com",
    phone: "(415) 555-0142",
    dateOfBirth: "1987-11-30",
    initials: "RK",
    date: "Sat, May 16",
    time: "10:30 AM",
    duration: 20,
    reason: "Eczema follow-up",
    status: "confirmed",
    visitType: "Telehealth",
    requested: "2026-05-06T11:33:00-07:00",
    insurance: "Self-pay",
    flagged: false,
    notes: ""
  },
  {
    physicianInitials: "PS",
    patient: "Noah Stern",
    email: "noah.stern@example.com",
    phone: "(415) 555-0128",
    dateOfBirth: "1992-04-08",
    initials: "NS",
    date: "Tue, May 12",
    time: "2:30 PM",
    duration: 20,
    reason: "Rash after new detergent",
    status: "completed",
    visitType: "Telehealth",
    requested: "2026-05-04T16:45:00-07:00",
    insurance: "BlueCross",
    flagged: false,
    notes: "Improved after topical steroid."
  },
  {
    physicianInitials: "JR",
    patient: "Mina Alvarez",
    email: "mina.alvarez@example.com",
    phone: "(415) 555-0184",
    dateOfBirth: "2015-02-18",
    initials: "MA",
    date: "Mon, May 11",
    time: "8:30 AM",
    duration: 30,
    reason: "School physical",
    status: "confirmed",
    visitType: "In-person",
    requested: "2026-05-03T14:20:00-07:00",
    insurance: "Medicaid",
    flagged: false,
    notes: "Needs sports clearance form."
  },
  {
    physicianInitials: "JR",
    patient: "Ethan Brooks",
    email: "ethan.brooks@example.com",
    phone: "(415) 555-0168",
    dateOfBirth: "2012-06-26",
    initials: "EB",
    date: "Wed, May 13",
    time: "9:00 AM",
    duration: 20,
    reason: "Asthma symptoms after soccer",
    status: "pending",
    visitType: "In-person",
    requested: "2026-05-07T13:02:00-07:00",
    insurance: "BlueCross",
    flagged: true,
    notes: "Parent reports increased rescue inhaler use."
  },
  {
    physicianInitials: "JR",
    patient: "Harper Nguyen",
    email: "harper.nguyen@example.com",
    phone: "(415) 555-0119",
    dateOfBirth: "2020-12-04",
    initials: "HN",
    date: "Thu, May 14",
    time: "10:30 AM",
    duration: 30,
    reason: "Well-child check",
    status: "confirmed",
    visitType: "In-person",
    requested: "2026-05-05T10:25:00-07:00",
    insurance: "United",
    flagged: false,
    notes: ""
  },
  {
    physicianInitials: "JR",
    patient: "Leo Martin",
    email: "leo.martin@example.com",
    phone: "(415) 555-0179",
    dateOfBirth: "2014-09-19",
    initials: "LM",
    date: "Sat, May 16",
    time: "1:30 PM",
    duration: 20,
    reason: "ADHD medication follow-up",
    status: "cancelled",
    visitType: "Telehealth",
    requested: "2026-05-06T17:12:00-07:00",
    insurance: "BlueCross",
    flagged: false,
    notes: "Parent cancelled and will call back."
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

  const physicianByInitials = new Map(
    insertedPhysicians.map((physician) => [physician.initials, physician])
  );

  const bookingsBySlot = new Map(
    seedBookings.map((booking) => [
      `${booking.physicianInitials}:${booking.date}:${booking.time}`,
      booking
    ])
  );
  const slotByKey = new Map<string, string>();

  console.log("Generating prototype availability");
  for (const [physicianIndex, physician] of insertedPhysicians.entries()) {
    const rows: NewSlot[] = [];

    for (const day of prototypeDays) {
      for (const slot of prototypeSlots) {
        const startAt = slotDateTime(day.isoDate, slot.label);
        const booking = bookingsBySlot.get(
          `${physician.initials}:${day.label}:${slot.label}`
        );
        const isBooked = Boolean(booking && booking.status !== "cancelled");

        rows.push({
          physicianId: physician.id,
          startAt,
          endAt: addMinutes(startAt, 30),
          status: isBooked
            ? "booked"
            : isSlotAvailable(physicianIndex, day, slot)
              ? "available"
              : "held"
        });
      }
    }

    const insertedSlots = await db.insert(availabilitySlots).values(rows).returning();

    for (const slot of insertedSlots) {
      const day = prototypeDays.find(
        (candidate) => candidate.isoDate === slot.startAt.toISOString().slice(0, 10)
      );
      const label = prototypeSlots.find((candidate) => {
        const date = slotDateTime(day?.isoDate ?? "", candidate.label);
        return date.getTime() === slot.startAt.getTime();
      });
      if (day && label) {
        slotByKey.set(`${physician.initials}:${day.label}:${label.label}`, slot.id);
      }
    }

    console.log(`  ${physician.name}: ${rows.length} slots`);
  }

  console.log("Inserting demo bookings");
  const bookingRows: NewBooking[] = seedBookings.map((booking) => {
    const physician = physicianByInitials.get(booking.physicianInitials);
    if (!physician) {
      throw new Error(`Missing physician for ${booking.physicianInitials}`);
    }

    const slotId = slotByKey.get(
      `${booking.physicianInitials}:${booking.date}:${booking.time}`
    );
    if (!slotId) {
      throw new Error(
        `Missing slot for ${booking.physicianInitials} ${booking.date} ${booking.time}`
      );
    }

    return {
      physicianId: physician.id,
      slotId,
      patientName: booking.patient,
      patientEmail: booking.email,
      patientPhone: booking.phone,
      patientDateOfBirth: booking.dateOfBirth,
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

  const cancelledBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.status, "cancelled"));

  for (const booking of cancelledBookings) {
    await db
      .update(availabilitySlots)
      .set({ status: "available" })
      .where(eq(availabilitySlots.id, booking.slotId));
  }

  console.log("Seed complete");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
