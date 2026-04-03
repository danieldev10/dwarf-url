import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaAdapter: PrismaPg | undefined;
};

const runtimeConnectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!runtimeConnectionString) {
  throw new Error("Set DATABASE_URL for app runtime access to PostgreSQL.");
}

const adapter =
  globalForPrisma.prismaAdapter ??
  new PrismaPg({ connectionString: runtimeConnectionString });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaAdapter = adapter;
}
