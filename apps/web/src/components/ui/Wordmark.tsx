import { clsx } from "clsx";
import Link from "next/link";

export function Wordmark({
  className,
  href = "/book",
  size = "md"
}: {
  className?: string;
  href?: string;
  size?: "sm" | "md";
}) {
  return (
    <Link
      aria-label="Go to home"
      className={clsx("wordmark", size === "sm" && "text-lg", className)}
      href={href}
    >
      vero
      <span className="font-sans text-[0.55em] not-italic text-accent">•</span>
    </Link>
  );
}
