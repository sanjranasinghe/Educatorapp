"use client";

import { useParticipants, useRoomInfo } from "@livekit/components-react";

function inferRole(identity: string) {
  if (identity.startsWith("tutor-")) {
    return "Tutor";
  }

  if (identity.startsWith("admin-")) {
    return "Admin";
  }

  if (identity.startsWith("parent-")) {
    return "Parent";
  }

  if (identity.startsWith("student-")) {
    return "Student";
  }

  return "Participant";
}

function formatName(identity: string, name: string) {
  if (name.trim()) {
    return name;
  }

  return identity.replace(/^(tutor|admin|parent|student)-/, "").replace(/[-.]/g, " ");
}

export function LessonRoomStatus({ localIdentity }: { localIdentity: string }) {
  const participants = useParticipants();
  const room = useRoomInfo();
  const waiting = participants.length < 2;

  return (
    <div className="rounded-[1.5rem] bg-white/10 p-4 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Room status</p>
          <p className="mt-2 text-lg font-semibold">{room.name}</p>
          <p className="mt-1 text-sm text-white/70">
            {waiting ? "Waiting for the other person to join the lesson." : `${participants.length} people are connected.`}
          </p>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${waiting ? "bg-gold text-ink" : "bg-mint text-ink"}`}>
          {waiting ? "Waiting" : "Ready"}
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {participants.map((participant) => {
          const isLocal = participant.identity === localIdentity;
          const role = inferRole(participant.identity);

          return (
            <div key={participant.identity} className="rounded-[1.1rem] bg-white/10 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{formatName(participant.identity, participant.name || "")}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/60">{role}</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-[11px] font-semibold ${isLocal ? "bg-ocean text-white" : "bg-white text-ink"}`}>
                  {isLocal ? "You" : "Connected"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
