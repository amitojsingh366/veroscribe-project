"use client";

import type { Slot } from "@veroscribe/shared";
import { clsx } from "clsx";
import { formatTime } from "@/lib/format";

export type TimeSlotSection = {
  label: string;
  slots: Slot[];
};

export function TimeSlotGroups({
  onSelectSlot,
  sections,
  selectedSlotId
}: {
  onSelectSlot: (slot: Slot) => void;
  sections: TimeSlotSection[];
  selectedSlotId: string;
}) {
  const hasSlots = sections.some((section) => section.slots.length > 0);

  return (
    <div className="mt-5 border-t border-border-muted pt-5">
      {hasSlots ? (
        sections.map(({ label, slots }) => (
          <section className="mt-4 first:mt-0" key={label}>
            <h3 className="mb-3 text-sm font-semibold text-fg">{label}</h3>
            {slots.length ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                {slots.map((slot) => (
                  <TimeSlotButton
                    key={slot.id}
                    onSelect={onSelectSlot}
                    selected={selectedSlotId === slot.id}
                    slot={slot}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-border-muted bg-bg-muted px-3 py-2 text-sm text-fg-muted">
                No {label.toLowerCase()} times on this date.
              </p>
            )}
          </section>
        ))
      ) : (
        <p className="rounded-lg border border-border-muted bg-bg-muted px-3 py-3 text-sm text-fg-muted">
          No appointment times are available on this date. Try another day or
          move to the next week.
        </p>
      )}
    </div>
  );
}

function TimeSlotButton({
  onSelect,
  selected,
  slot
}: {
  onSelect: (slot: Slot) => void;
  selected: boolean;
  slot: Slot;
}) {
  const available = slot.status === "available";

  return (
    <button
      className={clsx(
        "rounded-lg border px-3 py-3 text-sm font-medium transition",
        selected
          ? "border-primary bg-primary text-primary-fg"
          : "border-border bg-surface text-fg hover:border-[#c9c2b6]",
        !available &&
          "cursor-not-allowed bg-transparent text-fg-subtle line-through decoration-fg-subtle hover:border-border"
      )}
      disabled={!available}
      onClick={() => onSelect(slot)}
      type="button"
    >
      {formatTime(slot.startAt)}
    </button>
  );
}
