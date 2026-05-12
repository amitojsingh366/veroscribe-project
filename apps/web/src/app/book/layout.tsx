import { PatientNav } from "@/components/booking/PatientNav";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <PatientNav />
      {children}
    </div>
  );
}
