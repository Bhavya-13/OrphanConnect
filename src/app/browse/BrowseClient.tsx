"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Orphanage } from "@/lib/types";
import OrphanageCard from "@/components/OrphanageCard";
import Badge from "@/components/Badge";

type SortKey = "least-visible" | "most-children" | "name";

export default function BrowseClient({
  orphanages,
  states,
}: {
  orphanages: Orphanage[];
  states: string[];
}) {
  const [stateFilter, setStateFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("least-visible");

  const stateCounts = useMemo(() => {
    const counts = new Map<string, number>();
    orphanages.forEach((o) => counts.set(o.state, (counts.get(o.state) ?? 0) + 1));
    return counts;
  }, [orphanages]);

  // The single least-visible orphanage, pulled out as a spotlight feature
  const spotlight = useMemo(() => {
    if (orphanages.length === 0) return null;
    return [...orphanages].sort((a, b) => a.views - b.views)[0];
  }, [orphanages]);

  const filtered = useMemo(() => {
    const base = orphanages.filter((o) => {
      const matchesState = stateFilter === "all" || o.state === stateFilter;
      const matchesSearch =
        search.trim() === "" ||
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.location.toLowerCase().includes(search.toLowerCase());
      return matchesState && matchesSearch;
    });

    const sorted = [...base];
    if (sort === "least-visible") sorted.sort((a, b) => a.views - b.views);
    if (sort === "most-children") sorted.sort((a, b) => b.childrenCount - a.childrenCount);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [orphanages, stateFilter, search, sort]);

  const clearFilters = () => {
    setSearch("");
    setStateFilter("all");
  };

  const hasActiveFilters = search !== "" || stateFilter !== "all";
  // Exclude spotlight from the grid when no filters are active, so it isn't shown twice
  const gridResults =
    !hasActiveFilters && spotlight
      ? filtered.filter((o) => o.id !== spotlight.id)
      : filtered;

  return (
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-transparent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute top-10 -left-20 w-64 h-64 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 pt-14 sm:pt-16 pb-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white shadow-sm ring-1 ring-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Discover
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Browse Orphanages
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
            Explore verified orphanages and see exactly what they need right
            now. Every one here is real, reviewed, and waiting to be seen.
          </p>
        </div>
      </section>

      {/* SPOTLIGHT FEATURE (only when no filters applied) */}
      {!hasActiveFilters && spotlight && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <Link
            href={`/orphanage/${spotlight.id}`}
            className="group grid sm:grid-cols-2 gap-0 bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
          >
            <div className="relative h-56 sm:h-full min-h-[14rem]">
              <Image
                src={spotlight.imageUrl}
                alt={spotlight.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  Needs attention most
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                {spotlight.verified && <Badge variant="verified">Verified</Badge>}
                <span className="text-xs text-gray-400">{spotlight.views} profile views</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                {spotlight.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {spotlight.location}, {spotlight.state} &middot; {spotlight.childrenCount} children
              </p>
              <p className="text-sm text-gray-600 line-clamp-3 mb-5">{spotlight.story}</p>
              <span className="inline-flex items-center gap-1 text-brand-600 font-medium text-sm group-hover:gap-2 transition-all">
                View profile <span aria-hidden>&rarr;</span>
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 pb-16 sm:pb-20">
        {/* Sticky control bar */}
        <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm border border-orange-100 rounded-2xl shadow-sm p-3 sm:p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="relative flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            >
              <option value="least-visible">Sort: Needs attention first</option>
              <option value="most-children">Sort: Most children</option>
              <option value="name">Sort: A &ndash; Z</option>
            </select>
          </div>

          {/* State filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-none">
            <button
              onClick={() => setStateFilter("all")}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                stateFilter === "all"
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
              }`}
            >
              All states ({orphanages.length})
            </button>
            {states.map((s) => (
              <button
                key={s}
                onClick={() => setStateFilter(s)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  stateFilter === s
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                }`}
              >
                {s} ({stateCounts.get(s) ?? 0})
              </button>
            ))}
          </div>
        </div>

        {/* Result count + active filter clear */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{gridResults.length}</span>{" "}
            {gridResults.length === 1 ? "orphanage" : "orphanages"}
            {stateFilter !== "all" && ` in ${stateFilter}`}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-brand-600 text-sm font-medium hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {gridResults.length === 0 ? (
          <div className="text-center py-20 bg-orange-50/40 rounded-2xl border border-dashed border-orange-200">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-brand-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-3">No orphanages match your search.</p>
            <button
              onClick={clearFilters}
              className="text-brand-600 text-sm font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridResults.map((o, i) => (
              <div
                key={o.id}
                className={`opacity-0 animate-fade-up ${
                  i % 7 === 0 ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
                style={{ animationDelay: `${Math.min(i, 6) * 80}ms`, animationFillMode: "forwards" }}
              >
                <OrphanageCard orphanage={o} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}