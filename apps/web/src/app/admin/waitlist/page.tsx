import { Clock } from "lucide-react";
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminWaitlistPage() {
  return (
    <AdminPlaceholderPage
      description="Waitlist management will help staff fill cancellations and earlier openings."
      icon={Clock}
      title="Waitlist"
    />
  );
}
