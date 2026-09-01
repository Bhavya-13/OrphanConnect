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
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3.5">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm text-green-800 pt-0.5">
          Thanks {name}! Your application is in. The orphanage will reach out
          using your contact details.
        </p>
      </div>
    );
  }

  // Small step indicator shared by "form" and "otp" steps
  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-4">
      <div className={`flex items-center gap-1.5 text-xs font-medium ${step === "form" ? "text-brand-600" : "text-gray-400"}`}>
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === "form" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"}`}>1</span>
        Details
      </div>
      <span className="flex-1 h-px bg-gray-200" />
      <div className={`flex items-center gap-1.5 text-xs font-medium ${step === "otp" ? "text-brand-600" : "text-gray-400"}`}>
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === "otp" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"}`}>2</span>
        Verify
      </div>
    </div>
  );

  if (step === "otp") {
    return (
      <div>
        <StepIndicator />
        <form onSubmit={handleVerify} className="flex flex-col gap-3">
          <p className="text-xs text-gray-600">
            We sent a 6-digit code to <span className="font-medium text-gray-800">{email}</span>. Enter it to confirm your application.
          </p>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          <input
            type="text"
            required
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 text-white py-2.5 rounded-full text-sm font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Verifying..." : "Verify & Apply"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator />
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
        <p className="text-xs text-gray-500">
          Apply to volunteer &mdash; we&apos;ll verify your email with a code.
        </p>
        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
        <input
          type="text"
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
        />
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
        />
        <input
          type="tel"
          required
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 text-white py-2.5 rounded-full text-sm font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Sending code..." : "Apply to Volunteer"}
        </button>
      </form>
    </div>
  );
}