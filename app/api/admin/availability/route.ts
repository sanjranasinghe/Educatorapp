import { NextResponse } from "next/server";
import { createAvailabilitySlot, deleteAvailabilitySlot, requireAdminAccess } from "@/lib/availability-admin";

export async function POST(request: Request) {
  try {
    await requireAdminAccess();
    const body = (await request.json()) as { tutorId?: string; startsAt?: string };

    if (!body.tutorId || !body.startsAt) {
      return NextResponse.json({ error: "Tutor and start time are required." }, { status: 400 });
    }

    const created = await createAvailabilitySlot({
      tutorId: body.tutorId,
      startsAt: body.startsAt
    });

    return NextResponse.json({ ok: true, slot: created });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create slot." },
      { status: 403 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminAccess();
    const body = (await request.json()) as { slotId?: string };

    if (!body.slotId) {
      return NextResponse.json({ error: "slotId is required." }, { status: 400 });
    }

    const deleted = await deleteAvailabilitySlot(body.slotId);
    return NextResponse.json({ ok: true, slot: deleted });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete slot." },
      { status: 403 }
    );
  }
}
