import { NextRequest, NextResponse } from "next/server";
import { addContribution } from "@/lib/data";
import { Contribution } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const contribution: Contribution = {
    id: `contrib-${Date.now()}`,
    needId: body.needId,
    donorName: body.donorName || "Anonymous",
    type: body.type,
    amount: body.amount,
    quantity: body.quantity,
    createdAt: new Date().toISOString(),
  };

  try {
    await addContribution(contribution);
    return NextResponse.json({ success: true, contribution });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}