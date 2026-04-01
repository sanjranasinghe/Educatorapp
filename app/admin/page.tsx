import { redirect } from "next/navigation";
import { AccessPanel } from "@/components/access-panel";
import { AdminShell } from "@/components/admin-shell";
import { SiteHeader } from "@/components/site-header";
import { getAvailableTutorsAndSlots } from "@/lib/availability";
import { getAllBookingsForAdmin } from "@/lib/booking-views";
import { getCurrentUserContext } from "@/lib/auth-context";

export default async function AdminPage() {
  const { role } = await getCurrentUserContext();

  if (role === "tutor") {
    redirect("/tutor");
  }

  if (role !== "admin") {
    return (
      <main>
        <SiteHeader />
        <AccessPanel title="Admin panel" role={role} requiredRole="admin" />
      </main>
    );
  }

  const [bookings, availability] = await Promise.all([getAllBookingsForAdmin(), getAvailableTutorsAndSlots()]);

  return (
    <main>
      <SiteHeader />
      <AdminShell bookings={bookings} tutors={availability.tutors} slots={availability.slots} />
    </main>
  );
}
