"use client";

import { useEffect, useId, useRef, useState } from "react";

type AccountMenuProps = {
  email: string;
  name: string | null;
};

export default function AccountMenu({ email, name }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const displayName = name?.trim() || "Your account";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close account menu" : "Open account menu"}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white text-slate-900 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.4)] transition hover:border-slate-400 ${isOpen ? "border-slate-400" : "border-slate-300"}`}
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <UserIcon />
      </button>

      <div
        className={`absolute top-full right-0 z-40 mt-2 w-[min(15rem,calc(100vw-2rem))] max-w-60 rounded-[1.35rem] border border-slate-200 bg-white/98 p-3 shadow-[0_24px_50px_-28px_rgba(15,23,42,0.55)] transition duration-150 ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
        id={panelId}
        role="menu"
      >
        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <p className="text-sm font-semibold text-slate-950">{displayName}</p>
          <p className="mt-1 break-all text-xs leading-5 text-slate-500">{email}</p>
        </div>

        <form action="/auth/signout" className="mt-3" method="post">
          <button
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6.5 7.5a6.5 6.5 0 0 1 13 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
