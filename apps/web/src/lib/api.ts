import type {
  Booking,
  BookingStatus,
  BookingWithRelations,
  Physician,
  Slot
} from "@veroscribe/shared";
import { env } from "@/env";

function apiUrl(path: string) {
  const baseUrl =
    typeof window === "undefined"
      ? (env.API_INTERNAL_URL ?? env.NEXT_PUBLIC_API_URL)
      : env.NEXT_PUBLIC_API_URL;

  return `${baseUrl}${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}

export function getPhysicians() {
  return request<Physician[]>("/api/physicians");
}

export function getPhysician(id: string) {
  return request<Physician>(`/api/physicians/${id}`);
}

export function getAvailability(physicianId: string, from: Date, to: Date) {
  const params = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString()
  });

  return request<Slot[]>(
    `/api/physicians/${physicianId}/availability?${params.toString()}`
  );
}

export function getBookings(filters?: {
  status?: BookingStatus;
  physicianId?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.physicianId) params.set("physicianId", filters.physicianId);
  const suffix = params.size ? `?${params.toString()}` : "";

  return request<BookingWithRelations[]>(`/api/bookings${suffix}`);
}

export function getBooking(id: string) {
  return request<BookingWithRelations>(`/api/bookings/${id}`);
}

export function createBooking(payload: unknown) {
  return request<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateBooking(id: string, payload: unknown) {
  return request<Booking>(`/api/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
