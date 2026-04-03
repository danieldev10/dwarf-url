import Link from "next/link";

const highlights = [
  {
    title: "Create short links",
    text: "Users paste a long URL and receive a compact slug they can share right away.",
  },
  {
    title: "Keep a library",
    text: "Each signed-in user sees only the links they created, with click counts included.",
  },
  {
    title: "Hosted database",
    text: "Supabase hosts PostgreSQL while DwarfURL handles auth and link generation itself.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-6 sm:px-10 lg:px-12">
      <header className="flex items-center justify-between py-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
            DwarfURL
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Make URLs shorter, keep them organized, and access them from your personal library.
          </p>
        </div>
        <nav className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <Link className="rounded-full px-4 py-2 hover:bg-white/70" href="/login">
            Log in
          </Link>
          <Link className="rounded-full px-4 py-2 hover:bg-white/70" href="/signup">
            Create account
          </Link>
          <Link className="rounded-full px-4 py-2 hover:bg-white/70" href="/create">
            Create
          </Link>
          <Link className="rounded-full px-4 py-2 hover:bg-white/70" href="/library">
            Library
          </Link>
        </nav>
      </header>

      <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800">
            Core shortener flow is live.
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Short links without the clutter
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Turn long URLs into clean, memorable links and keep them organized in one library.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              DwarfURL now has a hosted Postgres database, custom account auth, a real create-link form, a per-user library, and working short-code redirects.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold !text-white visited:!text-white transition hover:bg-slate-800"
              href="/create"
            >
              Create a short link
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
              href="/library"
            >
              Open your library
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)] backdrop-blur"
              >
                <h2 className="text-base font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-slate-50 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.65)]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-cyan-200">
              <span>Build progress</span>
              <span>Step 4</span>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Already done</p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
                  <li>1. Next.js app scaffolded.</li>
                  <li>2. Prisma connected to Supabase Postgres.</li>
                  <li>3. Custom auth wired into the app router.</li>
                  <li>4. Users can create and open short links.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-sm font-semibold text-cyan-100">Next milestone</p>
                <p className="mt-3 text-sm leading-7 text-cyan-50">
                  Add link management tools such as editing, deleting, or copying links, then expand into click analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
