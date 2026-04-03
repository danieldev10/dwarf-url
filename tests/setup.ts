import "dotenv/config";

import { afterEach, beforeEach, vi } from "vitest";

import { cleanupIntegrationData } from "./support/database";
import {
  NotFoundError,
  RedirectError,
  getMockCookieStore,
  getMockHeaderStore,
  resetNextMockState,
} from "./support/next-test-context";

process.env.DWARFURL_AUTH_EMAIL_RATE_LIMIT = "3";
process.env.DWARFURL_CLICK_RATE_LIMIT = "3";

export const revalidatePathMock = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => getMockCookieStore()),
  headers: vi.fn(async () => getMockHeaderStore()),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new NotFoundError();
  },
  redirect: (destination: string) => {
    throw new RedirectError(destination);
  },
}));

beforeEach(async () => {
  const { resetRateLimitsForTests } = await import("@/lib/security/rate-limit");

  resetNextMockState();
  resetRateLimitsForTests();
  revalidatePathMock.mockReset();
  await cleanupIntegrationData();
});

afterEach(async () => {
  const { resetRateLimitsForTests } = await import("@/lib/security/rate-limit");

  resetNextMockState();
  resetRateLimitsForTests();
  revalidatePathMock.mockReset();
  await cleanupIntegrationData();
});
