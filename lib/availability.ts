import { tutorSlots, tutors } from "@/lib/data";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type AvailableTutor = {
  id: string;
  name: string;
  subject: "English" | "Maths";
  rateAud: number;
  blurb: string;
};

export type AvailableSlot = {
  id: string;
  tutorId: string;
  startsAt: string;
};

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function parseStoredTimezone(value: unknown) {
  const timezone = readString(value);

  if (!timezone.startsWith("seed:") && !timezone.startsWith("custom:")) {
    return null;
  }

  const parts = timezone.split(":");
  const prefix = parts.shift();
  const tutorId = parts.shift();
  const startsAt = parts.join(":");

  if (!prefix || !tutorId || !startsAt) {
    return null;
  }

  return {
    tutorId,
    startsAt
  };
}

export async function seedTutorsAndAvailability() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return;
  }

  const tutorProfiles = new Map<string, string>();

  for (const tutor of tutors) {
    const email = `${tutor.name.toLowerCase().replace(/\s+/g, ".")}@brightpath.test`;
    const existing = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
    const profileId = readString(existing.data?.id) || crypto.randomUUID();

    await supabase.from("profiles").upsert(
      {
        id: profileId,
        email,
        full_name: tutor.name,
        role: "tutor"
      },
      { onConflict: "email" }
    );

    tutorProfiles.set(tutor.id, profileId);
  }

  await supabase.from("tutor_availability").delete().like("timezone", "seed:%");

  for (const slot of tutorSlots) {
    const profileId = tutorProfiles.get(slot.tutorId);

    if (!profileId) {
      continue;
    }

    const date = new Date(slot.startsAt);
    const end = new Date(date.getTime() + 60 * 60 * 1000);

    await supabase.from("tutor_availability").insert({
      tutor_profile_id: profileId,
      weekday: date.getUTCDay(),
      start_time: date.toISOString().slice(11, 19),
      end_time: end.toISOString().slice(11, 19),
      timezone: `seed:${slot.tutorId}:${slot.startsAt}`
    });
  }
}

export async function getAvailableTutorsAndSlots() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      tutors: tutors.map((tutor) => ({
        id: tutor.id,
        name: tutor.name,
        subject: tutor.subject,
        rateAud: tutor.rateAud,
        blurb: tutor.blurb
      })),
      slots: tutorSlots
    };
  }

  try {
    await seedTutorsAndAvailability();

    const availabilityRows = await supabase.from("tutor_availability").select("id,timezone");

    const mappedSlots: AvailableSlot[] = (availabilityRows.data || [])
      .map((item) => {
        const parsed = parseStoredTimezone(item.timezone);

        if (!parsed) {
          return null;
        }

        return {
          id: readString(item.id),
          tutorId: parsed.tutorId,
          startsAt: parsed.startsAt
        };
      })
      .filter((item): item is AvailableSlot => Boolean(item && item.id));

    return {
      tutors: tutors.map((tutor) => ({
        id: tutor.id,
        name: tutor.name,
        subject: tutor.subject,
        rateAud: tutor.rateAud,
        blurb: tutor.blurb
      })),
      slots: mappedSlots.length ? mappedSlots : tutorSlots
    };
  } catch {
    return {
      tutors: tutors.map((tutor) => ({
        id: tutor.id,
        name: tutor.name,
        subject: tutor.subject,
        rateAud: tutor.rateAud,
        blurb: tutor.blurb
      })),
      slots: tutorSlots
    };
  }
}
