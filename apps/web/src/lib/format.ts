export function asDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Vancouver"
  }).format(asDate(value));
}

export function formatMonthYear(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/Vancouver"
  }).format(asDate(value));
}

export function formatDayOfWeek(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "America/Vancouver"
  }).format(asDate(value));
}

export function formatDayOfMonth(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    timeZone: "America/Vancouver"
  }).format(asDate(value));
}

export function formatDateKey(value: string | Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Vancouver",
    year: "numeric"
  }).formatToParts(asDate(value));
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function formatDateKeyLabel(value: string) {
  return formatDate(new Date(`${value}T12:00:00-07:00`));
}

export function formatTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Vancouver"
  }).format(asDate(value));
}

export function formatDateOfBirth(value?: string | null) {
  if (!value) return "DOB not provided";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`));
}

export function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
