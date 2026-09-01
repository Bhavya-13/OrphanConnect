"use client";

import { useState } from "react";
import VolunteerSignupForm from "@/components/VolunteerSignupForm";
import Badge from "@/components/Badge";
import { formatDate } from "@/lib/formatDate";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";

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

  useLockBodyScroll(!!active);

  const openCount = requests.filter((r) => r.slotsAvailable - r.slotsFilled > 0).length;

  return (
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-transparent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal-300/25 blur-3xl" />
        <div className="absolute top-10 -left-20 w-64 h-64 rounded-full bg-brand-200/25 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 pt-14 sm:pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white shadow-sm ring-1 ring-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Give your time
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Volunteer Opportunities
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
            Orphanages across the network need helping hands. Find a task
            that fits your time and skills, then click to apply.
          </p>
          {requests.length > 0 && (
            <p className="text-sm text-gray-500 mt-4">
              <span className="font-medium text-gray-700">{openCount}</span> of{" "}
              {requests.length} opportunities still open
            </p>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 sm:pb-20">
        {requests.length === 0 ? (
          <div className="text-center py-20 bg-orange-50/40 rounded-2xl border border-dashed border-orange-200">
            <p className="text-gray-600">No volunteer requests at the moment. Check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((r, i) => {
              const slotsLeft = r.slotsAvailable - r.slotsFilled;
              const full = slotsLeft <= 0;
              const fillPct =
                r.slotsAvailable > 0
                  ? Math.round((r.slotsFilled / r.slotsAvailable) * 100)
                  : 0;

              return (
                <div
                  key={r.id}
                  className={`opacity-0 animate-fade-up group bg-white rounded-2xl border border-orange-100 p-6 flex flex-col transition-all ${
                    full ? "opacity-60" : "hover:shadow-lg hover:border-brand-300 hover:-translate-y-0.5"
                  }`}
                  style={{ animationDelay: `${Math.min(i, 6) * 80}ms`, animationFillMode: "forwards" }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 leading-snug">{r.task}</h4>
                    {full ? (
                      <Badge variant="default">Full</Badge>
                    ) : (
                      <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-600">
                        {slotsLeft} open
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-brand-600 font-medium mb-3">{r.orphanageName}</p>
                  <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{r.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <span>{formatDate(r.date)}</span>
                  </div>

                  {/* Slots progress */}
                  <div className="mb-4">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${fillPct}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {r.slotsFilled} of {r.slotsAvailable} slots filled
                    </p>
                  </div>

                  <button
                    onClick={() => !full && setActive(r)}
                    disabled={full}
                    className={`w-full py-2.5 rounded-full text-sm font-medium transition-colors ${
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
              {active.orphanageName}
            </span>
            <h3 className="font-serif text-lg font-bold text-gray-900 mb-1 pr-8">{active.task}</h3>
            <p className="text-sm text-gray-600 mb-2">{active.description}</p>
            <p className="text-xs text-gray-500 mb-5">Date: {formatDate(active.date)}</p>
            <VolunteerSignupForm requestId={active.id} />
          </div>
        </div>
      )}
    </div>
  );
}