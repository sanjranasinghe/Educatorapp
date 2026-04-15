import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserContext } from "@/lib/auth-context";

function encodeTimezone(prefix: "seed" | "custom", tutorId: string, startsAt: string) {
  return `${prefix}:${tutorId}:${startsAt}`;
}

export async function requireAdminAccess() {
  const context = await getCurrentUserContext();

  if (context.role !== "admin") {
    throw new Error("Admin access required.");
  }

  return context;
}

export async function createAvailabilitySlot({
  tutorId,
  startsAt,
  tutorEmail
}: {
  tutorId: string;
  startsAt: string;
  tutorEmail?: string;
}) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const fallbackTutorProfileEmail = `${tutorId.replace(/-/g, ".")}@brightpath.test`;
  const profile = await supabase
    .from("profiles")
    .select("id")
    .eq("email", tutorEmail || fallbackTutorProfileEmail)
    .maybeSingle();

  if (!profile.data?.id) {
    throw new Error("Tutor profile not found.");
  }

  const timezone = encodeTimezone("custom", tutorId, startsAt);
  const existing = await supabase
    .from("tutor_availability")
    .select("id")
    .eq("tutor_profile_id", profile.data.id)
    .eq("timezone", timezone)
    .maybeSingle();

  if (existing.data?.id) {
    return {
      id: existing.data.id,
      tutorId,
      startsAt
    };
  }

  const date = new Date(startsAt);
  const end = new Date(date.getTime() + 60 * 60 * 1000);

  const inserted = await supabase
    .from("tutor_availability")
    .insert({
      tutor_profile_id: profile.data.id,
      weekday: date.getUTCDay(),
      start_time: date.toISOString().slice(11, 19),
      end_time: end.toISOString().slice(11, 19),
      timezone
    })
    .select("id")
    .single();

  if (inserted.error) {
    throw new Error(inserted.error.message);
  }

  return {
    id: inserted.data.id,
    tutorId,
    startsAt
  };
}

export async function deleteAvailabilitySlot(slotId: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const deleted = await supabase.from("tutor_availability").delete().eq("id", slotId).select("id").single();

  if (deleted.error) {
    throw new Error(deleted.error.message);
  }

  return deleted.data;
}
