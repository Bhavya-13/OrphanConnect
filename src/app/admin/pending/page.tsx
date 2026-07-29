"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";

interface PendingOrphanage {
  id: string;
  name: string;
  location: string;
  state: string;
  story: string;
  children_count: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  doc_registration: string | null;
  doc_80g: string | null;
  doc_pan: string | null;
  doc_photo1: string | null;
  doc_photo2: string | null;
  status: string;
}

export default function PendingOrphanagesPage() {
  return (
    <AdminGuard>
      <PendingList />
    </AdminGuard>
  );
}

function PendingList() {
  const [orphanages, setOrphanages] = useState<PendingOrphanage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orphanages")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    setOrphanages((data as PendingOrphanage[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const getDocUrl = async (path: string | null) => {
    if (!path) return;
    const { data } = await supabase.storage
      .from("orphanage-documents")
      .createSignedUrl(path, 60 * 5); // valid 5 minutes
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const decide = async (id: string, status: "approved" | "rejected") => {
    setBusyId(id);
    const { data, error } = await supabase
      .from("orphanages")
      .update({ status, verified: status === "approved" })
      .eq("id", id)
      .select();

    setBusyId(null);

    if (error) {
      alert("Update failed: " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      alert("No rows were updated. This is likely a permissions (RLS) issue on the orphanages table.");
      return;
    }
    load();
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Pending Orphanages</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Review each submission and its documents, then approve or reject.
      </p>

      {orphanages.length === 0 ? (
        <p className="text-gray-500">No pending registrations right now.</p>
      ) : (
        <div className="space-y-6">
          {orphanages.map((o) => (
            <div key={o.id} className="border border-orange-100 rounded-xl p-6 bg-white">
              <h2 className="text-lg font-bold text-gray-800">{o.name}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {o.location}, {o.state} &middot; {o.children_count} children
              </p>
              <p className="text-sm text-gray-700 mb-3">{o.story}</p>

              <div className="text-sm text-gray-700 mb-4">
                <p className="font-medium">Contact person:</p>
                <p>{o.contact_name} &middot; {o.contact_phone} &middot; {o.contact_email}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {o.doc_registration && (
                  <button onClick={() => getDocUrl(o.doc_registration)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                    View Registration Cert
                  </button>
                )}
                {o.doc_80g && (
                  <button onClick={() => getDocUrl(o.doc_80g)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                    View 80G/12A
                  </button>
                )}
                {o.doc_pan && (
                  <button onClick={() => getDocUrl(o.doc_pan)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                    View PAN
                  </button>
                )}
                {o.doc_photo1 && (
                  <button onClick={() => getDocUrl(o.doc_photo1)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                    View Photo 1
                  </button>
                )}
                {o.doc_photo2 && (
                  <button onClick={() => getDocUrl(o.doc_photo2)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                    View Photo 2
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => decide(o.id, "approved")}
                  disabled={busyId === o.id}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-60"
                >
                  {busyId === o.id ? "..." : "Approve"}
                </button>
                <button
                  onClick={() => decide(o.id, "rejected")}
                  disabled={busyId === o.id}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60"
                >
                  {busyId === o.id ? "..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}