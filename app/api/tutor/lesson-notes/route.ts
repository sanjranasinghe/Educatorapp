import { NextResponse } from "next/server";
import { requireTutorAccess } from "@/lib/tutor-availability";
import { updateTutorLessonNotes } from "@/lib/tutor-lesson-notes";

export async function POST(request: Request) {
  try {
    const context = await requireTutorAccess();
    const body = (await request.json()) as {
      bookingId?: string;
      lessonSummary?: string;
      homework?: string;
      parentUpdate?: string;
      attendanceStatus?: string;
    };

    if (!body.bookingId) {
      return NextResponse.json({ error: "bookingId is required." }, { status: 400 });
    }

    const updated = await updateTutorLessonNotes({
      bookingId: body.bookingId,
      tutorId: context.tutorId,
      lessonSummary: body.lessonSummary?.trim() || "",
      homework: body.homework?.trim() || "",
      parentUpdate: body.parentUpdate?.trim() || "",
      attendanceStatus: body.attendanceStatus?.trim() || ""
    });

    return NextResponse.json({ ok: true, lesson: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save lesson notes." },
      { status: 403 }
    );
  }
}
