import { BookingSidebar } from "@/components/booking/BookingSidebar";
import { PatientStepHeader } from "@/components/booking/PatientStepHeader";
import { PatientStepLayout } from "@/components/booking/PatientStepLayout";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { getAvailability, getPhysician } from "@/lib/api";
import { getAvailabilityQueryRange } from "@/lib/bookingCalendar";

export default async function SelectTimePage({
  params
}: {
  params: Promise<{ physicianId: string }>;
}) {
  const { physicianId } = await params;
  const availabilityRange = getAvailabilityQueryRange();
  const [physician, slots] = await Promise.all([
    getPhysician(physicianId),
    getAvailability(physicianId, availabilityRange.from, availabilityRange.to)
  ]);

  return (
    <PatientStepLayout sidebar={<BookingSidebar physician={physician} step={2} />}>
      <PatientStepHeader
        description="Times are shown in your local timezone."
        step={2}
        title={
          <>
            Pick a <span className="serif-italic">time</span> that works.
          </>
        }
      />
      <div className="mt-6">
        {slots.length ? (
          <TimeSlotPicker physicianId={physicianId} slots={slots} />
        ) : (
          <p className="text-sm text-fg-muted">No available slots found.</p>
        )}
      </div>
    </PatientStepLayout>
  );
}
