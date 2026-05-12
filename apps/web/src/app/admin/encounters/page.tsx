import { Stethoscope } from "lucide-react";
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminEncountersPage() {
  return (
    <AdminPlaceholderPage
      description="Encounter prep would organize upcoming visit context, intake notes, and clinician handoff details."
      icon={Stethoscope}
      title="Encounters"
    />
  );
}
