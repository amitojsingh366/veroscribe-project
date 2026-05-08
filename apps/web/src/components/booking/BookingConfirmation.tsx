import type { BookingWithRelations } from "@veroscribe/shared";
import { Bell, Calendar, Check, Clock } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate, formatTime } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";

export function BookingConfirmation({
  booking
}: {
  booking: BookingWithRelations;
}) {
  const physician = booking.physician;
  const slot = booking.slot;

  return (
    <div className="gradient-bg min-h-screen px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full border border-border bg-surface">
            <Check size={26} />
          </span>
          <h1 className="text-4xl leading-tight text-fg md:text-6xl">
            Request <span className="serif-italic">sent.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-fg-muted">
            The office will confirm shortly. The booking starts as pending so
            the physician team can review it.
          </p>
        </div>

        <Card className="mt-10 p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
                Booking
              </p>
              <p className="mt-1 text-base font-semibold">#{booking.id.slice(0, 8)}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="mt-5 grid gap-5 border-t border-border-muted pt-5 md:grid-cols-[1.4fr_1fr_1fr]">
            {physician ? (
              <div className="flex items-center gap-3">
                <Avatar
                  initials={physician.initials}
                  name={physician.name}
                  src={physician.photoUrl}
                  tone={physician.avatarTone}
                />
                <div>
                  <p className="font-semibold">{physician.name}</p>
                  <p className="text-sm text-fg-muted">{physician.specialty}</p>
                </div>
              </div>
            ) : null}
            {slot ? (
              <>
                <div>
                  <p className="text-xs text-fg-muted">Date</p>
                  <p className="mt-1 text-sm font-medium">{formatDate(slot.startAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-fg-muted">Time</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatTime(slot.startAt)} · 30 min
                  </p>
                </div>
              </>
            ) : null}
          </div>

          <div className="mt-5 border-t border-border-muted pt-5">
            <p className="text-xs text-fg-muted">Reason for visit</p>
            <p className="mt-1 text-sm leading-relaxed text-fg">{booking.reasonForVisit}</p>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-border-muted pt-5 md:flex-row md:items-center md:justify-between">
            <p className="inline-flex items-center gap-2 text-xs text-fg-muted">
              <Clock size={14} />
              Free cancellation up to 24 hours before the visit.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary">
                <Calendar size={14} />
                Add to calendar
              </Button>
              <Button variant="secondary">
                <Bell size={14} />
                Reminders
              </Button>
              <Link href="/book">
                <Button>Done</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
