import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ensureBookingFromStripeSession } from "@/lib/bookings";
import { serviceStatus } from "@/lib/env";
import { getStripeClient } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;
  let bookingCreated = false;
  let message = "Payment completed. Next, the app should create the booking record and share the classroom link.";

  if (serviceStatus.stripe && serviceStatus.supabase && sessionId) {
    const stripe = getStripeClient();
    const session = await stripe!.checkout.sessions.retrieve(sessionId);

    if (
      session.payment_status === "paid" &&
      session.customer_email &&
      session.metadata?.packageId &&
      session.metadata?.studentName &&
      session.metadata?.tutorId &&
      session.metadata?.scheduledAt
    ) {
      await ensureBookingFromStripeSession({
        sessionId: session.id,
        parentName: session.metadata.parentName,
        studentName: session.metadata.studentName,
        email: session.customer_email,
        packageId: session.metadata.packageId,
        tutorId: session.metadata.tutorId,
        scheduledAt: session.metadata.scheduledAt,
        studentYear: session.metadata.studentYear
      });
      bookingCreated = true;
      message = "Payment completed and the scheduled booking has been created in Supabase. The parent booking, year level, tutor, and lesson time should now appear on the dashboard.";
    }
  }

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Payment success</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Lesson payment completed</h1>
          <p className="mt-5 text-base leading-8 text-ink/75">{message}</p>
          <div className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
            {bookingCreated ? "Booking saved" : "Waiting for configured payment flow"}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
              Go to dashboard
            </Link>
            <Link href="/classroom" className="rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white">
              Open classroom
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
