import { AccessToken } from "livekit-server-sdk";
import { env, serviceStatus } from "@/lib/env";

export async function createLessonRoomToken({
  roomName,
  identity,
  name
}: {
  roomName: string;
  identity: string;
  name: string;
}) {
  if (!serviceStatus.livekit) {
    throw new Error("LiveKit environment variables are not configured.");
  }

  const token = new AccessToken(env.livekitApiKey, env.livekitApiSecret, {
    identity,
    name,
    ttl: "1h"
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true
  });

  return token.toJwt();
}
