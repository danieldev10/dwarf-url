import Link from "next/link";

import MobileDrawerMenu from "./mobile-drawer-menu";

const homeNavItems = [
  {
    href: "/login",
    label: "Log in",
  },
  {
    href: "/signup",
    label: "Sign up",
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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-1 flex-col px-6 py-5 sm:px-10 lg:px-12 lg:py-4">
      <header className="flex items-center justify-between py-3 lg:py-2">
        <div>
          <p className="text-sm font-semibold tracking-[0.2px] text-white">
            DwarfURL
          </p>
        </div>
        <nav className="hidden items-center gap-2.5 text-sm font-medium md:flex">
          {homeNavItems.map((item) => (
            <Link
              className="ray-nav-link px-3.5 py-2"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileDrawerMenu items={[...homeNavItems]} />
      </header>

      <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
        <div className="space-y-7">
          <div className="space-y-5">
            <p className="ray-eyebrow">
              Short links without the clutter
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[0px] text-white sm:text-5xl lg:text-[3.75rem]">
              Shorten long URLs, share them anywhere, and keep every link in one place.
            </h1>
            <p className="max-w-xl text-base font-medium leading-7 text-[#9c9c9d]">
              A small, fast workspace for the links you share every day.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="ray-button-primary px-5 py-3 text-sm"
              href="/create"
            >
              Create a short link
            </Link>
            <Link
              className="ray-button-secondary px-5 py-3 text-sm"
              href="/library"
            >
              Open your library
            </Link>
          </div>

        </div>

        <section className="ray-card-float relative overflow-hidden rounded-2xl p-4 text-[#f9f9f9] lg:p-5">
          <div className="ray-red-stripes pointer-events-none absolute -right-16 -top-16 h-56 w-56 rotate-12 rounded-2xl opacity-20" />
          <div className="relative rounded-xl border border-white/[0.08] bg-[#07080a] p-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs font-semibold text-[#6a6b6c]">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff6363]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbc33]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#5fc992]" />
              </div>
              <span>Link preview</span>
            </div>

            <div className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-[#cecece]">
              https://example.com/articles/how-to-build-a-url-shortener
            </div>

            <div className="mt-4 space-y-2">
              <div className="rounded-lg border border-white/[0.06] bg-[#101111] p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">Create short link</p>
                  <span className="rounded-md bg-[#1b1c1e] px-2 py-1 text-[11px] font-semibold text-[#cecece]">
                    Ready
                  </span>
                </div>
                <p className="mt-2 break-all text-sm leading-6 text-[#9c9c9d]">
                  dwarf.url/dW4rf7X
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
