import Link from "next/link";

import MobileDrawerMenu from "./mobile-drawer-menu";

const homeNavItems = [
  {
    href: "/login",
    label: "Log in",
  },
  {
    href: "/signup",
    label: "Create account",
  },
  {
    href: "/create",
    label: "Create",
  },
  {
    href: "/library",
    label: "Library",
  },
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-5 sm:px-10 lg:px-12 lg:py-4">
      <header className="flex items-center justify-between py-3 lg:py-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
            DwarfURL
          </p>
        </div>
        <nav className="hidden items-center gap-2.5 text-sm font-medium text-slate-700 md:flex">
          {homeNavItems.map((item) => (
            <Link
              className="rounded-full px-3.5 py-2 hover:bg-white/70"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileDrawerMenu items={[...homeNavItems]} />
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
