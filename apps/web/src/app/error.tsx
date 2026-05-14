"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";

export default function AppError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5">
      <section className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
        <Wordmark href="/book" />
        <h1 className="mt-6 text-2xl font-semibold">Something went wrong.</h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          We could not load this part of the prototype. Try again, or return to
          the booking flow.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <Link href="/book">
            <Button className="w-full sm:w-auto" variant="secondary">
              Back to booking
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
