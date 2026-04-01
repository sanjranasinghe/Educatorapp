import { lessonPackages, roadmap } from "@/lib/data";

export function LessonSection() {
  return (
    <section id="lessons" className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-ocean p-8 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-mint">How it works</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Simple flow for student bookings</h2>
          <div className="mt-8 space-y-5">
            {roadmap.map((item, index) => (
              <div key={item.title} className="rounded-[1.5rem] bg-white/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/75">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-6">
          {lessonPackages.map((item) => (
            <article key={item.id} className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">{item.subject}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink/60">{item.audience}</p>
                </div>
                <div className="rounded-[1.25rem] bg-sand px-5 py-4">
                  <p className="text-sm text-ink/55">Starting from</p>
                  <p className="text-2xl font-semibold">${item.priceAud} AUD</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3 text-sm text-ocean">
                <span className="rounded-full bg-mint px-3 py-1 font-semibold">{item.sessions} session{item.sessions > 1 ? "s" : ""}</span>
                <span>Includes class notes and live board support</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.outcomes.map((outcome) => (
                  <span key={outcome} className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/75">
                    {outcome}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
