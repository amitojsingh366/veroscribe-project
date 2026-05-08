"use client";

import type { BookingStatus } from "@veroscribe/shared";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { updateBooking } from "@/lib/api";

export function BookingActions({
  bookingId,
  status,
  notes
}: {
  bookingId: string;
  status: BookingStatus;
  notes?: string | null;
}) {
  const router = useRouter();
  const [draftNotes, setDraftNotes] = useState(notes ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patch = async (nextStatus: "confirmed" | "cancelled" | "completed") => {
    setIsSubmitting(true);
    try {
      await updateBooking(bookingId, { status: nextStatus, notes: draftNotes });
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "cancelled" || status === "completed") {
    return (
      <div className="border-t border-border-muted p-5 text-sm text-fg-muted">
        This booking is terminal and cannot be changed.
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-border-muted p-5">
      <Textarea
        label="Notes"
        onChange={(event) => setDraftNotes(event.target.value)}
        rows={3}
        value={draftNotes}
      />
      <div className="grid gap-2">
        {status === "pending" ? (
          <Button disabled={isSubmitting} onClick={() => patch("confirmed")}>
            <Check size={14} />
            Confirm booking
          </Button>
        ) : null}
        {status === "confirmed" ? (
          <Button disabled={isSubmitting} onClick={() => patch("completed")}>
            <Check size={14} />
            Mark complete
          </Button>
        ) : null}
        <Button
          disabled={isSubmitting}
          onClick={() => patch("cancelled")}
          variant="destructive"
        >
          <X size={14} />
          Cancel booking
        </Button>
      </div>
    </div>
  );
}
