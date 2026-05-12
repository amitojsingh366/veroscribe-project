"use client";

import type { Slot } from "@veroscribe/shared";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import {
  formatDayOfMonth,
  formatDayOfWeek,
  formatMonthYear
} from "@/lib/format";

export type AvailabilityDay = {
  available: boolean;
  date: Date;
  key: string;
  slots: Slot[];
};

export function AvailabilityDatePicker({
  activeDay,
  canGoNext,
  canGoPrevious,
  days,
  onNext,
  onPrevious,
  onSelectDate,
  selectedDateKey
}: {
  activeDay?: AvailabilityDay;
  canGoNext: boolean;
  canGoPrevious: boolean;
  days: AvailabilityDay[];
  onNext: () => void;
  onPrevious: () => void;
  onSelectDate: (dateKey: string) => void;
  selectedDateKey: string;
}) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-fg md:text-base">
          {activeDay ? formatMonthYear(activeDay.date) : "Availability"}
        </h2>
        <div className="flex gap-1">
          <IconButton
            disabled={!canGoPrevious}
            label="Previous date"
            onClick={onPrevious}
          >
            <ChevronLeft size={14} />
          </IconButton>
          <IconButton disabled={!canGoNext} label="Next date" onClick={onNext}>
            <ChevronRight size={14} />
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {days.map((day) => {
          const active = selectedDateKey === day.key;
          return (
            <button
              className={clsx(
                "flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-xl border text-center transition",
                active
                  ? "border-primary bg-primary text-primary-fg"
                  : "border-border bg-surface text-fg hover:border-[#c9c2b6]",
                !day.available && "opacity-40"
              )}
              key={day.key}
              onClick={() => onSelectDate(day.key)}
              type="button"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] opacity-60">
                {formatDayOfWeek(day.date)}
              </span>
              <span className="text-lg font-medium">{formatDayOfMonth(day.date)}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
