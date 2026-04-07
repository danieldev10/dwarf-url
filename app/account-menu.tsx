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
        className={`ray-button-secondary h-11 w-11 p-0 ${isOpen ? "opacity-100" : ""}`}
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <UserIcon />
      </button>

      <div
        className={`ray-card absolute top-full right-0 z-40 mt-2 w-[min(15rem,calc(100vw-2rem))] max-w-60 rounded-2xl p-3 transition duration-150 ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
        id={panelId}
        role="menu"
      >
        <div className="rounded-xl border border-white/[0.06] bg-[#07080a] px-3 py-3">
          <p className="text-sm font-semibold text-white">{displayName}</p>
          <p className="mt-1 break-all text-xs leading-5 text-[#9c9c9d]">{email}</p>
        </div>

        <form action="/auth/signout" className="mt-3" method="post">
          <button
            className="ray-button-secondary w-full px-4 py-2.5 text-sm"
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
