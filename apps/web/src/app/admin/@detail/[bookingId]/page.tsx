import { notFound } from "next/navigation";
import { BookingDetailPanel } from "@/components/admin/BookingDetailPanel";
import { getBooking, isApiNotFound } from "@/lib/api";

export default async function AdminDetailSlotPage({
  params
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await getBooking(bookingId).catch((error: unknown) => {
    if (isApiNotFound(error)) notFound();
    throw error;
  });
  return <BookingDetailPanel booking={booking} />;
}
