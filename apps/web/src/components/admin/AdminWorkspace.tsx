"use client";

import type { BookingWithRelations, Physician } from "@veroscribe/shared";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookingDetailPanel } from "@/components/admin/BookingDetailPanel";
import { BookingsList } from "@/components/admin/BookingsList";
import { asDate } from "@/lib/format";
import { useAdminStore } from "@/stores/adminStore";
import { AdminStatsGrid, type AdminStat } from "./AdminStatsGrid";
import { AdminWorkspaceHeader } from "./AdminWorkspaceHeader";

const DETAIL_PANEL_EXIT_MS = 220;
const DETAIL_LAYOUT_EXIT_MS = 300;
const DAY_MS = 86_400_000;

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatDays(value: number) {
  const rounded = value >= 10 ? Math.round(value) : Number(value.toFixed(1));
  return `${rounded}d`;
}

function formatPercent(value: number) {
  return value.toFixed(value % 1 === 0 ? 0 : 1);
}

function averageLeadTimeDays(bookings: BookingWithRelations[]) {
  const leadTimes = bookings
    .filter((booking) => booking.slot)
    .map((booking) =>
      Math.max(
        0,
        (asDate(booking.slot?.startAt ?? booking.createdAt).getTime() -
          asDate(booking.createdAt).getTime()) /
          DAY_MS
      )
    );

  if (!leadTimes.length) return undefined;
  return leadTimes.reduce((total, value) => total + value, 0) / leadTimes.length;
}

export function AdminWorkspace({
  allBookings,
  detailBackHref,
  initialPhysicianId,
  physicians,
  selectedBookingId,
  todayLabel
}: {
  allBookings: BookingWithRelations[];
  detailBackHref?: string;
  initialPhysicianId?: string;
  physicians: Physician[];
  selectedBookingId?: string;
  todayLabel: string;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const clearBookingPhysicianSync = useAdminStore(
    (state) => state.clearBookingPhysicianSync
  );
  const persistedDetailLayoutOpen = useAdminStore(
    (state) => state.detailLayoutOpen
  );
  const physicianId = useAdminStore((state) => state.physicianId);
  const setDetailLayoutOpen = useAdminStore(
    (state) => state.setDetailLayoutOpen
  );
  const setPhysicianId = useAdminStore((state) => state.setPhysicianId);
  const setStatus = useAdminStore((state) => state.setStatus);
  const syncPhysicianFromBooking = useAdminStore(
    (state) => state.syncPhysicianFromBooking
  );
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
    if (selectedBooking?.id && selectedBooking.physicianId) {
      syncPhysicianFromBooking(selectedBooking.id, selectedBooking.physicianId);
      return;
    }

    clearBookingPhysicianSync();
    if (!physicianId && initialPhysicianId) {
      setPhysicianId(initialPhysicianId);
    }
  }, [
    clearBookingPhysicianSync,
    initialPhysicianId,
    physicianId,
    selectedBooking?.id,
    selectedBooking?.physicianId,
    setPhysicianId,
    syncPhysicianFromBooking
  ]);

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
  const stats: AdminStat[] = useMemo(() => {
    const pendingCount = physicianBookings.filter(
      (candidate) => candidate.status === "pending"
    ).length;
    const telehealthCount = physicianBookings.filter(
      (candidate) => candidate.visitType === "Telehealth"
    ).length;
    const scheduledCount = physicianBookings.filter((booking) => booking.slot).length;
    const leadTimeDays = averageLeadTimeDays(physicianBookings);
    const cancelledCount = physicianBookings.filter(
      (candidate) => candidate.status === "cancelled"
    ).length;
    const cancellationRate = physicianBookings.length
      ? (cancelledCount / physicianBookings.length) * 100
      : 0;

    return [
      {
        label: "Today's visits",
        sub: `${telehealthCount} telehealth`,
        value: physicianBookings.length.toString()
      },
      {
        label: "Awaiting confirmation",
        sub: pluralize(pendingCount, "new request"),
        value: pendingCount.toString()
      },
      {
        label: "Avg. lead time",
        sub: scheduledCount
          ? pluralize(scheduledCount, "scheduled booking")
          : "no scheduled bookings",
        value: leadTimeDays === undefined ? "N/A" : formatDays(leadTimeDays)
      },
      {
        label: "Cancellation rate",
        sub: cancelledCount
          ? pluralize(cancelledCount, "cancelled booking")
          : "no cancellations",
        value: `${formatPercent(cancellationRate)}%`
      }
    ];
  }, [physicianBookings]);

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
          todayLabel={todayLabel}
        />

        <AdminStatsGrid stats={stats} />

        <BookingsList
          allBookings={searchedBookings}
          bookings={bookings}
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
