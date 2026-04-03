import Link from "next/link";

import { getBaseUrl } from "@/lib/app-url";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type LibraryPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const user = await requireUser("Please sign in to see your library.");
  const baseUrl = await getBaseUrl();
  const params = (await searchParams) ?? {};
  const bannerText = params.error ?? params.message ?? null;
  const bannerClasses = params.error
    ? "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700"
    : "rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm leading-7 text-cyan-800";
  const links = await prisma.shortLink.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">
            Library
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Your shortened links live here.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Signed in as {user.email}. Every link here belongs to your account and can be opened from its short URL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white! visited:text-white! transition hover:bg-slate-800"
            href="/create"
          >
            Create a link
          </Link>
          <form action="/auth/signout" method="post">
            <button className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {bannerText ? <div className={bannerClasses + " mt-8"}>{bannerText}</div> : null}

      <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white/88 p-8 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)]">
        {links.length === 0 ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Your library is empty for now.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Create your first short link and it will appear here immediately. This page is already querying only the links that belong to your account.
              </p>
            </div>
            <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-6 text-sm leading-7 text-cyan-900">
              <p className="font-semibold text-cyan-950">What this page proves</p>
              <ul className="mt-3 space-y-2">
                <li>1. The user must be logged in.</li>
                <li>2. Prisma can read from Supabase Postgres.</li>
                <li>3. Results are scoped to the current user ID.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => {
              const shortUrl = baseUrl + "/" + link.shortCode;

              return (
                <article
                  key={link.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                        {link.shortCode}
                      </p>
                      <h2 className="text-lg font-semibold text-slate-950">
                        {link.title ?? "Untitled link"}
                      </h2>
                      <div className="space-y-2 text-sm leading-7 text-slate-600">
                        <p className="break-all">
                          Original: {" "}
                          <a
                            className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4"
                            href={link.originalUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {link.originalUrl}
                          </a>
                        </p>
                        <p className="break-all">
                          Short: {" "}
                          <Link
                            className="font-medium text-cyan-700 underline decoration-cyan-300 underline-offset-4"
                            href={"/" + link.shortCode}
                            target="_blank"
                          >
                            {shortUrl}
                          </Link>
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-500">
                      <p>{link.clickCount} clicks</p>
                      <p>{new Date(link.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
