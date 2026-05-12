import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export type AdminNavGroupItem = {
  badge?: string;
  href: string;
  icon: LucideIcon;
  label: string;
  tone: "default" | "warn";
};

export type AdminNavGroupConfig = {
  items: AdminNavGroupItem[];
  label: string;
};

export function AdminNavGroup({
  activeItem,
  group
}: {
  activeItem?: string;
  group: AdminNavGroupConfig;
}) {
  return (
    <div>
      <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.08em] text-fg-muted">
        {group.label}
      </p>
      <div className="space-y-1">
        {group.items.map((item) => (
          <AdminNavItem
            active={item.label === activeItem}
            item={item}
            key={item.label}
          />
        ))}
      </div>
    </div>
  );
}

function AdminNavItem({
  active,
  item
}: {
  active: boolean;
  item: AdminNavGroupItem;
}) {
  const Icon = item.icon;

  return (
    <Link
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-fg-muted transition hover:bg-black/[0.04] data-[active=true]:bg-surface data-[active=true]:text-fg"
      data-active={active}
      href={item.href}
    >
      <Icon size={14} />
      <span>{item.label}</span>
      {item.badge ? (
        <span
          className="ml-auto rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-fg-muted data-[tone=warn]:border-[#ECDBB8] data-[tone=warn]:bg-status-pending-bg data-[tone=warn]:text-status-pending-fg"
          data-tone={item.tone}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
