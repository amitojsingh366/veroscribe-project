import { formatDateKey } from "@/lib/format";

export const BOOKING_DATE_WINDOW_DAYS = 6;
export const BOOKING_DATE_JUMP_DAYS = 7;
export const BOOKING_AVAILABILITY_LOOKAHEAD_DAYS = 56;

export function parseDateKey(dateKey: string) {
  const [year = "0", month = "1", day = "1"] = dateKey.split("-");
  return new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0, 0)
  );
}

export function formatCalendarDateKey(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

export function addCalendarDays(dateKey: string, days: number) {
  const date = parseDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return formatCalendarDateKey(date);
}

export function diffCalendarDays(fromDateKey: string, toDateKey: string) {
  const from = parseDateKey(fromDateKey);
  const to = parseDateKey(toDateKey);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

export function getBookableStartDateKey(referenceDate = new Date()) {
  const todayKey = formatDateKey(referenceDate);
  const today = parseDateKey(todayKey);
  const dayOfWeek = today.getUTCDay();

  if (dayOfWeek === 6) return addCalendarDays(todayKey, 2);
  if (dayOfWeek === 0) return addCalendarDays(todayKey, 1);
  return todayKey;
}

export function getAvailabilityQueryRange(referenceDate = new Date()) {
  const fromKey = getBookableStartDateKey(referenceDate);
  const toKey = addCalendarDays(
    fromKey,
    BOOKING_AVAILABILITY_LOOKAHEAD_DAYS - 1
  );

  return {
    from: new Date(`${fromKey}T00:00:00.000Z`),
    to: new Date(`${toKey}T23:59:59.999Z`)
  };
}
