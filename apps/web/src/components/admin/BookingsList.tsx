import type { BookingStatus, BookingWithRelations } from "@veroscribe/shared";
import { Building2, Video } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { formatDate, formatTime, initialsFor } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

const tabs: Array<{ value: BookingStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" }
];

export function BookingsList({
  bookings,
  selectedId,
  status
}: {
  bookings: BookingWithRelations[];
  selectedId?: string;
  status?: BookingStatus;
}) {
  const counts = tabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] =
      tab.value === "all"
        ? bookings.length
        : bookings.filter((booking) => booking.status === tab.value).length;
    return acc;
  }, {});

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((tab) => {
          const active = status ? status === tab.value : tab.value === "all";
          const href = tab.value === "all" ? "/admin" : `/admin?status=${tab.value}`;

          return (
            <Link
              className="border-b-2 px-3 py-2 text-sm font-medium data-[active=true]:border-primary data-[active=false]:border-transparent data-[active=false]:text-fg-muted"
              data-active={active}
              href={href}
              key={tab.value}
            >
              {tab.label}
              <span className="ml-1 text-fg-subtle">{counts[tab.value] ?? 0}</span>
            </Link>
          );
        })}
      </div>

      <Card className="min-h-0 flex-1 overflow-hidden p-0">
        <div className="hidden grid-cols-[1.4fr_1.4fr_1fr_0.8fr_0.9fr] border-b border-border px-4 py-3 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted lg:grid">
          <span>Patient</span>
          <span>Reason</span>
          <span>When</span>
          <span>Type</span>
          <span>Status</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {bookings.map((booking) => (
            <Link
              className="grid items-center gap-3 border-b border-border-muted px-4 py-4 transition hover:bg-[#FAF8F4] data-[selected=true]:border-l-4 data-[selected=true]:border-l-primary data-[selected=true]:bg-[#FAF8F4] lg:grid-cols-[1.4fr_1.4fr_1fr_0.8fr_0.9fr]"
              data-selected={booking.id === selectedId}
              href={`/admin/${booking.id}${status ? `?status=${status}` : ""}`}
              key={booking.id}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  initials={initialsFor(booking.patientName)}
                  name={booking.patientName}
                  size="sm"
                />
                <div>
                  <p className="text-sm font-semibold">{booking.patientName}</p>
                  <p className="text-xs text-fg-muted">{booking.insurance ?? "Self-pay"}</p>
                </div>
              </div>
              <p className="truncate text-sm text-fg">{booking.reasonForVisit}</p>
              <div>
                <p className="text-sm font-medium">
                  {booking.slot ? formatDate(booking.slot.startAt) : "TBD"}
                </p>
                <p className="text-xs text-fg-muted">
                  {booking.slot ? formatTime(booking.slot.startAt) : ""}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
                {booking.visitType === "Telehealth" ? (
                  <Video size={13} />
                ) : (
                  <Building2 size={13} />
                )}
                {booking.visitType}
              </span>
              <StatusBadge status={booking.status} />
            </Link>
          ))}
        </div>
      </Card>
    </section>
  );
}
