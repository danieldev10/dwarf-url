import Link from "next/link";

import { getBaseUrl } from "@/lib/app-url";
import { getCurrentUser } from "@/lib/auth/session";

import AccountMenu from "@/app/account-menu";
import MobileDrawerMenu from "@/app/mobile-drawer-menu";

import { createShortLink } from "./actions";

type CreatePageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
    shortCode?: string | string[];
  }>;
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const guestNavItems = [
    {
      href: "/signup",
      label: "Create account",
    },
    {
      href: "/login",
      label: "Sign in",
    },
    {
      href: "/",
      label: "Back home",
    },
  ] as const;
  const user = await getCurrentUser();
  const baseUrl = await getBaseUrl();
  const params = (await searchParams) ?? {};
  const createdShortCode = getSingleSearchParam(params.shortCode).trim();
  const createdShortUrl = createdShortCode
    ? baseUrl + "/" + createdShortCode
    : baseUrl + "/dW4rf7X";
  const bannerText = params.error ?? params.message ?? null;
  const bannerClasses = params.error
    ? "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700"
    : "rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm leading-7 text-cyan-800";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">
            Create
          </p>
        </div>

        {user ? (
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
            <Link
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white! visited:text-white! transition hover:bg-slate-800"
              href="/library"
            >
              View library
            </Link>
            <AccountMenu email={user.email} name={user.name ?? null} />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <Link
                className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400"
                href="/login"
              >
                Sign in
              </Link>
              <Link
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white! visited:text-white! transition hover:bg-slate-800"
                href="/signup"
              >
                Create account
              </Link>
            </div>
            <MobileDrawerMenu items={[...guestNavItems]} />
          </div>
        )}
      </header>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-4xl border border-slate-200 bg-white/88 p-8 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)]">
          <div className="max-w-2xl space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Shorten a URL
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Create a link in seconds
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {user
                  ? "Add a destination, give it an optional title, and save a clean link you can share right away."
                  : "No account required for your first link. Create it now, then sign in later to save it to your library."}
              </p>
            </div>

            {bannerText ? <div className={bannerClasses}>{bannerText}</div> : null}

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="title">
                  Title
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Weekly product demo"
                  maxLength={80}
                />
                <p className="text-sm leading-6 text-slate-500">
                  Optional. Use a short label so the link is easier to spot later.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="originalUrl">
                  Long URL
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500"
                  id="originalUrl"
                  name="originalUrl"
                  type="text"
                  placeholder="https://example.com/articles/how-to-build-a-url-shortener"
                  required
                />
                <p className="text-sm leading-6 text-slate-500">
                  Paste a full URL or just the domain. We will add `https://` when needed.
                </p>
              </div>

              <button
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white! transition hover:bg-slate-800"
                formAction={createShortLink}
              >
                Create short link
              </button>
            </form>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-4xl border border-slate-200 bg-slate-950 p-6 text-slate-50 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.5)]">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">
              {createdShortCode ? "Your short link" : "Preview"}
            </p>
            {createdShortCode ? (
              <Link
                className="mt-4 block break-all text-lg font-semibold text-white underline decoration-cyan-400/40 underline-offset-4"
                href={"/" + createdShortCode}
                target="_blank"
              >
                {createdShortUrl}
              </Link>
            ) : (
              <p className="mt-4 text-lg font-semibold text-white">{createdShortUrl}</p>
            )}
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {createdShortCode
                ? user
                  ? "Your new short link is ready to share and will be waiting in your library."
                  : "Your link is ready to share. Sign in or create an account from this browser to claim it into your library later."
                : "Your next short link will look something like this and will be ready to share right away."}
            </p>
            {!user && createdShortCode ? (
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  href="/signup"
                >
                  Create account
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/6 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  href="/login"
                >
                  Sign in
                </Link>
              </div>
            ) : null}
          </section>

          <section className="rounded-4xl border border-cyan-100 bg-cyan-50 p-6 text-sm leading-7 text-cyan-900">
            <p className="font-semibold text-cyan-950">Helpful tips</p>
            <ul className="mt-3 space-y-2">
              <li>1. Use clear titles for links you plan to reuse often.</li>
              <li>
                2.{" "}
                {user
                  ? "New links appear in your library immediately after you create them."
                  : "Guest links stay attached to this browser until you sign in and claim them."}
              </li>
              <li>
                3.{" "}
                {user
                  ? "Your short links can be opened and shared directly from the library page."
                  : "Once you create an account, your recent guest links will move into your library automatically."}
              </li>
            </ul>
          </section>
        </aside>
      </section>
    </main>
  );
}
