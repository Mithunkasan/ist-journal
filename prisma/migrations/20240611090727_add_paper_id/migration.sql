/*
  Warnings:

  - Added the required column `paperID` to the `SubmittedJournals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubmittedJournals" ADD COLUMN     "paperID" INTEGER NOT NULL;
