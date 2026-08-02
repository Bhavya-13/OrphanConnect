import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const row: any = {
    id: `need-${Date.now()}`,
    orphanage_id: body.orphanageId,
    type: body.type,
    title: body.title,
    description: body.description,
    urgent: !!body.urgent,
  };

  if (body.type === "money") {
    row.amount_needed = Number(body.amountNeeded);
    row.amount_raised = 0;
  } else {
    row.quantity_needed = Number(body.quantityNeeded);
    row.quantity_fulfilled = 0;
    row.unit = body.unit;
  }

  const { error } = await supabaseAdmin.from("needs").insert(row);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}