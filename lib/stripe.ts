import Stripe from "stripe";
import { env, serviceStatus } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!serviceStatus.stripe) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey!);
  }

  return stripeClient;
}
