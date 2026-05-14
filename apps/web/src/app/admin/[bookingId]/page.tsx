import { notFound } from "next/navigation";
import { AdminWorkspace } from "@/components/admin/AdminWorkspace";
import {
  getBooking,
  getBookings,
  getPhysicians,
  isApiNotFound
} from "@/lib/api";
import { formatDate } from "@/lib/format";

export default async function AdminBookingPage({
  params
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const [physicians, allBookings, booking] = await Promise.all([
    getPhysicians(),
    getBookings(),
    getBooking(bookingId)
  ]).catch((error: unknown) => {
    if (isApiNotFound(error)) notFound();
    throw error;
  });

  return (
    <AdminWorkspace
      allBookings={allBookings}
      detailBackHref="/admin"
      initialPhysicianId={booking.physicianId}
      physicians={physicians}
      selectedBookingId={booking.id}
      todayLabel={formatDate(new Date())}
    />
  );
}
