import type { ReactNode } from "react";

export function PatientStepLayout({
  children,
  sidebar
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-65px)] bg-bg px-5 py-6 md:px-10 md:py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[260px_1fr]">
        {sidebar}
        <section>{children}</section>
      </div>
    </main>
  );
}
