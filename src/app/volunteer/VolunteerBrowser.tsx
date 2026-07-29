"use client";

import { useState } from "react";
import VolunteerSignupForm from "@/components/VolunteerSignupForm";

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Volunteer Opportunities</h1>
      <p className="text-gray-500 mb-6">
        Orphanages across the network are looking for help. Pick a task that fits your time and skills, then click to apply.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {requests.map((r) => {
          const slotsLeft = r.slotsAvailable - r.slotsFilled;
          const full = slotsLeft <= 0;
          return (
            <button
              key={r.id}
              onClick={() => !full && setActive(r)}
              disabled={full}
              className={`text-left border border-orange-100 rounded-lg p-4 bg-white transition-shadow ${
                full ? "opacity-60 cursor-not-allowed" : "hover:shadow-md cursor-pointer"
              }`}
            >
              <h4 className="font-semibold text-gray-800">{r.task}</h4>
              <p className="text-sm text-gray-500 mb-1">{r.orphanageName}</p>
              <p className="text-sm text-gray-600 mb-2">{r.description}</p>
              <p className="text-sm text-gray-700 mb-1">
                Date: <span className="font-medium">{r.date}</span>
              </p>
              <p className="text-sm text-gray-700 mb-2">
                Slots left: <span className="font-medium">{slotsLeft}</span> / {r.slotsAvailable}
              </p>
              <span className={`text-sm font-medium ${full ? "text-gray-400" : "text-brand-600"}`}>
                {full ? "Fully booked" : "Click to apply →"}
              </span>
            </button>
          );
        })}
      </div>

      {requests.length === 0 && (
        <p className="text-gray-500">No volunteer requests at the moment.</p>
      )}

      {/* Apply modal */}
      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActive(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700"
            >
              X
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{active.task}</h3>
            <p className="text-sm text-gray-500 mb-1">{active.orphanageName}</p>
            <p className="text-sm text-gray-600 mb-4">{active.description}</p>
            <VolunteerSignupForm requestId={active.id} />
          </div>
        </div>
      )}
    </div>
  );
}