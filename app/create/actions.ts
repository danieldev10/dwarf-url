"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import {
  RateLimitError,
  assertRateLimit,
  getRateLimitValue,
} from "@/lib/security/rate-limit";
import {
  createShortLinkRecord,
  normalizeOriginalUrl,
} from "@/lib/short-links";

function buildRedirect(
  path: "/create" | "/library",
  kind: "error" | "message",
  text: string,
) {
  return path + "?" + kind + "=" + encodeURIComponent(text);
}

export async function createShortLink(formData: FormData) {
  const user = await requireUser("Please sign in to create short links.");
  const title = String(formData.get("title") ?? "").trim();
  const originalUrlInput = String(formData.get("originalUrl") ?? "").trim();
  const createLinkRateLimit = getRateLimitValue("DWARFURL_CREATE_LINK_RATE_LIMIT", 25);

  try {
    assertRateLimit({
      keyParts: [user.id],
      limit: createLinkRateLimit,
      message: "You're creating links too quickly. Please wait a minute and try again.",
      scope: "create-short-link",
      windowMs: 1000 * 60,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      redirect(buildRedirect("/create", "error", error.message));
    }

    throw error;
  }

  if (title.length > 80) {
    redirect(
      buildRedirect("/create", "error", "Keep the title under 80 characters."),
    );
  }

  let originalUrl = "";

  try {
    originalUrl = normalizeOriginalUrl(originalUrlInput);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Enter a valid http or https URL.";

    redirect(buildRedirect("/create", "error", message));
  }

  try {
    await createShortLinkRecord({
      originalUrl,
      title: title || null,
      userId: user.id,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      redirect(buildRedirect("/create", "error", error.message));
    }

    redirect(
      buildRedirect(
        "/create",
        "error",
        "We couldn't create that short link. Please try again.",
      ),
    );
  }

  revalidatePath("/create");
  revalidatePath("/library");
  redirect(buildRedirect("/library", "message", "Short link created."));
}
