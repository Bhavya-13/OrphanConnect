"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/formatDate";

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

interface NeedRow {
  id: string;
  orphanage_id: string;
  type: string;
  title: string;
  amount_needed: number | null;
  quantity_needed: number | null;
  unit: string | null;
  urgent: boolean;
}

interface VolRow {
  id: string;
  orphanage_id: string;
  task: string;
  date: string;
  slots_available: number;
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
  const [needs, setNeeds] = useState<NeedRow[]>([]);
  const [requests, setRequests] = useState<VolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: orphs } = await supabase
      .from("orphanages")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    const pending = (orphs as PendingOrphanage[]) ?? [];
    setOrphanages(pending);

    const ids = pending.map((o) => o.id);
    if (ids.length > 0) {
      const { data: nds } = await supabase
        .from("needs")
        .select("*")
        .in("orphanage_id", ids);
      setNeeds((nds as NeedRow[]) ?? []);

      const { data: reqs } = await supabase
        .from("volunteer_requests")
        .select("*")
        .in("orphanage_id", ids);
      setRequests((reqs as VolRow[]) ?? []);
    } else {
      setNeeds([]);
      setRequests([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const getDocUrl = async (path: string | null) => {
    if (!path) return;
    const { data } = await supabase.storage
      .from("orphanage-documents")
      .createSignedUrl(path, 60 * 5);
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
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        {orphanages.length} awaiting review
      </span>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Pending Orphanages</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Review each submission, its documents, and what it has requested &mdash; then approve or reject.
      </p>

      {orphanages.length === 0 ? (
        <div className="text-center py-16 bg-orange-50/40 rounded-2xl border border-dashed border-orange-200">
          <p className="text-gray-500">No pending registrations right now.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orphanages.map((o) => {
            const orphNeeds = needs.filter((n) => n.orphanage_id === o.id);
            const orphRequests = requests.filter((r) => r.orphanage_id === o.id);
            const totalMoneyAsked = orphNeeds
              .filter((n) => n.type === "money")
              .reduce((sum, n) => sum + (n.amount_needed ?? 0), 0);

            const docs = [
              { key: "doc_registration", label: "Registration Cert", value: o.doc_registration },
              { key: "doc_80g", label: "80G/12A", value: o.doc_80g },
              { key: "doc_pan", label: "PAN", value: o.doc_pan },
              { key: "doc_photo1", label: "Photo 1", value: o.doc_photo1 },
              { key: "doc_photo2", label: "Photo 2", value: o.doc_photo2 },
            ].filter((d) => d.value);

            return (
              <div key={o.id} className="border border-orange-100 rounded-2xl p-6 sm:p-7 bg-white">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">{o.name}</h2>
                  <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                    Pending
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {o.location}, {o.state} &middot; {o.children_count} children
                </p>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{o.story}</p>

                <div className="text-sm text-gray-700 mb-5 bg-gray-50 rounded-xl p-3.5">
                  <p className="font-medium text-gray-800 mb-0.5">Contact person</p>
                  <p className="text-gray-600">{o.contact_name} &middot; {o.contact_phone} &middot; {o.contact_email}</p>
                </div>

                {/* Documents */}
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Documents</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {docs.length === 0 ? (
                    <p className="text-xs text-gray-400">No documents uploaded.</p>
                  ) : (
                    docs.map((d) => (
                      <button
                        key={d.key}
                        onClick={() => getDocUrl(d.value)}
                        className="flex items-center gap-1.5 text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6 12v-3.75A2.25 2.25 0 0 0 12 8.25m0 0V6a2.25 2.25 0 0 1 2.25-2.25h1.5" />
                        </svg>
                        {d.label}
                      </button>
                    ))
                  )}
                </div>

                {/* What they've requested (fraud-check signal) */}
                <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-4 mb-5">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Requested so far &mdash; review for anything suspicious
                  </p>

                  {orphNeeds.length === 0 && orphRequests.length === 0 ? (
                    <p className="text-xs text-gray-400">Nothing requested yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orphNeeds.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1.5">
                            Needs
                            {totalMoneyAsked > 0 && (
                              <span className="text-gray-500"> &mdash; total money asked: Rs {totalMoneyAsked.toLocaleString()}</span>
                            )}
                          </p>
                          <ul className="space-y-1">
                            {orphNeeds.map((n) => (
                              <li key={n.id} className="text-xs text-gray-600 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                                {n.title} &mdash; {n.type === "money" ? `Rs ${n.amount_needed?.toLocaleString()}` : `${n.quantity_needed} ${n.unit}`}
                                {n.urgent && <span className="text-red-600 font-medium">(urgent)</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {orphRequests.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1.5">Volunteer requests</p>
                          <ul className="space-y-1">
                            {orphRequests.map((r) => (
                              <li key={r.id} className="text-xs text-gray-600 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                                {r.task} &mdash; {formatDate(r.date)} &mdash; {r.slots_available} slots
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Decision */}
                <div className="flex gap-3">
                  <button
                    onClick={() => decide(o.id, "approved")}
                    disabled={busyId === o.id}
                    className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition-colors"
                  >
                    {busyId === o.id ? "..." : "Approve"}
                  </button>
                  <button
                    onClick={() => decide(o.id, "rejected")}
                    disabled={busyId === o.id}
                    className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
                  >
                    {busyId === o.id ? "..." : "Reject"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}