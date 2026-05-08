"use client";

import type { Slot } from "@veroscribe/shared";
import { clsx } from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate, formatTime } from "@/lib/format";

export function TimeSlotPicker({
  physicianId,
  slots
}: {
  physicianId: string;
  slots: Slot[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const selectedSlotId = params.get("slot");
  const groups = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const key = formatDate(slot.startAt);
    acc[key] = [...(acc[key] ?? []), slot];
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([date, groupedSlots]) => (
        <section key={date}>
          <h2 className="mb-3 text-sm font-semibold text-fg">{date}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {groupedSlots.map((slot) => (
              <button
                className={clsx(
                  "rounded-lg border px-3 py-3 text-sm font-medium transition hover:border-[#c9c2b6]",
                  selectedSlotId === slot.id
                    ? "border-primary bg-primary text-primary-fg"
                    : "border-border bg-surface text-fg"
                )}
                key={slot.id}
                onClick={() => {
                  router.push(`/book/${physicianId}/details?slot=${slot.id}`);
                }}
                type="button"
              >
                {formatTime(slot.startAt)}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
