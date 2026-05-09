"use client";

import type { Physician, Slot } from "@veroscribe/shared";
import { useEffect } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { formatDate, formatDateKeyLabel, formatTime } from "@/lib/format";
import { useBookingStore } from "@/stores/bookingStore";

export function VisitSummaryCard({
  physician,
  slot
}: {
  physician: Physician;
  slot?: Slot;
}) {
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedSlot = useBookingStore((state) => state.slot);
  const setPhysician = useBookingStore((state) => state.setPhysician);
  const setSlot = useBookingStore((state) => state.setSlot);
  const visitType = useBookingStore((state) => state.visitType);

  useEffect(() => {
    setPhysician(physician);
  }, [physician, setPhysician]);

  useEffect(() => {
    if (slot) setSlot(slot);
  }, [slot, setSlot]);

  const dateLabel = selectedSlot
    ? formatDate(selectedSlot.startAt)
    : selectedDate
      ? formatDateKeyLabel(selectedDate)
      : undefined;

  return (
    <Card className="mt-6 rounded-[18px] p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
        Your visit
      </p>
      <div className="flex items-center gap-3">
        <Avatar
          initials={physician.initials}
          name={physician.name}
          src={physician.photoUrl}
          tone={physician.avatarTone}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{physician.name}</p>
          <p className="truncate text-xs text-fg-muted">{physician.specialty}</p>
        </div>
      </div>
      {dateLabel ? (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border-muted pt-3">
          <div>
            <p className="text-xs text-fg-subtle">Date</p>
            <p className="text-sm font-medium">{dateLabel}</p>
          </div>
          {selectedSlot ? (
            <div>
              <p className="text-xs text-fg-subtle">Time</p>
              <p className="text-sm font-medium">{formatTime(selectedSlot.startAt)}</p>
            </div>
          ) : null}
          <div>
            <p className="text-xs text-fg-subtle">Type</p>
            <p className="text-sm font-medium">{visitType}</p>
          </div>
          {selectedSlot ? (
            <div>
              <p className="text-xs text-fg-subtle">Duration</p>
              <p className="text-sm font-medium">30 min</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
