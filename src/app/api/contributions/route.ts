import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Contribution } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const contribution: Contribution = {
    id: `contrib-${Date.now()}`,
    needId: body.needId,
    donorName: body.isAnonymous || body.skip ? "Anonymous" : body.donorName || "Anonymous",
    donorEmail: body.skip ? undefined : body.donorEmail || undefined,
    isAnonymous: !!body.isAnonymous || !!body.skip,
    type: body.type,
    amount: body.amount,
    quantity: body.quantity,
    createdAt: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin.from("contributions").insert({
    id: contribution.id,
    need_id: contribution.needId,
    donor_name: contribution.donorName,
    donor_email: contribution.donorEmail ?? null,
    is_anonymous: contribution.isAnonymous,
    type: contribution.type,
    amount: contribution.amount ?? null,
    quantity: contribution.quantity ?? null,
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  // Update the need's progress
  const { data: needRow } = await supabaseAdmin
    .from("needs")
    .select("*")
    .eq("id", contribution.needId)
    .single();

  if (needRow) {
    if (needRow.type === "money" && contribution.type === "money" && contribution.amount) {
      const newRaised = Math.min(
        needRow.amount_needed ?? 0,
        (needRow.amount_raised ?? 0) + contribution.amount
      );
      await supabaseAdmin.from("needs").update({ amount_raised: newRaised }).eq("id", contribution.needId);
    }
    if (needRow.type === "goods" && contribution.type === "goods" && contribution.quantity) {
      const newFulfilled = Math.min(
        needRow.quantity_needed ?? 0,
        (needRow.quantity_fulfilled ?? 0) + contribution.quantity
      );
      await supabaseAdmin.from("needs").update({ quantity_fulfilled: newFulfilled }).eq("id", contribution.needId);
    }
  }

  return NextResponse.json({ success: true, contribution });
}