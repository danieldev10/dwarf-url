import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";

import MobileDrawerMenu from "@/app/mobile-drawer-menu";

import { signup } from "@/app/login/actions";

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const signupNavItems = [
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

  if (user) {
    redirect("/library");
  }

  const params = (await searchParams) ?? {};
  const bannerText = params.error ?? params.message ?? null;
  const bannerClasses = params.error
    ? "ray-banner-error text-sm leading-7"
    : "ray-banner-info text-sm leading-7";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
      <header className="flex items-center justify-between py-4">
        <Link
          className="text-sm font-semibold tracking-[0.2px] text-white"
          href="/"
        >
          DwarfURL
        </Link>
        <Link
          className="ray-nav-link hidden px-4 py-2 text-sm font-medium md:inline-flex"
          href="/login"
        >
          Sign in
        </Link>
        <MobileDrawerMenu items={[...signupNavItems]} />
      </header>

      <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="ray-eyebrow">
              Start your library
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[0px] text-white sm:text-5xl lg:text-6xl">
              Start shortening and organizing links in minutes.
            </h1>
            <p className="max-w-lg text-sm font-medium leading-7 text-[#9c9c9d]">
              Keep the URLs you use most in one fast, searchable library.
            </p>
          </div>

        </div>

        <section className="ray-card rounded-2xl p-6 sm:p-8">
          <div className="max-w-md space-y-6">
            <div>
              <p className="ray-eyebrow">
                Create account
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0px] text-white">
                Use your details to get started
              </h2>
            </div>

            {bannerText ? <div className={bannerClasses}>{bannerText}</div> : null}

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="ray-label" htmlFor="name">
                  Name
                </label>
                <input
                  className="ray-input w-full px-4 py-3 text-sm"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Steve Jobs"
                  maxLength={80}
                  required
                />
              </div>

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
                className="ray-button-primary w-full px-6 py-3 text-sm"
                formAction={signup}
              >
                Create account
              </button>
            </form>

            <p className="text-sm leading-7 text-[#9c9c9d]">
              Already registered?{" "}
              <Link className="ray-link font-semibold" href="/login">
                Sign in here
              </Link>
            </p>
            <p className="text-sm leading-7 text-[#6a6b6c]">
              If you already created links as a guest on this device, we&apos;ll add them to your library after signup.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
