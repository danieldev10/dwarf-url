import Link from "next/link";

const highlights = [
  {
    title: "Create short links",
    text: "Users paste a long URL and receive a compact slug they can share.",
  },
  {
    title: "Keep a library",
    text: "Each signed-in user sees the links they created in one place.",
  },
  {
    title: "Grow later",
    text: "We can add clicks, analytics, and custom slugs after the basics work.",
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
            Make URLs Shorter
          </p>
        </div>
        <nav className="flex items-center gap-3 text-sm font-medium text-slate-700">
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
            Starter phase: landing page first, database next
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Short links without the clutter
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Turn long URLs into clean, memorable links and keep them organized
              in one library.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              This first version gives your project a real identity instead of
              the default Next.js placeholder. Next, we will connect a
              PostgreSQL database, save links per user, and add account-based
              library pages.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              href="/create"
            >
              Open the create page
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
              href="/library"
            >
              Preview the library page
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
              <span>Example flow</span>
              <span>Step 1</span>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
                  Original URL
                </p>
                <p className="mt-2 break-all rounded-2xl bg-white/10 px-4 py-3 text-sm leading-7 text-slate-100">
                  https://www.example.com/articles/how-to-start-building-a-simple-url-shortener
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
                  Short URL
                </p>
                <p className="mt-2 rounded-2xl bg-cyan-400/10 px-4 py-3 font-mono text-sm text-cyan-200">
                  dwarfurl.app/go/ab12xy
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">What comes next?</p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
                  <li>1. Add PostgreSQL and Prisma.</li>
                  <li>2. Store each link with the user who created it.</li>
                  <li>3. Build auth and the personal library page.</li>
                  <li>4. Redirect short slugs to the original URL.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
