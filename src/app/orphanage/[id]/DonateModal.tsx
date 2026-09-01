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
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [skip, setSkip] = useState(false);
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const openNeed = (need: MoneyNeed | GoodsNeed) => {
    setActiveNeed(need);
    setSubmitted(false);
    setDonorName("");
    setDonorEmail("");
    setIsAnonymous(false);
    setSkip(false);
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
        donorName: donorName,
        donorEmail: donorEmail,
        isAnonymous: isAnonymous,
        skip: skip,
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
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">Money Needed</h2>
          </div>
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
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">Goods Needed</h2>
          </div>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={closeModal}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {!submitted ? (
              <>
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-1 pr-8">{activeNeed.title}</h3>
                <p className="text-sm text-gray-500 mb-5">
                  {activeNeed.type === "money"
                    ? "Donate money towards this need"
                    : "Pledge to fulfill part of this need"}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!skip && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Your name</label>
                        <input
                          type="text"
                          required={!skip}
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Your full name"
                          className="mt-1 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          required={!skip}
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="mt-1 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Used for your records and a future donation certificate.
                        </p>
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="rounded border-gray-300 text-brand-600 focus:ring-brand-400"
                        />
                        Donate anonymously (your name will be hidden publicly)
                      </label>
                    </>
                  )}

                  {activeNeed.type === "money" ? (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Amount (Rs)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
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
                        className="mt-1 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-600 text-white py-3 rounded-full font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors"
                  >
                    {submitting
                      ? "Processing..."
                      : activeNeed.type === "money"
                      ? "Confirm Donation"
                      : "Confirm Pledge"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSkip(!skip)}
                    className="w-full text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    {skip
                      ? "Actually, I want to share my details"
                      : "Skip and donate without sharing details"}
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
                  Your {activeNeed.type === "money" ? "donation" : "pledge"} has been recorded
                  against &quot;{activeNeed.title}&quot;.
                </p>
                <button
                  onClick={closeModal}
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