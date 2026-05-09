"use client";

import type { Slot, VisitType } from "@veroscribe/shared";
import { clsx } from "clsx";
import { Building2, ChevronLeft, ChevronRight, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  asDate,
  formatDate,
  formatDateKey,
  formatDayOfMonth,
  formatDayOfWeek,
  formatMonthYear,
  formatTime
} from "@/lib/format";
import { useBookingStore } from "@/stores/bookingStore";

type TimeSelectionValues = {
  dateKey: string;
  slotId: string;
  visitType: VisitType;
};

function isMorning(slot: Slot) {
  return asDate(slot.startAt).getHours() < 12;
}

export function TimeSlotPicker({
  physicianId,
  slots
}: {
  physicianId: string;
  slots: Slot[];
}) {
  const router = useRouter();
  const clearSlot = useBookingStore((state) => state.clearSlot);
  const selectedStoreDate = useBookingStore((state) => state.selectedDate);
  const selectedStoreSlotId = useBookingStore((state) => state.slot?.id);
  const selectedStoreVisitType = useBookingStore((state) => state.visitType);
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const setSlot = useBookingStore((state) => state.setSlot);
  const setVisitType = useBookingStore((state) => state.setVisitType);

  const groupedSlots = useMemo(() => {
    return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
      const key = formatDateKey(slot.startAt);
      acc[key] = [...(acc[key] ?? []), slot];
      return acc;
    }, {});
  }, [slots]);

  const days = useMemo(
    () =>
      Object.entries(groupedSlots)
        .map(([key, daySlots]) => ({
          available: daySlots.some((slot) => slot.status === "available"),
          key,
          slots: daySlots
        }))
        .sort((a, b) => a.key.localeCompare(b.key)),
    [groupedSlots]
  );
  const todayKey = formatDateKey(new Date());
  const calendarDays = days.filter((day) => day.key >= todayKey);

  const initialSlot = slots.find((slot) => slot.id === selectedStoreSlotId);
  const firstAvailableDay =
    calendarDays.find((day) => day.available)?.key ??
    calendarDays[0]?.key ??
    "";

  const { handleSubmit, register, setValue, watch } = useForm<TimeSelectionValues>({
    defaultValues: {
      dateKey:
        (initialSlot ? formatDateKey(initialSlot.startAt) : selectedStoreDate) ??
        firstAvailableDay,
      slotId: initialSlot?.status === "available" ? initialSlot.id : "",
      visitType: selectedStoreVisitType
    }
  });

  const selectedDateKey = watch("dateKey");
  const selectedSlotId = watch("slotId");
  const selectedVisitType = watch("visitType");
  const selectedDaySlots = groupedSlots[selectedDateKey] ?? [];
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
  const selectedDayIndex = calendarDays.findIndex(
    (day) => day.key === selectedDateKey
  );
  const activeDayIndex = selectedDayIndex >= 0 ? selectedDayIndex : 0;
  const activeCalendarDay = calendarDays[activeDayIndex];
  const canGoPrevious = activeDayIndex > 0;
  const canGoNext = activeDayIndex < calendarDays.length - 1;
  const canContinue = selectedSlot?.status === "available";
  const morningSlots = selectedDaySlots.filter(isMorning);
  const afternoonSlots = selectedDaySlots.filter((slot) => !isMorning(slot));
  const slotSections: Array<{ label: string; slots: Slot[] }> = [
    { label: "Morning", slots: morningSlots },
    { label: "Afternoon", slots: afternoonSlots }
  ];

  const selectDate = (dateKey: string) => {
    clearSlot();
    setSelectedDate(dateKey);
    setValue("dateKey", dateKey);
    setValue("slotId", "");
  };

  const selectRelativeDate = (direction: -1 | 1) => {
    const nextDay = calendarDays[activeDayIndex + direction];
    if (!nextDay) return;
    selectDate(nextDay.key);
  };

  const selectVisitType = (visitType: VisitType) => {
    setVisitType(visitType);
    setValue("visitType", visitType);
  };

  const selectSlot = (slot: Slot) => {
    if (slot.status !== "available") return;
    setSlot(slot);
    setValue("dateKey", formatDateKey(slot.startAt));
    setValue("slotId", slot.id);
  };

  const onSubmit = handleSubmit((values) => {
    const slot = slots.find((candidate) => candidate.id === values.slotId);
    if (!slot || slot.status !== "available") return;
    setSlot(slot);
    setVisitType(values.visitType);
    router.push(`/book/${physicianId}/details`);
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <input type="hidden" {...register("dateKey")} />
      <input type="hidden" {...register("slotId")} />
      <input type="hidden" {...register("visitType")} />

      <div className="grid grid-cols-2 gap-2 sm:flex">
        {(["In-person", "Telehealth"] as const).map((visitType) => {
          const active = selectedVisitType === visitType;
          return (
            <button
              className={clsx(
                "inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition",
                active
                  ? "border-primary bg-primary text-primary-fg"
                  : "border-border bg-surface text-fg hover:border-[#c9c2b6]"
              )}
              key={visitType}
              onClick={() => selectVisitType(visitType)}
              type="button"
            >
              {visitType === "In-person" ? <Building2 size={14} /> : <Video size={14} />}
              {visitType}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-fg md:text-base">
            {activeCalendarDay
              ? formatMonthYear(
                  new Date(`${activeCalendarDay.key}T12:00:00-07:00`)
                )
              : "Availability"}
          </h2>
          <div className="flex gap-1">
            <button
              aria-label="Previous date"
              className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface text-fg-muted transition hover:border-[#c9c2b6] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canGoPrevious}
              onClick={() => selectRelativeDate(-1)}
              type="button"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              aria-label="Next date"
              className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface text-fg-muted transition hover:border-[#c9c2b6] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canGoNext}
              onClick={() => selectRelativeDate(1)}
              type="button"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {calendarDays.map((day) => {
            const firstSlot = day.slots[0];
            const active = selectedDateKey === day.key;
            return (
              <button
                className={clsx(
                  "flex min-h-16 flex-col items-center justify-center rounded-xl border text-center transition",
                  active
                    ? "border-primary bg-primary text-primary-fg"
                    : "border-border bg-surface text-fg hover:border-[#c9c2b6]",
                  !day.available && "opacity-40"
                )}
                key={day.key}
                onClick={() => selectDate(day.key)}
                type="button"
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.08em] opacity-60">
                  {firstSlot ? formatDayOfWeek(firstSlot.startAt) : ""}
                </span>
                <span className="text-lg font-medium">
                  {firstSlot ? formatDayOfMonth(firstSlot.startAt) : ""}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 border-t border-border-muted pt-5">
          {slotSections.map(({ label, slots: daySlots }) => (
            <section className="mt-4 first:mt-0" key={label}>
              <h3 className="mb-3 text-sm font-semibold text-fg">{label}</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                {daySlots.map((slot) => {
                  const active = selectedSlotId === slot.id;
                  const available = slot.status === "available";
                  return (
                    <button
                      className={clsx(
                        "rounded-lg border px-3 py-3 text-sm font-medium transition",
                        active
                          ? "border-primary bg-primary text-primary-fg"
                          : "border-border bg-surface text-fg hover:border-[#c9c2b6]",
                        !available &&
                          "cursor-not-allowed bg-transparent text-fg-subtle line-through decoration-fg-subtle hover:border-border"
                      )}
                      disabled={!available}
                      key={slot.id}
                      onClick={() => selectSlot(slot)}
                      type="button"
                    >
                      {formatTime(slot.startAt)}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/book">
          <Button variant="ghost">
            <ChevronLeft size={14} />
            Back
          </Button>
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-fg-muted">
            {selectedSlot
              ? `${formatDate(selectedSlot.startAt)} · ${formatTime(selectedSlot.startAt)}`
              : "Choose a date and time"}
          </p>
          <Button disabled={!canContinue} type="submit">
            Continue
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </form>
  );
}
