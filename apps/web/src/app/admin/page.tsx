import { AdminWorkspace } from "@/components/admin/AdminWorkspace";
import { getBookings, getPhysicians } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default async function AdminPage() {
  const [physicians, allBookings] = await Promise.all([
    getPhysicians(),
    getBookings()
  ]);
  const initialPhysicianId = physicians[0]?.id;
  return (
    <AdminWorkspace
      allBookings={allBookings}
      initialPhysicianId={initialPhysicianId}
      physicians={physicians}
      todayLabel={formatDate(new Date())}
    />
  );
}
