"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBookingInputSchema,
  type CreateBookingInput
} from "@veroscribe/shared";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createBooking } from "@/lib/api";

type CreateBookingFormValues = z.input<typeof createBookingInputSchema>;

export function PatientDetailsForm({
  physicianId,
  slotId
}: {
  physicianId: string;
  slotId: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<CreateBookingFormValues, undefined, CreateBookingInput>({
    resolver: zodResolver(createBookingInputSchema),
    defaultValues: {
      physicianId,
      slotId,
      visitType: "In-person"
    }
  });

  const onSubmit = async (values: CreateBookingInput) => {
    try {
      const booking = await createBooking(values);
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
      </div>
      <Input label="Insurance" {...register("insurance")} />
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
