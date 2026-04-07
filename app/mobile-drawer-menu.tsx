"use client";

import { useEffect, useId, useState } from "react";

import Link from "next/link";

type MobileDrawerMenuProps = {
  items: Array<{
    href: string;
    label: string;
  }>;
};

export default function MobileDrawerMenu({ items }: MobileDrawerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="ray-button-secondary h-11 w-11 p-0 md:!hidden"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <MenuIcon />
      </button>

      <div className={`fixed inset-0 z-50 md:hidden ${isOpen ? "" : "pointer-events-none"}`}>
        <button
          aria-label="Close navigation menu"
          className={`absolute inset-0 bg-black/55 backdrop-blur-[2px] transition duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
          type="button"
        />

        <aside
          aria-modal="true"
          className={`absolute inset-y-0 right-0 flex w-[18.5rem] max-w-[84vw] flex-col border-l border-white/[0.08] bg-[#07080a] px-5 py-5 text-white shadow-[-24px_0_60px_-35px_rgba(0,0,0,0.95)] transition duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          id={panelId}
          role="dialog"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.2px] text-white">
                DwarfURL
              </p>
              <p className="mt-2 text-sm leading-6 text-[#9c9c9d]">
                Short links without the clutter.
              </p>
            </div>

            <button
              aria-label="Close navigation menu"
              className="ray-button-secondary h-10 w-10 p-0"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-2.5">
            {items.map((item) => (
              <Link
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-[#cecece] transition hover:border-white/[0.15] hover:text-white"
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-[#ff6363]/30 bg-[#ff6363]/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff9a9a]">
              Quick Start
            </p>
            <p className="mt-2 text-sm leading-6 text-[#cecece]">
              Create one short link, save it, and keep the rest of your links in one simple library.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
