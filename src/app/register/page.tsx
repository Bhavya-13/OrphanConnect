"use client";

import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

export default function RegisterPage() {
  const { user, loading } = useAuth();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [story, setStory] = useState("");
  const [childrenCount, setChildrenCount] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [docRegistration, setDocRegistration] = useState<File | null>(null);
  const [doc80g, setDoc80g] = useState<File | null>(null);
  const [docPan, setDocPan] = useState<File | null>(null);
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!loading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Sign in to register</h1>
        <p className="text-gray-600 mb-6">
          To register your orphanage, please sign in first. This links the listing to
          your account so you can manage it later.
        </p>
        <Link
          href="/login"
          className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700"
        >
          Sign in to continue
        </Link>
      </div>
    );
  }

  const uploadFile = async (
    file: File | null,
    prefix: string
  ): Promise<string | null> => {
    if (!file) return null;
    const path = `${user!.id}/${prefix}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("orphanage-documents")
      .upload(path, file);
    if (error) throw error;
    return path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const regPath = await uploadFile(docRegistration, "registration");
      const g80Path = await uploadFile(doc80g, "80g");
      const panPath = await uploadFile(docPan, "pan");
      const p1Path = await uploadFile(photo1, "photo1");
      const p2Path = await uploadFile(photo2, "photo2");

      const res = await fetch("/api/orphanages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          location,
          state,
          story,
          childrenCount,
          ownerId: user!.id,
          contactName,
          contactPhone,
          contactEmail,
          docRegistration: regPath,
          doc80g: g80Path,
          docPan: panPath,
          docPhoto1: p1Path,
          docPhoto2: p2Path,
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Something went wrong");

      await supabase
        .from("profiles")
        .update({ role: "orphanage", orphanage_id: result.orphanage.id })
        .eq("id", user!.id);

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Registration submitted!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for registering <span className="font-medium">{name}</span>. Your
          submission and documents are now pending review by our team. Once verified,
          your orphanage will appear publicly and you can start posting your needs.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Register Your Orphanage</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Fill in your details and upload verification documents. Your submission will be
        reviewed before going live.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl border border-orange-100"
      >
        <div>
          <label className="text-sm font-medium text-gray-700">Orphanage name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label className="text-sm font-medium text-gray-700">Number of children</label>
          <input
            type="number"
            required
            min={1}
            value={childrenCount}
            onChange={(e) => setChildrenCount(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Your story</label>
          <textarea
            required
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={3}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <hr className="border-orange-100" />
        <p className="text-sm font-semibold text-gray-700">Contact person</p>
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            required
            placeholder="Contact person name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="tel"
            required
            placeholder="Contact phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="email"
            required
            placeholder="Contact email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <hr className="border-orange-100" />
        <p className="text-sm font-semibold text-gray-700">Verification documents</p>

        <div>
          <label className="text-sm text-gray-700">
            Registration certificate (Trust / Society / CCI)
          </label>
          <input
            type="file"
            required
            onChange={(e) => setDocRegistration(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">80G / 12A certificate</label>
          <input
            type="file"
            required
            onChange={(e) => setDoc80g(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">PAN of the organization</label>
          <input
            type="file"
            required
            onChange={(e) => setDocPan(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">Facility photo 1</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setPhoto1(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">Facility photo 2 (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto2(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}