"use client";

import { useState } from "react";

import { deleteShortLink, updateShortLinkTitle } from "./actions";

type RowActionsProps = {
  currentPage: number;
  initialTitle: string;
  linkId: string;
  query: string;
  shortUrl: string;
  sort: string;
};

export default function RowActions({
  currentPage,
  initialTitle,
  linkId,
  query,
  shortUrl,
  sort,
}: RowActionsProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(initialTitle);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyState("copied");
      window.setTimeout(() => {
        setCopyState("idle");
      }, 1500);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => {
        setCopyState("idle");
      }, 1500);
    }
  }

  function handleDeleteSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!window.confirm("Delete this short link?")) {
      event.preventDefault();
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <button
          aria-label={
            copyState === "copied"
              ? "Short link copied"
              : copyState === "failed"
                ? "Copy failed"
                : "Copy short link"
          }
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${copyState === "copied"
            ? "border-cyan-200 bg-cyan-50 text-cyan-700"
            : copyState === "failed"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
            }`}
          onClick={handleCopy}
          title={
            copyState === "copied"
              ? "Copied"
              : copyState === "failed"
                ? "Copy failed"
                : "Copy"
          }
          type="button"
        >
          {copyState === "copied" ? <CheckIcon /> : copyState === "failed" ? <AlertIcon /> : <CopyIcon />}
          <span className="sr-only">
            {copyState === "copied"
              ? "Copied"
              : copyState === "failed"
                ? "Copy failed"
                : "Copy"}
          </span>
        </button>
        <button
          aria-label={isEditing ? "Cancel editing title" : "Edit title"}
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${isEditing
            ? "border-cyan-200 bg-cyan-50 text-cyan-700"
            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
            }`}
          onClick={() => setIsEditing((value) => !value)}
          title={isEditing ? "Cancel" : "Edit"}
          type="button"
        >
          {isEditing ? <CloseIcon /> : <EditIcon />}
          <span className="sr-only">{isEditing ? "Cancel" : "Edit"}</span>
        </button>
        <form action={deleteShortLink} className="shrink-0" onSubmit={handleDeleteSubmit}>
          <input name="linkId" type="hidden" value={linkId} />
          <input name="page" type="hidden" value={String(currentPage)} />
          <input name="query" type="hidden" value={query} />
          <input name="sort" type="hidden" value={sort} />
          <button
            aria-label="Delete short link"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
            title="Delete"
            type="submit"
          >
            <TrashIcon />
            <span className="sr-only">Delete</span>
          </button>
        </form>
      </div>

      {isEditing ? (
        <form action={updateShortLinkTitle} className="flex flex-col gap-1.5 sm:flex-row">
          <input name="linkId" type="hidden" value={linkId} />
          <input name="page" type="hidden" value={String(currentPage)} />
          <input name="query" type="hidden" value={query} />
          <input name="sort" type="hidden" value={sort} />
          <input
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[13px] text-slate-950 outline-none transition focus:border-cyan-500"
            maxLength={80}
            name="title"
            onChange={(event) => setDraftTitle(event.target.value)}
            placeholder="Untitled link"
            value={draftTitle}
          />
          <button
            className="rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
            type="submit"
          >
            Save
          </button>
        </form>
      ) : null}
    </div>
  );
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <rect height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" width="11" x="9" y="9" />
      <path
        d="M15 7V6.5A2.5 2.5 0 0 0 12.5 4H6.5A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <path
        d="M5.5 12.5 10 17l8.5-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 7.5v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <circle cx="12" cy="16.5" fill="currentColor" r="1.1" />
      <path
        d="M10.3 4.9a2 2 0 0 1 3.4 0l6.2 10.8A2 2 0 0 1 18.2 19H5.8a2 2 0 0 1-1.7-3.3z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 20h4.3l9.6-9.6a2.1 2.1 0 0 0-3-3L5.3 17V20Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="m13.8 8.2 3 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 7h14M9.5 4h5M8 7l.7 10.2A2 2 0 0 0 10.7 19h2.6a2 2 0 0 0 2-1.8L16 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M10 11v4.5M14 11v4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
