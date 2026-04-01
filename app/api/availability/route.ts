import { NextResponse } from "next/server";
import { getAvailableTutorsAndSlots } from "@/lib/availability";

export async function GET() {
  const data = await getAvailableTutorsAndSlots();
  return NextResponse.json(data);
}
