import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block">
        {label ? <span className="field-label">{label}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "focus-ring w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-[15px] text-fg",
            className
          )}
          {...props}
        />
        {error ? <span className="mt-1 block text-xs text-status-cancelled-fg">{error}</span> : null}
      </label>
    );
  }
);

Input.displayName = "Input";
