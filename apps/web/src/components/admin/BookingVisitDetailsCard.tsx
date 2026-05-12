import type { BookingWithRelations } from "@veroscribe/shared";
import { Building2, Video } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DetailItem } from "@/components/ui/DetailItem";
import { formatDate, formatTime } from "@/lib/format";

export function BookingVisitDetailsCard({
  booking
}: {
  booking: BookingWithRelations;
}) {
  return (
    <Card className="bg-[#FAF8F4]">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
        Visit details
      </p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <DetailItem
          label="Date"
          value={booking.slot ? formatDate(booking.slot.startAt) : "TBD"}
        />
        <DetailItem
          label="Time"
          value={booking.slot ? formatTime(booking.slot.startAt) : "TBD"}
        />
        <DetailItem
          label="Type"
          value={
            <span className="inline-flex items-center gap-1">
              {booking.visitType === "Telehealth" ? (
                <Video size={13} />
              ) : (
                <Building2 size={13} />
              )}
              {booking.visitType}
            </span>
          }
        />
        <DetailItem label="Duration" value="30 min" />
      </div>
    </Card>
  );
}
