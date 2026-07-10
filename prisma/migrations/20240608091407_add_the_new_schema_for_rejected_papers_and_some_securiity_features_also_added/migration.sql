/*
  Warnings:

  - You are about to alter the column `paperID` on the `Archives` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `paperID` on the `AssignedJournals` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `paperID` on the `Published` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `paperID` on the `SubmittedJournals` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Archives" ADD COLUMN     "isAssigndToEditor" BOOLEAN,
ADD COLUMN     "isAssociatedEditorAssigned" BOOLEAN,
ADD COLUMN     "isReviewerAssigned" BOOLEAN,
ADD COLUMN     "isSubmitted" BOOLEAN,
ALTER COLUMN "paperID" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "AssignedJournals" ADD COLUMN     "isAssigndToEditor" BOOLEAN,
ADD COLUMN     "isAssociatedEditorAssigned" BOOLEAN,
ADD COLUMN     "isReviewerAssigned" BOOLEAN,
ADD COLUMN     "isSubmitted" BOOLEAN,
ALTER COLUMN "paperID" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Published" ADD COLUMN     "isAssigndToEditor" BOOLEAN,
ADD COLUMN     "isAssociatedEditorAssigned" BOOLEAN,
ADD COLUMN     "isReviewerAssigned" BOOLEAN,
ADD COLUMN     "isSubmitted" BOOLEAN,
ALTER COLUMN "paperID" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "SubmittedJournals" ADD COLUMN     "isAssigndToEditor" BOOLEAN,
ADD COLUMN     "isAssociatedEditorAssigned" BOOLEAN,
ADD COLUMN     "isReviewerAssigned" BOOLEAN,
ADD COLUMN     "isSubmitted" BOOLEAN,
ALTER COLUMN "paperID" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "RejectedJournal" (
    "id" SERIAL NOT NULL,
    "rejectedPerson" TEXT,
    "rejectedReasons" TEXT,
    "type" TEXT,
    "title" TEXT,
    "paperID" INTEGER,
    "isSubmitted" BOOLEAN,
    "isAssigndToEditor" BOOLEAN,
    "isReviewerAssigned" BOOLEAN,
    "isAssociatedEditorAssigned" BOOLEAN,
    "paperUrl" TEXT,
    "abstract" TEXT,
    "country" TEXT,
    "primaryDomain" TEXT,
    "secondaryDomain" TEXT,
    "authorNames" TEXT,
    "authorEmail" TEXT,
    "keywords" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3),
    "status" "Status",

    CONSTRAINT "RejectedJournal_pkey" PRIMARY KEY ("id")
);
