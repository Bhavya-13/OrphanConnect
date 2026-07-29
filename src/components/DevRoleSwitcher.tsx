"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";

export default function DevRoleSwitcher() {
  const { user, role } = useAuth();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [orphanageId, setOrphanageId] = useState("");

  // Only render in development
  if (process.env.NODE_ENV !== "development") return null;
  if (!user) return null;

  const setRole = async (newRole: string) => {
    setBusy(true);
    const update: any = { role: newRole };
    if (newRole === "orphanage" && orphanageId.trim()) {
      update.orphanage_id = orphanageId.trim();
    }
    await supabase.from("profiles").update(update).eq("id", user.id);
    setBusy(false);
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {open ? (
        <div className="bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 w-64 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-amber-400 text-xs tracking-wide">
              DEV ROLE SWITCHER
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-gray-300 mb-3">
            Current role:{" "}
            <span className="font-semibold text-white">{role ?? "loading..."}</span>
          </p>

          <div className="space-y-2">
            <button
              onClick={() => setRole("donor")}
              disabled={busy}
              className="w-full bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
            >
              Switch to Donor
            </button>

            <div className="pt-1">
              <input
                type="text"
                placeholder="orphanage_id (e.g. orph-1)"
                value={orphanageId}
                onChange={(e) => setOrphanageId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-500 mb-1"
              />
              <button
                onClick={() => setRole("orphanage")}
                disabled={busy}
                className="w-full bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
              >
                Switch to Orphanage
              </button>
            </div>

            <button
              onClick={() => setRole("admin")}
              disabled={busy}
              className="w-full bg-brand-600 hover:bg-brand-700 px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
            >
              Switch to Admin
            </button>
          </div>

          {busy && (
            <p className="text-xs text-gray-400 mt-2 text-center">Switching...</p>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-900 text-amber-400 rounded-full shadow-2xl border border-gray-700 w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-800"
          title="Dev Role Switcher"
        >
          <span className="text-[10px] font-bold leading-none">DEV</span>
          <span className="text-[9px] text-gray-400 leading-none mt-0.5">
            {role ?? "?"}
          </span>
        </button>
      )}
    </div>
  );
}