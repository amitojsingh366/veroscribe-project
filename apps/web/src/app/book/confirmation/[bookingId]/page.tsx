import { notFound } from "next/navigation";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { getBooking, isApiNotFound } from "@/lib/api";

export default async function ConfirmationPage({
  params
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await getBooking(bookingId).catch((error: unknown) => {
    if (isApiNotFound(error)) notFound();
    throw error;
  });
  return <BookingConfirmation booking={booking} />;
}
