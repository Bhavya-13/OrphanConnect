import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const id = `signup-${Date.now()}`;

  const { error } = await supabaseAdmin.from("volunteer_signups").insert({
    id,
    volunteer_request_id: body.volunteerRequestId,
    volunteer_name: body.volunteerName,
    volunteer_email: body.volunteerEmail,
    volunteer_phone: body.volunteerPhone,
    contact: body.volunteerPhone || body.volunteerEmail || "",
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  // Increment slots_filled
  const { data: reqRow } = await supabaseAdmin
    .from("volunteer_requests")
    .select("*")
    .eq("id", body.volunteerRequestId)
    .single();

  if (reqRow && reqRow.slots_filled < reqRow.slots_available) {
    await supabaseAdmin
      .from("volunteer_requests")
      .update({ slots_filled: reqRow.slots_filled + 1 })
      .eq("id", body.volunteerRequestId);
  }

  return NextResponse.json({ success: true });
}