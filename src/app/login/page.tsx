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
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign in</h1>
      <p className="text-gray-500 mb-6 text-sm">
        No password needed. We&apos;ll email you a one-time code.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={sendOtp} className="space-y-4 bg-white p-6 rounded-xl border border-orange-100">
          <div>
            <label className="text-sm font-medium text-gray-700">Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Sending code..." : "Send me a code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4 bg-white p-6 rounded-xl border border-orange-100">
          <p className="text-sm text-gray-600">
            We sent a 6-digit code to <span className="font-medium">{email}</span>. Enter it below.
          </p>
          <div>
            <label className="text-sm font-medium text-gray-700">Verification code</label>
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm tracking-widest"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-60"
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
  );
}