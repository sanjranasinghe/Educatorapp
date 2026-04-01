"use client";

import { useDataChannel, useParticipants } from "@livekit/components-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };

type WhiteboardMessage =
  | { type: "stroke-start"; x: number; y: number; color: string; sender: string }
  | { type: "stroke-move"; x: number; y: number; color: string; sender: string }
  | { type: "stroke-end"; sender: string }
  | { type: "clear"; sender: string };

const WHITEBOARD_TOPIC = "whiteboard";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function isWhiteboardMessage(value: unknown): value is WhiteboardMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.type === "string" &&
    typeof candidate.sender === "string" &&
    (candidate.type === "clear" ||
      (typeof candidate.x === "number" &&
        typeof candidate.y === "number" &&
        typeof candidate.color === "string"))
  );
}

export function CollaborativeWhiteboard({ identity }: { identity: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const remoteDrawersRef = useRef(new Map<string, string>());
  const [color, setColor] = useState("#f97360");
  const participants = useParticipants();

  const { send } = useDataChannel(WHITEBOARD_TOPIC, (message) => {
    try {
      const parsed = JSON.parse(decoder.decode(message.payload)) as unknown;

      if (!isWhiteboardMessage(parsed) || parsed.sender === identity) {
        return;
      }

      applyWhiteboardMessage(parsed);
    } catch {
      // Ignore malformed whiteboard packets.
    }
  });

  const participantLabel = useMemo(() => {
    if (participants.length <= 1) {
      return "Waiting for the other person to join the board";
    }

    return `${participants.length} people in the lesson room`;
  }, [participants.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 4;
  }, []);

  function getContext() {
    return canvasRef.current?.getContext("2d") ?? null;
  }

  function pointFromEvent(event: React.PointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function publish(message: WhiteboardMessage, reliable = false) {
    void send(encoder.encode(JSON.stringify(message)), {
      reliable,
      topic: WHITEBOARD_TOPIC
    });
  }

  function applyWhiteboardMessage(message: WhiteboardMessage) {
    const context = getContext();

    if (!context) {
      return;
    }

    if (message.type === "clear") {
      remoteDrawersRef.current.clear();
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      return;
    }

    if (message.type === "stroke-start") {
      remoteDrawersRef.current.set(message.sender, message.color);
      context.beginPath();
      context.strokeStyle = message.color;
      context.moveTo(message.x, message.y);
      return;
    }

    if (message.type === "stroke-move") {
      context.strokeStyle = remoteDrawersRef.current.get(message.sender) || message.color;
      context.lineTo(message.x, message.y);
      context.stroke();
      return;
    }

    remoteDrawersRef.current.delete(message.sender);
  }

  function startDraw(event: React.PointerEvent<HTMLCanvasElement>) {
    const context = getContext();

    if (!context) {
      return;
    }

    const point = pointFromEvent(event);
    drawingRef.current = true;
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(point.x, point.y);

    publish(
      {
        type: "stroke-start",
        x: point.x,
        y: point.y,
        color,
        sender: identity
      },
      true
    );
  }

  function moveDraw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) {
      return;
    }

    const context = getContext();

    if (!context) {
      return;
    }

    const point = pointFromEvent(event);
    context.lineTo(point.x, point.y);
    context.stroke();

    publish({
      type: "stroke-move",
      x: point.x,
      y: point.y,
      color,
      sender: identity
    });
  }

  function endDraw() {
    if (!drawingRef.current) {
      return;
    }

    drawingRef.current = false;
    publish(
      {
        type: "stroke-end",
        sender: identity
      },
      true
    );
  }

  function clearCanvas() {
    const context = getContext();

    if (!context || !canvasRef.current) {
      return;
    }

    remoteDrawersRef.current.clear();
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    publish(
      {
        type: "clear",
        sender: identity
      },
      true
    );
  }

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Shared whiteboard</p>
          <p className="mt-1 text-sm text-ink/65">{participantLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {["#f97360", "#1f6f78", "#f4c95d"].map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => setColor(swatch)}
                className={`h-8 w-8 rounded-full border ${color === swatch ? "border-ink" : "border-black/5"}`}
                style={{ backgroundColor: swatch }}
                aria-label={`Use ${swatch} pen`}
              />
            ))}
          </div>
          <button type="button" onClick={clearCanvas} className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink">
            Clear board
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={900}
        height={420}
        className="board-grid h-[420px] w-full touch-none rounded-[1.5rem] border border-ink/10 bg-white"
        onPointerDown={startDraw}
        onPointerMove={moveDraw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
      />
    </div>
  );
}
