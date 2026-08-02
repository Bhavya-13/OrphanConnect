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

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Donation Ledger</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Complete private record of all donations. Total money donated: Rs {totalMoney.toLocaleString()}
      </p>

      {rows.length === 0 ? (
        <p className="text-gray-500">No donations recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-orange-100 rounded-lg bg-white">
            <thead className="bg-orange-50 text-gray-700">
              <tr>
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-left px-3 py-2">Donor</th>
                <th className="text-left px-3 py-2">Email</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-left px-3 py-2">Amount / Qty</th>
                <th className="text-left px-3 py-2">Anonymous</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-orange-50">
                                    <td className="px-3 py-2">{formatDate(r.created_at)}</td>
                  <td className="px-3 py-2">{r.donor_name}</td>
                  <td className="px-3 py-2">{r.donor_email ?? "-"}</td>
                  <td className="px-3 py-2 capitalize">{r.type}</td>
                  <td className="px-3 py-2">
                    {r.type === "money" ? `Rs ${r.amount ?? 0}` : `${r.quantity ?? 0}`}
                  </td>
                  <td className="px-3 py-2">{r.is_anonymous ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}