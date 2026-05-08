import { clsx } from "clsx";
import type { HTMLAttributes, ElementType } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  padded?: boolean;
};

export function Card({
  as: Component = "div",
  className,
  padded = true,
  ...props
}: CardProps) {
  return (
    <Component
      className={clsx(
        "rounded-2xl border border-border bg-surface shadow-sm",
        padded && "p-4",
        className
      )}
      {...props}
    />
  );
}
