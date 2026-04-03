import "server-only";

import crypto from "node:crypto";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const SHORT_CODE_ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SHORT_CODE_LENGTH = 7;
const MAX_GENERATION_ATTEMPTS = 20;

export function normalizeOriginalUrl(input: string) {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    throw new Error("Paste a URL to shorten.");
  }

  const explicitSchemeMatch = trimmedInput.match(/^([a-z][a-z\d+\-.]*):/i);

  if (explicitSchemeMatch && !/^https?:\/\//i.test(trimmedInput)) {
    throw new Error("Enter a valid http or https URL.");
  }

  const missingSchemeSeparatorMatch = trimmedInput.match(
    /^([a-z][a-z\d+\-.]*)\/\//i,
  );

  if (missingSchemeSeparatorMatch) {
    const missingSchemeSeparatorPrefix =
      missingSchemeSeparatorMatch[1].toLowerCase();

    if (
      missingSchemeSeparatorPrefix !== "localhost" &&
      !missingSchemeSeparatorPrefix.includes(".")
    ) {
      throw new Error("Enter a valid http or https URL.");
    }
  }

  const candidate = /^https?:\/\//i.test(trimmedInput)
    ? trimmedInput
    : "https://" + trimmedInput;

  const parsedUrl = new URL(candidate);

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("Enter a valid http or https URL.");
  }

  return parsedUrl.toString();
}

function generateShortCodeCandidate() {
  let shortCode = "";

  for (let index = 0; index < SHORT_CODE_LENGTH; index += 1) {
    const randomIndex = crypto.randomInt(0, SHORT_CODE_ALPHABET.length);
    shortCode += SHORT_CODE_ALPHABET[randomIndex];
  }

  return shortCode;
}

function isShortCodeConflict(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function createShortLinkRecord(input: {
  originalUrl: string;
  title: string | null;
  userId: string;
}) {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const shortCode = generateShortCodeCandidate();

    try {
      return await prisma.shortLink.create({
        data: {
          ...input,
          shortCode,
        },
      });
    } catch (error) {
      if (isShortCodeConflict(error)) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("We couldn't generate a unique short link. Please try again.");
}
