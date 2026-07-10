/*
  Warnings:

  - You are about to drop the column `userId` on the `SubmittedJournals` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubmittedJournals" DROP CONSTRAINT "SubmittedJournals_userId_fkey";

-- AlterTable
ALTER TABLE "SubmittedJournals" DROP COLUMN "userId";
