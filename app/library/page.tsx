import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getBaseUrl } from "@/lib/app-url";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

import RowActions from "./row-actions";
import {
  DEFAULT_LIBRARY_SORT,
  LIBRARY_SORT_OPTIONS,
  buildLibraryHref,
  clampLibraryPage,
  getCurrentPage,
  getLibraryOrderBy,
  getLibrarySort,
  getLibraryWhere,
  getSingleSearchParam,
} from "./utils";

type LibraryPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
    page?: string | string[];
    query?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const user = await requireUser("Please sign in to see your library.");
  const baseUrl = await getBaseUrl();
  const params = (await searchParams) ?? {};
  const query = getSingleSearchParam(params.query).trim();
  const requestedPage = getCurrentPage(params.page);
  const rawSort = getSingleSearchParam(params.sort);
  const sort = getLibrarySort(params.sort);
  const bannerText = params.error ?? params.message ?? null;
  const bannerClasses = params.error
    ? "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700"
    : "rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm leading-7 text-cyan-800";
  const where = getLibraryWhere(user.id, query);

  const totalLinks = await prisma.shortLink.count({
    where,
  });
  const { currentPage, totalPages } = clampLibraryPage(totalLinks, requestedPage);

  if (
    currentPage !== requestedPage ||
    (rawSort && rawSort !== sort)
  ) {
    redirect(buildLibraryHref({
      kind: params.error ? "error" : params.message ? "message" : undefined,
      page: currentPage,
      query,
      sort,
      text: bannerText ?? undefined,
    }));
  }

  const links = await prisma.shortLink.findMany({
    where,
    orderBy: getLibraryOrderBy(sort),
    skip: (currentPage - 1) * 8,
    take: 8,
  });
  const previousPageHref = buildLibraryHref({
    page: currentPage - 1,
    query,
    sort,
  });
  const nextPageHref = buildLibraryHref({
    page: currentPage + 1,
    query,
    sort,
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[70rem] flex-col px-5 py-7 sm:px-8 lg:px-10 lg:py-6">
      <header className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-700">
            Library
          </p>
          <h1 className="mt-1.5 text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.15rem]">
            Your links, all in one place.
          </h1>
          <p className="mt-2.5 max-w-2xl text-[15px] leading-7 text-slate-600">
            Signed in as {user.email}. Open, share, and keep track of every short link from one library.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            className="rounded-full bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white! visited:text-white! transition hover:bg-slate-800"
            href="/create"
          >
            Create a link
          </Link>
          <form action="/auth/signout" method="post">
            <button className="rounded-full border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {bannerText ? <div className={bannerClasses + " mt-5"}>{bannerText}</div> : null}

      <section className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white/88 p-5 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.4)] lg:p-6">
        <div className="flex flex-col gap-3.5 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Manage your links</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Search, sort, copy, rename, and clean up your links without leaving the page.
            </p>
          </div>

          <Form action="/library" className="flex w-full max-w-[42rem] flex-col gap-2 lg:flex-row">
            <input
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500"
              defaultValue={query}
              name="query"
              placeholder="Search by title, short code, or destination"
            />
            <select
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500"
              defaultValue={sort}
              name="sort"
            >
              {LIBRARY_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              className="rounded-full bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              type="submit"
            >
              Apply
            </button>
            {query || sort !== DEFAULT_LIBRARY_SORT ? (
              <Link
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                href="/library"
              >
                Clear
              </Link>
            ) : null}
          </Form>
        </div>

        {links.length === 0 ? (
          <div className="grid gap-5 pt-5 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                {query ? "No matching links." : "No links yet."}
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm leading-7 text-slate-600">
                {query
                  ? "Try a different search term or clear the current filter to see the rest of your library."
                  : "Create your first short link and it will show up here right away, ready to open and share."}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-cyan-900">
              <p className="font-semibold text-cyan-950">Ideas to get started</p>
              <ul className="mt-2.5 space-y-1.5">
                <li>1. Shorten a long article, product, or campaign link.</li>
                <li>2. Save a document, form, or page you send often.</li>
                <li>3. Add a clear title so it is easy to find again later.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-5">
            <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {links.length} of {totalLinks} link{totalLinks === 1 ? "" : "s"}
                {query ? ` for “${query}”` : ""}.
              </p>
              <p>
                Page {currentPage} of {totalPages}. Sorted by{" "}
                {LIBRARY_SORT_OPTIONS.find((option) => option.value === sort)?.label.toLowerCase()}.
              </p>
            </div>

            <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-200 lg:block">
              <table className="min-w-full border-collapse table-fixed">
                <thead className="bg-slate-100/80">
                  <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <th className="w-[18%] px-4 py-2.5">Title</th>
                    <th className="w-[18%] px-4 py-2.5">Short link</th>
                    <th className="w-[32%] px-4 py-2.5">Destination</th>
                    <th className="w-[8%] px-4 py-2.5">Clicks</th>
                    <th className="w-[10%] px-4 py-2.5">Created</th>
                    <th className="w-[14%] px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {links.map((link) => {
                    const shortUrl = baseUrl + "/" + link.shortCode;
                    const createdAtLabel = new Date(link.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <tr key={link.id} className="border-t border-slate-200 align-top">
                        <td className="px-4 py-3.5">
                          <p className="text-[13px] font-semibold leading-5 text-slate-950">
                            {link.title ?? "Untitled link"}
                          </p>
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                            {link.shortCode}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link
                            className="break-all text-[13px] font-medium leading-5 text-cyan-700 underline decoration-cyan-300 underline-offset-4"
                            href={"/" + link.shortCode}
                            target="_blank"
                          >
                            {shortUrl}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5">
                          <a
                            className="line-clamp-2 break-all text-[13px] leading-5 text-slate-600 underline decoration-slate-300 underline-offset-4"
                            href={link.originalUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {link.originalUrl}
                          </a>
                        </td>
                        <td className="px-4 py-3.5 text-[13px] text-slate-600">{link.clickCount}</td>
                        <td className="px-4 py-3.5 text-[13px] leading-5 text-slate-600">{createdAtLabel}</td>
                        <td className="px-4 py-3.5">
                          <RowActions
                            currentPage={currentPage}
                            initialTitle={link.title ?? ""}
                            linkId={link.id}
                            query={query}
                            shortUrl={shortUrl}
                            sort={sort}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-2.5 lg:hidden">
              {links.map((link) => {
                const shortUrl = baseUrl + "/" + link.shortCode;
                const clickLabel =
                  link.clickCount === 1 ? "1 click" : `${link.clickCount} clicks`;
                const createdAtLabel = new Date(link.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <article
                    key={link.id}
                    className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-3.5"
                  >
                    <div className="space-y-2.5">
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                          {link.shortCode}
                        </p>
                        <h3 className="text-[15px] font-semibold text-slate-950">
                          {link.title ?? "Untitled link"}
                        </h3>
                      </div>

                      <div className="space-y-1.5 text-sm leading-6 text-slate-600">
                        <p className="break-all">
                          Destination:{" "}
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
                          Short link:{" "}
                          <Link
                            className="font-medium text-cyan-700 underline decoration-cyan-300 underline-offset-4"
                            href={"/" + link.shortCode}
                            target="_blank"
                          >
                            {shortUrl}
                          </Link>
                        </p>
                        <p>{clickLabel}</p>
                        <p>Created {createdAtLabel}</p>
                      </div>

                      <RowActions
                        currentPage={currentPage}
                        initialTitle={link.title ?? ""}
                        linkId={link.id}
                        query={query}
                        shortUrl={shortUrl}
                        sort={sort}
                      />
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                aria-disabled={currentPage <= 1}
                className={`inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-sm font-semibold transition ${currentPage <= 1
                  ? "pointer-events-none border-slate-200 text-slate-300"
                  : "border-slate-300 bg-white text-slate-900 hover:border-slate-400"
                  }`}
                href={previousPageHref}
              >
                Previous
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-slate-500">
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((pageNumber) => {
                    return (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - currentPage) <= 1
                    );
                  })
                  .map((pageNumber, index, pageNumbers) => {
                    const previousPageNumber = pageNumbers[index - 1];
                    const needsGap =
                      previousPageNumber !== undefined &&
                      pageNumber - previousPageNumber > 1;

                    return (
                      <div className="flex items-center gap-1" key={pageNumber}>
                        {needsGap ? <span className="px-1 text-slate-300">…</span> : null}
                        <Link
                          className={`inline-flex h-[1.875rem] min-w-[1.875rem] items-center justify-center rounded-full px-2.5 text-sm font-semibold transition ${pageNumber === currentPage
                            ? "bg-slate-950 text-white"
                            : "border border-slate-300 bg-white text-slate-900 hover:border-slate-400"
                            }`}
                          href={buildLibraryHref({
                            page: pageNumber,
                            query,
                            sort,
                          })}
                        >
                          {pageNumber}
                        </Link>
                      </div>
                    );
                  })}
              </div>

              <Link
                aria-disabled={currentPage >= totalPages}
                className={`inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-sm font-semibold transition ${currentPage >= totalPages
                  ? "pointer-events-none border-slate-200 text-slate-300"
                  : "border-slate-300 bg-white text-slate-900 hover:border-slate-400"
                  }`}
                href={nextPageHref}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
