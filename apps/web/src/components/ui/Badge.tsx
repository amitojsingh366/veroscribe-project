import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

type BadgeTone = "neutral" | "warning" | "success" | "danger" | "info";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-chip text-fg border-border",
  warning: "bg-status-pending-bg text-status-pending-fg border-[#ECDBB8]",
  success: "bg-status-confirmed-bg text-status-confirmed-fg border-[#C9E5D6]",
  danger: "bg-status-cancelled-bg text-status-cancelled-fg border-[#ECC9C3]",
  info: "bg-status-completed-bg text-status-completed-fg border-[#D6E4F8]"
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
