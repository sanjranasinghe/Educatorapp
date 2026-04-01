import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ensureBookingFromStripeSession } from "@/lib/bookings";
import { env, serviceStatus } from "@/lib/env";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!serviceStatus.stripe || !env.stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured. Add STRIPE_WEBHOOK_SECRET first." },
      { status: 503 }
    );
  }

  const stripe = getStripeClient();
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

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
    }
  }

  return NextResponse.json({ received: true });
}
