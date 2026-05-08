import { redirect } from "next/navigation";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { PatientDetailsForm } from "@/components/booking/PatientDetailsForm";
import { Card } from "@/components/ui/Card";
import { getPhysician } from "@/lib/api";

export default async function DetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ physicianId: string }>;
  searchParams: Promise<{ slot?: string }>;
}) {
  const [{ physicianId }, { slot }] = await Promise.all([params, searchParams]);
  if (!slot) redirect(`/book/${physicianId}/time`);

  const physician = await getPhysician(physicianId);

  return (
    <main className="min-h-screen bg-bg px-5 py-6 md:px-10 md:py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <BookingProgress step={3} />
          <Card className="mt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
              Your provider
            </p>
            <p className="text-sm font-semibold">{physician.name}</p>
            <p className="text-xs text-fg-muted">{physician.specialty}</p>
          </Card>
        </aside>
        <section>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
            Step 3 of 4
          </p>
          <h1 className="mt-2 text-3xl leading-tight md:text-4xl">
            Tell us a bit <span className="serif-italic">about you.</span>
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            This helps the provider prepare for your visit.
          </p>
          <Card className="mt-6 p-5 md:p-7">
            <PatientDetailsForm physicianId={physicianId} slotId={slot} />
          </Card>
        </section>
      </div>
    </main>
  );
}
