"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBookingInputSchema,
  type CreateBookingInput
} from "@veroscribe/shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createBooking } from "@/lib/api";
import { useBookingStore } from "@/stores/bookingStore";

type CreateBookingFormValues = z.input<typeof createBookingInputSchema>;

export function PatientDetailsForm({
  physicianId,
  slotId
}: {
  physicianId: string;
  slotId: string;
}) {
  const router = useRouter();
  const details = useBookingStore((state) => state.details);
  const setBookingId = useBookingStore((state) => state.setBookingId);
  const setDetails = useBookingStore((state) => state.setDetails);
  const visitType = useBookingStore((state) => state.visitType);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreateBookingFormValues, undefined, CreateBookingInput>({
    resolver: zodResolver(createBookingInputSchema),
    defaultValues: {
      insurance: details.insurance,
      patientDateOfBirth: details.patientDateOfBirth,
      patientEmail: details.patientEmail,
      patientName: details.patientName,
      patientPhone: details.patientPhone,
      physicianId,
      reasonForVisit: details.reasonForVisit,
      slotId,
      visitType
    }
  });

  useEffect(() => {
    const subscription = watch((values) => {
      setDetails({
        insurance: values.insurance,
        patientDateOfBirth: values.patientDateOfBirth,
        patientEmail: values.patientEmail,
        patientName: values.patientName,
        patientPhone: values.patientPhone,
        reasonForVisit: values.reasonForVisit
      });
    });

    return () => subscription.unsubscribe();
  }, [setDetails, watch]);

  const onSubmit = async (values: CreateBookingInput) => {
    try {
      setDetails({
        insurance: values.insurance,
        patientDateOfBirth: values.patientDateOfBirth,
        patientEmail: values.patientEmail,
        patientName: values.patientName,
        patientPhone: values.patientPhone,
        reasonForVisit: values.reasonForVisit
      });
      const booking = await createBooking(values);
      setBookingId(booking.id);
      router.push(`/book/confirmation/${booking.id}`);
    } catch {
      setError("root", {
        message: "Could not create the booking. The slot may no longer be available."
      });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("physicianId")} />
      <input type="hidden" {...register("slotId")} />
      <input type="hidden" {...register("visitType")} />
      <Input
        autoComplete="name"
        label="Full name"
        {...register("patientName")}
        error={errors.patientName?.message}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          autoComplete="bday"
          label="Date of birth"
          type="date"
          {...register("patientDateOfBirth")}
          error={errors.patientDateOfBirth?.message}
        />
        <Input
          autoComplete="email"
          inputMode="email"
          label="Email"
          {...register("patientEmail")}
          error={errors.patientEmail?.message}
        />
        <Input
          autoComplete="tel"
          label="Phone"
          {...register("patientPhone")}
          error={errors.patientPhone?.message}
        />
        <Input label="Insurance" {...register("insurance")} />
      </div>
      <Textarea
        label="Reason for visit"
        rows={5}
        {...register("reasonForVisit")}
        error={errors.reasonForVisit?.message}
      />
      {errors.root?.message ? (
        <p className="text-sm text-status-cancelled-fg">{errors.root.message}</p>
      ) : null}
      <Button disabled={isSubmitting} size="lg" type="submit">
        {isSubmitting ? "Booking..." : "Review & request"}
      </Button>
    </form>
  );
}
