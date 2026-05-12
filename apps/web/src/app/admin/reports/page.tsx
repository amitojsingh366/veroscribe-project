import { FileText } from "lucide-react";
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminReportsPage() {
  return (
    <AdminPlaceholderPage
      description="Reporting would summarize schedule health, request volume, utilization, and clinic operations."
      icon={FileText}
      title="Reports"
    />
  );
}
