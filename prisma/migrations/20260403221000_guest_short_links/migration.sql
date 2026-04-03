-- DropForeignKey
ALTER TABLE "ShortLink" DROP CONSTRAINT "ShortLink_userId_fkey";

-- AlterTable
ALTER TABLE "ShortLink"
ALTER COLUMN "userId" DROP NOT NULL,
ADD COLUMN     "guestTokenHash" TEXT;

-- CreateIndex
CREATE INDEX "ShortLink_guestTokenHash_createdAt_idx" ON "ShortLink"("guestTokenHash", "createdAt");

-- AddForeignKey
ALTER TABLE "ShortLink" ADD CONSTRAINT "ShortLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
