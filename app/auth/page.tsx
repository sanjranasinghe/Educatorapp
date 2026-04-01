import { AuthPanel } from "@/components/auth-panel";
import { SiteHeader } from "@/components/site-header";

export default function AuthPage() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <AuthPanel />
      </div>
    </main>
  );
}
