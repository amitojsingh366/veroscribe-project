import type { ReactNode } from "react";

export function BookingDetailSection({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
        {title}
      </p>
      {children}
    </section>
  );
}
