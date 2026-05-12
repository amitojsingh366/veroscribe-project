"use client";

import type { Physician } from "@veroscribe/shared";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { useAdminStore } from "@/stores/adminStore";

const adminBookingPathPattern = /^\/admin\/([0-9a-f-]{36})$/i;

export function AdminPhysicianSwitcher({
  className,
  id = "admin-physician",
  physicians
}: {
  className?: string;
  id?: string;
  physicians: Physician[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const physicianId = useAdminStore((state) => state.physicianId);
  const setPhysicianId = useAdminStore((state) => state.setPhysicianId);
  const selectedPhysicianId = physicianId ?? physicians[0]?.id;
  const selectedPhysician =
    physicians.find((physician) => physician.id === selectedPhysicianId) ??
    physicians[0];

  if (!selectedPhysician) return null;

  const handlePhysicianChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const detailBookingId = adminBookingPathPattern.exec(pathname)?.[1];
    setPhysicianId(
      event.target.value,
      detailBookingId ? { bookingPhysicianSyncId: detailBookingId } : undefined
    );

    if (detailBookingId) {
      router.push("/admin");
    }
  };

  return (
    <div
      className={clsx(
        "rounded-xl border border-border bg-surface p-3",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar
          initials={selectedPhysician.initials}
          name={selectedPhysician.name}
          size="sm"
          src={selectedPhysician.photoUrl}
          tone={selectedPhysician.avatarTone}
        />
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor={id}>
            Change physician
          </label>
          <select
            className="w-full appearance-none bg-transparent pr-6 text-xs font-semibold text-fg outline-none"
            id={id}
            onChange={handlePhysicianChange}
            value={selectedPhysician.id}
          >
            {physicians.map((physician) => (
              <option key={physician.id} value={physician.id}>
                {physician.name}
              </option>
            ))}
          </select>
          <p className="truncate text-[11px] text-fg-muted">
            {selectedPhysician.location ?? "Riverside Clinic"}
          </p>
        </div>
        <ChevronDown className="pointer-events-none text-fg-muted" size={13} />
      </div>
    </div>
  );
}
