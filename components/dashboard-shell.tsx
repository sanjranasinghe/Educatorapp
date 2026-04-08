import Link from "next/link";
import { serviceStatus } from "@/lib/env";
import type { DashboardLesson } from "@/lib/bookings";

function formatAttendance(value: string) {
  if (!value) {
    return "Lesson notes pending";
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function hasProgress(lesson: DashboardLesson) {
  return Boolean(lesson.lessonSummary || lesson.homework || lesson.parentUpdate || lesson.attendanceStatus);
}

export function DashboardShell({
  email,
  lessons
}: {
  email: string | null;
  lessons: DashboardLesson[];
}) {
  const identity = `parent-${(email || "family").split("@")[0]}`;
  const displayName = (email || "Parent").split("@")[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-ink p-8 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-mint">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Welcome{email ? `, ${email}` : ""}</h1>
          <p className="mt-5 text-base leading-8 text-white/75">
            This is the home for upcoming lessons, parent-ready schedules, homework, tutor notes, and room join links.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white">
              Book lesson
            </Link>
            <Link href="/classroom" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink">
              Open classroom
            </Link>
          </div>
        </section>
        <section className="rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Service status</p>
          <h2 className="mt-2 text-2xl font-semibold">Production connections</h2>
          <div className="mt-6 grid gap-3">
            <StatusRow label="Supabase auth + data" ready={serviceStatus.supabase} />
            <StatusRow label="Stripe payment checkout" ready={serviceStatus.stripe} />
            <StatusRow label="LiveKit audio room" ready={serviceStatus.livekit} />
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Upcoming lessons</p>
        <h2 className="mt-2 text-2xl font-semibold">Parent and student schedule</h2>
        <div className="mt-6 grid gap-4">
          {lessons.length ? (
            lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-[1.5rem] bg-sand p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{lesson.subject}</h3>
                    {lesson.studentName ? <p className="mt-1 text-sm text-ink/65">Student: {lesson.studentName}</p> : null}
                    {lesson.studentYear ? <p className="mt-1 text-sm text-ink/65">Year level: {lesson.studentYear}</p> : null}
                    <p className="mt-1 text-sm text-ink/65">Tutor: {lesson.tutorName}</p>
                  </div>
                  <div className="text-sm text-ink/75">{lesson.startsAt}</div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-mint px-3 py-1 text-xs font-semibold capitalize text-ink">{lesson.status}</div>
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
                {hasProgress(lesson) ? (
                  <div className="mt-5 rounded-[1.25rem] border border-ink/10 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">Parent progress update</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Attendance</p>
                        <p className="mt-1 text-sm text-ink/80">{formatAttendance(lesson.attendanceStatus)}</p>
                      </div>
                      {lesson.lessonSummary ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Tutor notes</p>
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
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Parent message</p>
                          <p className="mt-1 text-sm leading-6 text-ink/80">{lesson.parentUpdate}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] bg-sand p-6 text-sm leading-7 text-ink/75">
              No real bookings yet. Once Stripe payment is completed, the lesson will appear here automatically.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusRow({
  label,
  ready
}: {
  label: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-[1.3rem] bg-sand px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ready ? "bg-mint text-ink" : "bg-ink text-white"}`}>
        {ready ? "Ready" : "Not configured"}
      </span>
    </div>
  );
}
