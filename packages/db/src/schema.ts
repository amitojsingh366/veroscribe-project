import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed"
]);

export const slotStatusEnum = pgEnum("slot_status", [
  "available",
  "held",
  "booked"
]);

export const visitTypeEnum = pgEnum("visit_type", ["In-person", "Telehealth"]);

export const physicians = pgTable(
  "physicians",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 120 }).notNull(),
    specialty: varchar("specialty", { length: 120 }).notNull(),
    initials: varchar("initials", { length: 4 }).notNull(),
    photoUrl: text("photo_url"),
    bio: text("bio"),
    rating: doublePrecision("rating"),
    reviews: integer("reviews"),
    nextAvailable: varchar("next_available", { length: 80 }),
    location: varchar("location", { length: 160 }),
    accepts: jsonb("accepts")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    avatarTone: text("avatar_tone"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date())
  },
  (t) => ({
    nameIdx: index("physicians_name_idx").on(t.name),
    specialtyIdx: index("physicians_specialty_idx").on(t.specialty)
  })
);

export const availabilitySlots = pgTable(
  "availability_slots",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    physicianId: uuid("physician_id")
      .notNull()
      .references(() => physicians.id, { onDelete: "cascade" }),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    status: slotStatusEnum("status").notNull().default("available"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (t) => ({
    physicianStartIdx: index("slots_physician_start_idx").on(
      t.physicianId,
      t.startAt
    ),
    uniqStart: uniqueIndex("slots_physician_start_uniq").on(
      t.physicianId,
      t.startAt
    )
  })
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    physicianId: uuid("physician_id")
      .notNull()
      .references(() => physicians.id, { onDelete: "restrict" }),
    slotId: uuid("slot_id")
      .notNull()
      .references(() => availabilitySlots.id, { onDelete: "restrict" }),
    patientName: varchar("patient_name", { length: 120 }).notNull(),
    patientEmail: varchar("patient_email", { length: 254 }).notNull(),
    patientPhone: varchar("patient_phone", { length: 32 }).notNull(),
    patientDateOfBirth: date("patient_date_of_birth"),
    reasonForVisit: text("reason_for_visit").notNull(),
    visitType: visitTypeEnum("visit_type").notNull().default("In-person"),
    durationMinutes: integer("duration_minutes").notNull().default(30),
    insurance: varchar("insurance", { length: 80 }),
    flagged: boolean("flagged").notNull().default(false),
    notes: text("notes"),
    status: bookingStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date())
  },
  (t) => ({
    statusIdx: index("bookings_status_idx").on(t.status),
    physicianIdx: index("bookings_physician_idx").on(t.physicianId),
    activeSlotUniq: uniqueIndex("bookings_active_slot_uniq")
      .on(t.slotId)
      .where(sql`status <> 'cancelled'`)
  })
);

export const physiciansRelations = relations(physicians, ({ many }) => ({
  slots: many(availabilitySlots),
  bookings: many(bookings)
}));

export const slotsRelations = relations(availabilitySlots, ({ one, many }) => ({
  physician: one(physicians, {
    fields: [availabilitySlots.physicianId],
    references: [physicians.id]
  }),
  bookings: many(bookings)
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  physician: one(physicians, {
    fields: [bookings.physicianId],
    references: [physicians.id]
  }),
  slot: one(availabilitySlots, {
    fields: [bookings.slotId],
    references: [availabilitySlots.id]
  })
}));

export type Physician = typeof physicians.$inferSelect;
export type NewPhysician = typeof physicians.$inferInsert;
export type Slot = typeof availabilitySlots.$inferSelect;
export type NewSlot = typeof availabilitySlots.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type BookingStatus = (typeof bookingStatusEnum.enumValues)[number];
export type SlotStatus = (typeof slotStatusEnum.enumValues)[number];
export type VisitType = (typeof visitTypeEnum.enumValues)[number];
