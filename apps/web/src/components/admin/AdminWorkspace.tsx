"use client";

import type { BookingWithRelations, Physician } from "@veroscribe/shared";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookingDetailPanel } from "@/components/admin/BookingDetailPanel";
import { BookingsList } from "@/components/admin/BookingsList";
import { useAdminStore } from "@/stores/adminStore";
import { AdminStatsGrid, type AdminStat } from "./AdminStatsGrid";
import { AdminWorkspaceHeader } from "./AdminWorkspaceHeader";

const DETAIL_PANEL_EXIT_MS = 220;
const DETAIL_LAYOUT_EXIT_MS = 300;

export function AdminWorkspace({
  allBookings,
  detailBackHref,
  initialPhysicianId,
  physicians,
  selectedBookingId
}: {
  allBookings: BookingWithRelations[];
  detailBackHref?: string;
  initialPhysicianId?: string;
  physicians: Physician[];
  selectedBookingId?: string;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const persistedDetailLayoutOpen = useAdminStore(
    (state) => state.detailLayoutOpen
  );
  const physicianId = useAdminStore((state) => state.physicianId);
  const setDetailLayoutOpen = useAdminStore(
    (state) => state.setDetailLayoutOpen
  );
  const setPhysicianId = useAdminStore((state) => state.setPhysicianId);
  const setSelectedBookingId = useAdminStore(
    (state) => state.setSelectedBookingId
  );
  const setStatus = useAdminStore((state) => state.setStatus);
  const status = useAdminStore((state) => state.status);
  const selectedBooking = selectedBookingId
    ? allBookings.find((booking) => booking.id === selectedBookingId)
    : undefined;
  const activePhysicianId =
    selectedBooking?.physicianId ?? physicianId ?? initialPhysicianId ?? "";
  const hasSelectedRoute = Boolean(selectedBookingId);
  const [isDetailLayoutOpen, setIsDetailLayoutOpen] = useState(
    hasSelectedRoute && persistedDetailLayoutOpen
  );
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(
    hasSelectedRoute && persistedDetailLayoutOpen
  );
  const closeTimersRef = useRef<number[]>([]);
  const isClosingDetailRef = useRef(false);
  const detailLayoutOpen = hasSelectedRoute && isDetailLayoutOpen;
  const detailPanelOpen = hasSelectedRoute && isDetailPanelOpen;

  const clearCloseTimers = useCallback(() => {
    closeTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    closeTimersRef.current = [];
  }, []);

  const scheduleCloseTimer = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      closeTimersRef.current = closeTimersRef.current.filter(
        (candidate) => candidate !== timer
      );
      callback();
    }, delay);
    closeTimersRef.current.push(timer);
  }, []);

  useEffect(
    () => () => {
      clearCloseTimers();
    },
    [clearCloseTimers]
  );

  useEffect(() => {
    if (selectedBooking?.physicianId) {
      if (physicianId !== selectedBooking.physicianId) {
        setPhysicianId(selectedBooking.physicianId);
      }
      return;
    }

    if (!physicianId && initialPhysicianId) {
      setPhysicianId(initialPhysicianId);
    }
  }, [initialPhysicianId, physicianId, selectedBooking?.physicianId, setPhysicianId]);

  useEffect(() => {
    if (!hasSelectedRoute) {
      isClosingDetailRef.current = false;
      const frame = window.requestAnimationFrame(() => {
        setIsDetailLayoutOpen(false);
        setIsDetailPanelOpen(false);
        setDetailLayoutOpen(false);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    if (isClosingDetailRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      setIsDetailLayoutOpen(true);
      setIsDetailPanelOpen(true);
      if (!persistedDetailLayoutOpen) {
        setDetailLayoutOpen(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [
    hasSelectedRoute,
    persistedDetailLayoutOpen,
    selectedBookingId,
    setDetailLayoutOpen
  ]);

  const closeDetail = () => {
    if (!detailBackHref) return;
    clearCloseTimers();
    isClosingDetailRef.current = true;
    setIsDetailPanelOpen(false);

    scheduleCloseTimer(() => {
      setIsDetailLayoutOpen(false);
      setDetailLayoutOpen(false);
    }, DETAIL_PANEL_EXIT_MS);

    scheduleCloseTimer(() => {
      router.push(detailBackHref);
    }, DETAIL_PANEL_EXIT_MS + DETAIL_LAYOUT_EXIT_MS);
  };

  const physicianBookings = useMemo(
    () =>
      allBookings.filter((booking) => booking.physicianId === activePhysicianId),
    [activePhysicianId, allBookings]
  );
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchedBookings = useMemo(() => {
    if (!normalizedSearch) return physicianBookings;

    return physicianBookings.filter((booking) => {
      const haystack = [
        booking.patientName,
        booking.patientEmail,
        booking.patientPhone,
        booking.reasonForVisit,
        booking.insurance,
        booking.status,
        booking.visitType,
        booking.physician?.name,
        booking.physician?.specialty
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch, physicianBookings]);
  const bookings = useMemo(
    () =>
      status === "all"
        ? searchedBookings
        : searchedBookings.filter((booking) => booking.status === status),
    [searchedBookings, status]
  );
  const stats: AdminStat[] = [
    {
      label: "Today's visits",
      sub: "3 telehealth",
      value: physicianBookings.length.toString()
    },
    {
      label: "Awaiting confirmation",
      sub: "new requests",
      value: physicianBookings
        .filter((candidate) => candidate.status === "pending")
        .length.toString()
    },
    { label: "Avg. lead time", sub: "down 0.6d this week", value: "2.4d" },
    { label: "No-show rate", sub: "30-day rolling", value: "4.1%" }
  ];

  return (
    <section
      className={clsx(
        "relative grid min-h-screen w-full min-w-0 overflow-x-hidden bg-bg transition-[grid-template-columns] duration-300 ease-out",
        detailLayoutOpen
          ? "lg:grid-cols-[minmax(0,1fr)_clamp(360px,30vw,460px)]"
          : "lg:grid-cols-[minmax(0,1fr)_0px]"
      )}
    >
      <div
        className={clsx(
          "min-h-0 min-w-0 flex-col p-5 transition-[opacity,transform] duration-300 ease-out md:p-7 lg:flex lg:max-h-screen",
          hasSelectedRoute
            ? "pointer-events-none absolute inset-0 -translate-x-3 opacity-0 lg:pointer-events-auto lg:relative lg:translate-x-0 lg:opacity-100"
            : "flex translate-x-0 opacity-100"
        )}
      >
        <AdminWorkspaceHeader
          onSearchChange={setSearchTerm}
          physicians={physicians}
          searchTerm={searchTerm}
        />

        <AdminStatsGrid stats={stats} />

        <BookingsList
          allBookings={searchedBookings}
          bookings={bookings}
          onSelectBooking={setSelectedBookingId}
          onSelectStatus={setStatus}
          selectedId={selectedBooking?.id}
          status={status}
        />
      </div>

      <div
        className={clsx(
          "min-h-0 min-w-0 overflow-hidden border-border transition-[opacity,transform] duration-300 ease-out lg:border-l",
          detailLayoutOpen
            ? "block translate-x-0 opacity-100"
            : "pointer-events-none hidden translate-x-4 opacity-0 lg:block"
        )}
      >
        {selectedBooking ? (
          <BookingDetailPanel
            backHref={detailBackHref}
            booking={selectedBooking}
            isOpen={detailPanelOpen}
            key={selectedBooking.id}
            onRequestClose={closeDetail}
          />
        ) : null}
      </div>
    </section>
  );
}
