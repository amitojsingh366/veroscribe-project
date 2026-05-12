import { Clock } from "lucide-react";
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminWaitlistPage() {
  return (
    <AdminPlaceholderPage
      description="Waitlist management would help staff fill cancellations and offer earlier openings."
      icon={Clock}
      title="Waitlist"
    />
  );
}
