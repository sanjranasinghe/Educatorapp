import { tutors } from "@/lib/data";
import { getCurrentUserContext } from "@/lib/auth-context";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function inferTutorIdFromEmail(email: string) {
  const local = email.split("@")[0].toLowerCase();
  return tutors.find((tutor) => tutor.id === local.replace(/\./g, "-"))?.id || null;
}

export async function requireTutorAccess() {
  const context = await getCurrentUserContext();

  if (context.role !== "tutor" || !context.email) {
    throw new Error("Tutor access required.");
  }

  const tutorId = inferTutorIdFromEmail(context.email);

  if (!tutorId) {
    throw new Error("Tutor account is not linked to a tutor profile slug yet.");
  }

  return {
    ...context,
    tutorId
  };
}

export async function getTutorAvailabilityByEmail(email: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const tutorId = inferTutorIdFromEmail(email);

  if (!tutorId) {
    return [];
  }

  const rows = await supabase.from("tutor_availability").select("id,timezone");

  return (rows.data || [])
    .map((item) => {
      const timezone = readString(item.timezone);

      if (!timezone.includes(`:${tutorId}:`)) {
        return null;
      }

      const parts = timezone.split(":");
      const parsedTutorId = parts[1];
      const startsAt = parts.slice(2).join(":");

      if (!parsedTutorId || !startsAt) {
        return null;
      }

      return {
        id: readString(item.id),
        tutorId: parsedTutorId,
        startsAt
      };
    })
    .filter((item): item is { id: string; tutorId: string; startsAt: string } => Boolean(item && item.id));
}
