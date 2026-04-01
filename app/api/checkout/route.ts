import { NextResponse } from "next/server";
import { lessonPackages, tutors } from "@/lib/data";
import { env, serviceStatus } from "@/lib/env";
import { getStripeClient } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validation";
import { ensureLessonPackagesSeeded } from "@/lib/bookings";
import { getAvailableTutorsAndSlots } from "@/lib/availability";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });
  }

  const availability = await getAvailableTutorsAndSlots();
  const selectedPackage = lessonPackages.find((item) => item.id === parsed.data.packageId);
  const selectedTutor = tutors.find((item) => item.id === parsed.data.tutorId);
  const selectedSlot = availability.slots.find(
    (slot) => slot.tutorId === parsed.data.tutorId && slot.startsAt === parsed.data.scheduledAt
  );

  if (!selectedPackage || !selectedTutor || !selectedSlot) {
    return NextResponse.json({ error: "Tutor, package, or lesson slot not found." }, { status: 404 });
  }

  if (!serviceStatus.stripe) {
    return NextResponse.json(
      {
        error: "Stripe is not configured yet. Add Stripe env keys before taking payments."
      },
      { status: 503 }
    );
  }

  await ensureLessonPackagesSeeded();

  const stripe = getStripeClient();

  const session = await stripe!.checkout.sessions.create({
    mode: "payment",
    success_url: `${env.appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.appUrl}/cancel`,
    customer_email: parsed.data.email,
    metadata: {
      parentName: parsed.data.parentName,
      studentName: parsed.data.studentName,
      studentYear: parsed.data.studentYear,
      subject: parsed.data.subject,
      goals: parsed.data.goals,
      packageId: selectedPackage.id,
      tutorId: selectedTutor.id,
      scheduledAt: selectedSlot.startsAt
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "aud",
          unit_amount: selectedPackage.priceAud * 100,
          product_data: {
            name: `${selectedPackage.title} with ${selectedTutor.name}`,
            description: `${parsed.data.studentYear} ${selectedPackage.subject} tutoring in Perth time on ${selectedSlot.startsAt}`
          }
        }
      }
    ]
  });

  return NextResponse.json({ url: session.url });
}
