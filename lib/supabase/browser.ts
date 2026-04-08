"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env, serviceStatus } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (!serviceStatus.supabase) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(env.supabaseUrl!, env.supabaseAnonKey!);
  }

  return browserClient;
}

export function resetSupabaseBrowserClient() {
  browserClient = null;
}

export function clearSupabaseBrowserSession() {
  if (typeof window === "undefined") {
    return;
  }

  const projectRef = env.supabaseUrl?.match(/^https:\/\/([^.]+)\.supabase\.co$/)?.[1];
  const storageMatchers = [
    "supabase.auth.token",
    projectRef ? `sb-${projectRef}-auth-token` : null,
    projectRef ? `sb-${projectRef}-auth-token-code-verifier` : null,
  ].filter(Boolean) as string[];

  const clearStorage = (storage: Storage) => {
    const keysToRemove: string[] = [];

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);

      if (!key) {
        continue;
      }

      if (storageMatchers.some((matcher) => key.includes(matcher))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => storage.removeItem(key));
  };

  clearStorage(window.localStorage);
  clearStorage(window.sessionStorage);
}
