import Link from "next/link";
import { TutorSlotManager } from "@/components/tutor-slot-manager";
import type { DashboardLesson } from "@/lib/booking-views";

type TutorSlot = {
  id: string;
  tutorId: string;
  startsAt: string;
};

export function TutorShell({
  email,
  lessons,
  slots
}: {
  email: string | null;
  lessons: DashboardLesson[];
  slots: TutorSlot[];
}) {
  const identity = (email || "tutor").split("@")[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-[2rem] bg-ocean p-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-mint">Tutor panel</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Your teaching schedule</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/80">
          Signed in as {email || "tutor"}. This view shows upcoming lessons currently assigned to your tutor profile.
        </p>
      </div>

      <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Upcoming lessons</p>
        <h2 className="mt-2 text-2xl font-semibold">Tutor schedule</h2>
        <div className="mt-6 grid gap-4">
          {lessons.length ? (
            lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-[1.5rem] bg-sand p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{lesson.subject}</h3>
                    {lesson.studentName ? <p className="mt-1 text-sm text-ink/70">Student: {lesson.studentName}</p> : null}
                    {lesson.studentYear ? <p className="mt-1 text-sm text-ink/70">Year level: {lesson.studentYear}</p> : null}
                    <p className="mt-1 text-sm text-ink/70">Tutor: {lesson.tutorName}</p>
                  </div>
                  <div className="text-sm text-ink/75">{lesson.startsAt}</div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-mint px-3 py-1 text-xs font-semibold capitalize text-ink">{lesson.status}</div>
                    {lesson.roomName ? (
                      <Link
                        href={`/classroom?room=${encodeURIComponent(lesson.roomName)}&identity=${encodeURIComponent(identity)}&name=${encodeURIComponent(identity)}`}
                        className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
                      >
                        Open room
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] bg-sand p-6 text-sm leading-7 text-ink/75">
              No tutor bookings found yet. Once students book you, your lessons will appear here.
            </div>
          )}
        </div>
      </section>

      <TutorSlotManager initialSlots={slots} />
    </div>
  );
}
