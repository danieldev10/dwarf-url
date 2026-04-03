import "server-only";

import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";

const SHORT_CODE_ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SHORT_CODE_LENGTH = 7;
const MAX_GENERATION_ATTEMPTS = 20;

export function normalizeOriginalUrl(input: string) {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    throw new Error("Paste a URL to shorten.");
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

export async function generateUniqueShortCode() {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const candidate = generateShortCodeCandidate();
    const existingLink = await prisma.shortLink.findUnique({
      where: {
        shortCode: candidate,
      },
      select: {
        id: true,
      },
    });

    if (!existingLink) {
      return candidate;
    }
  }

  throw new Error("We could not generate a unique short code. Please try again.");
}
