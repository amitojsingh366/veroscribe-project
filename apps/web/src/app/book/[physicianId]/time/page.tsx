import { BookingSidebar } from "@/components/booking/BookingSidebar";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { getAvailability, getPhysician } from "@/lib/api";

export default async function SelectTimePage({
  params
}: {
  params: Promise<{ physicianId: string }>;
}) {
  const { physicianId } = await params;
  const [physician, slots] = await Promise.all([
    getPhysician(physicianId),
    getAvailability(
      physicianId,
      new Date("2026-05-08T00:00:00-07:00"),
      new Date("2026-05-17T23:59:59-07:00")
    )
  ]);

  return (
    <main className="min-h-[calc(100vh-65px)] bg-bg px-5 py-6 md:px-10 md:py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[260px_1fr]">
        <BookingSidebar physician={physician} step={2} />

        <section>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
            Step 2 of 4
          </p>
          <h1 className="mt-2 text-3xl leading-tight md:text-4xl">
            Pick a <span className="serif-italic">time</span> that works.
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            Times are shown in your local timezone.
          </p>

          <div className="mt-6">
            {slots.length ? (
              <TimeSlotPicker
                physicianId={physicianId}
                slots={slots}
              />
            ) : (
              <p className="text-sm text-fg-muted">No available slots found.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
