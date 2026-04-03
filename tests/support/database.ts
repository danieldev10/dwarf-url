import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";

const TEST_EMAIL_PREFIX = "integration+";

export function createTestEmail() {
  return TEST_EMAIL_PREFIX + crypto.randomUUID() + "@example.com";
}

export async function cleanupIntegrationData() {
  await prisma.user.deleteMany({
    where: {
      email: {
        startsWith: TEST_EMAIL_PREFIX,
      },
    },
  });
}
