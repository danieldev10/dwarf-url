import "server-only";

import crypto from "node:crypto";

import { headers } from "next/headers";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type ConsumeRateLimitOptions = {
  keyParts: string[];
  limit: number;
  now?: number;
  scope: string;
  windowMs: number;
};

const globalForRateLimit = globalThis as unknown as {
  dwarfurlRateLimitBuckets: Map<string, RateLimitBucket> | undefined;
};

const rateLimitBuckets =
  globalForRateLimit.dwarfurlRateLimitBuckets ?? new Map<string, RateLimitBucket>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.dwarfurlRateLimitBuckets = rateLimitBuckets;
}

export class RateLimitError extends Error {
  retryAfterSeconds: number;

  constructor(message: string, retryAfterSeconds: number) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function hashKey(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function getWindowStart(now: number, windowMs: number) {
  return now - (now % windowMs);
}

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }
}

function getRateLimitPrefix() {
  return process.env.DWARFURL_RATE_LIMIT_PREFIX?.trim() || "dwarfurl:rate-limit";
}

function getBucketKey(scope: string, keyParts: string[], windowStart: number) {
  return [
    getRateLimitPrefix(),
    scope,
    String(windowStart),
    hashKey(keyParts.join(":")),
  ].join(":");
}

function consumeRateLimit({
  keyParts,
  limit,
  now = Date.now(),
  scope,
  windowMs,
}: ConsumeRateLimitOptions) {
  if (rateLimitBuckets.size >= 500) {
    pruneExpiredBuckets(now);
  }

  const windowStart = getWindowStart(now, windowMs);
  const resetAt = windowStart + windowMs;
  const bucketKey = getBucketKey(scope, keyParts, windowStart);
  const existingBucket = rateLimitBuckets.get(bucketKey);
  const nextCount = (existingBucket?.count ?? 0) + 1;

  rateLimitBuckets.set(bucketKey, {
    count: nextCount,
    resetAt,
  });

  return {
    allowed: nextCount <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  };
}

export async function getRequestFingerprint() {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  const requestIp =
    forwardedIp ??
    headerStore.get("x-real-ip") ??
    headerStore.get("cf-connecting-ip") ??
    "unknown-ip";
  const host = headerStore.get("host") ?? "unknown-host";

  return requestIp + "@" + host;
}

export function assertRateLimit(
  options: ConsumeRateLimitOptions & {
    message: string;
  },
) {
  const result = consumeRateLimit(options);

  if (!result.allowed) {
    throw new RateLimitError(options.message, result.retryAfterSeconds);
  }
}

export function shouldAllowRateLimitedAction(options: ConsumeRateLimitOptions) {
  return consumeRateLimit(options).allowed;
}

export function resetRateLimitsForTests() {
  rateLimitBuckets.clear();
}

export function getRateLimitValue(name: string, fallback: number) {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}
