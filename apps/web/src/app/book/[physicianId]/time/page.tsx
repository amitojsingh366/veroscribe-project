import Link from "next/link";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    <main className="min-h-screen bg-bg px-5 py-6 md:px-10 md:py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <BookingProgress step={2} />
          <Card className="mt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
              Your visit
            </p>
            <div className="flex items-center gap-3">
              <Avatar
                initials={physician.initials}
                name={physician.name}
                src={physician.photoUrl}
                tone={physician.avatarTone}
              />
              <div>
                <p className="text-sm font-semibold">{physician.name}</p>
                <p className="text-xs text-fg-muted">{physician.specialty}</p>
              </div>
            </div>
          </Card>
        </aside>

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

          <Card className="mt-6 p-5 md:p-6">
            {slots.length ? (
              <TimeSlotPicker physicianId={physicianId} slots={slots} />
            ) : (
              <p className="text-sm text-fg-muted">No available slots found.</p>
            )}
          </Card>

          <div className="mt-5">
            <Link href="/book">
              <Button variant="ghost">Back</Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
