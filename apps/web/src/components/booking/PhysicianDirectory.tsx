"use client";

import type { Physician } from "@veroscribe/shared";
import { Filter, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SearchField } from "@/components/ui/SearchField";
import { PhysicianList } from "./PhysicianList";

const placeholderMessage = "This feature has not been implemented in this prototype.";

function matchesPhysician(physician: Physician, query: string) {
  const haystack = [
    physician.name,
    physician.specialty,
    physician.location,
    physician.bio,
    ...physician.accepts
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function PhysicianDirectory({ physicians }: { physicians: Physician[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPhysicians = useMemo(() => {
    if (!normalizedQuery) return physicians;
    return physicians.filter((physician) =>
      matchesPhysician(physician, normalizedQuery)
    );
  }, [normalizedQuery, physicians]);

  return (
    <>
      <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center">
        <SearchField
          className="max-w-xl flex-1"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, specialty, or clinic"
          value={query}
        />
        <Button
          onClick={() => toast.info(placeholderMessage)}
          variant="secondary"
        >
          <Filter size={15} />
          Filter
        </Button>
        <Button
          onClick={() => toast.info(placeholderMessage)}
          variant="secondary"
        >
          <MapPin size={15} />
          Within 5 mi
        </Button>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold">
          {filteredPhysicians.length}{" "}
          {filteredPhysicians.length === 1 ? "physician" : "physicians"} match
        </p>
        <p className="text-sm text-fg-muted">Sorted by availability</p>
      </div>
      <div className="mt-4">
        {filteredPhysicians.length ? (
          <PhysicianList physicians={filteredPhysicians} />
        ) : (
          <Card className="rounded-2xl p-6 text-sm text-fg-muted">
            No physicians match your search.
          </Card>
        )}
      </div>
    </>
  );
}
