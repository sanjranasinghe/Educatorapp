import { tutors } from "@/lib/data";

export function tutorIdFromEmail(email: string) {
  return email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function humanizeFallbackTutorId(tutorId: string) {
  const withSeparators = tutorId
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim();

  const titled = withSeparators
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return titled || "Tutor to be assigned";
}

export function tutorDisplayNameFromId(tutorId: string) {
  const knownTutor = tutors.find((tutor) => tutor.id === tutorId);

  if (knownTutor) {
    return knownTutor.name;
  }

  return humanizeFallbackTutorId(tutorId);
}
