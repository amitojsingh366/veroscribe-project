import { Bell } from "lucide-react";
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminRequestsPage() {
  return (
    <AdminPlaceholderPage
      description="Request triage would collect new patient-submitted appointment requests and review tasks."
      icon={Bell}
      title="Requests"
    />
  );
}
