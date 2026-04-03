import Link from "next/link";

import { getBaseUrl } from "@/lib/app-url";
import { requireUser } from "@/lib/auth/session";

import { createShortLink } from "./actions";

type CreatePageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const user = await requireUser("Please sign in to create short links.");
  const baseUrl = await getBaseUrl();
  const userLabel = user.name?.trim() || user.email;
  const params = (await searchParams) ?? {};
  const bannerText = params.error ?? params.message ?? null;
  const bannerClasses = params.error
    ? "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700"
    : "rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm leading-7 text-cyan-800";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">
            Create
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Create a short link.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Signed in as {userLabel}. Add a destination, give it an optional title, and save a clean link you can share right away.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white! visited:text-white! transition hover:bg-slate-800"
            href="/library"
          >
            View library
          </Link>
          <form action="/auth/signout" method="post">
            <button className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400">
              Sign out
            </button>
          </form>
        </div>
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
              Preview
            </p>
            <p className="mt-4 text-lg font-semibold text-white">{baseUrl}/dW4rf7X</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Your next short link will look something like this and will be ready to share right away.
            </p>
          </section>

          <section className="rounded-4xl border border-cyan-100 bg-cyan-50 p-6 text-sm leading-7 text-cyan-900">
            <p className="font-semibold text-cyan-950">Helpful tips</p>
            <ul className="mt-3 space-y-2">
              <li>1. Use clear titles for links you plan to reuse often.</li>
              <li>2. New links appear in your library immediately after you create them.</li>
              <li>3. Your short links can be opened and shared directly from the library page.</li>
            </ul>
          </section>
        </aside>
      </section>
    </main>
  );
}
