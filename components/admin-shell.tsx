import Link from "next/link";
import { AdminSlotManager } from "@/components/admin-slot-manager";
import type { AdminBooking } from "@/lib/booking-views";
import type { AvailableSlot, AvailableTutor } from "@/lib/availability";

function formatSlot(startsAt: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Perth"
  }).format(new Date(startsAt));
}

function formatAttendance(value: string) {
  return value
    ? value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Pending";
}

export function AdminShell({
  bookings,
  tutors,
  slots
}: {
  bookings: AdminBooking[];
  tutors: AvailableTutor[];
  slots: AvailableSlot[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-[2rem] bg-ink p-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-mint">Admin panel</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Manage bookings and tutor availability</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/75">
          This admin view now shows parent bookings, student year levels, tutor lesson notes, and controls for adding or removing availability.
        </p>
      </div>

      <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">All bookings</p>
        <h2 className="mt-2 text-2xl font-semibold">Operations view</h2>
        <div className="mt-6 grid gap-4">
          {bookings.length ? (
            bookings.map((booking) => (
              <div key={booking.id} className="rounded-[1.5rem] bg-sand p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.subject}</h3>
                    <p className="mt-1 text-sm text-ink/70">Parent email: {booking.studentEmail}</p>
                    {booking.parentName ? <p className="mt-1 text-sm text-ink/70">Parent name: {booking.parentName}</p> : null}
                    {booking.studentName ? <p className="mt-1 text-sm text-ink/70">Student: {booking.studentName}</p> : null}
                    {booking.studentYear ? <p className="mt-1 text-sm text-ink/70">Year level: {booking.studentYear}</p> : null}
                    <p className="mt-1 text-sm text-ink/70">Tutor: {booking.tutorName}</p>
                  </div>
                  <div className="text-sm text-ink/75">{booking.startsAt}</div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-mint px-3 py-1 text-xs font-semibold capitalize text-ink">{booking.status}</div>
                    {booking.roomName ? (
                      <Link
                        href={`/classroom?room=${encodeURIComponent(booking.roomName)}&identity=${encodeURIComponent("admin-host")}&name=${encodeURIComponent("Admin")}`}
                        className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
                      >
                        Open room
                      </Link>
                    ) : null}
                  </div>
                </div>
                {booking.lessonSummary || booking.homework || booking.parentUpdate || booking.attendanceStatus ? (
                  <div className="mt-5 rounded-[1.25rem] border border-ink/10 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">Lesson progress</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Attendance</p>
                        <p className="mt-1 text-sm text-ink/80">{formatAttendance(booking.attendanceStatus)}</p>
                      </div>
                      {booking.lessonSummary ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Tutor notes</p>
                          <p className="mt-1 text-sm leading-6 text-ink/80">{booking.lessonSummary}</p>
                        </div>
                      ) : null}
                      {booking.homework ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Homework</p>
                          <p className="mt-1 text-sm leading-6 text-ink/80">{booking.homework}</p>
                        </div>
                      ) : null}
                      {booking.parentUpdate ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Parent message</p>
                          <p className="mt-1 text-sm leading-6 text-ink/80">{booking.parentUpdate}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] bg-sand p-6 text-sm leading-7 text-ink/75">No bookings found yet.</div>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Availability overview</p>
        <h2 className="mt-2 text-2xl font-semibold">Current tutor slots</h2>
        <div className="mt-6 grid gap-4">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="rounded-[1.5rem] bg-sand p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{tutor.name}</h3>
                  <p className="mt-1 text-sm text-ink/70">{tutor.subject}</p>
                </div>
                <div className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">${tutor.rateAud}/hr</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {slots.filter((slot) => slot.tutorId === tutor.id).map((slot) => (
                  <span key={slot.id} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/75">
                    {formatSlot(slot.startsAt)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <AdminSlotManager tutors={tutors} initialSlots={slots} />
    </div>
  );
}
