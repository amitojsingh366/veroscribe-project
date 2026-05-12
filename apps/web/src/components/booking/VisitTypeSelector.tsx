"use client";

import type { VisitType } from "@veroscribe/shared";
import { clsx } from "clsx";
import { Building2, Video } from "lucide-react";

const visitTypes: VisitType[] = ["In-person", "Telehealth"];

export function VisitTypeSelector({
  onChange,
  value
}: {
  onChange: (visitType: VisitType) => void;
  value: VisitType;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex">
      {visitTypes.map((visitType) => {
        const active = value === visitType;
        const Icon = visitType === "In-person" ? Building2 : Video;

        return (
          <button
            className={clsx(
              "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition",
              active
                ? "border-primary bg-primary text-primary-fg"
                : "border-border bg-surface text-fg hover:border-[#c9c2b6]"
            )}
            key={visitType}
            onClick={() => onChange(visitType)}
            type="button"
          >
            <Icon size={14} />
            {visitType}
          </button>
        );
      })}
    </div>
  );
}
