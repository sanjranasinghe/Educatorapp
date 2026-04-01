import { NextResponse } from "next/server";
import { createLessonRoomToken } from "@/lib/livekit";
import { serviceStatus } from "@/lib/env";
import { liveRoomSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = liveRoomSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid room request." }, { status: 400 });
  }

  if (!serviceStatus.livekit) {
    return NextResponse.json(
      {
        error: "LiveKit is not configured yet. Add LiveKit env keys before generating room tokens."
      },
      { status: 503 }
    );
  }

  const token = await createLessonRoomToken(parsed.data);
  return NextResponse.json({ token });
}
