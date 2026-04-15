import Link from "next/link";
import { TutorLessonNotesForm } from "@/components/tutor-lesson-notes-form";
import { TutorSlotManager } from "@/components/tutor-slot-manager";
import { formatLessonStatus, lessonStatusClasses } from "@/lib/lesson-ui";
import type { DashboardLesson } from "@/lib/booking-views";

type TutorSlot = {
  id: string;
  tutorId: string;
  startsAt: string;
};

function formatAttendance(value: string) {
  return value
    ? value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Not recorded";
}

export function TutorShell({
  email,
  lessons,
  slots
}: {
  email: string | null;
  lessons: DashboardLesson[];
  slots: TutorSlot[];
}) {
  const identity = `tutor-${(email || "tutor").split("@")[0]}`;
  const displayName = (email || "Tutor").split("@")[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-[2rem] bg-ocean p-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-mint">Tutor panel</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Your teaching schedule</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/80">
          Signed in as {email || "tutor"}. This view shows upcoming lessons, classroom links, and the post-lesson notes that parents will see after class.
        </p>
      </div>

      <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Upcoming lessons</p>
            <h2 className="mt-2 text-2xl font-semibold">Tutor schedule</h2>
          </div>
          <div className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-ink">
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {lessons.length ? (
            lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-[1.5rem] bg-sand p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{lesson.subject}</h3>
                    {lesson.studentName ? <p className="mt-1 text-sm text-ink/70">Student: {lesson.studentName}</p> : null}
                    {lesson.studentYear ? <p className="mt-1 text-sm text-ink/70">Year level: {lesson.studentYear}</p> : null}
                    <p className="mt-1 text-sm text-ink/70">Tutor: {lesson.tutorName}</p>
                  </div>
                  <div className="text-sm font-medium text-ink/75">{lesson.startsAt}</div>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${lessonStatusClasses(lesson.status)}`}>
                      {formatLessonStatus(lesson.status)}
                    </div>
                    {lesson.roomName ? (
                      <Link
                        href={`/classroom?room=${encodeURIComponent(lesson.roomName)}&identity=${encodeURIComponent(identity)}&name=${encodeURIComponent(displayName)}`}
                        className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
                      >
                        Open room
                      </Link>
                    ) : null}
                  </div>
                </div>
                {(lesson.lessonSummary || lesson.homework || lesson.parentUpdate || lesson.attendanceStatus) ? (
                  <div className="mt-5 rounded-[1.25rem] border border-ink/10 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">Latest saved progress</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Attendance</p>
                        <p className="mt-1 text-sm text-ink/80">{formatAttendance(lesson.attendanceStatus)}</p>
                      </div>
                      {lesson.lessonSummary ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Lesson summary</p>
                          <p className="mt-1 text-sm leading-6 text-ink/80">{lesson.lessonSummary}</p>
                        </div>
                      ) : null}
                      {lesson.homework ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Homework</p>
                          <p className="mt-1 text-sm leading-6 text-ink/80">{lesson.homework}</p>
                        </div>
                      ) : null}
                      {lesson.parentUpdate ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Parent update</p>
                          <p className="mt-1 text-sm leading-6 text-ink/80">{lesson.parentUpdate}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <TutorLessonNotesForm
                  lessonId={lesson.id}
                  initialLessonSummary={lesson.lessonSummary}
                  initialHomework={lesson.homework}
                  initialParentUpdate={lesson.parentUpdate}
                  initialAttendanceStatus={lesson.attendanceStatus}
                />
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
