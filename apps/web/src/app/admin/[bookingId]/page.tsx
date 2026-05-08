import Link from "next/link";
import { BookingDetailPanel } from "@/components/admin/BookingDetailPanel";
import { Button } from "@/components/ui/Button";
import { getBooking } from "@/lib/api";

export default async function AdminBookingPage({
  params
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await getBooking(bookingId);

  return (
    <section className="min-h-screen bg-surface lg:hidden">
      <div className="border-b border-border p-4">
        <Link href="/admin">
          <Button variant="ghost">Back to bookings</Button>
        </Link>
      </div>
      <div className="h-[calc(100vh-73px)]">
        <BookingDetailPanel booking={booking} />
      </div>
    </section>
  );
}
