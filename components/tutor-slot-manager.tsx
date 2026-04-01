"use client";

import { useState } from "react";

type TutorSlot = {
  id: string;
  tutorId: string;
  startsAt: string;
};

function formatSlot(startsAt: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(startsAt));
}

export function TutorSlotManager({
  initialSlots
}: {
  initialSlots: TutorSlot[];
}) {
  const [slots, setSlots] = useState(initialSlots);
  const [startsAt, setStartsAt] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function addSlot() {
    if (!startsAt) {
      setError("Choose a date and time first.");
      return;
    }

    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/tutor/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ startsAt: new Date(startsAt).toISOString() })
      });

      const data = (await response.json()) as { error?: string; slot?: TutorSlot };

      if (!response.ok || !data.slot) {
        throw new Error(data.error || "Could not create slot.");
      }

      setSlots((current) => [...current, data.slot!]);
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
      const response = await fetch("/api/tutor/availability", {
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
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Your availability</p>
      <h2 className="mt-2 text-2xl font-semibold">Add and remove your teaching slots</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
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
      <div className="mt-8 flex flex-wrap gap-2">
        {slots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => removeSlot(slot.id)}
            className="rounded-full bg-sand px-3 py-2 text-xs font-semibold text-ink/75"
          >
            {formatSlot(slot.startsAt)} x
          </button>
        ))}
      </div>
    </section>
  );
}
