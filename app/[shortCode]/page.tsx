import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

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

  redirect(link.originalUrl);
}
