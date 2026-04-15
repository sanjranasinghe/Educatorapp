import { getPublicTutors } from "@/lib/tutor-directory";

export async function TutorSection() {
  const tutors = await getPublicTutors();

  return (
    <section id="tutors" className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Tutors</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Students can choose the right teacher</h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-ink/70">
          Each tutor profile can later connect to real availability, ratings, and lesson history.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {tutors.map((tutor) => (
          <article key={tutor.id} className="rounded-[2rem] bg-white p-7 shadow-soft">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{tutor.name}</h3>
                <p className="mt-1 text-sm text-ink/60">{tutor.subject}</p>
              </div>
              <div className="rounded-full bg-sand px-3 py-2 text-right text-sm">
                <p className="font-semibold">${tutor.rateAud} AUD</p>
                <p className="text-ink/55">per hour</p>
              </div>
            </div>
            <p className="text-sm text-ink/60">{tutor.experience}</p>
            <p className="mt-4 leading-7 text-ink/75">{tutor.blurb}</p>
            <p className="mt-4 text-sm font-medium text-ocean">{tutor.accent}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {tutor.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/75">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
