import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "secondary" | "ghost";
type IconButtonSize = "sm" | "md";

const variants: Record<IconButtonVariant, string> = {
  secondary: "border-border bg-surface text-fg-muted hover:border-[#c9c2b6]",
  ghost: "border-transparent bg-transparent text-fg-muted hover:bg-black/[0.04] hover:text-fg"
};

const sizes: Record<IconButtonSize, string> = {
  sm: "size-8",
  md: "size-9"
};

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

export function IconButton({
  children,
  className,
  label,
  size = "sm",
  type = "button",
  variant = "secondary",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={clsx(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        sizes[size],
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
