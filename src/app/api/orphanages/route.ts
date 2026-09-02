import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json();

  // Prevent registering an orphanage under someone else's account
  if (body.ownerId !== user.id) {
    return NextResponse.json(
      { success: false, error: "ownerId must match the signed-in user" },
      { status: 403 }
    );
  }

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