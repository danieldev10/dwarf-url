"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  buildLibraryHref,
  clampLibraryPage,
  getLibrarySort,
  getLibraryWhere,
} from "@/app/library/utils";

function normalizeQueryParam(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePageParam(value: FormDataEntryValue | null) {
  const rawValue = typeof value === "string" ? value : "";
  const parsedValue = Number.parseInt(rawValue, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1;
}

export async function updateShortLinkTitle(formData: FormData) {
  const user = await requireUser("Please sign in to manage your links.");
  const linkId = normalizeQueryParam(formData.get("linkId"));
  const title = normalizeQueryParam(formData.get("title"));
  const query = normalizeQueryParam(formData.get("query"));
  const page = normalizePageParam(formData.get("page"));
  const sort = getLibrarySort(normalizeQueryParam(formData.get("sort")));

  if (!linkId) {
    redirect(buildLibraryHref({
      kind: "error",
      page,
      query,
      sort,
      text: "We couldn't find that link.",
    }));
  }

  if (title.length > 80) {
    redirect(buildLibraryHref({
      kind: "error",
      page,
      query,
      sort,
      text: "Keep the title under 80 characters.",
    }));
  }

  const result = await prisma.shortLink.updateMany({
    where: {
      id: linkId,
      userId: user.id,
    },
    data: {
      title: title || null,
    },
  });

  if (result.count === 0) {
    redirect(buildLibraryHref({
      kind: "error",
      page,
      query,
      sort,
      text: "We couldn't update that link.",
    }));
  }

  const totalLinks = await prisma.shortLink.count({
    where: getLibraryWhere(user.id, query),
  });
  const { currentPage } = clampLibraryPage(totalLinks, page);

  revalidatePath("/library");
  redirect(buildLibraryHref({
    kind: "message",
    page: currentPage,
    query,
    sort,
    text: "Link title updated.",
  }));
}

export async function deleteShortLink(formData: FormData) {
  const user = await requireUser("Please sign in to manage your links.");
  const linkId = normalizeQueryParam(formData.get("linkId"));
  const query = normalizeQueryParam(formData.get("query"));
  const page = normalizePageParam(formData.get("page"));
  const sort = getLibrarySort(normalizeQueryParam(formData.get("sort")));

  if (!linkId) {
    redirect(buildLibraryHref({
      kind: "error",
      page,
      query,
      sort,
      text: "We couldn't find that link.",
    }));
  }

  const result = await prisma.shortLink.deleteMany({
    where: {
      id: linkId,
      userId: user.id,
    },
  });

  if (result.count === 0) {
    redirect(buildLibraryHref({
      kind: "error",
      page,
      query,
      sort,
      text: "We couldn't delete that link.",
    }));
  }

  const totalLinks = await prisma.shortLink.count({
    where: getLibraryWhere(user.id, query),
  });
  const { currentPage } = clampLibraryPage(totalLinks, page);

  revalidatePath("/library");
  redirect(buildLibraryHref({
    kind: "message",
    page: currentPage,
    query,
    sort,
    text: "Link deleted.",
  }));
}
