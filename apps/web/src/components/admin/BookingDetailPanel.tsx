"use client";

import type { BookingWithRelations, Slot } from "@veroscribe/shared";
import { clsx } from "clsx";
import { ArrowLeft, Building2, Clock, Video, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, type MouseEvent, useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getAvailability, updateBooking } from "@/lib/api";
import {
  asDate,
  formatDate,
  formatDateOfBirth,
  formatDateKey,
  formatTime,
  initialsFor
} from "@/lib/format";
import { BookingActions } from "./BookingActions";
import { StatusBadge } from "./StatusBadge";

function formatNativeTimeValue(value: string | Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    timeZone: "America/Vancouver"
  }).formatToParts(value instanceof Date ? value : new Date(value));
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";

  return `${hour}:${minute}`;
}

export function BookingDetailPanel({
  backHref,
  booking,
  isOpen = true,
  onRequestClose
}: {
  backHref?: string;
  booking: BookingWithRelations;
  isOpen?: boolean;
  onRequestClose?: () => void;
}) {
  const router = useRouter();
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [showReschedule, setShowReschedule] = useState(false);
  const availableSlotDates = useMemo(
    () =>
      Array.from(
        new Set(availableSlots.map((slot) => formatDateKey(slot.startAt)))
      ).sort(),
    [availableSlots]
  );
  const selectedDateSlots = useMemo(
    () =>
      availableSlots.filter(
        (slot) => formatDateKey(slot.startAt) === rescheduleDate
      ),
    [availableSlots, rescheduleDate]
  );
  const selectedSlot = useMemo(
    () =>
      selectedDateSlots.find(
        (slot) => formatNativeTimeValue(slot.startAt) === rescheduleTime
      ),
    [rescheduleTime, selectedDateSlots]
  );
  const todayKey = formatDateKey(new Date());
  const minDate = availableSlotDates[0]
    ? availableSlotDates[0] > todayKey
      ? availableSlotDates[0]
      : todayKey
    : todayKey;
  const maxDate = availableSlotDates.at(-1);
  const canReschedule =
    booking.status !== "cancelled" && booking.status !== "completed";

  const closeDetail = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!backHref || !onRequestClose) return;
    event.preventDefault();
    onRequestClose();
  };

  const loadSlots = async () => {
    setShowReschedule((value) => !value);
    if (availableSlots.length || isLoadingSlots) return;

    setIsLoadingSlots(true);
    try {
      const now = new Date();
      const from = new Date(now);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(to.getDate() + 30);
      const slots = await getAvailability(booking.physicianId, from, to);
      const nextAvailableSlots = slots.filter(
        (slot) =>
          slot.status === "available" &&
          slot.id !== booking.slotId &&
          asDate(slot.startAt) >= now
      );
      setAvailableSlots(nextAvailableSlots);
      const firstSlot = nextAvailableSlots[0];
      setRescheduleDate(firstSlot ? formatDateKey(firstSlot.startAt) : "");
      setRescheduleTime(firstSlot ? formatNativeTimeValue(firstSlot.startAt) : "");
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const selectRescheduleDate = (dateKey: string) => {
    setRescheduleDate(dateKey);
    const firstSlotForDate = availableSlots.find(
      (slot) => formatDateKey(slot.startAt) === dateKey
    );
    setRescheduleTime(
      firstSlotForDate ? formatNativeTimeValue(firstSlotForDate.startAt) : ""
    );
  };

  const reschedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSlot) return;

    setIsSubmittingReschedule(true);
    try {
      await updateBooking(booking.id, { slotId: selectedSlot.id });
      setShowReschedule(false);
      router.refresh();
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  return (
    <aside
      className={clsx(
        "flex h-screen min-h-0 w-full min-w-0 max-w-full transform-gpu flex-col overflow-hidden bg-surface opacity-0 transition-[opacity,transform] duration-300 ease-out lg:h-full lg:max-h-screen",
        isOpen
          ? "translate-y-0 scale-100 opacity-100 lg:translate-x-0"
          : "translate-y-3 scale-[0.985] opacity-0 lg:translate-x-6 lg:translate-y-0"
      )}
    >
      <div className="shrink-0 p-5">
        {backHref ? (
          <a
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-fg-muted lg:hidden"
            href={backHref}
            onClick={closeDetail}
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
              onClick={closeDetail}
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

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-5 [scrollbar-gutter:stable]">
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

        {canReschedule && showReschedule ? (
          <form
            className="rounded-xl border border-border bg-[#FAF8F4] p-3"
            onSubmit={reschedule}
          >
            <label className="field-label" htmlFor={`reschedule-${booking.id}`}>
              New date
            </label>
            <input
              className="focus-ring w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
              disabled={isLoadingSlots || !availableSlots.length}
              id={`reschedule-${booking.id}`}
              max={maxDate}
              min={minDate}
              onChange={(event) => selectRescheduleDate(event.target.value)}
              type="date"
              value={rescheduleDate}
            />

            <div className="mt-3">
              <p className="field-label">Available times</p>
              {selectedDateSlots.length ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {selectedDateSlots.map((slot) => {
                    const timeValue = formatNativeTimeValue(slot.startAt);
                    const selected = timeValue === rescheduleTime;

                    return (
                      <button
                        className={clsx(
                          "cursor-pointer rounded-full border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
                          selected
                            ? "border-primary bg-primary text-primary-fg"
                            : "border-border bg-surface text-fg hover:border-[#d8d3cb]"
                        )}
                        disabled={isLoadingSlots || !availableSlots.length}
                        key={slot.id}
                        onClick={() => setRescheduleTime(timeValue)}
                        type="button"
                      >
                        {formatTime(slot.startAt)}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-fg-muted">
                  {isLoadingSlots
                    ? "Loading open times..."
                    : availableSlots.length
                      ? "No open times on this date."
                      : "No open times found."}
                </p>
              )}
            </div>

            <p className="mt-3 text-xs text-fg-muted">
              {isLoadingSlots
                ? "Loading open times..."
                : selectedSlot
                  ? `${formatDate(selectedSlot.startAt)} · ${formatTime(selectedSlot.startAt)} is available.`
                  : availableSlots.length
                    ? "Choose an open appointment time for this physician."
                    : "No open times found."}
            </p>
            <Button
              className="mt-3 w-full"
              disabled={
                isLoadingSlots ||
                isSubmittingReschedule ||
                !availableSlots.length ||
                !selectedSlot
              }
              type="submit"
            >
              Save
            </Button>
          </form>
        ) : null}
      </div>

      <BookingActions
        bookingId={booking.id}
        isLoadingSlots={isLoadingSlots}
        isRescheduling={showReschedule}
        notes={booking.notes}
        onToggleReschedule={loadSlots}
        status={booking.status}
      />
    </aside>
  );
}
