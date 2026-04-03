import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import {
  getRateLimitValue,
  getRequestFingerprint,
  shouldAllowRateLimitedAction,
} from "@/lib/security/rate-limit";

type ShortCodePageProps = {
  params: Promise<{
    shortCode: string;
  }>;
};

export default async function ShortCodePage({ params }: ShortCodePageProps) {
  const { shortCode } = await params;
  const link = await prisma.shortLink.findUnique({
    where: {
      shortCode,
    },
    select: {
      id: true,
      originalUrl: true,
    },
  });

  if (!link) {
    notFound();
  }

  const requestFingerprint = await getRequestFingerprint();
  const clickRateLimit = getRateLimitValue("DWARFURL_CLICK_RATE_LIMIT", 20);
  const shouldCountClick = shouldAllowRateLimitedAction({
    keyParts: [shortCode, requestFingerprint],
    limit: clickRateLimit,
    scope: "short-link-click",
    windowMs: 1000 * 60,
  });

  if (shouldCountClick) {
    await prisma.shortLink.update({
      where: {
        id: link.id,
      },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  }

  redirect(link.originalUrl);
}
