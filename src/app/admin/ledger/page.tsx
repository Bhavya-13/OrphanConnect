"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/formatDate";

interface LedgerRow {
  id: string;
  need_id: string;
  donor_name: string;
  donor_email: string | null;
  is_anonymous: boolean;
  type: string;
  amount: number | null;
  quantity: number | null;
  created_at: string;
}

export default function LedgerPage() {
  return (
    <AdminGuard>
      <Ledger />
    </AdminGuard>
  );
}

function Ledger() {
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("contributions")
        .select("*")
        .order("created_at", { ascending: false });
      setRows((data as LedgerRow[]) ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const totalMoney = rows
    .filter((r) => r.type === "money")
    .reduce((sum, r) => sum + (r.amount ?? 0), 0);
  const totalContributions = rows.length;
  const anonymousCount = rows.filter((r) => r.is_anonymous).length;
  const anonymousPct = totalContributions > 0 ? Math.round((anonymousCount / totalContributions) * 100) : 0;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Private record
      </span>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Donation Ledger</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Complete private record of all donations across the platform.
      </p>

      {/* Summary stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-orange-100 rounded-2xl p-5">
          <p className="text-xs text-gray-500 mb-1">Total money donated</p>
          <p className="font-serif text-2xl font-bold text-brand-600">Rs {totalMoney.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-orange-100 rounded-2xl p-5">
          <p className="text-xs text-gray-500 mb-1">Total contributions</p>
          <p className="font-serif text-2xl font-bold text-gray-900">{totalContributions}</p>
        </div>
        <div className="bg-white border border-orange-100 rounded-2xl p-5">
          <p className="text-xs text-gray-500 mb-1">Anonymous donors</p>
          <p className="font-serif text-2xl font-bold text-gray-900">{anonymousPct}%</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 bg-orange-50/40 rounded-2xl border border-dashed border-orange-200">
          <p className="text-gray-500">No donations recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-orange-100 rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-orange-50/60 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Donor</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Amount / Qty</th>
                <th className="text-left px-4 py-3 font-medium">Anonymous</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-orange-50 hover:bg-orange-50/30 transition-colors">
                  <td className="px-4 py-3 text-gray-600">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.donor_name}</td>
                  <td className="px-4 py-3 text-gray-500">{r.donor_email ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.type === "money" ? "bg-brand-50 text-brand-700" : "bg-teal-50 text-teal-700"
                    }`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {r.type === "money" ? `Rs ${r.amount ?? 0}` : `${r.quantity ?? 0}`}
                  </td>
                  <td className="px-4 py-3">
                    {r.is_anonymous ? (
                      <span className="text-xs text-gray-500">Yes</span>
                    ) : (
                      <span className="text-xs text-gray-400">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}