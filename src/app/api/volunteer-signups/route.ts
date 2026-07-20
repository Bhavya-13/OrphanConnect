import { NextRequest, NextResponse } from "next/server";
import { addVolunteerSignup } from "@/lib/data";
import { VolunteerSignup } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const signup: VolunteerSignup = {
    id: `signup-${Date.now()}`,
    volunteerRequestId: body.volunteerRequestId,
    volunteerName: body.volunteerName,
    contact: body.contact,
    createdAt: new Date().toISOString(),
  };

  try {
    await addVolunteerSignup(signup);
    return NextResponse.json({ success: true, signup });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}