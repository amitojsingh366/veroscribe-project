import { clsx } from "clsx";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block">
        {label ? <span className="field-label">{label}</span> : null}
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(
            "focus-ring min-h-28 w-full resize-none rounded-lg border border-border bg-surface px-3.5 py-3 text-[15px] leading-relaxed text-fg",
            className
          )}
          {...props}
        />
        {error ? <span className="mt-1 block text-xs text-status-cancelled-fg">{error}</span> : null}
      </label>
    );
  }
);

Textarea.displayName = "Textarea";
