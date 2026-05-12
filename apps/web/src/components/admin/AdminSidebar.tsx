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
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/ui/Wordmark";
import { AdminNavGroup, type AdminNavGroupConfig } from "./AdminNav";
import { AdminPhysicianSwitcher } from "./AdminPhysicianSwitcher";

const navGroups: AdminNavGroupConfig[] = [
  {
    label: "Today",
    items: [
      {
        badge: "8",
        href: "/admin",
        icon: CalendarDays,
        label: "Schedule",
        tone: "default"
      },
      {
        badge: "3",
        href: "/admin/requests",
        icon: Bell,
        label: "Requests",
        tone: "warn"
      },
      {
        href: "/admin/waitlist",
        icon: Clock,
        label: "Waitlist",
        tone: "default"
      }
    ]
  },
  {
    label: "Practice",
    items: [
      {
        href: "/admin/patients",
        icon: Users,
        label: "Patients",
        tone: "default"
      },
      {
        href: "/admin/encounters",
        icon: Stethoscope,
        label: "Encounters",
        tone: "default"
      },
      {
        href: "/admin/reports",
        icon: FileText,
        label: "Reports",
        tone: "default"
      }
    ]
  }
];

export function AdminSidebar({ physicians }: { physicians: Physician[] }) {
  const pathname = usePathname();
  const activeItem =
    navGroups
      .flatMap((group) => group.items)
      .find((item) => item.href !== "/admin" && pathname.startsWith(item.href))
      ?.label ?? "Schedule";

  return (
    <aside className="hidden border-r border-border bg-bg-muted p-4 lg:flex lg:flex-col">
      <Wordmark href="/admin" />

      <nav className="mt-7 space-y-6 text-sm font-medium text-fg">
        {navGroups.map((group) => (
          <AdminNavGroup activeItem={activeItem} group={group} key={group.label} />
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
