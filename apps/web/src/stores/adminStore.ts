"use client";

import type { BookingStatus } from "@veroscribe/shared";
import { create } from "zustand";

type AdminStore = {
  selectedBookingId?: string;
  physicianId?: string;
  detailLayoutOpen: boolean;
  status: BookingStatus | "all";
  setDetailLayoutOpen: (detailLayoutOpen: boolean) => void;
  setSelectedBookingId: (selectedBookingId?: string) => void;
  setPhysicianId: (physicianId: string) => void;
  setStatus: (status: BookingStatus | "all") => void;
};

export const useAdminStore = create<AdminStore>((set) => ({
  detailLayoutOpen: false,
  status: "all",
  setDetailLayoutOpen: (detailLayoutOpen) => set({ detailLayoutOpen }),
  setSelectedBookingId: (selectedBookingId) => set({ selectedBookingId }),
  setPhysicianId: (physicianId) =>
    set({ physicianId, selectedBookingId: undefined }),
  setStatus: (status) => set({ selectedBookingId: undefined, status })
}));
