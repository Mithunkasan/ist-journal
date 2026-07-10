/*
  Warnings:

  - You are about to drop the `Journal` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "JournalStatus" AS ENUM ('SUBMITTED', 'ASSIGNED', 'PENDINGTOEDITORREVIEW', 'CORRECTIONS', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_userId_fkey";

-- DropTable
DROP TABLE "Journal";

-- CreateTable
CREATE TABLE "SubmittedJournals" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "title" TEXT,
    "abstract" TEXT,
    "paperUrl" TEXT,
    "primaryDomain" TEXT,
    "secondaryDomain" TEXT,
    "country" TEXT,
    "authorNames" TEXT,
    "authorEmail" TEXT,
    "howToKnow" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SubmittedJournals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignedJournals" (
    "id" SERIAL NOT NULL,
    "status" TEXT,
    "editorName" TEXT,

    CONSTRAINT "AssignedJournals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubmittedJournals" ADD CONSTRAINT "SubmittedJournals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
