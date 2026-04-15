import { redirect } from "next/navigation";
import { AccessPanel } from "@/components/access-panel";
import { TutorShell } from "@/components/tutor-shell";
import { SiteHeader } from "@/components/site-header";
import { getTutorLessonsByTutorEmail } from "@/lib/booking-views";
import { getCurrentUserContext } from "@/lib/auth-context";
import { getTutorAvailabilityByEmail } from "@/lib/tutor-availability";

export const dynamic = "force-dynamic";

export default async function TutorPage() {
  const { email, role } = await getCurrentUserContext();

  if (role === "admin") {
    redirect("/admin");
  }

  return (
    <main>
      <SiteHeader />
      {role === "tutor" && email ? (
        <TutorShell
          email={email}
          lessons={await getTutorLessonsByTutorEmail(email)}
          slots={await getTutorAvailabilityByEmail(email)}
        />
      ) : (
        <AccessPanel title="Tutor panel" role={role} requiredRole="tutor" />
      )}
    </main>
  );
}
