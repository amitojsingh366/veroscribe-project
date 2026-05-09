import { BookingProgress } from "@/components/booking/BookingProgress";
import { PhysicianDirectory } from "@/components/booking/PhysicianDirectory";
import { getPhysicians } from "@/lib/api";

export default async function BookPage() {
  const physicians = await getPhysicians();

  return (
    <main className="gradient-bg min-h-[calc(100vh-65px)]">
      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-10">
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

        <PhysicianDirectory physicians={physicians} />
      </section>
    </main>
  );
}
