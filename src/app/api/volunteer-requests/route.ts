import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { error } = await supabaseAdmin.from("volunteer_requests").insert({
    id: `vol-${Date.now()}`,
    orphanage_id: body.orphanageId,
    task: body.task,
    description: body.description,
    date: body.date,
    slots_available: Number(body.slotsAvailable) || 0,
    slots_filled: 0,
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}