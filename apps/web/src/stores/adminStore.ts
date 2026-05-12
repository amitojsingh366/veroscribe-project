"use client";

import type { BookingStatus } from "@veroscribe/shared";
import { create } from "zustand";

type AdminStore = {
  bookingPhysicianSyncId?: string;
  physicianId?: string;
  detailLayoutOpen: boolean;
  status: BookingStatus | "all";
  clearBookingPhysicianSync: () => void;
  setDetailLayoutOpen: (detailLayoutOpen: boolean) => void;
  setPhysicianId: (
    physicianId: string,
    options?: { bookingPhysicianSyncId?: string }
  ) => void;
  setStatus: (status: BookingStatus | "all") => void;
  syncPhysicianFromBooking: (bookingId: string, physicianId: string) => void;
};

export const useAdminStore = create<AdminStore>((set) => ({
  detailLayoutOpen: false,
  status: "all",
  clearBookingPhysicianSync: () => set({ bookingPhysicianSyncId: undefined }),
  setDetailLayoutOpen: (detailLayoutOpen) => set({ detailLayoutOpen }),
  setPhysicianId: (physicianId, options) =>
    set({
      bookingPhysicianSyncId: options?.bookingPhysicianSyncId,
      physicianId
    }),
  setStatus: (status) => set({ status }),
  syncPhysicianFromBooking: (bookingId, physicianId) =>
    set((state) => {
      if (state.bookingPhysicianSyncId === bookingId) return {};

      return {
        bookingPhysicianSyncId: bookingId,
        physicianId
      };
    })
}));
