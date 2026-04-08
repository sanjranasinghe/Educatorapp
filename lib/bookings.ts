import { lessonPackages, tutors } from "@/lib/data";
import { formatLessonDate } from "@/lib/booking-views";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type DashboardLesson = {
  id: string;
  subject: string;
  tutorName: string;
  startsAt: string;
  status: string;
  roomName: string;
  studentName: string;
  studentYear: string;
  parentName: string;
  lessonSummary: string;
  homework: string;
  parentUpdate: string;
  attendanceStatus: string;
};

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readNullableString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function buildBookingNotes({ tutorId }: { tutorId: string }) {
  return `selected_tutor:${tutorId}`;
}

function readTutorId(notes: unknown) {
  const noteValue = readNullableString(notes);
  return noteValue?.startsWith("selected_tutor:") ? noteValue.replace("selected_tutor:", "") : "";
}

export async function ensureLessonPackagesSeeded() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return;
  }

  await supabase.from("lesson_packages").upsert(
    lessonPackages.map((item) => ({
      id: item.id,
      subject: item.subject,
      title: item.title,
      sessions: item.sessions,
      price_aud: item.priceAud
    })),
    { onConflict: "id" }
  );
}

export async function ensureProfileForEmail({
  email,
  fullName,
  role = "student"
}: {
  email: string;
  fullName?: string;
  role?: "student" | "parent" | "tutor" | "admin";
}) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const existing = await supabase.from("profiles").select("id,email,full_name,role").eq("email", email).maybeSingle();

  if (existing.data?.id) {
    if (fullName && !existing.data.full_name) {
      await supabase.from("profiles").update({ full_name: fullName }).eq("id", existing.data.id);
    }

    return existing.data;
  }

  const profile = {
    id: crypto.randomUUID(),
    email,
    full_name: fullName || null,
    role
  };

  const inserted = await supabase.from("profiles").insert(profile).select("id,email,full_name,role").single();
  return inserted.data;
}

export async function ensureBookingFromStripeSession({
  sessionId,
  parentName,
  studentName,
  email,
  packageId,
  tutorId,
  scheduledAt,
  studentYear
}: {
  sessionId: string;
  parentName?: string;
  studentName: string;
  email: string;
  packageId: string;
  tutorId: string;
  scheduledAt: string;
  studentYear?: string;
}) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  await ensureLessonPackagesSeeded();
  const parentProfile = await ensureProfileForEmail({ email, fullName: parentName || studentName, role: "parent" });

  if (!parentProfile) {
    return null;
  }

  const existing = await supabase
    .from("bookings")
    .select("id,lesson_package_id,status,created_at")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();

  if (existing.data) {
    return existing.data;
  }

  const roomName = `lesson-${sessionId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 18).toLowerCase()}`;

  const inserted = await supabase
    .from("bookings")
    .insert({
      student_profile_id: parentProfile.id,
      parent_profile_id: parentProfile.id,
      lesson_package_id: packageId,
      status: "scheduled",
      scheduled_at: scheduledAt,
      stripe_checkout_session_id: sessionId,
      livekit_room_name: roomName,
      student_name: studentName,
      student_year: studentYear || null,
      parent_name: parentName || parentProfile.full_name || null,
      notes: buildBookingNotes({ tutorId })
    })
    .select("id,lesson_package_id,status,scheduled_at,created_at,notes")
    .single();

  return inserted.data;
}

export async function getDashboardLessonsByEmail(email: string): Promise<DashboardLesson[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const profile = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();

  if (!profile.data?.id) {
    return [];
  }

  const bookings = await supabase
    .from("bookings")
    .select(
      "id,lesson_package_id,status,scheduled_at,created_at,notes,livekit_room_name,student_name,student_year,parent_name,lesson_summary,homework,parent_update,attendance_status"
    )
    .or(`parent_profile_id.eq.${profile.data.id},student_profile_id.eq.${profile.data.id}`)
    .order("created_at", { ascending: false });

  return (bookings.data || []).map((booking, index) => {
    const lessonPackage = lessonPackages.find((item) => item.id === readString(booking.lesson_package_id));
    const tutorId = readTutorId(booking.notes);
    const tutorName = tutors.find((item) => item.id === tutorId)?.name || "Tutor to be assigned";

    return {
      id: readString(booking.id) || `booking-${index}`,
      subject: lessonPackage?.subject || "Lesson",
      tutorName,
      startsAt: formatLessonDate(
        readNullableString(booking.scheduled_at) || readNullableString(booking.created_at) || "Pending scheduling"
      ),
      status: readString(booking.status) || "pending",
      roomName: readString(booking.livekit_room_name),
      studentName: readString(booking.student_name),
      studentYear: readString(booking.student_year),
      parentName: readString(booking.parent_name),
      lessonSummary: readString(booking.lesson_summary),
      homework: readString(booking.homework),
      parentUpdate: readString(booking.parent_update),
      attendanceStatus: readString(booking.attendance_status)
    };
  });
}
