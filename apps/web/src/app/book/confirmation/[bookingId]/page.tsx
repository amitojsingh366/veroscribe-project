import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { getBooking } from "@/lib/api";

export default async function ConfirmationPage({
  params
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await getBooking(bookingId);
  return <BookingConfirmation booking={booking} />;
}
