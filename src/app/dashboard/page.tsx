"use client";

import { useEffect, useState } from "react";
import OrphanageGuard from "@/components/OrphanageGuard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { formatDate } from "@/lib/formatDate";
import Badge from "@/components/Badge";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";

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

  useLockBodyScroll(showNeedForm || showVolForm);

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
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!orphanage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-600">
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
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">{orphanage.name}</h1>
            {isPending ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Under review
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Live
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            {orphanage.location}, {orphanage.state} &middot; {orphanage.children_count} children
          </p>
        </div>
      </div>

      {isPending && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-4 py-3.5 mb-8 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <p>
            Your account is under review. You can prepare your needs and
            volunteer requests now &mdash; they&apos;ll appear publicly once
            an admin approves your orphanage.
          </p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-dashed divide-orange-200 border-2 border-dashed border-orange-200 rounded-2xl mb-10 bg-white">
        <div className="p-5 text-center">
          <p className="font-serif text-2xl sm:text-3xl font-bold text-brand-600">{needs.length}</p>
          <p className="text-sm text-gray-500 mt-1">Active needs</p>
        </div>
        <div className="p-5 text-center">
          <p className="font-serif text-2xl sm:text-3xl font-bold text-brand-600">Rs {totalRaised.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">
            Raised {totalGoal > 0 && `of Rs ${totalGoal.toLocaleString()}`}
          </p>
        </div>
        <div className="p-5 text-center">
          <p className="font-serif text-2xl sm:text-3xl font-bold text-brand-600">{totalApplicants}</p>
          <p className="text-sm text-gray-500 mt-1">Volunteer applicants</p>
        </div>
      </div>

      {/* Needs */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">Your Needs</h2>
          <button
            onClick={() => setShowNeedForm(true)}
            className="text-sm bg-brand-600 text-white px-4 py-2 rounded-full font-medium hover:bg-brand-700 transition-colors"
          >
            + Add Need
          </button>
        </div>

        {needs.length === 0 ? (
          <p className="text-sm text-gray-400">No needs posted yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {needs.map((n) => {
              const current = n.type === "money" ? n.amount_raised ?? 0 : n.quantity_fulfilled ?? 0;
              const total = n.type === "money" ? n.amount_needed ?? 0 : n.quantity_needed ?? 0;
              const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
              return (
                <div key={n.id} className="bg-white border border-orange-100 rounded-2xl p-4 hover:border-brand-200 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-medium text-gray-900 text-sm">{n.title}</p>
                    <div className="flex gap-1.5 shrink-0">
                      {pct >= 100 && <Badge variant="verified">Fulfilled</Badge>}
                      {n.urgent && pct < 100 && <Badge variant="urgent">Urgent</Badge>}
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {n.type === "money"
                        ? `Rs ${current.toLocaleString()} of Rs ${total.toLocaleString()}`
                        : `${current} of ${total} ${n.unit}`}
                    </p>
                    <p className="text-xs font-medium text-brand-600">{pct}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Volunteer requests */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">Volunteer Requests</h2>
          <button
            onClick={() => setShowVolForm(true)}
            className="text-sm bg-brand-600 text-white px-4 py-2 rounded-full font-medium hover:bg-brand-700 transition-colors"
          >
            + Add Request
          </button>
        </div>

        {requests.length === 0 ? (
          <p className="text-sm text-gray-400">No volunteer requests yet.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => {
              const applicants = signups.filter((s) => s.volunteer_request_id === r.id);
              return (
                <div key={r.id} className="bg-white border border-orange-100 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-gray-900">{r.task}</p>
                    <span className="text-xs font-medium text-gray-500 shrink-0">
                      {r.slots_filled}/{r.slots_available} slots
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {formatDate(r.date)} &middot; {applicants.length} applicant{applicants.length === 1 ? "" : "s"}
                  </p>
                  {applicants.length === 0 ? (
                    <p className="text-sm text-gray-400">No applicants yet.</p>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      {applicants.map((a) => (
                        <div
                          key={a.id}
                          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700 border-t border-orange-50 pt-2"
                        >
                          <span className="font-medium text-gray-800">{a.volunteer_name}</span>
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

      {/* ADD NEED MODAL */}
      {showNeedForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowNeedForm(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-serif text-xl font-bold text-gray-900 mb-1 pr-8">Post a New Need</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will appear on your public profile for donors to see.
            </p>

            <form onSubmit={postNeed} className="space-y-6">
              {/* Section: type */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  What do you need?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNeedType("money")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      needType === "money"
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                    }`}
                  >
                    Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setNeedType("goods")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      needType === "goods"
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                    }`}
                  >
                    Goods
                  </button>
                </div>
              </div>

              {/* Section: details */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Details
                </p>
                <div>
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text" required placeholder="e.g. Monthly ration support" value={needTitle}
                    onChange={(e) => setNeedTitle(e.target.value)}
                    className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required placeholder="What is this need for, and why now?" value={needDesc}
                    onChange={(e) => setNeedDesc(e.target.value)} rows={3}
                    className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  />
                </div>

                {needType === "money" ? (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Amount needed (Rs)</label>
                    <input
                      type="number" required min={1} value={needAmount}
                      onChange={(e) => setNeedAmount(e.target.value)}
                      className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Quantity needed</label>
                      <input
                        type="number" required min={1} value={needQty}
                        onChange={(e) => setNeedQty(e.target.value)}
                        className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Unit</label>
                      <input
                        type="text" required placeholder="e.g. blankets" value={needUnit}
                        onChange={(e) => setNeedUnit(e.target.value)}
                        className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section: urgency */}
              <label className="flex items-center gap-2.5 text-sm text-gray-700 bg-red-50/60 border border-red-100 rounded-xl px-3.5 py-3">
                <input
                  type="checkbox" checked={needUrgent}
                  onChange={(e) => setNeedUrgent(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-400"
                />
                Mark as urgent &mdash; this need requires immediate attention
              </label>

              <button
                type="submit"
                className="w-full bg-brand-600 text-white py-3 rounded-full font-medium hover:bg-brand-700 transition-colors"
              >
                Post Need
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD VOLUNTEER REQUEST MODAL */}
      {showVolForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowVolForm(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-serif text-xl font-bold text-gray-900 mb-1 pr-8">Add a Volunteer Request</h3>
            <p className="text-sm text-gray-500 mb-6">
              Let volunteers know what help you need and when.
            </p>

            <form onSubmit={postRequest} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Task</label>
                <input
                  type="text" required placeholder="e.g. Weekend tutoring" value={volTask}
                  onChange={(e) => setVolTask(e.target.value)}
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required placeholder="What will volunteers be doing?" value={volDesc}
                  onChange={(e) => setVolDesc(e.target.value)} rows={3}
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date" required value={volDate}
                    onChange={(e) => setVolDate(e.target.value)}
                    className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Slots available</label>
                  <input
                    type="number" required min={1} value={volSlots}
                    onChange={(e) => setVolSlots(e.target.value)}
                    className="mt-1.5 w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-brand-600 text-white py-3 rounded-full font-medium hover:bg-brand-700 transition-colors mt-3"
              >
                Post Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}