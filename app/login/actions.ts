"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  buildAuthRedirect,
  createSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function getCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
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
        "We could not find an account with that email. Create one first.",
      ),
    );
  }

  const passwordIsValid = await verifyPassword(password, user.passwordHash);

  if (!passwordIsValid) {
    redirect(
      buildAuthRedirect("/login", "error", "Incorrect email or password."),
    );
  }

  await createSession(user.id);

  revalidatePath("/", "layout");
  redirect("/library");
}

export async function signup(formData: FormData) {
  const { email, password } = getCredentials(formData);

  if (!email || !password) {
    redirect(
      buildAuthRedirect(
        "/signup",
        "error",
        "Email and password are both required.",
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

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser?.passwordHash) {
    redirect(
      buildAuthRedirect(
        "/signup",
        "error",
        "An account with this email already exists. Sign in instead.",
      ),
    );
  }

  const passwordHash = await hashPassword(password);

  const user = existingUser
    ? await prisma.user.update({
      where: {
        email,
      },
      data: {
        passwordHash,
      },
    })
    : await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

  await createSession(user.id);

  revalidatePath("/", "layout");
  redirect("/library");
}
