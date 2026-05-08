import { BookingDetailPanel } from "@/components/admin/BookingDetailPanel";
import { getBooking } from "@/lib/api";

export default async function AdminDetailSlotPage({
  params
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await getBooking(bookingId);
  return <BookingDetailPanel booking={booking} />;
}
