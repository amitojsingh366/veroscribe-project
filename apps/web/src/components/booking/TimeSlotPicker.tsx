"use client";

import type { Slot, VisitType } from "@veroscribe/shared";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  AvailabilityDatePicker,
  type AvailabilityDay
} from "@/components/booking/AvailabilityDatePicker";
import {
  TimeSlotGroups,
  type TimeSlotSection
} from "@/components/booking/TimeSlotGroups";
import { VisitTypeSelector } from "@/components/booking/VisitTypeSelector";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  addCalendarDays,
  BOOKING_AVAILABILITY_LOOKAHEAD_DAYS,
  BOOKING_DATE_JUMP_DAYS,
  BOOKING_DATE_WINDOW_DAYS,
  diffCalendarDays,
  getBookableStartDateKey,
  parseDateKey
} from "@/lib/bookingCalendar";
import {
  asDate,
  formatDate,
  formatDateKey,
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

  const slotDays = useMemo<AvailabilityDay[]>(
    () =>
      Object.entries(groupedSlots)
        .map(([key, daySlots]) => ({
          available: daySlots.some((slot) => slot.status === "available"),
          date: parseDateKey(key),
          key,
          slots: daySlots
        }))
        .sort((a, b) => a.key.localeCompare(b.key)),
    [groupedSlots]
  );
  const baseDateKey = useMemo(() => getBookableStartDateKey(), []);

  const initialSlot = slots.find((slot) => slot.id === selectedStoreSlotId);
  const initialSlotDateKey = initialSlot ? formatDateKey(initialSlot.startAt) : "";
  const firstAvailableDay =
    slotDays.find((day) => day.key >= baseDateKey && day.available)?.key ??
    slotDays.find((day) => day.key >= baseDateKey)?.key ??
    baseDateKey;
  const initialDateKey =
    initialSlotDateKey && initialSlotDateKey >= baseDateKey
      ? initialSlotDateKey
      : selectedStoreDate && selectedStoreDate >= baseDateKey
        ? selectedStoreDate
        : firstAvailableDay;
  const [weekStartKey, setWeekStartKey] = useState(() => {
    const initialOffset = Math.max(
      0,
      diffCalendarDays(baseDateKey, initialDateKey)
    );
    return addCalendarDays(
      baseDateKey,
      Math.floor(initialOffset / BOOKING_DATE_JUMP_DAYS) *
        BOOKING_DATE_JUMP_DAYS
    );
  });
  const maxWeekStartKey = addCalendarDays(
    baseDateKey,
    Math.max(
      0,
      Math.min(
        BOOKING_AVAILABILITY_LOOKAHEAD_DAYS - BOOKING_DATE_WINDOW_DAYS,
        Math.floor(
          diffCalendarDays(
            baseDateKey,
            slotDays.at(-1)?.key ?? addCalendarDays(baseDateKey, 0)
          ) / BOOKING_DATE_JUMP_DAYS
        ) * BOOKING_DATE_JUMP_DAYS
      )
    )
  );
  const calendarDays = useMemo<AvailabilityDay[]>(
    () =>
      Array.from({ length: BOOKING_DATE_WINDOW_DAYS }, (_, index) => {
        const key = addCalendarDays(weekStartKey, index);
        const daySlots = groupedSlots[key] ?? [];

        return {
          available: daySlots.some((slot) => slot.status === "available"),
          date: parseDateKey(key),
          key,
          slots: daySlots
        };
      }),
    [groupedSlots, weekStartKey]
  );

  const defaultSlotId = initialSlot?.status === "available" ? initialSlot.id : "";
  const { control, handleSubmit, register, setValue } =
    useForm<TimeSelectionValues>({
      defaultValues: {
        dateKey: initialDateKey,
        slotId: defaultSlotId,
        visitType: selectedStoreVisitType
      }
    });

  const selectedDateKey = useWatch({
    control,
    defaultValue: initialDateKey,
    name: "dateKey"
  });
  const selectedSlotId = useWatch({
    control,
    defaultValue: defaultSlotId,
    name: "slotId"
  });
  const selectedVisitType = useWatch({
    control,
    defaultValue: selectedStoreVisitType,
    name: "visitType"
  });
  const selectedDaySlots = groupedSlots[selectedDateKey] ?? [];
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
  const activeCalendarDay =
    calendarDays.find((day) => day.key === selectedDateKey) ?? calendarDays[0];
  const canGoPrevious = weekStartKey > baseDateKey;
  const canGoNext = weekStartKey < maxWeekStartKey;
  const canContinue = selectedSlot?.status === "available";
  const morningSlots = selectedDaySlots.filter(isMorning);
  const afternoonSlots = selectedDaySlots.filter((slot) => !isMorning(slot));
  const slotSections: TimeSlotSection[] = [
    { label: "Morning", slots: morningSlots },
    { label: "Afternoon", slots: afternoonSlots }
  ];

  const selectDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setValue("dateKey", dateKey);
    setValue("slotId", "");
  };

  const preferredDateForWeek = (nextWeekStartKey: string) => {
    const weekKeys = Array.from({ length: BOOKING_DATE_WINDOW_DAYS }, (_, index) =>
      addCalendarDays(nextWeekStartKey, index)
    );
    return (
      weekKeys.find((key) =>
        (groupedSlots[key] ?? []).some((slot) => slot.status === "available")
      ) ?? nextWeekStartKey
    );
  };

  const selectRelativeWeek = (direction: -1 | 1) => {
    const nextWeekStartKey = addCalendarDays(
      weekStartKey,
      direction * BOOKING_DATE_JUMP_DAYS
    );
    if (nextWeekStartKey < baseDateKey || nextWeekStartKey > maxWeekStartKey) {
      return;
    }
    setWeekStartKey(nextWeekStartKey);
    selectDate(preferredDateForWeek(nextWeekStartKey));
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

      <VisitTypeSelector onChange={selectVisitType} value={selectedVisitType} />

      <Card className="p-4 md:p-6">
        <AvailabilityDatePicker
          activeDay={activeCalendarDay}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          days={calendarDays}
          onNext={() => selectRelativeWeek(1)}
          onPrevious={() => selectRelativeWeek(-1)}
          onSelectDate={selectDate}
          selectedDateKey={selectedDateKey}
        />
        <TimeSlotGroups
          onSelectSlot={selectSlot}
          sections={slotSections}
          selectedSlotId={selectedSlotId}
        />
      </Card>

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
