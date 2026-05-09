import { BookingSidebar } from "@/components/booking/BookingSidebar";
import { PatientDetailsStep } from "@/components/booking/PatientDetailsStep";
import { Card } from "@/components/ui/Card";
import { getPhysician } from "@/lib/api";

export default async function DetailsPage({
  params
}: {
  params: Promise<{ physicianId: string }>;
}) {
  const { physicianId } = await params;
  const physician = await getPhysician(physicianId);

  return (
    <main className="min-h-[calc(100vh-65px)] bg-bg px-5 py-6 md:px-10 md:py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[260px_1fr]">
        <BookingSidebar physician={physician} step={3} />
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
            <PatientDetailsStep physicianId={physicianId} />
          </Card>
        </section>
      </div>
    </main>
  );
}
