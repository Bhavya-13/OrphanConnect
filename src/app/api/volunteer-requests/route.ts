import { NextRequest, NextResponse } from "next/server";
import { addVolunteerRequest } from "@/lib/data";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    await addVolunteerRequest({
      id: `vol-${Date.now()}`,
      orphanageId: body.orphanageId,
      task: body.task,
      description: body.description,
      date: body.date,
      slotsAvailable: Number(body.slotsAvailable) || 0,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}