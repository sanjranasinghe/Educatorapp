import { CheckoutForm } from "@/components/checkout-form";
import { SiteHeader } from "@/components/site-header";

export default function BookPage() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <CheckoutForm />
      </div>
    </main>
  );
}
