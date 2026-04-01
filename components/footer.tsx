export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-[2rem] border border-black/5 bg-white/80 p-8 text-sm text-ink/70 shadow-soft">
        <p className="text-lg font-semibold text-ink">Next product step</p>
        <p className="mt-3 max-w-3xl leading-7">
          This starter gives you the product structure. From here, we can add authentication,
          tutor dashboards, student dashboards, Stripe checkout, and real audio rooms for deployment.
        </p>
      </div>
    </footer>
  );
}
