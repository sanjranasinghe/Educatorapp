import Link from "next/link";

export function AccessPanel({
  title,
  role,
  requiredRole
}: {
  title: string;
  role: string | null;
  requiredRole: "admin" | "tutor";
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-[2rem] bg-white p-10 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Access limited</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-5 text-base leading-8 text-ink/75">
          This page is only available to {requiredRole} accounts.
          {role ? ` Your current role is ${role}.` : " Please sign in to continue."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
            Go to dashboard
          </Link>
          <Link href="/" className="rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
