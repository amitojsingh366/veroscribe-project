import type { BookingStatus } from "@veroscribe/shared";
import { Badge } from "@/components/ui/Badge";

const statusMap: Record<
  BookingStatus,
  { label: string; tone: "warning" | "success" | "danger" | "info" }
> = {
  pending: { label: "Pending", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
  completed: { label: "Completed", tone: "info" }
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const item = statusMap[status];
  return (
    <Badge className="self-center justify-self-start" tone={item.tone}>
      <span className="size-1.5 rounded-full bg-current" />
      {item.label}
    </Badge>
  );
}
