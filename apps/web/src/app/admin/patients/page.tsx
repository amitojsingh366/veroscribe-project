import { Users } from "lucide-react";
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminPatientsPage() {
  return (
    <AdminPlaceholderPage
      description="Patient profiles will show demographics, visit history, and contact details."
      icon={Users}
      title="Patients"
    />
  );
}
