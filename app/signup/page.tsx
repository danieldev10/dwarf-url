import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";

import { signup } from "@/app/login/actions";

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/library");
  }

  const params = (await searchParams) ?? {};
  const bannerText = params.error ?? params.message ?? null;
  const bannerClasses = params.error
    ? "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700"
    : "rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm leading-7 text-cyan-800";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
      <header className="flex items-center justify-between py-4">
        <Link
          className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700"
          href="/"
        >
          DwarfURL
        </Link>
        <Link
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/70"
          href="/login"
        >
          Already have an account?
        </Link>
      </header>

      <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800">
            Signup step: create your DwarfURL account
          </p>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Get your own link library
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Create your account and start saving short links.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              There is no email confirmation step now. Once you sign up, the app creates your account, hashes your password, and signs you in immediately.
            </p>
          </div>
          <div className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
            <h2 className="text-base font-semibold text-slate-950">What happens next?</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <li>1. Create your account with email and password.</li>
              <li>2. The app stores your password hash in Postgres.</li>
              <li>3. A secure session cookie signs you in immediately.</li>
              <li>4. Your library becomes available right away.</li>
            </ul>
          </div>
        </div>

        <section className="rounded-4xl border border-slate-200 bg-white/88 p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)]">
          <div className="max-w-md space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Create account
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Start with your email and password
              </h2>
            </div>

            {bannerText ? <div className={bannerClasses}>{bannerText}</div> : null}

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
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                formAction={signup}
              >
                Create account
              </button>
            </form>

            <p className="text-sm leading-7 text-slate-600">
              Already registered?{" "}
              <Link className="font-semibold text-cyan-700 hover:text-cyan-800" href="/login">
                Sign in here
              </Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
