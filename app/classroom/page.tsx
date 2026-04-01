import { ClassroomJoin } from "@/components/classroom-join";
import { SiteHeader } from "@/components/site-header";
import { env, serviceStatus } from "@/lib/env";

export default async function ClassroomPage({
  searchParams
}: {
  searchParams: Promise<{ room?: string; identity?: string; name?: string }>;
}) {
  const params = await searchParams;

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <ClassroomJoin
          initialRoomName={params.room || "lesson-brightpath-001"}
          initialIdentity={params.identity || "student-aisha"}
          initialName={params.name || "Aisha"}
          livekitEnabled={serviceStatus.livekit}
          livekitUrl={env.livekitUrl}
        />
      </div>
    </main>
  );
}
