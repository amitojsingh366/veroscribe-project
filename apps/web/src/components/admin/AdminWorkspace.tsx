"use client";

import type { BookingWithRelations, Physician } from "@veroscribe/shared";
import { Filter, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BookingDetailPanel } from "@/components/admin/BookingDetailPanel";
import { BookingsList } from "@/components/admin/BookingsList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAdminStore } from "@/stores/adminStore";
import { AdminPhysicianSwitcher } from "./AdminPhysicianSwitcher";

function pickSelectedBooking(
  bookings: BookingWithRelations[],
  selectedId?: string
) {
  return (
    bookings.find((candidate) => candidate.id === selectedId) ??
    bookings.find((candidate) => candidate.status === "pending") ??
    bookings.find((candidate) => candidate.status === "confirmed") ??
    bookings[0]
  );
}

export function AdminWorkspace({
  allBookings,
  initialPhysicianId,
  physicians
}: {
  allBookings: BookingWithRelations[];
  initialPhysicianId?: string;
  physicians: Physician[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const physicianId = useAdminStore((state) => state.physicianId);
  const selectedBookingId = useAdminStore((state) => state.selectedBookingId);
  const setPhysicianId = useAdminStore((state) => state.setPhysicianId);
  const setSelectedBookingId = useAdminStore(
    (state) => state.setSelectedBookingId
  );
  const setStatus = useAdminStore((state) => state.setStatus);
  const status = useAdminStore((state) => state.status);
  const activePhysicianId = physicianId ?? initialPhysicianId ?? "";

  useEffect(() => {
    if (!physicianId && initialPhysicianId) {
      setPhysicianId(initialPhysicianId);
    }
  }, [initialPhysicianId, physicianId, setPhysicianId]);

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
  const selectedBooking = pickSelectedBooking(bookings, selectedBookingId);

  useEffect(() => {
    if (selectedBooking?.id && selectedBooking.id !== selectedBookingId) {
      setSelectedBookingId(selectedBooking.id);
    }
  }, [selectedBooking?.id, selectedBookingId, setSelectedBookingId]);

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
    <section className="grid min-h-screen min-w-0 bg-bg lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex min-h-0 min-w-0 flex-col p-5 md:p-7">
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

        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="min-h-0 border-t border-border lg:border-l lg:border-t-0">
        {selectedBooking ? (
          <BookingDetailPanel booking={selectedBooking} />
        ) : (
          <div className="flex h-full items-center justify-center bg-surface p-6 text-center text-sm text-fg-muted">
            Select a booking to view details.
          </div>
        )}
      </div>
    </section>
  );
}
