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

export function formatTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Vancouver"
  }).format(asDate(value));
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
