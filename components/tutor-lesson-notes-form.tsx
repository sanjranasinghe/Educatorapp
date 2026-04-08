"use client";

import { useState } from "react";

type LessonNotesState = {
  id: string;
  lessonSummary: string;
  homework: string;
  parentUpdate: string;
  attendanceStatus: string;
};

const attendanceOptions = [
  { value: "", label: "Select attendance" },
  { value: "attended", label: "Attended" },
  { value: "student-absent", label: "Student absent" },
  { value: "tutor-follow-up", label: "Tutor follow-up needed" }
];

export function TutorLessonNotesForm({
  lessonId,
  initialLessonSummary,
  initialHomework,
  initialParentUpdate,
  initialAttendanceStatus
}: {
  lessonId: string;
  initialLessonSummary: string;
  initialHomework: string;
  initialParentUpdate: string;
  initialAttendanceStatus: string;
}) {
  const [values, setValues] = useState<LessonNotesState>({
    id: lessonId,
    lessonSummary: initialLessonSummary,
    homework: initialHomework,
    parentUpdate: initialParentUpdate,
    attendanceStatus: initialAttendanceStatus
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  function updateField(field: keyof LessonNotesState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setSavedMessage("");
  }

  async function handleSave() {
    setPending(true);
    setError("");
    setSavedMessage("");

    try {
      const response = await fetch("/api/tutor/lesson-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bookingId: values.id,
          lessonSummary: values.lessonSummary,
          homework: values.homework,
          parentUpdate: values.parentUpdate,
          attendanceStatus: values.attendanceStatus
        })
      });

      const data = (await response.json()) as {
        error?: string;
        lesson?: {
          lesson_summary?: string | null;
          homework?: string | null;
          parent_update?: string | null;
          attendance_status?: string | null;
        };
      };

      if (!response.ok) {
        throw new Error(data.error || "Could not save lesson notes.");
      }

      setValues((current) => ({
        ...current,
        lessonSummary: data.lesson?.lesson_summary ?? "",
        homework: data.lesson?.homework ?? "",
        parentUpdate: data.lesson?.parent_update ?? "",
        attendanceStatus: data.lesson?.attendance_status ?? ""
      }));
      setSavedMessage("Lesson notes saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save lesson notes.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-5 rounded-[1.25rem] border border-ink/10 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">Post-lesson notes</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink/80 md:col-span-2">
          Lesson summary
          <textarea
            value={values.lessonSummary}
            onChange={(event) => updateField("lessonSummary", event.target.value)}
            rows={3}
            className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
            placeholder="What was covered in today's maths lesson?"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink/80">
          Homework
          <textarea
            value={values.homework}
            onChange={(event) => updateField("homework", event.target.value)}
            rows={3}
            className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
            placeholder="Homework, revision, or worksheet tasks"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink/80">
          Parent update
          <textarea
            value={values.parentUpdate}
            onChange={(event) => updateField("parentUpdate", event.target.value)}
            rows={3}
            className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
            placeholder="Short summary for the parent after class"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink/80 md:max-w-xs">
          Attendance
          <select
            value={values.attendanceStatus}
            onChange={(event) => updateField("attendanceStatus", event.target.value)}
            className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
          >
            {attendanceOptions.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save lesson notes"}
        </button>
        {savedMessage ? <p className="text-sm font-medium text-ocean">{savedMessage}</p> : null}
        {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
      </div>
    </div>
  );
}
