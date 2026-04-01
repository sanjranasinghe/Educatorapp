import { NextResponse } from "next/server";
import { createAvailabilitySlot, deleteAvailabilitySlot } from "@/lib/availability-admin";
import { requireTutorAccess } from "@/lib/tutor-availability";

export async function POST(request: Request) {
  try {
    const context = await requireTutorAccess();
    const body = (await request.json()) as { startsAt?: string };

    if (!body.startsAt) {
      return NextResponse.json({ error: "startsAt is required." }, { status: 400 });
    }

    const created = await createAvailabilitySlot({
      tutorId: context.tutorId,
      startsAt: body.startsAt
    });

    return NextResponse.json({ ok: true, slot: created });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create tutor slot." },
      { status: 403 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireTutorAccess();
    const body = (await request.json()) as { slotId?: string };

    if (!body.slotId) {
      return NextResponse.json({ error: "slotId is required." }, { status: 400 });
    }

    const deleted = await deleteAvailabilitySlot(body.slotId);
    return NextResponse.json({ ok: true, slot: deleted });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete tutor slot." },
      { status: 403 }
    );
  }
}
