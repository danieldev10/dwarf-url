"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  generateUniqueShortCode,
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
    const shortCode = await generateUniqueShortCode();

    await prisma.shortLink.create({
      data: {
        title: title || null,
        originalUrl,
        shortCode,
        userId: user.id,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We could not create that short link. Please try again.";

    redirect(buildRedirect("/create", "error", message));
  }

  revalidatePath("/create");
  revalidatePath("/library");
  redirect(buildRedirect("/library", "message", "Short link created."));
}
