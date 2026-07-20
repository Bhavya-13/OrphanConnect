"use client";

import { useState } from "react";
import { MoneyNeed, GoodsNeed } from "@/lib/types";
import NeedCard from "@/components/NeedCard";

export default function DonateModal({
  moneyNeeds,
  goodsNeeds,
}: {
  moneyNeeds: MoneyNeed[];
  goodsNeeds: GoodsNeed[];
}) {
  const [activeNeed, setActiveNeed] = useState<MoneyNeed | GoodsNeed | null>(null);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const openNeed = (need: MoneyNeed | GoodsNeed) => {
    setActiveNeed(need);
    setSubmitted(false);
    setDonorName("");
    setAmount("");
    setQuantity("");
  };

  const closeModal = () => setActiveNeed(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNeed) return;
    setSubmitting(true);

    await fetch("/api/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        needId: activeNeed.id,
        donorName: donorName || "Anonymous",
        type: activeNeed.type,
        amount: activeNeed.type === "money" ? Number(amount) : undefined,
        quantity: activeNeed.type === "goods" ? Number(quantity) : undefined,
      }),
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div>
      {moneyNeeds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Money Needed</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {moneyNeeds.map((n) => (
              <button key={n.id} onClick={() => openNeed(n)} className="text-left">
                <NeedCard need={n} />
              </button>
            ))}
          </div>
        </div>
      )}

      {goodsNeeds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Goods Needed</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {goodsNeeds.map((n) => (
              <button key={n.id} onClick={() => openNeed(n)} className="text-left">
                <NeedCard need={n} />
              </button>
            ))}
          </div>
        </div>
      )}

      {activeNeed && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700"
            >
              X
            </button>

            {!submitted ? (
              <>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{activeNeed.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {activeNeed.type === "money"
                    ? "Donate money towards this need"
                    : "Pledge to fulfill part of this need"}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Your name</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Optional - leave blank to stay anonymous"
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  {activeNeed.type === "money" ? (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Amount (Rs)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Quantity you can provide ({activeNeed.unit})
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-60"
                  >
                    {submitting
                      ? "Processing..."
                      : activeNeed.type === "money"
                      ? "Confirm Donation"
                      : "Confirm Pledge"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Thank you!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your {activeNeed.type === "money" ? "donation" : "pledge"} has been recorded
                  against &quot;{activeNeed.title}&quot;.
                </p>
                <button
                  onClick={closeModal}
                  className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
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
