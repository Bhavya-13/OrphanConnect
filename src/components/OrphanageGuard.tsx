"use client";

import { useAuth } from "@/lib/useAuth";
import Link from "next/link";

export default function OrphanageGuard({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Sign in required</h1>
        <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
        <Link href="/login" className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700">
          Sign in
        </Link>
      </div>
    );
  }

  if (role !== "orphanage") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Not an orphanage account</h1>
        <p className="text-gray-600 mb-6">
          This dashboard is for registered orphanages. If you run an orphanage, please register first.
        </p>
        <Link href="/register" className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700">
          Register your orphanage
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}