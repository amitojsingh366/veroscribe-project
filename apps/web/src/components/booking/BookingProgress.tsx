"use client";

import { clsx } from "clsx";
import { useBookingStore } from "@/stores/bookingStore";
import { BookingProgressItem } from "./BookingProgressItem";

const steps: Array<{
  label: string;
  sub: string;
}> = [
  { label: "Choose physician", sub: "Browse & select" },
  { label: "Select time", sub: "Date & visit type" },
  { label: "Your details", sub: "Reason for visit" },
  { label: "Confirm", sub: "Review & request" }
] as const;

export function BookingProgress({
  bookingId,
  physicianId,
  slotId,
  step,
  variant = "rail"
}: {
  bookingId?: string;
  physicianId?: string;
  slotId?: string;
  step: 1 | 2 | 3 | 4;
  variant?: "rail" | "compact";
}) {
  const storePhysicianId = useBookingStore((state) => state.physician?.id);
  const storeSlotId = useBookingStore((state) => state.slot?.id);
  const storeBookingId = useBookingStore((state) => state.bookingId);

  const activePhysicianId = physicianId ?? storePhysicianId;
  const activeSlotId = slotId ?? storeSlotId;
  const activeBookingId = bookingId ?? storeBookingId;

  const hrefs = [
    "/book",
    activePhysicianId ? `/book/${activePhysicianId}/time` : undefined,
    activePhysicianId && activeSlotId ? `/book/${activePhysicianId}/details` : undefined,
    activeBookingId ? `/book/confirmation/${activeBookingId}` : undefined
  ];

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
        Step {step} of 4
      </div>
      <div
        className={clsx(
          variant === "rail"
            ? "flex flex-col gap-1"
            : "flex flex-col gap-1 md:grid md:grid-cols-4 md:gap-2"
        )}
      >
        {steps.map(({ label, sub }, index) => {
          const number = index + 1;
          const complete = number < step;
          const current = number === step;
          const href = hrefs[index];

          return (
            <BookingProgressItem
              complete={complete}
              current={current}
              href={href}
              key={label}
              label={label}
              number={number}
              sub={sub}
              variant={variant}
            />
          );
        })}
      </div>
    </div>
  );
}
