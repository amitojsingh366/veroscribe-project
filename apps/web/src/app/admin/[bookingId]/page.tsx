import { redirect } from "next/navigation";

export default async function AdminBookingPage({
  params
}: {
  params: Promise<{ bookingId: string }>;
}) {
  await params;
  redirect("/admin");
}
