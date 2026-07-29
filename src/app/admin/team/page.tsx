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
    return <div className="max-w-3xl mx-auto px-4 py-16 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Admins</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Promote trusted users to admin. They must have signed in at least once so their
        account exists.
      </p>

      <form onSubmit={promoteByEmail} className="flex gap-2 mb-6">
        <input
          type="email"
          required
          placeholder="user@example.com"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700"
        >
          Promote to Admin
        </button>
      </form>

      {message && (
        <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-6">
          {message}
        </div>
      )}

      <h2 className="font-semibold text-gray-800 mb-3">Current admins</h2>
      <div className="space-y-2">
        {admins.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border border-orange-100 rounded-lg px-4 py-3 bg-white"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{p.name || "Unnamed"}</p>
              <p className="text-xs text-gray-500">{p.email}</p>
            </div>
            {p.id !== user?.id ? (
              <button
                onClick={() => setRole(p.id, "donor")}
                className="text-xs text-red-600 hover:underline"
              >
                Remove admin
              </button>
            ) : (
              <span className="text-xs text-gray-400">You</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}