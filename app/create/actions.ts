"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getOrCreateGuestLinkTokenHash } from "@/lib/auth/guest-links";
import { getCurrentUser } from "@/lib/auth/session";
import {
  RateLimitError,
  assertRateLimit,
  getRateLimitValue,
  getRequestFingerprint,
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

function buildGuestSuccessRedirect(shortCode: string, message: string) {
  return (
    "/create?message=" +
    encodeURIComponent(message) +
    "&shortCode=" +
    encodeURIComponent(shortCode)
  );
}

export async function createShortLink(formData: FormData) {
  const user = await getCurrentUser();
  const title = String(formData.get("title") ?? "").trim();
  const originalUrlInput = String(formData.get("originalUrl") ?? "").trim();
  const createLinkRateLimit = getRateLimitValue(
    "DWARFURL_CREATE_LINK_RATE_LIMIT",
    25,
  );
  const guestCreateLinkRateLimit = getRateLimitValue(
    "DWARFURL_GUEST_CREATE_LINK_RATE_LIMIT",
    10,
  );
  const requestFingerprint = user ? null : await getRequestFingerprint();

  try {
    assertRateLimit({
      keyParts: [user?.id ?? requestFingerprint ?? "unknown-request"],
      limit: user ? createLinkRateLimit : guestCreateLinkRateLimit,
      message: user
        ? "You're creating links too quickly. Please wait a minute and try again."
        : "You're creating guest links too quickly. Please wait a minute and try again.",
      scope: user ? "create-short-link" : "create-short-link-guest",
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

  const ownerInput = user
    ? { userId: user.id }
    : { guestTokenHash: await getOrCreateGuestLinkTokenHash() };

  let shortLink: Awaited<ReturnType<typeof createShortLinkRecord>> | null = null;

  try {
    shortLink = await createShortLinkRecord({
      originalUrl,
      ...ownerInput,
      title: title || null,
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

  if (user) {
    redirect(buildRedirect("/library", "message", "Short link created."));
  }

  redirect(
    buildGuestSuccessRedirect(
      shortLink.shortCode,
      "Short link created. Sign in later to save it to your library.",
    ),
  );
}
