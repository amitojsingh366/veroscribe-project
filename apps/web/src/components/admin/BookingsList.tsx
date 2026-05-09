"use client";

import type { BookingStatus, BookingWithRelations } from "@veroscribe/shared";
import { Building2, Video } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { formatDate, formatTime, initialsFor } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

const tabs: Array<{ value: BookingStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" }
];

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
  onSelectStatus: (status: BookingStatus | "all") => void;
  selectedId?: string;
  status: BookingStatus | "all";
}) {
  const counts = tabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] =
      tab.value === "all"
        ? allBookings.length
        : allBookings.filter((booking) => booking.status === tab.value).length;
    return acc;
  }, {});

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-1 overflow-x-auto border-b border-border">
          {tabs.map((tab) => {
            const active = status === tab.value;

            return (
              <button
                className="border-b-2 px-3 py-2 text-sm font-medium data-[active=true]:border-primary data-[active=false]:border-transparent data-[active=false]:text-fg-muted"
                data-active={active}
                key={tab.value}
                onClick={() => onSelectStatus(tab.value)}
                type="button"
              >
                {tab.label}
                <span className="ml-1 text-fg-subtle">{counts[tab.value] ?? 0}</span>
              </button>
            );
          })}
        </div>
        <div className="inline-flex w-fit gap-1 rounded-lg bg-border-muted p-1">
          {["List", "Day", "Week"].map((label) => (
            <button
              className="rounded-md px-3 py-1.5 text-xs font-medium text-fg-muted data-[active=true]:bg-surface data-[active=true]:text-fg"
              data-active={label === "List"}
              key={label}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Card className="min-h-0 flex-1 overflow-hidden p-0">
        <div className="hidden grid-cols-[1.4fr_1.4fr_1fr_0.8fr_0.9fr] border-b border-border px-4 py-3 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted lg:grid">
          <span>Patient</span>
          <span>Reason</span>
          <span>When</span>
          <span>Type</span>
          <span>Status</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {bookings.length ? (
            bookings.map((booking) => (
              <button
                className="grid w-full items-center gap-3 border-b border-border-muted px-4 py-4 text-left transition hover:bg-[#FAF8F4] data-[selected=true]:border-l-4 data-[selected=true]:border-l-primary data-[selected=true]:bg-[#FAF8F4] lg:grid-cols-[1.4fr_1.4fr_1fr_0.8fr_0.9fr]"
                data-selected={booking.id === selectedId}
                key={booking.id}
                onClick={() => onSelectBooking(booking.id)}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    initials={initialsFor(booking.patientName)}
                    name={booking.patientName}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-semibold">{booking.patientName}</p>
                    <p className="text-xs text-fg-muted">
                      {booking.insurance ?? "Self-pay"}
                    </p>
                  </div>
                </div>
                <p className="truncate text-sm text-fg">{booking.reasonForVisit}</p>
                <div>
                  <p className="text-sm font-medium">
                    {booking.slot ? formatDate(booking.slot.startAt) : "TBD"}
                  </p>
                  <p className="text-xs text-fg-muted">
                    {booking.slot ? formatTime(booking.slot.startAt) : ""}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
                  {booking.visitType === "Telehealth" ? (
                    <Video size={13} />
                  ) : (
                    <Building2 size={13} />
                  )}
                  {booking.visitType}
                </span>
                <StatusBadge status={booking.status} />
              </button>
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
