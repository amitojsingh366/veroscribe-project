import { notFound } from "next/navigation";
import { BookingSidebar } from "@/components/booking/BookingSidebar";
import { PatientStepHeader } from "@/components/booking/PatientStepHeader";
import { PatientStepLayout } from "@/components/booking/PatientStepLayout";
import { PatientDetailsStep } from "@/components/booking/PatientDetailsStep";
import { Card } from "@/components/ui/Card";
import { getPhysician, isApiNotFound } from "@/lib/api";

export default async function DetailsPage({
  params
}: {
  params: Promise<{ physicianId: string }>;
}) {
  const { physicianId } = await params;
  const physician = await getPhysician(physicianId).catch((error: unknown) => {
    if (isApiNotFound(error)) notFound();
    throw error;
  });

  return (
    <PatientStepLayout sidebar={<BookingSidebar physician={physician} step={3} />}>
      <PatientStepHeader
        description="This helps the provider prepare for your visit."
        step={3}
        title={
          <>
            Tell us a bit <span className="serif-italic">about you.</span>
          </>
        }
      />
      <Card className="mt-6 p-5 md:p-7">
        <PatientDetailsStep physicianId={physicianId} />
      </Card>
    </PatientStepLayout>
  );
}
