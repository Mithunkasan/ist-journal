/*
  Warnings:

  - Added the required column `userId` to the `AssignedJournals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignedJournals" ADD COLUMN     "abstract" TEXT,
ADD COLUMN     "authorEmail" TEXT,
ADD COLUMN     "authorNames" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "howToKnow" TEXT,
ADD COLUMN     "paperUrl" TEXT,
ADD COLUMN     "primaryDomain" TEXT,
ADD COLUMN     "secondaryDomain" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubmittedJournals" ADD COLUMN     "status" TEXT;

-- AddForeignKey
ALTER TABLE "AssignedJournals" ADD CONSTRAINT "AssignedJournals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
