import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const id = `orph-${Date.now()}`;

  const { error } = await supabaseAdmin.from("orphanages").insert({
    id,
    name: body.name,
    location: body.location,
    state: body.state,
    story: body.story,
    children_count: Number(body.childrenCount) || 0,
    verified: false,
    status: "pending",
    image_url: "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?q=80&w=1200",
    views: 0,
    owner_id: body.ownerId,
    contact_name: body.contactName,
    contact_phone: body.contactPhone,
    contact_email: body.contactEmail,
    doc_registration: body.docRegistration,
    doc_80g: body.doc80g,
    doc_pan: body.docPan,
    doc_photo1: body.docPhoto1,
    doc_photo2: body.docPhoto2,
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, orphanage: { id } });
}