import { Check } from "lucide-react";

export function BookingConfirmationHero() {
  return (
    <div className="text-center">
      <span className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full border border-border bg-surface">
        <Check size={26} />
      </span>
      <h1 className="text-4xl leading-tight text-fg md:text-6xl">
        Request <span className="serif-italic">sent.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-fg-muted">
        The office will confirm shortly. The booking starts as pending so the
        physician team can review it.
      </p>
    </div>
  );
}
