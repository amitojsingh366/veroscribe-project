"use client";

import type { BookingWithRelations, Slot } from "@veroscribe/shared";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { toast } from "sonner";
import { getAvailability, updateBooking } from "@/lib/api";
import {
  asDate,
  formatDateKey,
  formatNativeTimeValue
} from "@/lib/format";
import { BookingActivityList } from "./BookingActivityList";
import { BookingActions } from "./BookingActions";
import { BookingDetailHeader } from "./BookingDetailHeader";
import { BookingDetailSection } from "./BookingDetailSection";
import { BookingVisitDetailsCard } from "./BookingVisitDetailsCard";
import { RescheduleBookingForm } from "./RescheduleBookingForm";

const RESCHEDULE_ANIMATION_MS = 260;

export function BookingDetailPanel({
  backHref,
  booking,
  isOpen = true,
  onRequestClose
}: {
  backHref?: string;
  booking: BookingWithRelations;
  isOpen?: boolean;
  onRequestClose?: () => void;
}) {
  const router = useRouter();
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [renderReschedule, setRenderReschedule] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const rescheduleCardRef = useRef<HTMLDivElement>(null);
  const rescheduleExitTimerRef = useRef<number | undefined>(undefined);
  const availableSlotDates = useMemo(
    () =>
      Array.from(
        new Set(availableSlots.map((slot) => formatDateKey(slot.startAt)))
      ).sort(),
    [availableSlots]
  );
  const selectedDateSlots = useMemo(
    () =>
      availableSlots.filter(
        (slot) => formatDateKey(slot.startAt) === rescheduleDate
      ),
    [availableSlots, rescheduleDate]
  );
  const selectedSlot = useMemo(
    () =>
      selectedDateSlots.find(
        (slot) => formatNativeTimeValue(slot.startAt) === rescheduleTime
      ),
    [rescheduleTime, selectedDateSlots]
  );
  const todayKey = formatDateKey(new Date());
  const minDate = availableSlotDates[0]
    ? availableSlotDates[0] > todayKey
      ? availableSlotDates[0]
      : todayKey
    : todayKey;
  const maxDate = availableSlotDates.at(-1);
  const canReschedule =
    booking.status !== "cancelled" && booking.status !== "completed";

  const closeDetail = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!backHref || !onRequestClose) return;
    event.preventDefault();
    onRequestClose();
  };

  const scrollToReschedule = useCallback(() => {
    window.setTimeout(() => {
      rescheduleCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
      rescheduleCardRef.current?.focus({ preventScroll: true });
    }, 80);
  }, []);

  const closeReschedule = useCallback(() => {
    setShowReschedule(false);
    rescheduleExitTimerRef.current = window.setTimeout(() => {
      setRenderReschedule(false);
      rescheduleExitTimerRef.current = undefined;
    }, RESCHEDULE_ANIMATION_MS);
  }, []);

  const openReschedule = useCallback(() => {
    if (rescheduleExitTimerRef.current) {
      window.clearTimeout(rescheduleExitTimerRef.current);
      rescheduleExitTimerRef.current = undefined;
    }
    setRenderReschedule(true);
    window.requestAnimationFrame(() => {
      setShowReschedule(true);
      scrollToReschedule();
    });
  }, [scrollToReschedule]);

  useEffect(
    () => () => {
      if (rescheduleExitTimerRef.current) {
        window.clearTimeout(rescheduleExitTimerRef.current);
      }
    },
    []
  );

  const loadSlots = async () => {
    if (renderReschedule || showReschedule) {
      closeReschedule();
      return;
    }

    openReschedule();
    if (availableSlots.length || isLoadingSlots) return;

    setIsLoadingSlots(true);
    try {
      const now = new Date();
      const from = new Date(now);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(to.getDate() + 30);
      const slots = await getAvailability(booking.physicianId, from, to);
      const nextAvailableSlots = slots.filter(
        (slot) =>
          slot.status === "available" &&
          slot.id !== booking.slotId &&
          asDate(slot.startAt) >= now
      );
      setAvailableSlots(nextAvailableSlots);
      const firstSlot = nextAvailableSlots[0];
      setRescheduleDate(firstSlot ? formatDateKey(firstSlot.startAt) : "");
      setRescheduleTime(firstSlot ? formatNativeTimeValue(firstSlot.startAt) : "");
      if (nextAvailableSlots.length) {
        toast.success("Open reschedule times loaded.");
      } else {
        toast.info("No open reschedule times were found for this physician.");
      }
      scrollToReschedule();
    } catch {
      toast.error("Could not load reschedule times. Please try again.");
      closeReschedule();
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const selectRescheduleDate = (dateKey: string) => {
    setRescheduleDate(dateKey);
    const firstSlotForDate = availableSlots.find(
      (slot) => formatDateKey(slot.startAt) === dateKey
    );
    setRescheduleTime(
      firstSlotForDate ? formatNativeTimeValue(firstSlotForDate.startAt) : ""
    );
  };

  const reschedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSlot) return;

    setIsSubmittingReschedule(true);
    try {
      await updateBooking(booking.id, { slotId: selectedSlot.id });
      toast.success("Booking rescheduled.");
      closeReschedule();
      router.refresh();
    } catch {
      toast.error("Could not reschedule this booking. The slot may no longer be open.");
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  return (
    <aside
      className={clsx(
        "flex h-screen min-h-0 w-full min-w-0 max-w-full transform-gpu flex-col overflow-hidden bg-surface opacity-0 transition-[opacity,transform] duration-300 ease-out lg:h-full lg:max-h-screen",
        isOpen
          ? "translate-y-0 scale-100 opacity-100 lg:translate-x-0"
          : "translate-y-3 scale-[0.985] opacity-0 lg:translate-x-6 lg:translate-y-0"
      )}
    >
      <BookingDetailHeader
        backHref={backHref}
        booking={booking}
        onCloseLinkClick={closeDetail}
      />

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-5 [scrollbar-gutter:stable]">
        <BookingVisitDetailsCard booking={booking} />

        <BookingDetailSection title="Reason for visit">
          <p className="text-sm leading-relaxed text-fg">{booking.reasonForVisit}</p>
        </BookingDetailSection>

        {booking.notes ? (
          <BookingDetailSection title="Front-desk notes">
            <p className="rounded-lg border border-[#ECDBB8] bg-status-pending-bg p-3 text-sm leading-relaxed text-fg">
              {booking.notes}
            </p>
          </BookingDetailSection>
        ) : null}

        <BookingDetailSection title="Activity">
          <BookingActivityList />
        </BookingDetailSection>

        {canReschedule && renderReschedule ? (
          <div
            className={clsx(
              "grid origin-top transform-gpu transition-[grid-template-rows,opacity,transform] duration-300 ease-out focus:outline-none",
              showReschedule
                ? "grid-rows-[1fr] translate-y-0 scale-100 opacity-100"
                : "grid-rows-[0fr] -translate-y-2 scale-[0.98] opacity-0"
            )}
            ref={rescheduleCardRef}
            tabIndex={-1}
          >
            <div className="overflow-hidden">
              <RescheduleBookingForm
                availableSlots={availableSlots}
                bookingId={booking.id}
                isLoadingSlots={isLoadingSlots}
                isSubmitting={isSubmittingReschedule}
                maxDate={maxDate}
                minDate={minDate}
                onDateChange={selectRescheduleDate}
                onSubmit={reschedule}
                onTimeChange={setRescheduleTime}
                rescheduleDate={rescheduleDate}
                rescheduleTime={rescheduleTime}
                selectedDateSlots={selectedDateSlots}
                selectedSlot={selectedSlot}
              />
            </div>
          </div>
        ) : null}
      </div>

      <BookingActions
        bookingId={booking.id}
        isLoadingSlots={isLoadingSlots}
        isRescheduling={renderReschedule || showReschedule}
        notes={booking.notes}
        onToggleReschedule={loadSlots}
        status={booking.status}
      />
    </aside>
  );
}
