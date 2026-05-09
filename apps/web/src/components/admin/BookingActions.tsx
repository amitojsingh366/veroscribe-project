"use client";

import type { BookingStatus, Slot } from "@veroscribe/shared";
import { Check, ChevronDown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { formatDate, formatTime } from "@/lib/format";
import { getAvailability, updateBooking } from "@/lib/api";

type RescheduleValues = {
  slotId: string;
};

export function BookingActions({
  bookingId,
  currentSlotId,
  physicianId,
  status
}: {
  bookingId: string;
  currentSlotId: string;
  notes?: string | null;
  physicianId: string;
  status: BookingStatus;
}) {
  const router = useRouter();
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const {
    formState: { isSubmitting: isSubmittingReschedule },
    handleSubmit,
    register,
    reset
  } = useForm<RescheduleValues>();

  const patchStatus = async (nextStatus: "confirmed" | "cancelled" | "completed") => {
    setIsSubmittingStatus(true);
    try {
      await updateBooking(bookingId, { status: nextStatus });
      router.refresh();
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  const loadSlots = async () => {
    setShowReschedule((value) => !value);
    if (availableSlots.length || isLoadingSlots) return;

    setIsLoadingSlots(true);
    try {
      const slots = await getAvailability(
        physicianId,
        new Date("2026-05-08T00:00:00-07:00"),
        new Date("2026-05-17T23:59:59-07:00")
      );
      const nextAvailableSlots = slots.filter(
        (slot) => slot.status === "available" && slot.id !== currentSlotId
      );
      setAvailableSlots(nextAvailableSlots);
      reset({ slotId: nextAvailableSlots[0]?.id ?? "" });
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const reschedule = handleSubmit(async (values) => {
    if (!values.slotId) return;
    await updateBooking(bookingId, { slotId: values.slotId });
    setShowReschedule(false);
    router.refresh();
  });

  if (status === "cancelled" || status === "completed") {
    return (
      <div className="border-t border-border-muted p-5 text-sm text-fg-muted">
        This booking is terminal and cannot be changed.
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-border-muted p-5">
      {showReschedule ? (
        <form
          className="rounded-xl border border-border bg-[#FAF8F4] p-3"
          onSubmit={reschedule}
        >
          <label className="field-label" htmlFor={`reschedule-${bookingId}`}>
            New time
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                className="focus-ring w-full appearance-none rounded-lg border border-border bg-surface px-3 py-2.5 pr-9 text-sm"
                disabled={isLoadingSlots || !availableSlots.length}
                id={`reschedule-${bookingId}`}
                {...register("slotId")}
              >
                {availableSlots.length ? (
                  availableSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {formatDate(slot.startAt)} · {formatTime(slot.startAt)}
                    </option>
                  ))
                ) : (
                  <option value="">
                    {isLoadingSlots ? "Loading times..." : "No open times"}
                  </option>
                )}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted"
                size={14}
              />
            </div>
            <Button
              disabled={isLoadingSlots || isSubmittingReschedule || !availableSlots.length}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      ) : null}

      {status === "pending" ? (
        <Button
          className="w-full"
          disabled={isSubmittingStatus}
          onClick={() => patchStatus("confirmed")}
        >
          <Check size={14} />
          Confirm booking
        </Button>
      ) : null}
      {status === "confirmed" ? (
        <Button
          className="w-full"
          disabled={isSubmittingStatus}
          onClick={() => patchStatus("completed")}
        >
          <Check size={14} />
          Mark complete
        </Button>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <Button disabled={isSubmittingStatus} onClick={loadSlots} variant="secondary">
          Reschedule
        </Button>
        <Button
          disabled={isSubmittingStatus}
          onClick={() => patchStatus("cancelled")}
          variant="destructive"
        >
          <X size={14} />
          Cancel
        </Button>
      </div>
    </div>
  );
}
