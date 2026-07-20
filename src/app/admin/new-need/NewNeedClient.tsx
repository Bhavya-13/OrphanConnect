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
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Post a New Need</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Select your orphanage and describe what you need. It will appear on your
        profile for donors to see.
      </p>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          Need posted successfully. It will now appear on the orphanage profile page.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-xl border border-orange-100"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">Orphanage</label>
            <select
              value={orphanageId}
              onChange={(e) => setOrphanageId(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {orphanages.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Need type</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={needType === "money"}
                  onChange={() => setNeedType("money")}
                />
                Money
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={needType === "goods"}
                  onChange={() => setNeedType("goods")}
                />
                Goods
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Monthly ration support"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
            />
            Mark as urgent
          </label>

          <button
            type="submit"
            className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700"
          >
            Post Need
          </button>
        </form>
      )}
    </div>
  );
}