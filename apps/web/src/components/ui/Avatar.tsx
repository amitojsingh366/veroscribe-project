import { clsx } from "clsx";

const sizes = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-16 text-lg"
};

export function Avatar({
  name,
  src,
  initials,
  tone,
  size = "md"
}: {
  name: string;
  src?: string | null;
  initials?: string | null;
  tone?: string | null;
  size?: keyof typeof sizes;
}) {
  const fallback =
    initials ??
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt=""
        className={clsx("rounded-full object-cover", sizes[size])}
        src={src}
      />
    );
  }

  return (
    <span
      aria-label={name}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#DCE8F4_0%,#EAD9DA_100%)] font-medium text-fg",
        sizes[size]
      )}
      style={tone ? { background: tone } : undefined}
    >
      {fallback}
    </span>
  );
}
