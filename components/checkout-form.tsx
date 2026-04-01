"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { lessonPackages, tutorSlots, tutors, yearLevels } from "@/lib/data";

type TutorView = {
  id: string;
  name: string;
  subject: "English" | "Maths";
  rateAud: number;
  blurb: string;
};

type SlotView = {
  id: string;
  tutorId: string;
  startsAt: string;
};

function formatSlot(startsAt: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Perth"
  }).format(new Date(startsAt));
}

export function CheckoutForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<"English" | "Maths">("Maths");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedTutorId, setSelectedTutorId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableTutors, setAvailableTutors] = useState<TutorView[]>(
    tutors.map((tutor) => ({
      id: tutor.id,
      name: tutor.name,
      subject: tutor.subject,
      rateAud: tutor.rateAud,
      blurb: tutor.blurb
    }))
  );
  const [availableSlots, setAvailableSlots] = useState<SlotView[]>(tutorSlots);

  useEffect(() => {
    async function loadAvailability() {
      try {
        const response = await fetch("/api/availability");
        const data = (await response.json()) as { tutors?: TutorView[]; slots?: SlotView[] };

        if (response.ok && data.tutors && data.slots) {
          setAvailableTutors(data.tutors);
          setAvailableSlots(data.slots);
        }
      } catch {
        // Keep fallback in-memory data.
      }
    }

    void loadAvailability();
  }, []);

  const subjectPackages = useMemo(
    () => lessonPackages.filter((item) => item.subject === selectedSubject),
    [selectedSubject]
  );
  const filteredTutors = useMemo(
    () => availableTutors.filter((tutor) => tutor.subject === selectedSubject),
    [availableTutors, selectedSubject]
  );

  const safeTutorId = filteredTutors.some((tutor) => tutor.id === selectedTutorId)
    ? selectedTutorId
    : filteredTutors[0]?.id || "";

  const filteredSlots = useMemo(
    () => availableSlots.filter((slot) => slot.tutorId === safeTutorId),
    [availableSlots, safeTutorId]
  );

  const safePackageId = subjectPackages.some((item) => item.id === selectedPackage)
    ? selectedPackage
    : subjectPackages[0]?.id || "";

  const safeSlot = filteredSlots.some((slot) => slot.startsAt === selectedSlot)
    ? selectedSlot
    : filteredSlots[0]?.startsAt || "";

  const selected = useMemo(
    () => lessonPackages.find((item) => item.id === safePackageId) ?? subjectPackages[0],
    [safePackageId, subjectPackages]
  );

  useEffect(() => {
    if (safePackageId !== selectedPackage) {
      setSelectedPackage(safePackageId);
    }
  }, [safePackageId, selectedPackage]);

  useEffect(() => {
    if (safeTutorId !== selectedTutorId) {
      setSelectedTutorId(safeTutorId);
    }
  }, [safeTutorId, selectedTutorId]);

  useEffect(() => {
    if (safeSlot !== selectedSlot) {
      setSelectedSlot(safeSlot);
    }
  }, [safeSlot, selectedSlot]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    setPending(true);
    setError("");

    try {
      const formData = new FormData(form);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          parentName: formData.get("parentName"),
          studentName: formData.get("studentName"),
          email: formData.get("email"),
          studentYear: formData.get("studentYear"),
          subject: formData.get("subject"),
          packageId: formData.get("packageId"),
          tutorId: formData.get("tutorId"),
          scheduledAt: formData.get("scheduledAt"),
          goals: formData.get("goals")
        })
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not create checkout session.");
      }

      window.location.href = data.url;
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Something went wrong.");
      setPending(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Checkout</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Book Perth maths support first</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-ink/75">
          Parents can book Years 1-8 lessons with maths selected by default. English stays available whenever you want to open that pathway more widely.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-ink/80">
            Parent or guardian name
            <input name="parentName" className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none" placeholder="Parent full name" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink/80">
            Parent email
            <input name="email" type="email" className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none" placeholder="family@email.com" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink/80">
            Student name
            <input name="studentName" className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none" placeholder="Student full name" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink/80">
            Year level
            <select
              name="studentYear"
              defaultValue="Year 5"
              className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
            >
              {yearLevels.map((yearLevel) => (
                <option key={yearLevel} value={yearLevel}>
                  {yearLevel}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink/80">
            Subject
            <select
              name="subject"
              value={selectedSubject}
              onChange={(event) => setSelectedSubject(event.target.value as "English" | "Maths")}
              className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
            >
              <option value="Maths">Maths</option>
              <option value="English">English</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink/80">
            Lesson package
            <select
              name="packageId"
              value={safePackageId}
              onChange={(event) => setSelectedPackage(event.target.value)}
              className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
            >
              {subjectPackages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink/80">
            Tutor
            <select
              name="tutorId"
              value={safeTutorId}
              onChange={(event) => setSelectedTutorId(event.target.value)}
              className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
            >
              {filteredTutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink/80">
            Lesson time
            <select
              name="scheduledAt"
              value={safeSlot}
              onChange={(event) => setSelectedSlot(event.target.value)}
              className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
            >
              {filteredSlots.map((slot) => (
                <option key={slot.id} value={slot.startsAt}>
                  {formatSlot(slot.startsAt)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink/80 md:col-span-2">
            Learning goals
            <textarea
              name="goals"
              className="min-h-28 rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
              placeholder="Tell the tutor the student's maths goals, current struggles, and anything the parent wants covered."
              required
            />
          </label>
          <button type="submit" disabled={pending} className="md:col-span-2 rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {pending ? "Creating checkout..." : `Continue to pay ${selected ? `$${selected.priceAud} AUD` : ""}`}
          </button>
          {error ? <p className="md:col-span-2 text-sm text-coral">{error}</p> : null}
        </form>
      </div>
      <div className="rounded-[2rem] bg-ink p-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-mint">Perth launch</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Maths-first for WA Years 1-8 families.</h2>
        <div className="mt-8 space-y-4">
          {filteredTutors.map((tutor) => (
            <div key={tutor.id} className="rounded-[1.4rem] bg-white/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{tutor.name}</h3>
                  <p className="text-sm text-white/70">{tutor.subject}</p>
                </div>
                <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">${tutor.rateAud}/hr</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/75">{tutor.blurb}</p>
            </div>
          ))}
          <div className="rounded-[1.4rem] bg-white/10 p-4 text-sm leading-7 text-white/75">
            Times are shown for Perth families in AWST. As you grow, we can map each lesson to Year 1-8 WA maths strands and parent progress reports.
          </div>
        </div>
      </div>
    </div>
  );
}
