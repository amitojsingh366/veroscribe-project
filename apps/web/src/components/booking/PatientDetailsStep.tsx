"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PatientDetailsForm } from "@/components/booking/PatientDetailsForm";
import { useBookingStore } from "@/stores/bookingStore";

export function PatientDetailsStep({ physicianId }: { physicianId: string }) {
  const router = useRouter();
  const slotId = useBookingStore((state) => state.slot?.id);

  useEffect(() => {
    if (!slotId) router.replace(`/book/${physicianId}/time`);
  }, [physicianId, router, slotId]);

  if (!slotId) {
    return <p className="text-sm text-fg-muted">Choose a time to continue.</p>;
  }

  return <PatientDetailsForm physicianId={physicianId} slotId={slotId} />;
}
