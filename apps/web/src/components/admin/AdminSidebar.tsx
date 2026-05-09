"use client";

import type { Physician } from "@veroscribe/shared";
import {
  Bell,
  CalendarDays,
  Clock,
  FileText,
  Stethoscope,
  Users
} from "lucide-react";
import { AdminPhysicianSwitcher } from "./AdminPhysicianSwitcher";

const navGroups = [
  {
    label: "Today",
    items: [
      { badge: "8", icon: CalendarDays, label: "Schedule", tone: "default" },
      { badge: "3", icon: Bell, label: "Requests", tone: "warn" },
      { icon: Clock, label: "Waitlist", tone: "default" }
    ]
  },
  {
    label: "Practice",
    items: [
      { icon: Users, label: "Patients", tone: "default" },
      { icon: Stethoscope, label: "Encounters", tone: "default" },
      { icon: FileText, label: "Reports", tone: "default" }
    ]
  }
] as const;

export function AdminSidebar({ physicians }: { physicians: Physician[] }) {
  return (
    <aside className="hidden border-r border-border bg-bg-muted p-4 lg:flex lg:flex-col">
      <span className="wordmark">
        vero
        <span className="font-sans text-[0.55em] not-italic text-accent">•</span>
      </span>

      <nav className="mt-7 space-y-6 text-sm font-medium text-fg">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.08em] text-fg-muted">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item, index) => {
                const Icon = item.icon;
                const active = group.label === "Today" && index === 0;
                return (
                  <div
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-fg-muted data-[active=true]:bg-surface data-[active=true]:text-fg"
                    data-active={active}
                    key={item.label}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                    {"badge" in item ? (
                      <span
                        className="ml-auto rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-fg-muted data-[tone=warn]:border-[#ECDBB8] data-[tone=warn]:bg-status-pending-bg data-[tone=warn]:text-status-pending-fg"
                        data-tone={item.tone}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <AdminPhysicianSwitcher
        className="mt-auto"
        id="admin-sidebar-physician"
        physicians={physicians}
      />
    </aside>
  );
}
