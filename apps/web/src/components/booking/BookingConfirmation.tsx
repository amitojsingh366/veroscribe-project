import type { BookingWithRelations } from "@veroscribe/shared";
import { BookingConfirmationHero } from "./BookingConfirmationHero";
import { BookingConfirmationSummary } from "./BookingConfirmationSummary";

export function BookingConfirmation({
  booking
}: {
  booking: BookingWithRelations;
}) {
  return (
    <div className="gradient-bg min-h-screen px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-4xl">
        <BookingConfirmationHero />
        <BookingConfirmationSummary booking={booking} />
      </div>
    </div>
  );
}
