import { Search } from "lucide-react";
import { clsx } from "clsx";
import type { ChangeEventHandler } from "react";
import { Card } from "./Card";

export function SearchField({
  className,
  inputClassName,
  onChange,
  placeholder,
  value
}: {
  className?: string;
  inputClassName?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  value: string;
}) {
  return (
    <Card
      className={clsx("flex min-w-0 items-center gap-3 rounded-xl px-4 py-3", className)}
    >
      <Search className="shrink-0 text-fg-muted" size={16} />
      <input
        className={clsx("min-w-0 flex-1 bg-transparent text-sm outline-none", inputClassName)}
        onChange={onChange}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </Card>
  );
}
