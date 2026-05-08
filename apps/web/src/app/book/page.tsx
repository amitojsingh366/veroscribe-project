import { Filter, MapPin, Search } from "lucide-react";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { PhysicianList } from "@/components/booking/PhysicianList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getPhysicians } from "@/lib/api";

export default async function BookPage() {
  const physicians = await getPhysicians();

  return (
    <main className="gradient-bg min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
        <span className="wordmark">
          vero
          <span className="font-sans text-[0.55em] not-italic text-accent">•</span>
        </span>
        <nav className="hidden gap-7 text-sm font-medium text-fg md:flex">
          <span>Find care</span>
          <span>My visits</span>
          <span>Records</span>
          <span>Help</span>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-10">
        <div className="max-w-3xl pt-6 md:pt-10">
          <BookingProgress step={1} />
          <h1 className="mt-8 text-4xl leading-tight text-fg md:text-6xl">
            Find <span className="serif-italic">care</span> that fits your day.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-fg-muted">
            Choose a physician to request an appointment. We&apos;ll show real-time
            availability across the clinic.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center">
          <Card className="flex max-w-xl flex-1 items-center gap-3 rounded-xl px-4 py-3">
            <Search size={17} className="text-fg-muted" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              placeholder="Search by name, specialty, or clinic"
            />
            <span className="chip hidden md:inline-flex">Family Medicine</span>
          </Card>
          <Button variant="secondary">
            <Filter size={15} />
            Filter
          </Button>
          <Button variant="secondary">
            <MapPin size={15} />
            Within 5 mi
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-semibold">{physicians.length} physicians match</p>
          <p className="text-sm text-fg-muted">Sorted by availability</p>
        </div>
        <div className="mt-4">
          <PhysicianList physicians={physicians} />
        </div>
      </section>
    </main>
  );
}
