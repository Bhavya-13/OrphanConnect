"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/lib/useToast";

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

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-orange-50 to-transparent py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Make a difference
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Current Needs
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Every card below is a real, active need from a verified orphanage. Give money
            or fulfill a request for goods — you choose exactly where your help goes.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        {/* Filters + sort */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search needs or orphanages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
          />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white">
            <option value="all">All types</option>
            <option value="money">Money</option>
            <option value="goods">Goods</option>
          </select>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white">
            <option value="all">All states</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white">
            <option value="urgent">Urgent first</option>
            <option value="least">Least funded</option>
            <option value="most">Most funded</option>
          </select>
        </div>

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={urgentOnly} onChange={(e) => setUrgentOnly(e.target.checked)} />
            Show urgent needs only
          </label>
          <p className="text-sm text-gray-500">{filtered.length} needs</p>
        </div>

        {/* Needs grid */}
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-16">No needs match your filters right now.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((n) => (
              <NeedGiveCard key={n.id} need={n} />
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
    <div className="bg-white rounded-2xl border border-orange-100 p-5 flex flex-col hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div>
          <h3 className="font-semibold text-gray-800 leading-snug">{need.title}</h3>
          <Link href={`/orphanage/${need.orphanageId}`} className="text-xs text-brand-600 hover:underline">
            {need.orphanageName} · {need.orphanageLocation}
          </Link>
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {need.type === "money" ? "Money" : "Goods"}
          </span>
          {need.urgent && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Urgent</span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 flex-1">{need.description}</p>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${need.percent}%` }} />
      </div>
      <p className="text-xs text-gray-500 mb-4">
        {need.type === "money"
          ? `Rs ${need.current.toLocaleString()} of Rs ${need.total.toLocaleString()}`
          : `${need.current} of ${need.total} ${need.unit}`}
      </p>

      <button
        onClick={() => { setOpen(true); setSubmitted(false); setSkip(false); setDonorName(""); setDonorEmail(""); setValue(""); setIsAnonymous(false); }}
        className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700"
      >
        {need.type === "money" ? "Donate" : "Fulfill this"}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">✕</button>
            {!submitted ? (
              <>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{need.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{need.orphanageName}</p>
                <form onSubmit={submit} className="space-y-4">
                  {!skip && (
                    <>
                      <input type="text" required={!skip} placeholder="Your name" value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      <input type="email" required={!skip} placeholder="Your email" value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                        Donate anonymously
                      </label>
                    </>
                  )}
                  <input type="number" required min={1}
                    placeholder={need.type === "money" ? "Amount (Rs)" : `Quantity (${need.unit})`}
                    value={value} onChange={(e) => setValue(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <button type="submit" disabled={submitting}
                    className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-60">
                    {submitting ? "Processing..." : "Confirm"}
                  </button>
                  <button type="button" onClick={() => setSkip(!skip)}
                    className="w-full text-xs text-gray-500 hover:text-gray-700 underline">
                    {skip ? "Actually, I'll share my details" : "Skip and give without sharing details"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Thank you!</h3>
                <p className="text-sm text-gray-600 mb-4">Your contribution to &quot;{need.title}&quot; has been recorded.</p>
                <button onClick={() => setOpen(false)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}