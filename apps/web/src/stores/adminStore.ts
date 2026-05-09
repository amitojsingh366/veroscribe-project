"use client";

import type { BookingStatus } from "@veroscribe/shared";
import { create } from "zustand";

type AdminStore = {
  selectedBookingId?: string;
  physicianId?: string;
  status: BookingStatus | "all";
  setSelectedBookingId: (selectedBookingId?: string) => void;
  setPhysicianId: (physicianId: string) => void;
  setStatus: (status: BookingStatus | "all") => void;
};

export const useAdminStore = create<AdminStore>((set) => ({
  status: "all",
  setSelectedBookingId: (selectedBookingId) => set({ selectedBookingId }),
  setPhysicianId: (physicianId) =>
    set({ physicianId, selectedBookingId: undefined }),
  setStatus: (status) => set({ selectedBookingId: undefined, status })
}));
