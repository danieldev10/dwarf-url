import Link from "next/link";

const highlights = [
  {
    title: "Shorten in seconds",
    text: "Paste any long URL and get a clean link that is ready to share right away.",
  },
  {
    title: "Stay organized",
    text: "Add simple titles so your saved links stay easy to scan and find later.",
  },
  {
    title: "See what gets opened",
    text: "Track click counts for every short link from one personal library.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-5 sm:px-10 lg:px-12 lg:py-4">
      <header className="flex items-center justify-between py-3 lg:py-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
            DwarfURL
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Short links for work, docs, campaigns, and everyday sharing.
          </p>
        </div>
        <nav className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
          <Link className="rounded-full px-3.5 py-2 hover:bg-white/70" href="/login">
            Log in
          </Link>
          <Link className="rounded-full px-3.5 py-2 hover:bg-white/70" href="/signup">
            Create account
          </Link>
          <Link className="rounded-full px-3.5 py-2 hover:bg-white/70" href="/create">
            Create
          </Link>
          <Link className="rounded-full px-3.5 py-2 hover:bg-white/70" href="/library">
            Library
          </Link>
        </nav>
      </header>

      <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-7 lg:py-6">
        <div className="space-y-6 lg:space-y-5">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Short links without the clutter
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.02]">
              Shorten long URLs, share them anywhere, and keep every link in one place.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 lg:max-w-xl">
              Turn messy URLs into clean links, save them to your library, and come back anytime to reuse or review them.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white! visited:text-white! transition hover:bg-slate-800"
              href="/create"
            >
              Create a short link
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
              href="/library"
            >
              Open your library
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)] backdrop-blur"
              >
                <h2 className="text-[0.95rem] font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-2.5 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <section className="rounded-4xl border border-slate-200 bg-slate-950 p-5 text-slate-50 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.65)] lg:p-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 lg:p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-cyan-200">
              <span>Built for everyday sharing</span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Why people use DwarfURL</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  <li>1. Share cleaner links in messages, docs, and social posts.</li>
                  <li>2. Save your most-used URLs once and find them faster later.</li>
                  <li>3. Keep an eye on clicks without digging through old notes.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-sm font-semibold text-cyan-100">Start small</p>
                <p className="mt-3 text-sm leading-6 text-cyan-50">
                  Create one short link today, then keep building your personal library as you go.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
