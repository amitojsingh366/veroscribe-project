"use client";

import type { BookingStatus } from "@veroscribe/shared";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { updateBooking } from "@/lib/api";
import { useAdminStore } from "@/stores/adminStore";

const statusSuccessMessages = {
  cancelled: "Booking cancelled.",
  completed: "Booking marked complete.",
  confirmed: "Booking confirmed."
} as const;

export function BookingActions({
  bookingId,
  isLoadingSlots = false,
  isRescheduling = false,
  onToggleReschedule,
  status
}: {
  bookingId: string;
  isLoadingSlots?: boolean;
  isRescheduling?: boolean;
  notes?: string | null;
  onToggleReschedule: () => void;
  status: BookingStatus;
}) {
  const router = useRouter();
  const setStatus = useAdminStore((state) => state.setStatus);
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  const patchStatus = async (nextStatus: "confirmed" | "cancelled" | "completed") => {
    setIsSubmittingStatus(true);
    try {
      await updateBooking(bookingId, { status: nextStatus });
      setStatus(nextStatus);
      if (nextStatus === "cancelled") {
        toast.warning(statusSuccessMessages[nextStatus]);
      } else {
        toast.success(statusSuccessMessages[nextStatus]);
      }
      router.refresh();
    } catch {
      toast.error("Could not update this booking. Please try again.");
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  if (status === "cancelled" || status === "completed") {
    return (
      <div className="shrink-0 border-t border-border-muted bg-surface p-5 text-sm text-fg-muted">
        This booking is terminal and cannot be changed.
      </div>
    );
  }

  return (
    <div className="shrink-0 space-y-3 border-t border-border-muted bg-surface p-5">
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
          variant="success"
        >
          <Check size={14} />
          Mark complete
        </Button>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <Button
          disabled={isSubmittingStatus || isLoadingSlots}
          onClick={onToggleReschedule}
          variant="secondary"
        >
          {isLoadingSlots
            ? "Loading..."
            : isRescheduling
              ? "Hide times"
              : "Reschedule"}
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
