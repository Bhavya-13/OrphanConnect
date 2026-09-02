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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, orphanage_id")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const ownsThisOrphanage =
    profile?.role === "orphanage" && profile.orphanage_id === body.orphanageId;

  if (!isAdmin && !ownsThisOrphanage) {
    return NextResponse.json(
      { success: false, error: "You can only post requests for your own orphanage" },
      { status: 403 }
    );
  }

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