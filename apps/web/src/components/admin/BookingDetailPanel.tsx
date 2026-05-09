import type { BookingWithRelations } from "@veroscribe/shared";
import { Building2, Clock, MoreHorizontal, Video } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import {
  formatDate,
  formatDateOfBirth,
  formatTime,
  initialsFor
} from "@/lib/format";
import { BookingActions } from "./BookingActions";
import { StatusBadge } from "./StatusBadge";

export function BookingDetailPanel({
  booking
}: {
  booking: BookingWithRelations;
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col bg-surface lg:overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
            Booking #{booking.id.slice(0, 8)}
          </p>
          <button className="rounded-full p-1.5 text-fg-muted hover:bg-black/[0.04]" type="button">
            <MoreHorizontal size={16} />
          </button>
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

      <div className="min-h-0 flex-1 space-y-5 overflow-y-visible px-5 pb-5 lg:overflow-y-auto">
        <Card className="bg-[#FAF8F4]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
            Visit details
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-fg-subtle">Date</p>
              <p className="font-medium">
                {booking.slot ? formatDate(booking.slot.startAt) : "TBD"}
              </p>
            </div>
            <div>
              <p className="text-xs text-fg-subtle">Time</p>
              <p className="font-medium">
                {booking.slot ? formatTime(booking.slot.startAt) : "TBD"}
              </p>
            </div>
            <div>
              <p className="text-xs text-fg-subtle">Type</p>
              <p className="inline-flex items-center gap-1 font-medium">
                {booking.visitType === "Telehealth" ? (
                  <Video size={13} />
                ) : (
                  <Building2 size={13} />
                )}
                {booking.visitType}
              </p>
            </div>
            <div>
              <p className="text-xs text-fg-subtle">Duration</p>
              <p className="font-medium">30 min</p>
            </div>
          </div>
        </Card>

        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
            Reason for visit
          </p>
          <p className="text-sm leading-relaxed text-fg">{booking.reasonForVisit}</p>
        </section>

        {booking.notes ? (
          <section>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
              Front-desk notes
            </p>
            <p className="rounded-lg border border-[#ECDBB8] bg-status-pending-bg p-3 text-sm leading-relaxed text-fg">
              {booking.notes}
            </p>
          </section>
        ) : null}

        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
            Activity
          </p>
          <div className="space-y-3 text-sm text-fg">
            <p className="flex gap-2">
              <Clock size={14} className="mt-0.5 text-status-pending-fg" />
              Request received from patient.
            </p>
            <p className="flex gap-2 text-fg-muted">
              <Clock size={14} className="mt-0.5" />
              Insurance verification pending.
            </p>
          </div>
        </section>
      </div>

      <BookingActions
        bookingId={booking.id}
        currentSlotId={booking.slotId}
        notes={booking.notes}
        physicianId={booking.physicianId}
        status={booking.status}
      />
    </aside>
  );
}
