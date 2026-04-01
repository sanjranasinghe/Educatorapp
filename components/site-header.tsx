import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
  { href: "/#subjects", label: "Subjects" },
  { href: "/#tutors", label: "Tutors" },
  { href: "/#lessons", label: "Lessons" },
  { href: "/classroom", label: "Classroom" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tutor", label: "Tutor" },
  { href: "/admin", label: "Admin" }
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          BrightPath Tutors
        </Link>
        <nav className="hidden gap-6 text-sm text-ink/80 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-coral">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LogoutButton />
          <Link
            href="/book"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ocean"
          >
            Book lesson
          </Link>
        </div>
      </div>
    </header>
  );
}
