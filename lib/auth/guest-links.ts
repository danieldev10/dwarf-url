import "server-only";

import crypto from "node:crypto";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export const GUEST_LINK_COOKIE_NAME = "dwarfurl_guest";

const GUEST_LINK_COOKIE_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

function hashGuestToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateGuestToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function getGuestCookieStore() {
  return cookies();
}

export async function getGuestLinkToken() {
  const cookieStore = await getGuestCookieStore();
  return cookieStore.get(GUEST_LINK_COOKIE_NAME)?.value ?? null;
}

async function setGuestLinkCookie(token: string) {
  const cookieStore = await getGuestCookieStore();
  const expiresAt = new Date(Date.now() + GUEST_LINK_COOKIE_DURATION_MS);

  cookieStore.set(GUEST_LINK_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function clearGuestLinkCookie() {
  const cookieStore = await getGuestCookieStore();

  cookieStore.set(GUEST_LINK_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
}

export async function getOrCreateGuestLinkTokenHash() {
  const existingToken = await getGuestLinkToken();

  if (existingToken) {
    return hashGuestToken(existingToken);
  }

  const token = generateGuestToken();
  await setGuestLinkCookie(token);
  return hashGuestToken(token);
}

export async function claimGuestShortLinks(userId: string) {
  const guestToken = await getGuestLinkToken();

  if (!guestToken) {
    return 0;
  }

  const result = await prisma.shortLink.updateMany({
    where: {
      guestTokenHash: hashGuestToken(guestToken),
      userId: null,
    },
    data: {
      guestTokenHash: null,
      userId,
    },
  });

  await clearGuestLinkCookie();
  return result.count;
}
