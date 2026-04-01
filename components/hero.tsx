export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
      <div className="space-y-8">
        <div className="inline-flex rounded-full border border-ocean/15 bg-white/70 px-4 py-2 text-sm text-ocean shadow-soft">
          Perth tutoring for WA Years 1-8
        </div>
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
            Maths First, English Still Available
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
            A Perth tutoring app where parents book maths lessons and students learn live by audio.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-ink/75">
            BrightPath is now positioned for a Western Australia launch with parent-led booking, Year 1-8 maths support, tutor audio rooms, and whiteboard teaching.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a
            href="#book"
            className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e5604b]"
          >
            Book maths support
          </a>
          <a
            href="#classroom"
            className="rounded-full border border-ink/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-ocean hover:text-ocean"
          >
            View classroom
          </a>
        </div>
      </div>
      <div className="rounded-[2rem] bg-ink p-6 text-white shadow-soft">
        <div className="rounded-[1.5rem] bg-white/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Today&apos;s lesson room</p>
              <p className="text-xl font-semibold">Year 5 Maths Problem Solving</p>
            </div>
            <div className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">
              Live audio
            </div>
          </div>
          <div className="space-y-3 rounded-[1.25rem] bg-white p-4 text-ink">
            <div className="flex items-center justify-between rounded-2xl bg-sand px-4 py-3">
              <span className="text-sm font-medium">Teacher microphone</span>
              <span className="rounded-full bg-ocean px-2 py-1 text-xs font-semibold text-white">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-sand px-4 py-3">
              <span className="text-sm font-medium">Student microphone</span>
              <span className="rounded-full bg-gold px-2 py-1 text-xs font-semibold text-ink">
                Joining
              </span>
            </div>
            <div className="board-grid min-h-52 rounded-[1.25rem] border border-dashed border-ink/10 bg-white p-5">
              <p className="text-sm text-ink/60">Shared maths board example</p>
              <div className="mt-5 flex gap-3">
                <div className="h-3 w-24 rounded-full bg-coral" />
                <div className="h-3 w-16 rounded-full bg-ocean" />
              </div>
              <div className="mt-8 max-w-72 rounded-2xl bg-mint p-4 text-sm font-medium text-ink">
                Tutor explains fractions, number lines, and worded problems while both people talk by audio.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
