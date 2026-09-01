import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  // --- Auth check: must be signed in, and must own the orphanage (or be admin) ---
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // no-op: we're only reading the session here
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
      { success: false, error: "You can only post needs for your own orphanage" },
      { status: 403 }
    );
  }
  // --- End auth check ---

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