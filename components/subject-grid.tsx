const subjects = [
  {
    title: "Maths",
    badge: "Launch focus",
    description: "WA-aligned Years 1-8 maths support covering number, fractions, problem solving, and confidence."
  },
  {
    title: "English",
    badge: "Also available",
    description: "Speaking, grammar, reading, writing, pronunciation, and school support remain in the app."
  }
];

export function SubjectGrid() {
  return (
    <section id="subjects" className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Subjects</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Start with maths for Perth families, then expand</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {subjects.map((subject) => (
          <article
            key={subject.title}
            className="rounded-[2rem] border border-black/5 bg-white/80 p-8 shadow-soft"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="inline-flex rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">
                {subject.title}
              </div>
              <div className="inline-flex rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink/70">
                {subject.badge}
              </div>
            </div>
            <p className="max-w-md text-lg leading-8 text-ink/75">{subject.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
