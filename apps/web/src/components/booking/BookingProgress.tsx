"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { useBookingStore } from "@/stores/bookingStore";

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
            : "grid grid-cols-4 gap-2"
        )}
      >
        {steps.map(({ label, sub }, index) => {
          const number = index + 1;
          const complete = number < step;
          const current = number === step;
          const href = hrefs[index];
          const content = (
            <>
              <span
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold data-[complete=true]:border-primary data-[complete=true]:bg-primary data-[complete=true]:text-primary-fg data-[current=true]:border-primary"
                data-complete={complete}
                data-current={current}
              >
                {complete ? <Check size={13} /> : number}
              </span>
              <span className={clsx(variant === "rail" ? "block" : "hidden sm:block")}>
                <span
                  className={clsx(
                    "block text-sm font-semibold",
                    current || complete ? "text-fg" : "text-fg-muted"
                  )}
                >
                  {label}
                </span>
                <span className="block text-xs text-fg-subtle">{sub}</span>
              </span>
            </>
          );

          return href ? (
            <Link
              aria-current={current ? "step" : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-lg border border-transparent p-2 text-left transition hover:bg-black/[0.04] data-[current=true]:border-border data-[current=true]:bg-surface",
                variant === "compact" && "justify-center sm:justify-start"
              )}
              data-current={current}
              href={href}
              key={label}
            >
              {content}
            </Link>
          ) : (
            <button
              className={clsx(
                "flex cursor-not-allowed items-center gap-3 rounded-lg border border-transparent p-2 text-left opacity-50",
                variant === "compact" && "justify-center sm:justify-start"
              )}
              disabled
              key={label}
              type="button"
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
