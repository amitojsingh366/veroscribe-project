import type { BookingStatus } from "@veroscribe/shared";
import { BookingsList } from "@/components/admin/BookingsList";
import { ScheduleView } from "@/components/admin/ScheduleView";
import { getBookings, getPhysicians } from "@/lib/api";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ status?: BookingStatus }>;
}) {
  const { status } = await searchParams;
  const [bookings, physicians] = await Promise.all([
    getBookings(status ? { status } : undefined),
    getPhysicians()
  ]);

  return (
    <section className="flex min-h-0 flex-col p-5 md:p-7">
      <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-muted">
            Friday, May 8
          </p>
          <h1 className="mt-1 text-3xl leading-tight">
            <span className="serif-italic">Upcoming</span> bookings
          </h1>
        </div>
      </header>
      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Today's visits", "8"],
          ["Awaiting confirmation", "3"],
          ["Avg. lead time", "2.4d"],
          ["No-show rate", "4.1%"]
        ].map(([label, value]) => (
          <div
            className="rounded-2xl border border-border bg-surface p-4"
            key={label}
          >
            <p className="text-xs text-fg-muted">{label}</p>
            <p className="mt-1 text-2xl font-medium">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 gap-5 2xl:grid-cols-[1fr_320px]">
        <BookingsList bookings={bookings} status={status} />
        <div className="hidden 2xl:block">
          <ScheduleView bookings={bookings} physicians={physicians} />
        </div>
      </div>
    </section>
  );
}
