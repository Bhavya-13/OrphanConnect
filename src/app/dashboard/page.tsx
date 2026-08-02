"use client";

import { useEffect, useState } from "react";
import OrphanageGuard from "@/components/OrphanageGuard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { formatDate } from "@/lib/formatDate";

export default function DashboardPage() {
  return (
    <OrphanageGuard>
      <Dashboard />
    </OrphanageGuard>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [orphanage, setOrphanage] = useState<any>(null);
  const [needs, setNeeds] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [signups, setSignups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [needType, setNeedType] = useState<"money" | "goods">("money");
  const [needTitle, setNeedTitle] = useState("");
  const [needDesc, setNeedDesc] = useState("");
  const [needAmount, setNeedAmount] = useState("");
  const [needQty, setNeedQty] = useState("");
  const [needUnit, setNeedUnit] = useState("");
  const [needUrgent, setNeedUrgent] = useState(false);
  const [showNeedForm, setShowNeedForm] = useState(false);

  const [volTask, setVolTask] = useState("");
  const [volDesc, setVolDesc] = useState("");
  const [volDate, setVolDate] = useState("");
  const [volSlots, setVolSlots] = useState("");
  const [showVolForm, setShowVolForm] = useState(false);

  const loadAll = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("orphanage_id")
      .eq("id", user.id)
      .single();

    const orphanageId = profile?.orphanage_id;
    if (!orphanageId) {
      setLoading(false);
      return;
    }

    const { data: orph } = await supabase
      .from("orphanages").select("*").eq("id", orphanageId).single();
    setOrphanage(orph);

    const { data: nds } = await supabase
      .from("needs").select("*").eq("orphanage_id", orphanageId);
    setNeeds(nds ?? []);

    const { data: reqs } = await supabase
      .from("volunteer_requests").select("*").eq("orphanage_id", orphanageId);
    setRequests(reqs ?? []);

    const reqIds = (reqs ?? []).map((r: any) => r.id);
    if (reqIds.length > 0) {
      const { data: sgn } = await supabase
        .from("volunteer_signups").select("*").in("volunteer_request_id", reqIds);
      setSignups(sgn ?? []);
    } else {
      setSignups([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const postNeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orphanage) return;
    await fetch("/api/needs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orphanageId: orphanage.id,
        type: needType,
        title: needTitle,
        description: needDesc,
        amountNeeded: needType === "money" ? Number(needAmount) : undefined,
        quantityNeeded: needType === "goods" ? Number(needQty) : undefined,
        unit: needType === "goods" ? needUnit : undefined,
        urgent: needUrgent,
      }),
    });
    setNeedTitle(""); setNeedDesc(""); setNeedAmount(""); setNeedQty(""); setNeedUnit(""); setNeedUrgent(false);
    setShowNeedForm(false);
    loadAll();
  };

  const postRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orphanage) return;
    await fetch("/api/volunteer-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orphanageId: orphanage.id,
        task: volTask,
        description: volDesc,
        date: volDate,
        slotsAvailable: Number(volSlots),
      }),
    });
    setVolTask(""); setVolDesc(""); setVolDate(""); setVolSlots("");
    setShowVolForm(false);
    loadAll();
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-gray-500">Loading...</div>;
  }

  if (!orphanage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-600">
        We couldn&apos;t find an orphanage linked to your account. Please register first.
      </div>
    );
  }

  const isPending = orphanage.status !== "approved";
  const totalApplicants = signups.length;
  const moneyNeeds = needs.filter((n) => n.type === "money");
  const totalRaised = moneyNeeds.reduce((s, n) => s + (n.amount_raised ?? 0), 0);
  const totalGoal = moneyNeeds.reduce((s, n) => s + (n.amount_needed ?? 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-gray-800">{orphanage.name}</h1>
            {isPending ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                Under review
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                Live
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            {orphanage.location}, {orphanage.state} · {orphanage.children_count} children
          </p>
        </div>
      </div>

      {isPending && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 mb-8 text-sm">
          Your account is under review. You can prepare your needs and volunteer requests now —
          they&apos;ll appear publicly once an admin approves your orphanage.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-orange-100 p-5">
          <p className="text-3xl font-bold text-brand-600">{needs.length}</p>
          <p className="text-sm text-gray-500 mt-1">Active needs</p>
        </div>
        <div className="bg-white rounded-2xl border border-orange-100 p-5">
          <p className="text-3xl font-bold text-brand-600">Rs {totalRaised.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">
            Raised {totalGoal > 0 && `of Rs ${totalGoal.toLocaleString()}`}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-orange-100 p-5">
          <p className="text-3xl font-bold text-brand-600">{totalApplicants}</p>
          <p className="text-sm text-gray-500 mt-1">Volunteer applicants</p>
        </div>
      </div>

      {/* Needs */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Your Needs</h2>
          <button
            onClick={() => setShowNeedForm(!showNeedForm)}
            className="text-sm bg-brand-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-brand-700"
          >
            {showNeedForm ? "Cancel" : "+ Add Need"}
          </button>
        </div>

        {showNeedForm && (
          <form onSubmit={postNeed} className="space-y-3 bg-white p-5 rounded-2xl border border-orange-100 mb-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={needType === "money"} onChange={() => setNeedType("money")} /> Money
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={needType === "goods"} onChange={() => setNeedType("goods")} /> Goods
              </label>
            </div>
            <input type="text" required placeholder="Title" value={needTitle} onChange={(e) => setNeedTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <textarea required placeholder="Description" value={needDesc} onChange={(e) => setNeedDesc(e.target.value)} rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            {needType === "money" ? (
              <input type="number" required min={1} placeholder="Amount needed (Rs)" value={needAmount} onChange={(e) => setNeedAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input type="number" required min={1} placeholder="Quantity" value={needQty} onChange={(e) => setNeedQty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                <input type="text" required placeholder="Unit (e.g. blankets)" value={needUnit} onChange={(e) => setNeedUnit(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={needUrgent} onChange={(e) => setNeedUrgent(e.target.checked)} /> Mark as urgent
            </label>
            <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
              Post Need
            </button>
          </form>
        )}

        {needs.length === 0 ? (
          <p className="text-sm text-gray-400">No needs posted yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {needs.map((n) => {
              const current = n.type === "money" ? n.amount_raised ?? 0 : n.quantity_fulfilled ?? 0;
              const total = n.type === "money" ? n.amount_needed ?? 0 : n.quantity_needed ?? 0;
              const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
              return (
                <div key={n.id} className="bg-white border border-orange-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-800 text-sm">{n.title}</p>
                    {n.urgent && <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Urgent</span>}
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-500">
                    {n.type === "money"
                      ? `Rs ${current.toLocaleString()} of Rs ${total.toLocaleString()}`
                      : `${current} of ${total} ${n.unit}`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Volunteer requests */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Volunteer Requests</h2>
          <button
            onClick={() => setShowVolForm(!showVolForm)}
            className="text-sm bg-brand-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-brand-700"
          >
            {showVolForm ? "Cancel" : "+ Add Request"}
          </button>
        </div>

        {showVolForm && (
          <form onSubmit={postRequest} className="space-y-3 bg-white p-5 rounded-2xl border border-orange-100 mb-4">
            <input type="text" required placeholder="Task (e.g. Weekend tutoring)" value={volTask} onChange={(e) => setVolTask(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <textarea required placeholder="Description" value={volDesc} onChange={(e) => setVolDesc(e.target.value)} rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" required value={volDate} onChange={(e) => setVolDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input type="number" required min={1} placeholder="Slots available" value={volSlots} onChange={(e) => setVolSlots(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
              Post Request
            </button>
          </form>
        )}

        {requests.length === 0 ? (
          <p className="text-sm text-gray-400">No volunteer requests yet.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => {
              const applicants = signups.filter((s) => s.volunteer_request_id === r.id);
              return (
                <div key={r.id} className="bg-white border border-orange-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-800">{r.task}</p>
                    <span className="text-xs text-gray-500">{r.slots_filled}/{r.slots_available} slots</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{formatDate(r.date)} · {applicants.length} applicant(s)</p>
                  {applicants.length === 0 ? (
                    <p className="text-sm text-gray-400">No applicants yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {applicants.map((a) => (
                        <div key={a.id} className="text-sm text-gray-700 flex flex-wrap gap-x-3 border-t border-orange-50 pt-1.5">
                          <span className="font-medium">{a.volunteer_name}</span>
                          <span className="text-gray-500">{a.volunteer_email}</span>
                          <span className="text-gray-500">{a.volunteer_phone}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}