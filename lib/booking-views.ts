import { lessonPackages, tutors } from "@/lib/data";
import { sortLessons } from "@/lib/lesson-ui";
import { tutorDisplayNameFromId, tutorIdFromEmail } from "@/lib/tutor-identity";
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

export type AdminBooking = DashboardLesson & {
  studentEmail: string;
};

export type TutorLessonDebug = {
  tutorId: string;
  bookingIds: string[];
  bookingNotes: string[];
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
  parent_profile_id?: unknown;
  student_name?: unknown;
  student_year?: unknown;
  parent_name?: unknown;
  lesson_summary?: unknown;
  homework?: unknown;
  parent_update?: unknown;
  attendance_status?: unknown;
};

const bookingSelectCore =
  "id,lesson_package_id,status,scheduled_at,created_at,notes,livekit_room_name,student_profile_id,parent_profile_id,student_name,student_year,parent_name";
const bookingSelectExtended = `${bookingSelectCore},lesson_summary,homework,parent_update,attendance_status`;

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
  const tutorName = tutorId ? tutorDisplayNameFromId(tutorId) : "Tutor to be assigned";
  const sortAt = scheduledAt || createdAt || "";

  return {
    id: bookingId,
    subject: lessonPackage?.subject || "Lesson",
    tutorName,
    startsAt: formatLessonDate(sortAt || "Pending scheduling"),
    sortAt,
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

  const bookingRows = await fetchBookingsWithFallback({ orderBy: "created_at", ascending: false });
  const profileIds = [
    ...new Set(
      bookingRows
        .flatMap((item) => [readString(item.student_profile_id), readString(item.parent_profile_id)])
        .filter(Boolean)
    )
  ];
  const profiles =
    profileIds.length > 0
      ? await supabase.from("profiles").select("id,email").in("id", profileIds)
      : { data: [] as Array<{ id: string; email: string | null }> };

  const mapped = bookingRows.map((booking, index) => {
    const lesson = mapBooking(booking, index);
    const studentProfileId = readString(booking.parent_profile_id) || readString(booking.student_profile_id);
    const studentEmail =
      readString(profiles.data?.find((profile) => profile.id === studentProfileId)?.email) || "Unknown student";

    return {
      ...lesson,
      studentEmail
    };
  });

  return sortLessons(mapped);
}

export async function getTutorLessonsByTutorEmail(email: string): Promise<DashboardLesson[]> {
  const tutorId = tutorIdFromEmail(email);
  const bookingRows = await fetchBookingsWithFallback({
    filters: (query) => query.like("notes", `%selected_tutor:${tutorId}%`),
    orderBy: "scheduled_at",
    ascending: true
  });

  return sortLessons(bookingRows.map((booking, index) => mapBooking(booking, index)));
}

export async function getTutorLessonDebugByTutorEmail(email: string): Promise<TutorLessonDebug> {
  const supabase = getSupabaseAdminClient();
  const tutorId = tutorIdFromEmail(email);

  if (!supabase) {
    return {
      tutorId,
      bookingIds: [],
      bookingNotes: []
    };
  }

  const bookings = await supabase
    .from("bookings")
    .select("id,notes")
    .like("notes", `%selected_tutor:${tutorId}%`)
    .order("created_at", { ascending: false });

  return {
    tutorId,
    bookingIds: (bookings.data || []).map((booking) => readString(booking.id)).filter(Boolean),
    bookingNotes: (bookings.data || []).map((booking) => readString(booking.notes)).filter(Boolean)
  };
}
