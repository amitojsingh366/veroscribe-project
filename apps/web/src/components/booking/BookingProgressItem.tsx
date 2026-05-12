"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export function BookingProgressItem({
  complete,
  current,
  href,
  label,
  number,
  sub,
  variant
}: {
  complete: boolean;
  current: boolean;
  href?: string;
  label: string;
  number: number;
  sub: string;
  variant: "rail" | "compact";
}) {
  const className = clsx(
    "flex items-center gap-3 rounded-lg border border-transparent p-2 text-left transition data-[current=true]:border-border data-[current=true]:bg-surface",
    href ? "hover:bg-black/[0.04]" : "cursor-not-allowed opacity-50",
    variant === "compact" && "justify-start md:min-h-16"
  );
  const content = (
    <>
      <span
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold data-[complete=true]:border-primary data-[complete=true]:bg-primary data-[complete=true]:text-primary-fg data-[current=true]:border-primary"
        data-complete={complete}
        data-current={current}
      >
        {complete ? <Check size={13} /> : number}
      </span>
      <span className="block min-w-0">
        <span
          className={clsx(
            "block text-sm font-semibold",
            current || complete ? "text-fg" : "text-fg-muted"
          )}
        >
          {label}
        </span>
        <span className="block text-xs text-fg-subtle">{sub}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <button className={className} disabled type="button">
        {content}
      </button>
    );
  }

  return (
    <Link
      aria-current={current ? "step" : undefined}
      className={className}
      data-current={current}
      href={href}
    >
      {content}
    </Link>
  );
}
