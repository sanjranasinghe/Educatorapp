"use client";

import { AudioConference, LiveKitRoom, RoomAudioRenderer, StartAudio } from "@livekit/components-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CollaborativeWhiteboard } from "@/components/collaborative-whiteboard";
import { WhiteboardDemo } from "@/components/whiteboard-demo";

export function ClassroomJoin({
  initialRoomName = "lesson-brightpath-001",
  initialIdentity = "student-aisha",
  initialName = "Aisha",
  livekitEnabled = false,
  livekitUrl
}: {
  initialRoomName?: string;
  initialIdentity?: string;
  initialName?: string;
  livekitEnabled?: boolean;
  livekitUrl?: string;
}) {
  const [roomName, setRoomName] = useState(initialRoomName);
  const [identity, setIdentity] = useState(initialIdentity);
  const [name, setName] = useState(initialName);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const autoJoinedRef = useRef(false);

  const roomReady = useMemo(
    () => roomName.trim().length > 1 && identity.trim().length > 1 && name.trim().length > 1,
    [identity, name, roomName]
  );

  async function generateToken() {
    if (!roomReady || !livekitEnabled) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ roomName, identity, name })
      });

      const data = (await response.json()) as { token?: string; error?: string };

      if (!response.ok || !data.token) {
        throw new Error(data.error || "Could not generate room token.");
      }

      setToken(data.token);
    } catch (tokenError) {
      setError(tokenError instanceof Error ? tokenError.message : "Something went wrong.");
      setToken("");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!livekitEnabled || !roomReady || autoJoinedRef.current || token) {
      return;
    }

    autoJoinedRef.current = true;
    void generateToken();
  }, [livekitEnabled, roomReady, token]);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[2rem] bg-ink p-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">Audio room</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Join the booked lesson room</h1>
        <p className="mt-5 text-base leading-8 text-white/75">
          Each paid lesson has its own room name. When LiveKit is configured, this page now connects straight into the booked audio lesson inside the app.
        </p>
        <div className="mt-6 rounded-[1.4rem] bg-white/10 p-4 text-sm text-white/80">
          LiveKit configured: {livekitEnabled ? "Yes" : "No. Add LiveKit env keys first."}
        </div>
      </div>
      <div className="grid gap-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Room name
              <input value={roomName} onChange={(event) => setRoomName(event.target.value)} className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Identity
              <input value={identity} onChange={(event) => setIdentity(event.target.value)} className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Display name
              <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none" />
            </label>
            <button
              type="button"
              onClick={generateToken}
              disabled={!roomReady || !livekitEnabled || isLoading}
              className="rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isLoading ? "Connecting..." : token ? "Reconnect to room" : "Join audio lesson"}
            </button>
            {error ? <p className="text-sm text-coral">{error}</p> : null}
            {!livekitEnabled ? (
              <div className="rounded-[1.4rem] bg-sand p-4 text-sm leading-7 text-ink/75">
                LiveKit is not configured yet. Add `NEXT_PUBLIC_LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` in your environment before opening live lessons in production.
              </div>
            ) : null}
            {livekitEnabled && !token && !isLoading ? (
              <div className="rounded-[1.4rem] bg-sand p-4 text-sm leading-7 text-ink/75">
                Use the booked room details above and click join. If the page was opened from a lesson card, it should also auto-connect for you.
              </div>
            ) : null}
          </div>
        </div>
        {livekitEnabled && token && livekitUrl ? (
          <LiveKitRoom
            audio
            connect
            token={token}
            serverUrl={livekitUrl}
            video={false}
            data-lk-theme="default"
            className="grid gap-6"
            onDisconnected={() => setToken("")}
            onError={(livekitError) => setError(livekitError.message)}
          >
            <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-ink shadow-soft">
              <div className="border-b border-white/10 px-6 py-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">Live lesson</p>
                <h2 className="mt-2 text-2xl font-semibold">Audio classroom is connected</h2>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  Students and tutors can speak live here while keeping the shared whiteboard open below.
                </p>
              </div>
              <div className="bg-white">
                <AudioConference className="min-h-[28rem]" />
                <RoomAudioRenderer />
                <StartAudio label="Click to allow lesson audio" />
              </div>
            </div>
            <CollaborativeWhiteboard identity={identity} />
          </LiveKitRoom>
        ) : (
          <div className="grid gap-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Whiteboard</p>
              <h2 className="mt-3 text-2xl font-semibold">Shared board stays available</h2>
              <p className="mt-4 text-base leading-8 text-ink/75">
                The whiteboard demo remains below. Once the live room is connected, students can talk here by audio while drawing on the lesson board underneath.
              </p>
            </div>
            <WhiteboardDemo />
          </div>
        )}
      </div>
    </div>
  );
}
