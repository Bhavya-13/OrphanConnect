"use client";

import { useState } from "react";
import VolunteerSignupForm from "@/components/VolunteerSignupForm";
import { formatDate } from "@/lib/formatDate";

interface VolReq {
  id: string;
  task: string;
  description: string;
  date: string;
  slotsAvailable: number;
  slotsFilled: number;
  orphanageName: string;
}

export default function VolunteerBrowser({ requests }: { requests: VolReq[] }) {
  const [active, setActive] = useState<VolReq | null>(null);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-orange-50 to-transparent py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Give your time
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Volunteer Opportunities
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Orphanages across the network need helping hands. Find a task that fits your
            time and skills, then click to apply.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        {requests.length === 0 ? (
          <p className="text-gray-500 text-center">No volunteer requests at the moment. Check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((r) => {
              const slotsLeft = r.slotsAvailable - r.slotsFilled;
              const full = slotsLeft <= 0;
              const fillPct =
                r.slotsAvailable > 0
                  ? Math.round((r.slotsFilled / r.slotsAvailable) * 100)
                  : 0;

              return (
                <div
                  key={r.id}
                  className={`group bg-white rounded-2xl border border-orange-100 p-6 flex flex-col transition-all ${
                    full ? "opacity-70" : "hover:shadow-lg hover:border-brand-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 leading-snug">{r.task}</h4>
                    {full ? (
                      <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                        Full
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                        {slotsLeft} open
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-brand-600 font-medium mb-3">{r.orphanageName}</p>
                  <p className="text-sm text-gray-600 mb-4 flex-1">{r.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <span>{formatDate(r.date)}</span>
                  </div>

                  {/* Slots progress */}
                  <div className="mb-4">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${fillPct}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {r.slotsFilled} of {r.slotsAvailable} slots filled
                    </p>
                  </div>

                  <button
                    onClick={() => !full && setActive(r)}
                    disabled={full}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      full
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    {full ? "Fully booked" : "Apply to Volunteer"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Apply modal */}
      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActive(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
            <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
              {active.orphanageName}
            </span>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{active.task}</h3>
            <p className="text-sm text-gray-600 mb-2">{active.description}</p>
            <p className="text-xs text-gray-500 mb-4">Date: {formatDate(active.date)}</p>
            <VolunteerSignupForm requestId={active.id} />
          </div>
        </div>
      )}
    </div>
  );
}