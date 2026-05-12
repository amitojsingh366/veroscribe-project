"use client";

import type { Physician, Slot, VisitType } from "@veroscribe/shared";
import { create } from "zustand";
import { formatDateKey } from "@/lib/format";

type PhysicianSummary = Pick<
  Physician,
  "avatarTone" | "id" | "initials" | "name" | "photoUrl" | "specialty"
>;

type SlotSummary = Pick<Slot, "endAt" | "id" | "startAt" | "status">;

type PatientDetailsDraft = {
  insurance?: string;
  patientDateOfBirth?: string;
  patientEmail?: string;
  patientName?: string;
  patientPhone?: string;
  reasonForVisit?: string;
};

type BookingStore = {
  bookingId?: string;
  details: PatientDetailsDraft;
  physician?: PhysicianSummary;
  selectedDate?: string;
  slot?: SlotSummary;
  visitType: VisitType;
  setBookingId: (bookingId: string) => void;
  setDetails: (details: PatientDetailsDraft) => void;
  setPhysician: (physician: PhysicianSummary) => void;
  setSelectedDate: (selectedDate: string) => void;
  setSlot: (slot: SlotSummary) => void;
  setVisitType: (visitType: VisitType) => void;
  startBookingForPhysician: (physician: PhysicianSummary) => void;
};

function serializeSlot(slot: SlotSummary): SlotSummary {
  return {
    ...slot,
    endAt: slot.endAt instanceof Date ? slot.endAt.toISOString() : slot.endAt,
    startAt: slot.startAt instanceof Date ? slot.startAt.toISOString() : slot.startAt
  };
}

export const useBookingStore = create<BookingStore>((set) => ({
  details: {},
  visitType: "In-person",
  setBookingId: (bookingId) => set({ bookingId }),
  setDetails: (details) =>
    set((state) => ({
      bookingId: undefined,
      details: {
        ...state.details,
        ...details
      }
    })),
  setPhysician: (physician) =>
    set((state) => ({
      bookingId: undefined,
      physician,
      selectedDate:
        state.physician?.id && state.physician.id !== physician.id
          ? undefined
          : state.selectedDate,
      slot:
        state.physician?.id && state.physician.id !== physician.id
          ? undefined
          : state.slot
    })),
  setSelectedDate: (selectedDate) =>
    set({ bookingId: undefined, selectedDate, slot: undefined }),
  setSlot: (slot) =>
    set({
      bookingId: undefined,
      selectedDate: formatDateKey(slot.startAt),
      slot: serializeSlot(slot)
    }),
  setVisitType: (visitType) => set({ bookingId: undefined, visitType }),
  startBookingForPhysician: (physician) =>
    set({
      bookingId: undefined,
      physician,
      selectedDate: undefined,
      slot: undefined
    })
}));
