import { NextRequest, NextResponse } from "next/server";
import { addOrphanage } from "@/lib/data";
import { Orphanage } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const orphanage: Orphanage = {
    id: `orph-${Date.now()}`,
    name: body.name,
    location: body.location,
    state: body.state,
    story: body.story,
    childrenCount: Number(body.childrenCount) || 0,
    verified: false,
    imageUrl:
      body.imageUrl ||
      "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?q=80&w=1200",
    views: 0,
  };

  try {
    await addOrphanage(orphanage);
    return NextResponse.json({ success: true, orphanage });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}