import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function CancelPage() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Checkout cancelled</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">The lesson booking was not completed</h1>
          <p className="mt-5 text-base leading-8 text-ink/75">
            The user can come back and try again any time.
          </p>
          <div className="mt-8">
            <Link href="/book" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
              Return to booking
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
