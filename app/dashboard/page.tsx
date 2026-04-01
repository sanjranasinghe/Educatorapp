import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { SiteHeader } from "@/components/site-header";
import { DashboardLesson, getDashboardLessonsByEmail, ensureProfileForEmail } from "@/lib/bookings";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { serviceStatus } from "@/lib/env";

export default async function DashboardPage() {
  let email: string | null = null;
  let lessons: DashboardLesson[] = [];

  if (serviceStatus.supabase) {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase!.auth.getUser();

    if (!data.user) {
      redirect("/auth");
    }

    email = data.user.email ?? null;

    if (email) {
      await ensureProfileForEmail({
        email,
        fullName: (data.user.user_metadata.full_name as string | undefined) || email.split("@")[0],
        role: ((data.user.user_metadata.role as "student" | "parent" | "tutor" | "admin" | undefined) || "student")
      });
      lessons = await getDashboardLessonsByEmail(email);
    }
  }

  return (
    <main>
      <SiteHeader />
      <DashboardShell email={email} lessons={lessons} />
    </main>
  );
}
