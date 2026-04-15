import { lessonPackages } from "@/lib/data";
import { sortLessons } from "@/lib/lesson-ui";
import { tutorDisplayNameFromId } from "@/lib/tutor-identity";
import { formatLessonDate } from "@/lib/booking-views";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type DashboardLesson = {
  id: string;
  subject: string;
  tutorName: string;
  startsAt: string;
  sortAt: string;
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

type BookingRow = {
  id: unknown;
  lesson_package_id: unknown;
  status: unknown;
  scheduled_at: unknown;
  created_at: unknown;
  notes: unknown;
  livekit_room_name: unknown;
  parent_profile_id?: unknown;
  student_profile_id?: unknown;
  student_name?: unknown;
  student_year?: unknown;
  parent_name?: unknown;
  lesson_summary?: unknown;
  homework?: unknown;
  parent_update?: unknown;
  attendance_status?: unknown;
};

const bookingSelectCore =
  "id,lesson_package_id,status,scheduled_at,created_at,notes,livekit_room_name,parent_profile_id,student_profile_id,student_name,student_year,parent_name";
const bookingSelectExtended = `${bookingSelectCore},lesson_summary,homework,parent_update,attendance_status`;

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

async function fetchBookingsWithFallback({
  filters,
  orderBy = "created_at",
  ascending = false
}: {
  filters?: (query: any) => any;
  orderBy?: "created_at" | "scheduled_at";
  ascending?: boolean;
}) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [] as BookingRow[];
  }

  let query: any = supabase.from("bookings").select(bookingSelectExtended);

  if (filters) {
    query = filters(query);
  }

  let result: any = await query.order(orderBy, { ascending });

  if (result.error) {
    let fallbackQuery: any = supabase.from("bookings").select(bookingSelectCore);

    if (filters) {
      fallbackQuery = filters(fallbackQuery);
    }

    result = await fallbackQuery.order(orderBy, { ascending });
  }

  return (result.data || []) as BookingRow[];
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
    const updates: { full_name?: string; role?: "student" | "parent" | "tutor" | "admin" } = {};

    if (fullName && !existing.data.full_name) {
      updates.full_name = fullName;
    }

    if (role && existing.data.role !== role && existing.data.role !== "admin") {
      updates.role = role;
    }

    if (Object.keys(updates).length) {
      await supabase.from("profiles").update(updates).eq("id", existing.data.id);
    }

    return {
      ...existing.data,
      full_name: updates.full_name ?? existing.data.full_name,
      role: updates.role ?? existing.data.role
    };
  }

  const profile = {
    id: crypto.randomUUID(),
    email,
    full_name: fullName || null,
    role
  };

  const inserted = await supabase.from("profiles").insert(profile).select("id,email,full_name,role").single();

  if (inserted.error) {
    throw new Error(inserted.error.message);
  }

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

  if (inserted.error) {
    throw new Error(inserted.error.message);
  }

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

  const [parentBookings, studentBookings] = await Promise.all([
    fetchBookingsWithFallback({
      filters: (query) => query.eq("parent_profile_id", profile.data!.id),
      orderBy: "created_at",
      ascending: false
    }),
    fetchBookingsWithFallback({
      filters: (query) => query.eq("student_profile_id", profile.data!.id),
      orderBy: "created_at",
      ascending: false
    })
  ]);

  const merged = [...parentBookings, ...studentBookings];
  const uniqueBookings = Array.from(new Map(merged.map((booking) => [readString(booking.id), booking])).values());

  const lessons = uniqueBookings.map((booking, index) => {
    const lessonPackage = lessonPackages.find((item) => item.id === readString(booking.lesson_package_id));
    const tutorId = readTutorId(booking.notes);
    const tutorName = tutorId ? tutorDisplayNameFromId(tutorId) : "Tutor to be assigned";
    const sortAt = readNullableString(booking.scheduled_at) || readNullableString(booking.created_at) || "";

    return {
      id: readString(booking.id) || `booking-${index}`,
      subject: lessonPackage?.subject || "Lesson",
      tutorName,
      startsAt: formatLessonDate(sortAt || "Pending scheduling"),
      sortAt,
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

  return sortLessons(lessons);
}
