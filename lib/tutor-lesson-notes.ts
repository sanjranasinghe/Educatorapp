import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type TutorLessonNotesInput = {
  bookingId: string;
  tutorId: string;
  lessonSummary: string;
  homework: string;
  parentUpdate: string;
  attendanceStatus: string;
};

function readTutorId(notes: unknown) {
  return typeof notes === "string" && notes.startsWith("selected_tutor:") ? notes.replace("selected_tutor:", "") : "";
}

export async function updateTutorLessonNotes({
  bookingId,
  tutorId,
  lessonSummary,
  homework,
  parentUpdate,
  attendanceStatus
}: TutorLessonNotesInput) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const booking = await supabase.from("bookings").select("id,notes").eq("id", bookingId).maybeSingle();

  if (!booking.data?.id) {
    throw new Error("Lesson booking not found.");
  }

  if (readTutorId(booking.data.notes) !== tutorId) {
    throw new Error("This lesson is not assigned to your tutor account.");
  }

  const updated = await supabase
    .from("bookings")
    .update({
      lesson_summary: lessonSummary || null,
      homework: homework || null,
      parent_update: parentUpdate || null,
      attendance_status: attendanceStatus || null,
      status: attendanceStatus ? "completed" : "scheduled"
    })
    .eq("id", bookingId)
    .select("id,lesson_summary,homework,parent_update,attendance_status,status")
    .single();

  if (updated.error) {
    throw new Error(updated.error.message);
  }

  return updated.data;
}
