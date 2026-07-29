"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export default function Navbar() {
  const { user, role, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-600">
          Orphan<span className="text-gray-800">Connect</span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600 items-center">
          <Link href="/browse" className="hover:text-brand-600">Browse Orphanages</Link>
          <Link href="/volunteer" className="hover:text-brand-600">Volunteer</Link>
          {role === "orphanage" && (
            <Link href="/dashboard" className="text-brand-600 hover:text-brand-700 font-semibold">Dashboard</Link>
          )}
          {role !== "orphanage" && role !== "admin" && (
            <Link href="/register" className="hover:text-brand-600">Register Orphanage</Link>
          )}
          {role === "admin" && (
            <Link href="/admin" className="text-brand-600 hover:text-brand-700 font-semibold">Admin</Link>
          )}
          {user ? (
            <button onClick={signOut} className="text-gray-600 hover:text-brand-600">Sign out</button>
          ) : (
            <Link href="/login" className="hover:text-brand-600">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}