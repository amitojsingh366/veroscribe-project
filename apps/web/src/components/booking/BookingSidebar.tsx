import type { Physician, Slot } from "@veroscribe/shared";
import { BookingProgress } from "./BookingProgress";
import { VisitSummaryCard } from "./VisitSummaryCard";

export function BookingSidebar({
  bookingId,
  physician,
  slot,
  step
}: {
  bookingId?: string;
  physician: Physician;
  slot?: Slot;
  step: 2 | 3 | 4;
}) {
  return (
    <aside>
      <BookingProgress
        bookingId={bookingId}
        physicianId={physician.id}
        slotId={slot?.id}
        step={step}
      />
      <VisitSummaryCard physician={physician} slot={slot} />
    </aside>
  );
}
