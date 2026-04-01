import Link from "next/link";
import { releaseChecklist } from "@/lib/platform";

export function PlatformLinks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Production app</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">These are the next working areas to release</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/auth" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
              Auth
            </Link>
            <Link href="/book" className="rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white">
              Booking + payment
            </Link>
            <Link href="/dashboard" className="rounded-full bg-ocean px-5 py-3 text-sm font-semibold text-white">
              Dashboard
            </Link>
            <Link href="/classroom" className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink">
              Classroom
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] bg-ink p-8 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-mint">Release readiness</p>
          <div className="mt-6 grid gap-4">
            {releaseChecklist.map((item) => (
              <div key={item.title} className="rounded-[1.4rem] bg-white/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.ready ? "bg-mint text-ink" : "bg-white/15 text-white"
                    }`}
                  >
                    {item.ready ? "Configured" : "Needed"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/75">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
