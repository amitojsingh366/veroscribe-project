import type { BookingWithRelations, Physician } from "@veroscribe/shared";
import { Card } from "@/components/ui/Card";
import { formatTime } from "@/lib/format";

export function ScheduleView({
  physicians,
  bookings
}: {
  physicians: Physician[];
  bookings: BookingWithRelations[];
}) {
  const confirmed = bookings.filter((booking) => booking.status === "confirmed");

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold">Today&apos;s confirmed schedule</p>
      <div className="space-y-3">
        {physicians.map((physician) => {
          const items = confirmed.filter(
            (booking) => booking.physicianId === physician.id
          );

          return (
            <section key={physician.id}>
              <p className="text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
                {physician.name}
              </p>
              <div className="mt-2 space-y-1">
                {items.length ? (
                  items.map((booking) => (
                    <div
                      className="flex items-center justify-between rounded-lg bg-bg-muted px-3 py-2 text-sm"
                      key={booking.id}
                    >
                      <span>{booking.patientName}</span>
                      <span className="text-fg-muted">
                        {booking.slot ? formatTime(booking.slot.startAt) : "TBD"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-fg-muted">No confirmed appointments.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </Card>
  );
}
