import type { ReactNode } from "react";

export function PatientStepHeader({
  description,
  step,
  title
}: {
  description: string;
  step: 1 | 2 | 3 | 4;
  title: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
        Step {step} of 4
      </p>
      <h1 className="mt-2 text-3xl leading-tight md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-fg-muted">{description}</p>
    </div>
  );
}
