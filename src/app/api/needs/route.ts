import { NextRequest, NextResponse } from "next/server";
import { addNeed } from "@/lib/data";
import { Need } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();

  let need: Need;

  if (body.type === "money") {
    need = {
      id: `need-${Date.now()}`,
      orphanageId: body.orphanageId,
      type: "money",
      title: body.title,
      description: body.description,
      amountNeeded: Number(body.amountNeeded),
      amountRaised: 0,
      urgent: !!body.urgent,
    };
  } else {
    need = {
      id: `need-${Date.now()}`,
      orphanageId: body.orphanageId,
      type: "goods",
      title: body.title,
      description: body.description,
      quantityNeeded: Number(body.quantityNeeded),
      quantityFulfilled: 0,
      unit: body.unit,
      urgent: !!body.urgent,
    };
  }

  try {
    await addNeed(need);
    return NextResponse.json({ success: true, need });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}