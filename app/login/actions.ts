"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { claimGuestShortLinks } from "@/lib/auth/guest-links";
import {
  buildAuthRedirect,
  createSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  RateLimitError,
  assertRateLimit,
  getRateLimitValue,
  getRequestFingerprint,
} from "@/lib/security/rate-limit";

const INVALID_LOGIN_MESSAGE = "Incorrect email or password.";
const SIGNUP_FAILURE_MESSAGE =
  "We couldn't create that account. If you've already signed up, try signing in.";

async function enforceAuthRateLimit(scope: "login" | "signup", email: string) {
  const requestFingerprint = await getRequestFingerprint();
  const normalizedEmail = email || "missing-email";
  const authIpRateLimit = getRateLimitValue("DWARFURL_AUTH_IP_RATE_LIMIT", 20);
  const authEmailRateLimit = getRateLimitValue("DWARFURL_AUTH_EMAIL_RATE_LIMIT", 8);

  assertRateLimit({
    keyParts: [requestFingerprint],
    limit: authIpRateLimit,
    message: "Too many attempts. Please wait a few minutes and try again.",
    scope: scope + "-ip",
    windowMs: 1000 * 60 * 10,
  });

  assertRateLimit({
    keyParts: [requestFingerprint, normalizedEmail],
    limit: authEmailRateLimit,
    message: "Too many attempts. Please wait a few minutes and try again.",
    scope: scope + "-email",
    windowMs: 1000 * 60 * 10,
  });
}

function getCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

function getSignupDetails(formData: FormData) {
  return {
    ...getCredentials(formData),
    name: String(formData.get("name") ?? "")
      .trim()
      .replace(/\s+/g, " "),
  };
}

export async function login(formData: FormData) {
  const { email, password } = getCredentials(formData);

  if (!email || !password) {
    redirect(
      buildAuthRedirect(
        "/login",
        "error",
        "Email and password are both required.",
      ),
    );
  }

  try {
    await enforceAuthRateLimit("login", email);
  } catch (error) {
    if (error instanceof RateLimitError) {
      redirect(buildAuthRedirect("/login", "error", error.message));
    }

    throw error;
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user?.passwordHash) {
    redirect(
      buildAuthRedirect(
        "/login",
        "error",
        INVALID_LOGIN_MESSAGE,
      ),
    );
  }

  const passwordIsValid = await verifyPassword(password, user.passwordHash);

  if (!passwordIsValid) {
    redirect(buildAuthRedirect("/login", "error", INVALID_LOGIN_MESSAGE));
  }

  await claimGuestShortLinks(user.id);
  await createSession(user.id);

  revalidatePath("/", "layout");
  revalidatePath("/create");
  revalidatePath("/library");
  redirect("/library");
}

export async function signup(formData: FormData) {
  const { email, name, password } = getSignupDetails(formData);

  if (!name || !email || !password) {
    redirect(
      buildAuthRedirect(
        "/signup",
        "error",
        "Name, email, and password are all required.",
      ),
    );
  }

  if (name.length > 80) {
    redirect(
      buildAuthRedirect(
        "/signup",
        "error",
        "Keep your name under 80 characters.",
      ),
    );
  }

  if (password.length < 8) {
    redirect(
      buildAuthRedirect(
        "/signup",
        "error",
        "Choose a password with at least 8 characters.",
      ),
    );
  }

  try {
    await enforceAuthRateLimit("signup", email);
  } catch (error) {
    if (error instanceof RateLimitError) {
      redirect(buildAuthRedirect("/signup", "error", error.message));
    }

    throw error;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    redirect(
      buildAuthRedirect(
        "/signup",
        "error",
        SIGNUP_FAILURE_MESSAGE,
      ),
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  await claimGuestShortLinks(user.id);
  await createSession(user.id);

  revalidatePath("/", "layout");
  revalidatePath("/create");
  revalidatePath("/library");
  redirect("/library");
}
