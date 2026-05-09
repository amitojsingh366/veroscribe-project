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
  clearSlot: () => void;
  setBookingId: (bookingId: string) => void;
  setDetails: (details: PatientDetailsDraft) => void;
  setPhysician: (physician: PhysicianSummary) => void;
  setSelectedDate: (selectedDate: string) => void;
  setSlot: (slot: SlotSummary) => void;
  setVisitType: (visitType: VisitType) => void;
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
  clearSlot: () => set({ selectedDate: undefined, slot: undefined }),
  setBookingId: (bookingId) => set({ bookingId }),
  setDetails: (details) =>
    set((state) => ({
      details: {
        ...state.details,
        ...details
      }
    })),
  setPhysician: (physician) =>
    set((state) => ({
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
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSlot: (slot) =>
    set({
      selectedDate: formatDateKey(slot.startAt),
      slot: serializeSlot(slot)
    }),
  setVisitType: (visitType) => set({ visitType })
}));
