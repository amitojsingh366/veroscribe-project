"use client";

import type { Physician } from "@veroscribe/shared";
import { Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { useBookingStore } from "@/stores/bookingStore";

export function PhysicianCard({
  physician,
  href
}: {
  physician: Physician;
  href: string;
}) {
  const setPhysician = useBookingStore((state) => state.setPhysician);

  return (
    <Link href={href} onClick={() => setPhysician(physician)}>
      <Card className="group flex h-full gap-4 rounded-[18px] p-4 transition hover:border-[#c9c2b6]">
        <Avatar
          initials={physician.initials}
          name={physician.name}
          size="lg"
          src={physician.photoUrl}
          tone={physician.avatarTone}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-fg md:text-base">
                {physician.name}
              </h2>
              <p className="mt-0.5 text-sm text-fg-muted">{physician.specialty}</p>
            </div>
            {physician.rating ? (
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-fg-muted">
                <Star size={12} fill="currentColor" />
                {physician.rating}
                {physician.reviews ? (
                  <span className="text-fg-subtle">({physician.reviews})</span>
                ) : null}
              </span>
            ) : null}
          </div>
          {physician.bio ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-subtle">
              {physician.bio}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {physician.nextAvailable ? (
              <span className="chip border-[#D6E4F8] bg-accent-soft text-accent-fg">
                <Clock size={11} />
                {physician.nextAvailable}
              </span>
            ) : null}
            {physician.location ? (
              <span className="chip">
                <MapPin size={11} />
                {physician.location}
              </span>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
