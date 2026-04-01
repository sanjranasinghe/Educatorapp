import { BookingForm } from "@/components/booking-form";
import { ClassroomPreview } from "@/components/classroom-preview";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { LessonSection } from "@/components/lesson-section";
import { PlatformLinks } from "@/components/platform-links";
import { SiteHeader } from "@/components/site-header";
import { SubjectGrid } from "@/components/subject-grid";
import { TutorSection } from "@/components/tutor-section";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <SubjectGrid />
      <TutorSection />
      <LessonSection />
      <PlatformLinks />
      <BookingForm />
      <ClassroomPreview />
      <Footer />
    </main>
  );
}
