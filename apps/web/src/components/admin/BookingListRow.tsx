"use client";

import type { BookingWithRelations } from "@veroscribe/shared";
import { Building2, Video } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, formatTime, initialsFor } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

export function BookingListRow({
  booking,
  onSelectBooking,
  selected
}: {
  booking: BookingWithRelations;
  onSelectBooking: (bookingId: string) => void;
  selected: boolean;
}) {
  return (
    <Link
      className="grid w-full min-w-0 items-center gap-3 border-b border-border-muted px-4 py-4 text-left transition hover:bg-[#FAF8F4] data-[selected=true]:border-l-4 data-[selected=true]:border-l-primary data-[selected=true]:bg-[#FAF8F4] lg:grid-cols-[1.4fr_1.4fr_1fr_0.8fr_0.9fr]"
      data-selected={selected}
      href={`/admin/${booking.id}`}
      onClick={() => onSelectBooking(booking.id)}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          initials={initialsFor(booking.patientName)}
          name={booking.patientName}
          size="sm"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{booking.patientName}</p>
          <p className="text-xs text-fg-muted">
            {booking.insurance ?? "Self-pay"}
          </p>
        </div>
      </div>
      <p className="min-w-0 truncate text-sm text-fg">
        {booking.reasonForVisit}
      </p>
      <div className="min-w-0">
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
    </Link>
  );
}
