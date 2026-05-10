import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "success";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg border-transparent hover:bg-primary-hover",
  secondary: "bg-surface text-fg border-border hover:border-[#d8d3cb]",
  ghost: "bg-transparent text-fg border-transparent hover:bg-black/[0.04]",
  destructive:
    "bg-status-cancelled-bg text-status-cancelled-fg border-[#ECC9C3] hover:border-status-cancelled-fg",
  success:
    "bg-status-confirmed-bg text-status-confirmed-fg border-[#C9E5D6] hover:border-status-confirmed-fg"
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-[18px] py-2.5 text-sm",
  lg: "px-[18px] py-3.5 text-[15px]"
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border font-medium transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      type={type}
      {...props}
    />
  );
}
