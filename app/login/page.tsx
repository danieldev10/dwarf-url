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
          className="text-sm font-semibold tracking-[0.2px] text-white"
          href="/"
        >
          DwarfURL
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            className="ray-nav-link px-4 py-2 text-sm font-medium"
            href="/signup"
          >
            Create account
          </Link>
          <Link
            className="ray-nav-link px-4 py-2 text-sm font-medium"
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
            <p className="ray-eyebrow">
              Access your library
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[0px] text-white sm:text-5xl lg:text-6xl">
              Sign in and pick up where you left off.
            </h1>
            <p className="max-w-lg text-sm font-medium leading-7 text-[#9c9c9d]">
              Your saved links, click counts, and recent guest links are waiting.
            </p>
          </div>

        </div>

        <section className="ray-card rounded-2xl p-6 sm:p-8">
          <div className="max-w-md space-y-6">
            <div>
              <p className="ray-eyebrow">
                Sign in
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0px] text-white">
                Use your email and password
              </h2>
            </div>

            {bannerTone && bannerText ? (
              <div
                className={`text-sm leading-7 ${bannerTone === "error"
                  ? "ray-banner-error"
                  : "ray-banner-info"
                  }`}
              >
                {bannerText}
              </div>
            ) : null}

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="ray-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="ray-input w-full px-4 py-3 text-sm"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="ray-label" htmlFor="password">
                  Password
                </label>
                <input
                  className="ray-input w-full px-4 py-3 text-sm"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </div>

              <button
                className="ray-button-primary px-6 py-3 text-sm"
                formAction={login}
              >
                Sign in
              </button>
            </form>

            <p className="text-sm leading-7 text-[#9c9c9d]">
              New here?{" "}
              <Link className="ray-link font-semibold" href="/signup">
                Sign up
              </Link>
            </p>
            <p className="text-sm leading-7 text-[#6a6b6c]">
              Any guest links you created on this device will move into your library after you sign in.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
