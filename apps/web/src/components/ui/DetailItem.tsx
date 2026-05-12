import type { ReactNode } from "react";

export function DetailItem({
  label,
  value
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-fg-subtle">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
