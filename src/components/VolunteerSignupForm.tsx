"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";

export default function VolunteerSignupForm({ requestId }: { requestId: string }) {
  const { user } = useAuth();

  // steps: form (name/email/phone) -> otp (verify) -> done
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Submit the actual application (called after verification, or if already logged in)
  const submitApplication = async () => {
    const res = await fetch("/api/volunteer-signups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        volunteerRequestId: requestId,
        volunteerName: name,
        volunteerEmail: email,
        volunteerPhone: phone,
      }),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Failed to apply");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // If already logged in with this email, skip OTP
      if (user && user.email === email) {
        await submitApplication();
        setStep("done");
        setLoading(false);
        return;
      }

      // Otherwise send OTP to verify the email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (otpError) throw otpError;
      setStep("otp");
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (verifyError) throw verifyError;

      // Save/update their profile (name + phone) after verification
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          phone: phone,
        });
      }

      await submitApplication();
      setStep("done");
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
        Thanks {name}! Your application is in. The orphanage will reach out using your contact details.
      </p>
    );
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleVerify} className="flex flex-col gap-2">
        <p className="text-xs text-gray-600">
          We sent a 6-digit code to <span className="font-medium">{email}</span>. Enter it to confirm your application.
        </p>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <input
          type="text"
          required
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm tracking-widest"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify & Apply"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
      <p className="text-xs text-gray-500">Apply to volunteer — we&apos;ll verify your email with a code.</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <input
        type="text"
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <input
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <input
        type="tel"
        required
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? "Sending code..." : "Apply to Volunteer"}
      </button>
    </form>
  );
}