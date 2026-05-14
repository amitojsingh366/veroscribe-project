"use client";

import type { Physician } from "@veroscribe/shared";
import { Filter, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { SearchField } from "@/components/ui/SearchField";
import { AdminPhysicianSwitcher } from "./AdminPhysicianSwitcher";

const placeholderMessage = "This feature has not been implemented in this prototype.";

export function AdminWorkspaceHeader({
  onSearchChange,
  physicians,
  searchTerm,
  todayLabel
}: {
  onSearchChange: (value: string) => void;
  physicians: Physician[];
  searchTerm: string;
  todayLabel: string;
}) {
  return (
    <header className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-muted">
            {todayLabel}
          </p>
          <h1 className="mt-1 text-3xl leading-tight">
            <span className="serif-italic">Upcoming</span> bookings
          </h1>
        </div>
        <AdminPhysicianSwitcher
          className="lg:hidden"
          id="admin-main-physician"
          physicians={physicians}
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <SearchField
          className="sm:w-72"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search patients, reason..."
          value={searchTerm}
        />
        <Button
          onClick={() => toast.info(placeholderMessage)}
          variant="secondary"
        >
          <Filter size={14} />
          Filter
        </Button>
        <Button onClick={() => toast.info(placeholderMessage)}>
          <Plus size={14} />
          New booking
        </Button>
      </div>
    </header>
  );
}
