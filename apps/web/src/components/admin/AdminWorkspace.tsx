"use client";

import type { BookingWithRelations, Physician } from "@veroscribe/shared";
import { clsx } from "clsx";
import { Filter, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookingDetailPanel } from "@/components/admin/BookingDetailPanel";
import { BookingsList } from "@/components/admin/BookingsList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAdminStore } from "@/stores/adminStore";
import { AdminPhysicianSwitcher } from "./AdminPhysicianSwitcher";

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
  const stats = [
    ["Today's visits", physicianBookings.length.toString(), "3 telehealth"],
    [
      "Awaiting confirmation",
      physicianBookings
        .filter((candidate) => candidate.status === "pending")
        .length.toString(),
      "new requests"
    ],
    ["Avg. lead time", "2.4d", "down 0.6d this week"],
    ["No-show rate", "4.1%", "30-day rolling"]
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
        <header className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-muted">
                Friday, May 8
              </p>
              <h1 className="mt-1 text-3xl leading-tight">
                <span className="serif-italic">Upcoming</span> bookings
              </h1>
            </div>
            <AdminPhysicianSwitcher
              className="lg:hidden"
              id="admin-main-physician"
              physicians={physicians}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Card className="flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 sm:w-72">
              <Search size={14} className="text-fg-muted" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search patients, reason..."
                type="search"
                value={searchTerm}
              />
            </Card>
            <Button variant="secondary">
              <Filter size={14} />
              Filter
            </Button>
            <Button>
              <Plus size={14} />
              New booking
            </Button>
          </div>
        </header>

        <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map(([label, value, sub]) => (
            <div
              className="rounded-2xl border border-border bg-surface p-4"
              key={label}
            >
              <p className="text-xs text-fg-muted">{label}</p>
              <p className="mt-1 text-2xl font-medium">{value}</p>
              <p className="mt-0.5 text-xs text-fg-subtle">{sub}</p>
            </div>
          ))}
        </div>

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
