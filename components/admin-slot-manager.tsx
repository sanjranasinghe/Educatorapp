"use client";

import { useMemo, useState } from "react";
import type { AvailableSlot, AvailableTutor } from "@/lib/availability";

function formatSlot(startsAt: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(startsAt));
}

export function AdminSlotManager({
  tutors,
  initialSlots
}: {
  tutors: AvailableTutor[];
  initialSlots: AvailableSlot[];
}) {
  const [slots, setSlots] = useState(initialSlots);
  const [tutorId, setTutorId] = useState(tutors[0]?.id || "");
  const [startsAt, setStartsAt] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const groupedSlots = useMemo(
    () =>
      tutors.map((tutor) => ({
        tutor,
        slots: slots.filter((slot) => slot.tutorId === tutor.id)
      })),
    [slots, tutors]
  );

  async function addSlot() {
    if (!tutorId || !startsAt) {
      setError("Choose a tutor and date/time first.");
      return;
    }

    setPending(true);
    setError("");

    try {
      const isoStartsAt = new Date(startsAt).toISOString();
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tutorId, startsAt: isoStartsAt })
      });

      const data = (await response.json()) as { error?: string; slot?: AvailableSlot };

      if (!response.ok || !data.slot) {
        throw new Error(data.error || "Could not create slot.");
      }

      setSlots((current) => {
        if (current.some((slot) => slot.id === data.slot!.id)) {
          return current;
        }

        return [...current, data.slot!];
      });
      setStartsAt("");
    } catch (slotError) {
      setError(slotError instanceof Error ? slotError.message : "Could not create slot.");
    } finally {
      setPending(false);
    }
  }

  async function removeSlot(slotId: string) {
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/admin/availability", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ slotId })
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not delete slot.");
      }

      setSlots((current) => current.filter((slot) => slot.id !== slotId));
    } catch (slotError) {
      setError(slotError instanceof Error ? slotError.message : "Could not delete slot.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Manage availability</p>
      <h2 className="mt-2 text-2xl font-semibold">Add and remove tutor slots</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <select
          value={tutorId}
          onChange={(event) => setTutorId(event.target.value)}
          className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
        >
          {tutors.map((tutor) => (
            <option key={tutor.id} value={tutor.id}>
              {tutor.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(event) => setStartsAt(event.target.value)}
          className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
        />
        <button
          type="button"
          onClick={addSlot}
          disabled={pending}
          className="rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          Add slot
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-coral">{error}</p> : null}
      <div className="mt-8 grid gap-4">
        {groupedSlots.map(({ tutor, slots: tutorSlots }) => (
          <div key={tutor.id} className="rounded-[1.5rem] bg-sand p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{tutor.name}</h3>
                <p className="mt-1 text-sm text-ink/70">{tutor.subject}</p>
              </div>
              <div className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">${tutor.rateAud}/hr</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {tutorSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => removeSlot(slot.id)}
                  className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-ink/75"
                >
                  {formatSlot(slot.startsAt)} x
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
