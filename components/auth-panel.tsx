"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Mode = "sign-in" | "sign-up";

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const fullName = String(formData.get("fullName") || "");
    const role = String(formData.get("role") || "student");
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase is not configured yet. Add env keys to enable real login.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role
            }
          }
        });

        if (error) {
          throw error;
        }

        setMessage("Account created. Check your email for verification if confirmation is enabled.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          throw error;
        }

        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] bg-ink p-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-mint">Accounts</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Create logins for students, parents, tutors, and admin.</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
          This screen is ready for Supabase email-password auth. You can start simple now and add Google login later.
        </p>
      </div>
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              mode === "sign-in" ? "bg-ink text-white" : "bg-sand text-ink"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              mode === "sign-up" ? "bg-coral text-white" : "bg-sand text-ink"
            }`}
          >
            Sign up
          </button>
        </div>
        <form
          action={async (formData) => {
            await handleSubmit(formData);
          }}
          className="mt-6 grid gap-4"
        >
          {mode === "sign-up" ? (
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Full name
              <input
                name="fullName"
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
                placeholder="Parent or tutor name"
              />
            </label>
          ) : null}
          {mode === "sign-up" ? (
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Role
              <select
                name="role"
                defaultValue="student"
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          ) : null}
          <label className="grid gap-2 text-sm font-medium text-ink/80">
            Email
            <input
              name="email"
              type="email"
              className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
              placeholder="name@email.com"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink/80">
            Password
            <input
              name="password"
              type="password"
              className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
              placeholder="At least 8 characters"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Working..." : mode === "sign-up" ? "Create account" : "Sign in"}
          </button>
          {message ? <p className="text-sm text-ocean">{message}</p> : null}
        </form>
      </div>
    </div>
  );
}
