import { Bell } from "lucide-react";
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminRequestsPage() {
  return (
    <AdminPlaceholderPage
      description="Request triage will collect new patient-submitted appointment requests."
      icon={Bell}
      title="Requests"
    />
  );
}
