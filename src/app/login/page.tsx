"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/lib/useToast";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    setLoading(false);
    if (error) {
      setError(
        error.message ||
          "Couldn't send the code. During testing, codes can only be sent to the email registered with our email provider."
      );
    } else {
      setStep("otp");
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // Create or update the profile row
    const user = data.user;
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        name: name || null,
      });
    }

    setLoading(false);
    showToast("Signed in successfully!", "success");
    setTimeout(() => router.push("/"), 800);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-transparent" />
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-200/30 blur-3xl" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-teal-300/20 blur-3xl" />

      <div className="relative max-w-md w-full mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-white shadow-sm ring-1 ring-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Welcome back
          </span>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Sign in
          </h1>
          <p className="text-gray-500 text-sm">
            No password needed. We&apos;ll email you a one-time code.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className={`flex items-center gap-1.5 text-xs font-medium ${step === "email" ? "text-brand-600" : "text-gray-400"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === "email" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"}`}>1</span>
            Email
          </div>
          <span className="w-8 h-px bg-gray-200" />
          <div className={`flex items-center gap-1.5 text-xs font-medium ${step === "otp" ? "text-brand-600" : "text-gray-400"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === "otp" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"}`}>2</span>
            Verify
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={sendOtp} className="space-y-4 bg-white p-6 sm:p-7 rounded-2xl border border-orange-100 shadow-sm">
            <div>
              <label className="text-sm font-medium text-gray-700">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white py-3 rounded-full font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Sending code..." : "Send me a code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4 bg-white p-6 sm:p-7 rounded-2xl border border-orange-100 shadow-sm">
            <p className="text-sm text-gray-600">
              We sent a 6-digit code to <span className="font-medium text-gray-800">{email}</span>. Enter it below.
            </p>
            <div>
              <label className="text-sm font-medium text-gray-700">Verification code</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white py-3 rounded-full font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Verifying..." : "Verify & Sign in"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}