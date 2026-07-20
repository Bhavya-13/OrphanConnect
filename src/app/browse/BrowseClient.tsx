"use client";

import { useState, useMemo } from "react";
import { Orphanage } from "@/lib/types";
import OrphanageCard from "@/components/OrphanageCard";

export default function BrowseClient({
  orphanages,
  states,
}: {
  orphanages: Orphanage[];
  states: string[];
}) {
  const [stateFilter, setStateFilter] = useState("all");

  const filtered = useMemo(() => {
    if (stateFilter === "all") return orphanages;
    return orphanages.filter((o) => o.state === stateFilter);
  }, [orphanages, stateFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Browse Orphanages</h1>
      <p className="text-gray-500 mb-6">
        Explore orphanages and see exactly what they need right now.
      </p>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mr-2">Filter by state:</label>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="all">All states</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((o) => (
          <OrphanageCard key={o.id} orphanage={o} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 mt-8">No orphanages found for this filter.</p>
      )}
    </div>
  );
}