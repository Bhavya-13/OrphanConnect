"use client";

import { useState } from "react";

export default function VolunteerSignupForm({ requestId }: { requestId: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await fetch("/api/volunteer-signups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        volunteerRequestId: requestId,
        volunteerName: name,
        contact: contact,
      }),
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
        Thanks {name}! You are signed up. The orphanage will reach out using your contact info.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <input
        type="text"
        required
        placeholder="Phone or email"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
      >
        {submitting ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
