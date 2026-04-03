import type { Prisma } from "@/generated/prisma/client";

export const PAGE_SIZE = 8;
export const DEFAULT_LIBRARY_SORT = "newest";

export const LIBRARY_SORT_OPTIONS = [
  {
    label: "Newest first",
    value: "newest",
  },
  {
    label: "Oldest first",
    value: "oldest",
  },
  {
    label: "Most clicks",
    value: "most-clicked",
  },
] as const;

export type LibrarySort = (typeof LIBRARY_SORT_OPTIONS)[number]["value"];

export function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function getCurrentPage(value: string | string[] | undefined) {
  const rawValue = getSingleSearchParam(value);
  const parsedValue = Number.parseInt(rawValue, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1;
}

export function getLibrarySort(value: string | string[] | undefined): LibrarySort {
  const rawValue = getSingleSearchParam(value);

  if (
    LIBRARY_SORT_OPTIONS.some((option) => option.value === rawValue)
  ) {
    return rawValue as LibrarySort;
  }

  return DEFAULT_LIBRARY_SORT;
}

export function buildLibraryHref(options: {
  kind?: "error" | "message";
  page?: number;
  query?: string;
  sort?: LibrarySort;
  text?: string;
}) {
  const searchParams = new URLSearchParams();
  const query = options.query?.trim() ?? "";
  const sort = options.sort ?? DEFAULT_LIBRARY_SORT;
  const page = options.page && options.page > 1 ? options.page : 1;

  if (query) {
    searchParams.set("query", query);
  }

  if (sort !== DEFAULT_LIBRARY_SORT) {
    searchParams.set("sort", sort);
  }

  if (page > 1) {
    searchParams.set("page", String(page));
  }

  if (options.kind && options.text) {
    searchParams.set(options.kind, options.text);
  }

  const queryString = searchParams.toString();

  return queryString ? "/library?" + queryString : "/library";
}

export function getLibraryWhere(userId: string, query: string) {
  return {
    userId,
    ...(query
      ? {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            originalUrl: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            shortCode: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
        ],
      }
      : {}),
  };
}

export function getLibraryOrderBy(sort: LibrarySort): Prisma.ShortLinkOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [
        {
          createdAt: "asc",
        },
        {
          id: "asc",
        },
      ];
    case "most-clicked":
      return [
        {
          clickCount: "desc",
        },
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ];
    case "newest":
    default:
      return [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ];
  }
}

export function clampLibraryPage(totalLinks: number, requestedPage: number) {
  const totalPages = Math.max(1, Math.ceil(totalLinks / PAGE_SIZE));

  return {
    currentPage: Math.min(requestedPage, totalPages),
    totalPages,
  };
}
