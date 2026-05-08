import { Check } from "lucide-react";

const steps = [
  "Choose physician",
  "Select time",
  "Your details",
  "Confirm"
] as const;

export function BookingProgress({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
        Step {step} of 4
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        {steps.map((label, index) => {
          const number = index + 1;
          const complete = number < step;
          const current = number === step;

          return (
            <div
              className="flex items-center gap-3 rounded-lg border border-transparent p-2 data-[current=true]:border-border data-[current=true]:bg-surface"
              data-current={current}
              key={label}
            >
              <span
                className="inline-flex size-6 items-center justify-center rounded-full border border-border text-xs font-semibold data-[complete=true]:border-primary data-[complete=true]:bg-primary data-[complete=true]:text-primary-fg data-[current=true]:border-primary"
                data-complete={complete}
                data-current={current}
              >
                {complete ? <Check size={13} /> : number}
              </span>
              <span className="hidden text-sm font-semibold text-fg md:inline">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
