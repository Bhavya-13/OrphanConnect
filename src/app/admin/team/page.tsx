"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";

interface ProfileRow {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
}

export default function TeamPage() {
  return (
    <AdminGuard>
      <Team />
    </AdminGuard>
  );
}

function Team() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, name, role")
      .order("created_at", { ascending: false });
    setProfiles((data as ProfileRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setRole = async (id: string, role: string) => {
    await supabase.from("profiles").update({ role }).eq("id", id);
    load();
  };

  const promoteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", searchEmail.trim())
      .single();
    if (!data) {
      setMessage("No user found with that email. They must sign in at least once first.");
      return;
    }
    await supabase.from("profiles").update({ role: "admin" }).eq("id", data.id);
    setSearchEmail("");
    setMessage("User promoted to admin.");
    load();
  };

  const admins = profiles.filter((p) => p.role === "admin");

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        {admins.length} {admins.length === 1 ? "admin" : "admins"}
      </span>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Manage Admins</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Promote trusted users to admin. They must have signed in at least once so their account exists.
      </p>

      <form onSubmit={promoteByEmail} className="flex gap-2 mb-4">
        <input
          type="email"
          required
          placeholder="user@example.com"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
        />
        <button
          type="submit"
          className="bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-700 transition-colors whitespace-nowrap"
        >
          Promote to Admin
        </button>
      </form>

      {message && (
        <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-8">
          {message}
        </div>
      )}

      <h2 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide text-gray-500">
        Current admins
      </h2>
      <div className="space-y-2">
        {admins.map((p) => {
          const initials = (p.name || p.email || "?").slice(0, 2).toUpperCase();
          return (
            <div
              key={p.id}
              className="flex items-center justify-between border border-orange-100 rounded-xl px-4 py-3 bg-white hover:border-brand-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.name || "Unnamed"}</p>
                  <p className="text-xs text-gray-500">{p.email}</p>
                </div>
              </div>
              {p.id !== user?.id ? (
                <button
                  onClick={() => setRole(p.id, "donor")}
                  className="text-xs text-red-600 hover:underline shrink-0"
                >
                  Remove admin
                </button>
              ) : (
                <span className="text-xs text-gray-400 shrink-0">You</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}