import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getPhysicians } from "@/lib/api";

export default async function AdminLayout({
  children,
  detail
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
}) {
  void detail;
  const physicians = await getPhysicians();

  return (
    <main className="min-h-screen overflow-x-hidden bg-bg">
      <div className="grid min-h-screen min-w-0 overflow-x-hidden lg:grid-cols-[232px_minmax(0,1fr)]">
        <AdminSidebar physicians={physicians} />
        {children}
      </div>
    </main>
  );
}
