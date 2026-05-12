import { Users } from "lucide-react";
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminPatientsPage() {
  return (
    <AdminPlaceholderPage
      description="Patient profiles would show demographics, visit history, contact details, and care notes."
      icon={Users}
      title="Patients"
    />
  );
}
