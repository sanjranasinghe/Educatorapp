import { lessonPackages, tutors } from "@/lib/data";
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

export type AdminBooking = DashboardLesson & {
  studentEmail: string;
};

type BookingRow = {
  id: unknown;
  lesson_package_id: unknown;
  status: unknown;
  scheduled_at: unknown;
  created_at: unknown;
  notes: unknown;
  livekit_room_name: unknown;
  student_profile_id?: unknown;
  student_name?: unknown;
  student_year?: unknown;
  parent_name?: unknown;
  lesson_summary?: unknown;
  homework?: unknown;
  parent_update?: unknown;
  attendance_status?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readNullableString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function readTutorId(notes: unknown) {
  const noteValue = readNullableString(notes);
  return noteValue?.startsWith("selected_tutor:") ? noteValue.replace("selected_tutor:", "") : "";
}

export function formatLessonDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Perth"
  }).format(date);
}

function mapBooking(booking: BookingRow, index = 0): DashboardLesson {
  const bookingId = readString(booking.id) || `booking-${index}`;
  const lessonPackageId = readString(booking.lesson_package_id);
  const status = readString(booking.status) || "pending";
  const scheduledAt = readNullableString(booking.scheduled_at);
  const createdAt = readNullableString(booking.created_at);
  const roomName = readString(booking.livekit_room_name);
  const lessonPackage = lessonPackages.find((item) => item.id === lessonPackageId);
  const tutorId = readTutorId(booking.notes);
  const tutorName = tutors.find((item) => item.id === tutorId)?.name || "Tutor to be assigned";

  return {
    id: bookingId,
    subject: lessonPackage?.subject || "Lesson",
    tutorName,
    startsAt: formatLessonDate(scheduledAt || createdAt || "Pending scheduling"),
    status,
    roomName,
    studentName: readString(booking.student_name),
    studentYear: readString(booking.student_year),
    parentName: readString(booking.parent_name),
    lessonSummary: readString(booking.lesson_summary),
    homework: readString(booking.homework),
    parentUpdate: readString(booking.parent_update),
    attendanceStatus: readString(booking.attendance_status)
  };
}

export async function getAllBookingsForAdmin(): Promise<AdminBooking[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const bookings = await supabase
    .from("bookings")
    .select(
      "id,lesson_package_id,status,scheduled_at,created_at,notes,livekit_room_name,student_profile_id,student_name,student_year,parent_name,lesson_summary,homework,parent_update,attendance_status"
    )
    .order("created_at", { ascending: false });

  const bookingRows = (bookings.data || []) as BookingRow[];
  const profileIds = [...new Set(bookingRows.map((item) => readString(item.student_profile_id)).filter(Boolean))];
  const profiles =
    profileIds.length > 0
      ? await supabase.from("profiles").select("id,email").in("id", profileIds)
      : { data: [] as Array<{ id: string; email: string | null }> };

  return bookingRows.map((booking, index) => {
    const mapped = mapBooking(booking, index);
    const studentProfileId = readString(booking.student_profile_id);
    const studentEmail =
      readString(profiles.data?.find((profile) => profile.id === studentProfileId)?.email) || "Unknown student";

    return {
      ...mapped,
      studentEmail
    };
  });
}

export async function getTutorLessonsByTutorEmail(email: string): Promise<DashboardLesson[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const tutor = tutors.find((item) => item.name.toLowerCase().replace(/\s+/g, ".") === email.split("@")[0].toLowerCase());

  if (!tutor) {
    return [];
  }

  const bookings = await supabase
    .from("bookings")
    .select(
      "id,lesson_package_id,status,scheduled_at,created_at,notes,livekit_room_name,student_name,student_year,parent_name,lesson_summary,homework,parent_update,attendance_status"
    )
    .like("notes", `%selected_tutor:${tutor.id}%`)
    .order("scheduled_at", { ascending: true });

  return ((bookings.data || []) as BookingRow[]).map((booking, index) => mapBooking(booking, index));
}
