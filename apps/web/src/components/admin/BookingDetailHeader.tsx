"use client";

import type { BookingWithRelations } from "@veroscribe/shared";
import { ArrowLeft, X } from "lucide-react";
import type { MouseEventHandler } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { formatDateOfBirth, initialsFor } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

export function BookingDetailHeader({
  backHref,
  booking,
  onCloseLinkClick
}: {
  backHref?: string;
  booking: BookingWithRelations;
  onCloseLinkClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <div className="shrink-0 p-5">
      {backHref ? (
        <a
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-fg-muted lg:hidden"
          href={backHref}
          onClick={onCloseLinkClick}
        >
          <ArrowLeft size={14} />
          Back to bookings
        </a>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
          Booking #{booking.id.slice(0, 8)}
        </p>
        {backHref ? (
          <a
            aria-label="Close booking details"
            className="rounded-full p-1.5 text-fg-muted transition hover:bg-black/[0.04] hover:text-fg"
            href={backHref}
            onClick={onCloseLinkClick}
          >
            <X size={16} />
          </a>
        ) : null}
      </div>
      <div className="mt-4">
        <StatusBadge status={booking.status} />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <Avatar
          initials={initialsFor(booking.patientName)}
          name={booking.patientName}
          size="lg"
        />
        <div>
          <h2 className="text-lg font-semibold">{booking.patientName}</h2>
          <p className="text-xs text-fg-muted">
            {formatDateOfBirth(booking.patientDateOfBirth)} ·{" "}
            {booking.insurance ?? "Self-pay"}
          </p>
        </div>
      </div>
    </div>
  );
}
