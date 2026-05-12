"use client";

import type { Slot } from "@veroscribe/shared";
import { clsx } from "clsx";
import type { FormEventHandler } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatDate, formatNativeTimeValue, formatTime } from "@/lib/format";

export function RescheduleBookingForm({
  availableSlots,
  bookingId,
  isLoadingSlots,
  isSubmitting,
  maxDate,
  minDate,
  onDateChange,
  onSubmit,
  onTimeChange,
  rescheduleDate,
  rescheduleTime,
  selectedDateSlots,
  selectedSlot
}: {
  availableSlots: Slot[];
  bookingId: string;
  isLoadingSlots: boolean;
  isSubmitting: boolean;
  maxDate?: string;
  minDate: string;
  onDateChange: (dateKey: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onTimeChange: (timeValue: string) => void;
  rescheduleDate: string;
  rescheduleTime: string;
  selectedDateSlots: Slot[];
  selectedSlot?: Slot;
}) {
  return (
    <form
      className="rounded-xl border border-border bg-[#FAF8F4] p-3"
      onSubmit={onSubmit}
    >
      <Input
        className="px-3 py-2.5 text-sm"
        disabled={isLoadingSlots || !availableSlots.length}
        id={`reschedule-${bookingId}`}
        label="New date"
        max={maxDate}
        min={minDate}
        onChange={(event) => onDateChange(event.target.value)}
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
                  onClick={() => onTimeChange(timeValue)}
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
          isSubmitting ||
          !availableSlots.length ||
          !selectedSlot
        }
        type="submit"
      >
        Save
      </Button>
    </form>
  );
}
