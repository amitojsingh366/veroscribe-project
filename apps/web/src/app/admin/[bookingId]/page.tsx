import { AdminWorkspace } from "@/components/admin/AdminWorkspace";
import { getBooking, getBookings, getPhysicians } from "@/lib/api";

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
  ]);

  return (
    <AdminWorkspace
      allBookings={allBookings}
      detailBackHref="/admin"
      initialPhysicianId={booking.physicianId}
      physicians={physicians}
      selectedBookingId={booking.id}
    />
  );
}
