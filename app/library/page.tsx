import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getBaseUrl } from "@/lib/app-url";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

import AccountMenu from "@/app/account-menu";

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
    ? "ray-banner-error text-sm leading-7"
    : "ray-banner-info text-sm leading-7";
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
    <main className="mx-auto flex min-h-screen w-full max-w-280 flex-col px-5 py-7 sm:px-8 lg:px-10 lg:py-6">
      <header className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="ray-eyebrow">
            Library
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-2.5 sm:w-auto sm:justify-start">
          <Link
            className="ray-button-primary px-3.5 py-2 text-sm"
            href="/create"
          >
            Create a link
          </Link>
          <AccountMenu email={user.email} name={user.name ?? null} />
        </div>
      </header>

      {bannerText ? <div className={bannerClasses + " mt-5"}>{bannerText}</div> : null}

      <section className="ray-card mt-6 rounded-2xl p-5 lg:p-6">
        <div className="flex flex-col gap-3.5 border-b border-white/[0.06] pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Manage your links</h2>

          </div>

          <Form action="/library" className="flex w-full max-w-2xl flex-col gap-2 lg:flex-row">
            <input
              className="ray-input min-w-0 flex-1 px-3.5 py-2 text-sm"
              defaultValue={query}
              name="query"
              placeholder="Search by title, short code, or destination"
            />
            <select
              className="ray-input px-3 py-2 text-sm"
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
              className="ray-button-primary px-3.5 py-2 text-sm"
              type="submit"
            >
              Apply
            </button>
            {query || sort !== DEFAULT_LIBRARY_SORT ? (
              <Link
                className="ray-button-secondary px-3.5 py-2 text-sm"
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
              <h2 className="text-xl font-semibold text-white">
                {query ? "No matching links." : "No links yet."}
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm leading-7 text-[#9c9c9d]">
                {query
                  ? "Try a different search term or clear the current filter to see the rest of your library."
                  : "Create your first short link and it will show up here right away, ready to open and share."}
              </p>
            </div>
            <div className="rounded-xl border border-[#55b3ff]/25 bg-[#55b3ff]/10 p-4 text-sm leading-6 text-[#cdeaff]">
              <p className="font-semibold text-white">Ideas to get started</p>
              <ul className="mt-2.5 space-y-1.5">
                <li>1. Shorten a long article, product, or campaign link.</li>
                <li>2. Save a document, form, or page you send often.</li>
                <li>3. Add a clear title so it is easy to find again later.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-5">
            <div className="flex flex-col gap-2 text-xs text-[#6a6b6c] sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {links.length} of {totalLinks} link{totalLinks === 1 ? "" : "s"}
                {query ? ` for “${query}”` : ""}.
              </p>
              <p>
                Page {currentPage} of {totalPages}. Sorted by{" "}
                {LIBRARY_SORT_OPTIONS.find((option) => option.value === sort)?.label.toLowerCase()}.
              </p>
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-white/[0.08] lg:block">
              <table className="min-w-full border-collapse table-fixed">
                <thead className="bg-white/[0.03]">
                  <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6a6b6c]">
                    <th className="w-[18%] px-4 py-2.5">Title</th>
                    <th className="w-[18%] px-4 py-2.5">Short link</th>
                    <th className="w-[32%] px-4 py-2.5">Destination</th>
                    <th className="w-[8%] px-4 py-2.5">Clicks</th>
                    <th className="w-[10%] px-4 py-2.5">Created</th>
                    <th className="w-[14%] px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[#07080a]">
                  {links.map((link) => {
                    const shortUrl = baseUrl + "/" + link.shortCode;
                    const createdAtLabel = new Date(link.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <tr key={link.id} className="border-t border-white/[0.06] align-top">
                        <td className="px-4 py-3.5">
                          <p className="text-[13px] font-semibold leading-5 text-white">
                            {link.title ?? "Untitled link"}
                          </p>
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ff6363]">
                            {link.shortCode}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link
                            className="ray-link break-all text-[13px] font-medium leading-5"
                            href={"/" + link.shortCode}
                            target="_blank"
                          >
                            {shortUrl}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5">
                          <a
                            className="line-clamp-2 break-all text-[13px] leading-5 text-[#9c9c9d] underline decoration-white/20 underline-offset-4 transition hover:text-white"
                            href={link.originalUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {link.originalUrl}
                          </a>
                        </td>
                        <td className="px-4 py-3.5 text-[13px] text-[#9c9c9d]">{link.clickCount}</td>
                        <td className="px-4 py-3.5 text-[13px] leading-5 text-[#9c9c9d]">{createdAtLabel}</td>
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
                    className="rounded-xl border border-white/[0.08] bg-[#07080a] p-3.5"
                  >
                    <div className="space-y-2.5">
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff6363]">
                          {link.shortCode}
                        </p>
                        <h3 className="text-[15px] font-semibold text-white">
                          {link.title ?? "Untitled link"}
                        </h3>
                      </div>

                      <div className="space-y-1.5 text-sm leading-6 text-[#9c9c9d]">
                        <p className="break-all">
                          Destination:{" "}
                          <a
                            className="font-medium text-[#cecece] underline decoration-white/20 underline-offset-4 transition hover:text-white"
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
                            className="ray-link font-medium"
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

            <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                aria-disabled={currentPage <= 1}
                className={`inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-sm font-semibold transition ${currentPage <= 1
                  ? "pointer-events-none border-white/[0.06] text-[#434345]"
                  : "border-white/[0.1] bg-transparent text-[#cecece] hover:opacity-60"
                  }`}
                href={previousPageHref}
              >
                Previous
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-[#6a6b6c]">
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
                        {needsGap ? <span className="px-1 text-[#434345]">…</span> : null}
                        <Link
                          className={`inline-flex h-7.5 min-w-7.5 items-center justify-center rounded-full px-2.5 text-sm font-semibold transition ${pageNumber === currentPage
                            ? "bg-white text-[#18191a]"
                            : "border border-white/[0.1] bg-transparent text-[#cecece] hover:opacity-60"
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
                  ? "pointer-events-none border-white/[0.06] text-[#434345]"
                  : "border-white/[0.1] bg-transparent text-[#cecece] hover:opacity-60"
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
