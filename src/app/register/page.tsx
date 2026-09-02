"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

function FileField({
  label,
  required,
  accept,
  file,
  onChange,
}: {
  label: string;
  required?: boolean;
  accept?: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const inputId = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label
        htmlFor={inputId}
        className={`flex items-center gap-3 border rounded-xl px-3.5 py-2.5 text-sm cursor-pointer transition-colors ${
          file
            ? "border-brand-300 bg-brand-50/50 text-brand-700"
            : "border-gray-200 border-dashed text-gray-500 hover:border-brand-300"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 shrink-0">
          {file ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
          )}
        </svg>
        <span className="truncate flex-1">{file ? file.name : "Click to upload"}</span>
        {file && (
          <span className="text-xs text-brand-600 font-medium shrink-0">Change</span>
        )}
      </label>
      <input
        id={inputId}
        type="file"
        required={required && !file}
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="hidden"
      />
    </div>
  );
}

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
  const [error, setError] = useState("");

  if (!loading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-brand-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Sign in to register</h1>
        <p className="text-gray-500 mb-6">
          To register your orphanage, please sign in first. This links the
          listing to your account so you can manage it later.
        </p>
        <Link
          href="/login"
          className="inline-block bg-brand-600 text-white px-6 py-3 rounded-full font-medium hover:bg-brand-700 transition-colors"
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

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || String(err));
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-transparent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute top-10 -left-20 w-64 h-64 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative max-w-2xl mx-auto px-4 pt-14 sm:pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white shadow-sm ring-1 ring-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Get listed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Register Your Orphanage
          </h1>
          <p className="text-gray-600 max-w-md mx-auto text-base">
            Fill in your details and upload verification documents. Your
            submission will be reviewed before going live.
          </p>
        </div>
      </section>

      <div className="max-w-lg mx-auto px-4 pb-16 sm:pb-20">
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Section: Basic info */}
          <div className="bg-white rounded-2xl border border-orange-100 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <p className="text-sm font-semibold text-gray-800">Basic Information</p>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="text-sm font-medium text-gray-700">Orphanage name</label>
                <input
                  type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">City / Town</label>
                  <input
                    type="text" required value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <select
                    required value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Number of children</label>
                <input
                  type="number" required min={1} value={childrenCount}
                  onChange={(e) => setChildrenCount(e.target.value)}
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
            </div>
          </div>

          {/* Section: Story */}
          <div className="bg-white rounded-2xl border border-orange-100 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <p className="text-sm font-semibold text-gray-800">Your Story</p>
            </div>
            <label className="text-sm font-medium text-gray-700">
              Tell donors and volunteers about your orphanage
            </label>
            <textarea
              required value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={4}
              placeholder="How long have you been running? Who do you care for? What makes your orphanage unique?"
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            />
          </div>

          {/* Section: Contact person */}
          <div className="bg-white rounded-2xl border border-orange-100 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <p className="text-sm font-semibold text-gray-800">Contact Person</p>
            </div>
            <div className="space-y-3.5">
              <input
                type="text" required placeholder="Contact person name"
                value={contactName} onChange={(e) => setContactName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel" required placeholder="Contact phone"
                  value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
                <input
                  type="email" required placeholder="Contact email"
                  value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
            </div>
          </div>

          {/* Section: Documents */}
          <div className="bg-white rounded-2xl border border-orange-100 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">4</span>
              <p className="text-sm font-semibold text-gray-800">Verification Documents</p>
            </div>
            <p className="text-xs text-gray-500 mb-4 ml-8">
              These are reviewed privately by our team and never shown publicly.
            </p>
            <div className="space-y-3.5">
              <FileField
                label="Registration certificate (Trust / Society / CCI)"
                required
                file={docRegistration}
                onChange={setDocRegistration}
              />
              <FileField
                label="80G / 12A certificate"
                required
                file={doc80g}
                onChange={setDoc80g}
              />
              <FileField
                label="PAN of the organization"
                required
                file={docPan}
                onChange={setDocPan}
              />
              <FileField
                label="Facility photo 1"
                required
                accept="image/*"
                file={photo1}
                onChange={setPhoto1}
              />
              <FileField
                label="Facility photo 2 (optional)"
                accept="image/*"
                file={photo2}
                onChange={setPhoto2}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 text-white py-3.5 rounded-full font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? "Submitting..." : "Submit for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}