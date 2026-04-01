export function BookingForm() {
  return (
    <section id="book" className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Booking</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Parent-led lesson request for Years 1-8</h2>
          <form className="mt-8 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Parent or guardian name
              <input className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none" placeholder="Parent full name" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Parent email
              <input className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none" placeholder="family@email.com" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Student name
              <input className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none" placeholder="Student full name" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Year level
              <select className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none">
                <option>Year 1</option>
                <option>Year 2</option>
                <option>Year 3</option>
                <option>Year 4</option>
                <option>Year 5</option>
                <option>Year 6</option>
                <option>Year 7</option>
                <option>Year 8</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Subject
              <select className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none">
                <option>Maths</option>
                <option>English</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Lesson type
              <select className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none">
                <option>Maths private 1 hour</option>
                <option>Maths 4 lesson pack</option>
                <option>English 4 lesson pack</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink/80 md:col-span-2">
              Learning goals
              <textarea
                className="min-h-28 rounded-2xl border border-ink/10 bg-sand px-4 py-3 outline-none"
                placeholder="Example: improve Year 5 fractions, multiplication confidence, and worded problems"
              />
            </label>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] bg-ink p-5 text-white">
              <div>
                <p className="text-sm text-white/70">Launch direction</p>
                <p className="text-lg font-semibold">Maths-first for Perth families, with English still available as a second learning path.</p>
              </div>
              <button
                type="button"
                className="rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white"
              >
                Prototype submit
              </button>
            </div>
          </form>
        </div>
        <div className="rounded-[2rem] bg-sand p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Recommended launch setup</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.5rem] bg-white p-5">
              <h3 className="text-lg font-semibold">Western Australia fit</h3>
              <p className="mt-2 text-sm leading-7 text-ink/75">
                Use Years 1-8 maths pathways, Perth timezone defaults, and parent-ready lesson updates after each class.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5">
              <h3 className="text-lg font-semibold">Parent buyer workflow</h3>
              <p className="mt-2 text-sm leading-7 text-ink/75">
                Capture parent contact details, student year level, and learning goals before checkout and scheduling.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5">
              <h3 className="text-lg font-semibold">Maths lesson delivery</h3>
              <p className="mt-2 text-sm leading-7 text-ink/75">
                Combine audio teaching with the shared board for fractions, number lines, place value, and worked examples.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
