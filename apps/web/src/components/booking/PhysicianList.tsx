import type { Physician } from "@veroscribe/shared";
import { PhysicianCard } from "./PhysicianCard";

export function PhysicianList({ physicians }: { physicians: Physician[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {physicians.map((physician) => (
        <PhysicianCard
          href={`/book/${physician.id}/time`}
          key={physician.id}
          physician={physician}
        />
      ))}
    </div>
  );
}
