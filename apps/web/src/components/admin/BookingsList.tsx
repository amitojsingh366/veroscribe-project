"use client";

import type { BookingWithRelations } from "@veroscribe/shared";
import { Card } from "@/components/ui/Card";
import {
  BookingStatusTabs,
  bookingTabs,
  type BookingListStatus
} from "./BookingStatusTabs";
import { BookingListRow } from "./BookingListRow";

export function BookingsList({
  allBookings,
  bookings,
  onSelectBooking,
  onSelectStatus,
  selectedId,
  status
}: {
  allBookings: BookingWithRelations[];
  bookings: BookingWithRelations[];
  onSelectBooking: (bookingId: string) => void;
  onSelectStatus: (status: BookingListStatus) => void;
  selectedId?: string;
  status: BookingListStatus;
}) {
  const counts = bookingTabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] =
      tab.value === "all"
        ? allBookings.length
        : allBookings.filter((booking) => booking.status === tab.value).length;
    return acc;
  }, {});

  return (
    <section
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      id="bookings-list"
    >
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <BookingStatusTabs
          counts={counts}
          onSelectStatus={onSelectStatus}
          status={status}
        />
      </div>

      <Card className="min-h-0 min-w-0 flex flex-1 flex-col p-0">
        <div className="hidden min-w-0 grid-cols-[1.4fr_1.4fr_1fr_0.8fr_0.9fr] border-b border-border px-4 py-3 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted lg:grid">
          <span>Patient</span>
          <span>Reason</span>
          <span>When</span>
          <span>Type</span>
          <span>Status</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {bookings.length ? (
            bookings.map((booking) => (
              <BookingListRow
                booking={booking}
                key={booking.id}
                onSelectBooking={onSelectBooking}
                selected={booking.id === selectedId}
              />
            ))
          ) : (
            <div className="p-6 text-sm text-fg-muted">
              No bookings match this view.
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
