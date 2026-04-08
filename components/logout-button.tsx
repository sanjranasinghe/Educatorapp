"use client";

import { useState } from "react";
import {
  clearSupabaseBrowserSession,
  getSupabaseBrowserClient,
  resetSupabaseBrowserClient,
} from "@/lib/supabase/browser";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();

    setPending(true);

    try {
      if (supabase) {
        await supabase.auth.signOut({ scope: "local" });
      }
    } catch {
      // Even if local sign-out fails, still send the user back to auth.
    } finally {
      clearSupabaseBrowserSession();
      resetSupabaseBrowserClient();
      window.location.replace("/auth");
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-coral hover:text-coral disabled:opacity-60"
    >
      {pending ? "Logging out..." : "Logout"}
    </button>
  );
}
