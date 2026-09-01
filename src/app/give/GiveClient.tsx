"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/lib/useToast";
import Badge from "@/components/Badge";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";

interface NeedItem {
  id: string;
  orphanageId: string;
  orphanageName: string;
  orphanageLocation: string;
  state: string;
  type: "money" | "goods";
  title: string;
  description: string;
  urgent: boolean;
  unit: string | null;
  current: number;
  total: number;
  percent: number;
}

export default function GiveClient({
  needs,
  states,
}: {
  needs: NeedItem[];
  states: string[];
}) {
  const [typeFilter, setTypeFilter] = useState<"all" | "money" | "goods">("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"urgent" | "least" | "most">("urgent");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = needs.filter((n) => {
      const matchesType = typeFilter === "all" || n.type === typeFilter;
      const matchesState = stateFilter === "all" || n.state === stateFilter;
      const matchesUrgent = !urgentOnly || n.urgent;
      const matchesSearch =
        search.trim() === "" ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.orphanageName.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesState && matchesUrgent && matchesSearch;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "urgent") {
        if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;
        return a.percent - b.percent; // then least funded first
      }
      if (sortBy === "least") return a.percent - b.percent;
      return b.percent - a.percent; // most funded first
    });

    return list;
  }, [needs, typeFilter, stateFilter, urgentOnly, sortBy, search]);

  const urgentCount = useMemo(() => needs.filter((n) => n.urgent).length, [needs]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStateFilter("all");
    setUrgentOnly(false);
  };

  const hasActiveFilters =
    search !== "" || typeFilter !== "all" || stateFilter !== "all" || urgentOnly;

  return (
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-transparent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute top-10 -left-20 w-64 h-64 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 pt-14 sm:pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white shadow-sm ring-1 ring-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Make a difference
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Current Needs
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
            Every card below is a real, active need from a verified orphanage.
            Give money or fulfill a request for goods &mdash; you choose
            exactly where your help goes.
          </p>
        </div>
      </section>

      {/* URGENT STRIP */}
      {urgentCount > 0 && !urgentOnly && (
        <section className="max-w-6xl mx-auto px-4 pb-2">
          <button
            onClick={() => setUrgentOnly(true)}
            className="w-full flex items-center justify-between gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 hover:bg-red-100/60 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <p className="text-sm font-medium text-red-800">
                {urgentCount} urgent {urgentCount === 1 ? "need" : "needs"} right now &mdash; these
                need help first.
              </p>
            </div>
            <span className="text-red-700 text-sm font-medium shrink-0">View all &rarr;</span>
          </button>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 pb-16 sm:pb-20 pt-6">
        {/* Sticky control bar */}
        <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm border border-orange-100 rounded-2xl shadow-sm p-3 sm:p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3 mb-3">
            <input
              type="text"
              placeholder="Search needs or orphanages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            />
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            >
              <option value="all">All states</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            >
              <option value="urgent">Sort: Urgent first</option>
              <option value="least">Sort: Least funded</option>
              <option value="most">Sort: Most funded</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: "All" },
              { key: "money", label: "Money" },
              { key: "goods", label: "Goods" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTypeFilter(t.key as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  typeFilter === t.key
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                }`}
              >
                {t.label}
              </button>
            ))}
            <span className="w-px h-4 bg-gray-200 mx-1" />
            <button
              onClick={() => setUrgentOnly((v) => !v)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                urgentOnly
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${urgentOnly ? "bg-white" : "bg-red-500"}`} />
              Urgent only
            </button>
          </div>
        </div>

        {/* Result count + clear */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">{filtered.length}</span> needs
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-brand-600 text-sm font-medium hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {/* Needs grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-orange-50/40 rounded-2xl border border-dashed border-orange-200">
            <p className="text-gray-600 mb-3">No needs match your filters right now.</p>
            <button onClick={clearFilters} className="text-brand-600 text-sm font-medium hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((n, i) => (
              <div
                key={n.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${Math.min(i, 6) * 80}ms`, animationFillMode: "forwards" }}
              >
                <NeedGiveCard need={n} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function NeedGiveCard({ need }: { need: NeedItem }) {
  const [open, setOpen] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [skip, setSkip] = useState(false);
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  useLockBodyScroll(open);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        needId: need.id,
        donorName,
        donorEmail,
        isAnonymous,
        skip,
        type: need.type,
        amount: need.type === "money" ? Number(value) : undefined,
        quantity: need.type === "goods" ? Number(value) : undefined,
      }),
    });
    setSubmitting(false);
    setSubmitted(true);
    showToast("Thank you for your contribution!", "success");
  };

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-5 flex flex-col hover:shadow-lg hover:border-brand-200 hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 leading-snug mb-1">{need.title}</h3>
          <Link
            href={`/orphanage/${need.orphanageId}`}
            className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {need.orphanageName} &middot; {need.orphanageLocation}
          </Link>
        </div>
        <div className="flex flex-col gap-1.5 items-end shrink-0">
          <Badge variant="default">{need.type === "money" ? "Money" : "Goods"}</Badge>
          {need.urgent && <Badge variant="urgent">Urgent</Badge>}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2">{need.description}</p>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${need.percent}%` }} />
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500">
          {need.type === "money"
            ? `Rs ${need.current.toLocaleString()} of Rs ${need.total.toLocaleString()}`
            : `${need.current} of ${need.total} ${need.unit}`}
        </p>
        <p className="text-xs font-medium text-brand-600">{need.percent}%</p>
      </div>

      <button
        onClick={() => {
          setOpen(true);
          setSubmitted(false);
          setSkip(false);
          setDonorName("");
          setDonorEmail("");
          setValue("");
          setIsAnonymous(false);
        }}
        className="w-full bg-brand-600 text-white py-2.5 rounded-full text-sm font-medium hover:bg-brand-700 transition-colors"
      >
        {need.type === "money" ? "Donate" : "Fulfill this"}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            {!submitted ? (
              <>
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-1 pr-8">{need.title}</h3>
                <p className="text-sm text-gray-500 mb-5">{need.orphanageName}</p>
                <form onSubmit={submit} className="space-y-4">
                  {!skip && (
                    <>
                      <input
                        type="text"
                        required={!skip}
                        placeholder="Your name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                      />
                      <input
                        type="email"
                        required={!skip}
                        placeholder="Your email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="rounded border-gray-300 text-brand-600 focus:ring-brand-400"
                        />
                        Donate anonymously
                      </label>
                    </>
                  )}
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder={need.type === "money" ? "Amount (Rs)" : `Quantity (${need.unit})`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-600 text-white py-3 rounded-full font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors"
                  >
                    {submitting ? "Processing..." : "Confirm"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkip(!skip)}
                    className="w-full text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    {skip ? "Actually, I'll share my details" : "Skip and give without sharing details"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">Thank you!</h3>
                <p className="text-sm text-gray-600 mb-5">
                  Your contribution to &quot;{need.title}&quot; has been recorded.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-gray-100 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}