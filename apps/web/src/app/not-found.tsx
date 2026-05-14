import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5">
      <section className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
        <Wordmark href="/book" />
        <h1 className="mt-6 text-2xl font-semibold">We could not find that.</h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          The physician, booking, or page may not exist in this prototype data set.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/book">
            <Button className="w-full sm:w-auto">Patient booking</Button>
          </Link>
          <Link href="/admin">
            <Button className="w-full sm:w-auto" variant="secondary">
              Admin schedule
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
