import { Stethoscope } from "lucide-react";
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminEncountersPage() {
  return (
    <AdminPlaceholderPage
      description="Encounter prep will organize upcoming visit context and intake notes."
      icon={Stethoscope}
      title="Encounters"
    />
  );
}
