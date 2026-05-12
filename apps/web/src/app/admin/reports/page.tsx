import { FileText } from "lucide-react";
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminReportsPage() {
  return (
    <AdminPlaceholderPage
      description="Reporting will summarize schedule health, request volume, and operations."
      icon={FileText}
      title="Reports"
    />
  );
}
