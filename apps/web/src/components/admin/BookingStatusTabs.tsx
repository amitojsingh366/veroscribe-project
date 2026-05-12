"use client";

import type { BookingStatus } from "@veroscribe/shared";

export type BookingListStatus = BookingStatus | "all";

export const bookingTabs: Array<{ value: BookingListStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];

export function BookingStatusTabs({
  counts,
  onSelectStatus,
  status
}: {
  counts: Record<string, number>;
  onSelectStatus: (status: BookingListStatus) => void;
  status: BookingListStatus;
}) {
  return (
    <div className="flex min-w-0 gap-1 overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {bookingTabs.map((tab) => {
        const active = status === tab.value;

        return (
          <button
            className="cursor-pointer border-b-2 px-3 py-2 text-sm font-medium data-[active=false]:border-transparent data-[active=false]:text-fg-muted data-[active=true]:border-primary"
            data-active={active}
            key={tab.value}
            onClick={() => onSelectStatus(tab.value)}
            type="button"
          >
            {tab.label}
            <span className="ml-1 text-fg-subtle">{counts[tab.value] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
