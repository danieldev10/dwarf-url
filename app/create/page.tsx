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
    ? "ray-banner-error text-sm leading-7"
    : "ray-banner-info text-sm leading-7";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="ray-eyebrow">
            Create
          </p>
        </div>

        {user ? (
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
            <Link
              className="ray-button-primary px-5 py-3 text-sm"
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
                className="ray-button-secondary px-4 py-2.5 text-sm"
                href="/login"
              >
                Sign in
              </Link>
              <Link
                className="ray-button-primary px-4 py-2.5 text-sm"
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
        <section className="ray-card rounded-2xl p-6 sm:p-8">
          <div className="max-w-2xl space-y-6">
            <div>
              <p className="ray-eyebrow">
                Shorten a URL
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0px] text-white">
                Create a link in seconds
              </h2>
              <p className="mt-3 text-sm font-medium leading-7 text-[#9c9c9d]">
                {user
                  ? "Add a destination, give it an optional title, and save a clean link you can share right away."
                  : "No account required for your first link. Create it now, then sign in later to save it to your library."}
              </p>
            </div>

            {bannerText ? <div className={bannerClasses}>{bannerText}</div> : null}

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="ray-label" htmlFor="title">
                  Title
                </label>
                <input
                  className="ray-input w-full px-4 py-3 text-sm"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Optional"
                  maxLength={80}
                />
              </div>

              <div className="space-y-2">
                <label className="ray-label" htmlFor="originalUrl">
                  Long URL
                </label>
                <input
                  className="ray-input w-full px-4 py-3 text-sm"
                  id="originalUrl"
                  name="originalUrl"
                  type="text"
                  placeholder="https://example.com/articles/how-to-build-a-url-shortener"
                  required
                />
              </div>

              <button
                className="ray-button-primary px-6 py-3 text-sm"
                formAction={createShortLink}
              >
                Create short link
              </button>
            </form>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="ray-card-float relative overflow-hidden rounded-2xl p-6 text-[#f9f9f9]">
            <div className="ray-red-stripes pointer-events-none absolute -right-14 -top-14 h-44 w-44 rotate-12 rounded-2xl opacity-[0.15]" />
            <p className="ray-eyebrow relative">
              {createdShortCode ? "Your short link" : "Preview"}
            </p>
            {createdShortCode ? (
              <Link
                className="ray-link relative mt-4 block break-all text-lg font-semibold"
                href={"/" + createdShortCode}
                target="_blank"
              >
                {createdShortUrl}
              </Link>
            ) : (
              <p className="relative mt-4 break-all text-lg font-semibold text-white">
                {createdShortUrl}
              </p>
            )}
            <p className="relative mt-3 text-sm leading-7 text-[#9c9c9d]">
              {createdShortCode
                ? user
                  ? "Your new short link is ready to share and will be waiting in your library."
                  : "Your link is ready to share. Sign in or create an account from this browser to claim it into your library later."
                : "Your next short link will look something like this and will be ready to share right away."}
            </p>
            {!user && createdShortCode ? (
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <Link
                  className="ray-button-primary px-4 py-2.5 text-sm"
                  href="/signup"
                >
                  Create account
                </Link>
                <Link
                  className="ray-button-secondary px-4 py-2.5 text-sm"
                  href="/login"
                >
                  Sign in
                </Link>
              </div>
            ) : null}
          </section>

          <section className="ray-card rounded-2xl p-6 text-sm leading-7 text-[#9c9c9d]">
            <p className="font-semibold text-white">Helpful tips</p>
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
