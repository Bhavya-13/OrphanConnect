"use client";

import { useState } from "react";
import { Orphanage } from "@/lib/types";

export default function NewNeedClient({
  orphanages,
}: {
  orphanages: Orphanage[];
}) {
  const [orphanageId, setOrphanageId] = useState(orphanages[0]?.id ?? "");
  const [needType, setNeedType] = useState<"money" | "goods">("money");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amountNeeded, setAmountNeeded] = useState("");
  const [quantityNeeded, setQuantityNeeded] = useState("");
  const [unit, setUnit] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/needs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orphanageId,
        type: needType,
        title,
        description,
        amountNeeded: needType === "money" ? Number(amountNeeded) : undefined,
        quantityNeeded: needType === "goods" ? Number(quantityNeeded) : undefined,
        unit: needType === "goods" ? unit : undefined,
        urgent,
      }),
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">
      <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
        New need
      </span>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Post a New Need</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Select an orphanage and describe what it needs. It will appear on
        that orphanage&apos;s profile for donors to see.
      </p>

      {submitted ? (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-green-800 text-sm pt-1">
            Need posted successfully. It will now appear on the orphanage profile page.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 sm:p-7 rounded-2xl border border-orange-100"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">Orphanage</label>
            <select
              value={orphanageId}
              onChange={(e) => setOrphanageId(e.target.value)}
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            >
              {orphanages.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Need type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNeedType("money")}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  needType === "money"
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                }`}
              >
                Money
              </button>
              <button
                type="button"
                onClick={() => setNeedType("goods")}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  needType === "goods"
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                }`}
              >
                Goods
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              placeholder="e.g. Monthly ration support"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              rows={3}
            />
          </div>

          {needType === "money" ? (
            <div>
              <label className="text-sm font-medium text-gray-700">Amount needed (Rs)</label>
              <input
                type="number"
                required
                min={1}
                value={amountNeeded}
                onChange={(e) => setAmountNeeded(e.target.value)}
                className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Quantity needed</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantityNeeded}
                  onChange={(e) => setQuantityNeeded(e.target.value)}
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. blankets"
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-400"
            />
            Mark as urgent
          </label>

          <button
            type="submit"
            className="w-full bg-brand-600 text-white py-3 rounded-full font-medium hover:bg-brand-700 transition-colors"
          >
            Post Need
          </button>
        </form>
      )}
    </div>
  );
}