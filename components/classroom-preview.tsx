const checklist = [
  "Teacher and student join a private room",
  "Audio call runs without video",
  "Shared whiteboard supports pen and lesson examples",
  "Tutor can add notes, tasks, and homework after class"
];

export function ClassroomPreview() {
  return (
    <section id="classroom" className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-[2.5rem] bg-ink p-8 text-white shadow-soft md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">Online session</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Audio-first lesson room with whiteboard</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
              You said you do not need video call. This app is designed around live audio plus a board where the tutor can write, draw, and explain examples.
            </p>
            <div className="mt-8 space-y-3">
              {checklist.map((item) => (
                <div key={item} className="rounded-[1.25rem] bg-white/10 px-4 py-3 text-sm text-white/90">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-5 text-ink">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div>
                <p className="text-sm text-ink/60">Room BRIGHT-204</p>
                <h3 className="text-xl font-semibold">Fraction lesson with audio support</h3>
              </div>
              <button className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white">
                Join audio room
              </button>
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-[0.34fr_0.66fr]">
              <aside className="space-y-4 rounded-[1.5rem] bg-sand p-4">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">Participants</p>
                  <p className="mt-3 text-sm">Tutor: Liam</p>
                  <p className="mt-1 text-sm">Student: Noah</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">Tools</p>
                  <p className="mt-3 text-sm">Mic on/off</p>
                  <p className="mt-1 text-sm">Pen colors</p>
                  <p className="mt-1 text-sm">Lesson notes</p>
                </div>
              </aside>
              <div className="board-grid min-h-80 rounded-[1.5rem] border border-ink/10 bg-white p-6">
                <div className="flex gap-2">
                  <div className="h-4 w-4 rounded-full bg-coral" />
                  <div className="h-4 w-4 rounded-full bg-ocean" />
                  <div className="h-4 w-4 rounded-full bg-gold" />
                </div>
                <div className="mt-10 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-coral/10 p-4 text-sm">
                    Example: 3/4 + 1/4 = 1 whole
                  </div>
                  <div className="rounded-2xl bg-mint p-4 text-sm">
                    Teacher can draw circles, numbers, and arrows while speaking.
                  </div>
                </div>
                <div className="mt-8 h-32 rounded-[1.25rem] border-2 border-dashed border-ocean/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
