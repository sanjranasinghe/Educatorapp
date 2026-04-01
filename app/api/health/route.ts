import { NextResponse } from "next/server";
import { releaseChecklist } from "@/lib/platform";

export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    services: releaseChecklist
  });
}
