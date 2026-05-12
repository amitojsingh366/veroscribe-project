import { BookingProgress } from "./BookingProgress";

export function ChoosePhysicianHero() {
  return (
    <div className="max-w-3xl pt-6 md:pt-10">
      <BookingProgress step={1} variant="compact" />
      <h1 className="mt-8 text-4xl leading-tight text-fg md:text-6xl">
        Find <span className="serif-italic">care</span> that fits your day.
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-fg-muted">
        Choose a physician to request an appointment. We&apos;ll show real-time
        availability across the clinic.
      </p>
    </div>
  );
}
