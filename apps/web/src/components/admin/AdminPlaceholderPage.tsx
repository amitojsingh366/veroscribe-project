import type { LucideIcon } from "lucide-react";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function AdminPlaceholderPage({
  description,
  icon: Icon,
  title
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-bg p-5 md:p-7">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-5 inline-flex size-12 items-center justify-center rounded-full border border-border bg-bg-muted text-accent-fg">
          <Icon size={22} />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-muted">
          Demo placeholder
        </p>
        <h1 className="mt-2 text-3xl leading-tight">
          <span className="serif-italic">{title}</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">
          {description} This page is a placeholder for the prototype.
        </p>
        <div className="mt-6">
          <Link href="/admin">
            <Button variant="secondary">
              <CalendarDays size={14} />
              Back to schedule
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
