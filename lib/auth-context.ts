import { redirect } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { serviceStatus } from "@/lib/env";

type CurrentUserContext = {
  email: string | null;
  role: string | null;
  user: Awaited<ReturnType<NonNullable<Awaited<ReturnType<typeof getSupabaseServerClient>>>["auth"]["getUser"]>>["data"]["user"] | null;
};

function readNullableString(value: unknown) {
  return typeof value === "string" ? value : null;
}

export async function getCurrentUserContext(): Promise<CurrentUserContext> {
  if (!serviceStatus.supabase) {
    return {
      email: null,
      role: null,
      user: null
    };
  }

  const supabase = await getSupabaseServerClient();
  const { data } = await supabase!.auth.getUser();

  if (!data.user) {
    redirect("/auth");
  }

  const email = data.user.email ?? null;
  const admin = getSupabaseAdminClient();
  const profile =
    email && admin
      ? await admin.from("profiles").select("role").eq("email", email).maybeSingle()
      : { data: null as { role?: unknown } | null };

  return {
    email,
    role: readNullableString(profile.data?.role),
    user: data.user
  };
}
