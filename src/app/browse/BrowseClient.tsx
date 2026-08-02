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
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return orphanages.filter((o) => {
      const matchesState = stateFilter === "all" || o.state === stateFilter;
      const matchesSearch =
        search.trim() === "" ||
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.location.toLowerCase().includes(search.toLowerCase());
      return matchesState && matchesSearch;
    });
  }, [orphanages, stateFilter, search]);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-orange-50 to-transparent py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Discover
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Browse Orphanages
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Explore verified orphanages and see exactly what they need right now.
            Every one here is real, reviewed, and waiting to be seen.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            />
          </div>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
          >
            <option value="all">All states</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Result count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing {filtered.length} {filtered.length === 1 ? "orphanage" : "orphanages"}
          {stateFilter !== "all" && ` in ${stateFilter}`}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-2">No orphanages match your search.</p>
            <button
              onClick={() => {
                setSearch("");
                setStateFilter("all");
              }}
              className="text-brand-600 text-sm font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((o) => (
              <OrphanageCard key={o.id} orphanage={o} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}