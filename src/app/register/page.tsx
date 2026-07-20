"use client";

import { useState } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [story, setStory] = useState("");
  const [childrenCount, setChildrenCount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await fetch("/api/orphanages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        location,
        state,
        story,
        childrenCount,
        imageUrl,
      }),
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Registration submitted!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for registering <span className="font-medium">{name}</span>.
          Your orphanage has been added and is pending verification by our team.
          Once verified, it will appear publicly and you can start posting your needs.
        </p>
        <a
          href="/admin/new-need"
          className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700"
        >
          Post Your First Need
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Register Your Orphanage
      </h1>
      <p className="text-gray-500 mb-6 text-sm">
        Fill in your details to join OrphanConnect. After registering, your profile
        will be reviewed and verified before going live, and you can post your needs
        for donors and volunteers to see.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl border border-orange-100"
      >
        <div>
          <label className="text-sm font-medium text-gray-700">
            Orphanage name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Asha Bal Ashram"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700">City / Town</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Ratlam"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">State</label>
            <select
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Number of children
          </label>
          <input
            type="number"
            required
            min={1}
            value={childrenCount}
            onChange={(e) => setChildrenCount(e.target.value)}
            placeholder="e.g. 34"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Your story</label>
          <textarea
            required
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={4}
            placeholder="Tell donors about your orphanage - how long you have been running, who you help, and your biggest challenges."
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Photo URL (optional)
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste a link to a photo of your orphanage"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Leave blank to use a default image for now.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Registering..." : "Register Orphanage"}
        </button>
      </form>
    </div>
  );
}