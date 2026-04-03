import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";

import MobileDrawerMenu from "@/app/mobile-drawer-menu";

import { login } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const loginNavItems = [
    {
      href: "/signup",
      label: "Create account",
    },
    {
      href: "/",
      label: "Back home",
    },
  ] as const;
  const user = await getCurrentUser();

  if (user) {
    redirect("/library");
  }

  const params = (await searchParams) ?? {};
  const bannerTone = params.error ? "error" : params.message ? "message" : null;
  const bannerText = params.error ?? params.message ?? null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
      <header className="flex items-center justify-between py-4">
        <Link
          className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700"
          href="/"
        >
          DwarfURL
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/70"
            href="/signup"
          >
            Create account
          </Link>
          <Link
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/70"
            href="/"
          >
            Back home
          </Link>
        </div>
        <MobileDrawerMenu items={[...loginNavItems]} />
      </header>

      <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Access your library
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Sign in and pick up where you left off.
            </h1>
          </div>

        </div>

        <section className="rounded-4xl border border-slate-200 bg-white/88 p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)]">
          <div className="max-w-md space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Sign in
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Use your email and password
              </h2>
            </div>

            {bannerTone && bannerText ? (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${bannerTone === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-cyan-200 bg-cyan-50 text-cyan-800"
                  }`}
              >
                {bannerText}
              </div>
            ) : null}

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </div>

              <button
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                formAction={login}
              >
                Sign in
              </button>
            </form>

            <p className="text-sm leading-7 text-slate-600">
              New here?{" "}
              <Link className="font-semibold text-cyan-700 hover:text-cyan-800" href="/signup">
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
