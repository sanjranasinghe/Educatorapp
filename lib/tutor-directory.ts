import { tutors, type Tutor } from "@/lib/data";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function slugFromEmail(email: string) {
  return email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function displayNameFromEmail(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getPublicTutors(): Promise<Tutor[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return tutors;
  }

  const profiles = await supabase
    .from("profiles")
    .select("id,email,full_name")
    .eq("role", "tutor")
    .order("created_at", { ascending: false });

  if (profiles.error || !profiles.data?.length) {
    return tutors;
  }

  const existingTutorIds = new Set(tutors.map((tutor) => tutor.id));
  const profileTutors = profiles.data
    .map((profile): Tutor | null => {
      const email = typeof profile.email === "string" ? profile.email : "";
      const id = slugFromEmail(email || String(profile.id));

      if (!id || existingTutorIds.has(id)) {
        return null;
      }

      return {
        id,
        name: typeof profile.full_name === "string" && profile.full_name ? profile.full_name : displayNameFromEmail(email) || "New Tutor",
        subject: "Maths",
        accent: "Perth tutor profile",
        rateAud: 48,
        experience: "Tutor profile created. Admin can complete subject, rate, and lesson details next.",
        blurb: "This tutor account is active and ready for admin profile setup before accepting bookings.",
        tags: ["Pending setup", "Maths", "WA students"]
      };
    })
    .filter((item): item is Tutor => Boolean(item));

  return [...profileTutors, ...tutors];
}
