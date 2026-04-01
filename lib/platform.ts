import { lessonPackages, tutors } from "@/lib/data";
import { serviceStatus } from "@/lib/env";

export const mockUpcomingLessons = [
  {
    id: "lesson-1",
    subject: "English",
    tutorName: tutors[0].name,
    startsAt: "2026-03-29 16:00",
    status: "Paid"
  },
  {
    id: "lesson-2",
    subject: "Maths",
    tutorName: tutors[1].name,
    startsAt: "2026-03-31 18:30",
    status: "Scheduled"
  }
];

export const releaseChecklist = [
  {
    title: "Auth and roles",
    ready: serviceStatus.supabase,
    detail: "Students, parents, tutors, and admin accounts"
  },
  {
    title: "Payments",
    ready: serviceStatus.stripe,
    detail: "Stripe checkout for AUD lesson purchases"
  },
  {
    title: "Audio classroom",
    ready: serviceStatus.livekit,
    detail: "Private LiveKit room tokens and audio join flow"
  },
  {
    title: "Lesson catalog",
    ready: true,
    detail: `${lessonPackages.length} starter lesson offers ready to wire to checkout`
  }
];
