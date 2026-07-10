/*
  Warnings:

  - The primary key for the `_AssignedJournals_Reviewers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_AssignedJournals_Reviewers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_AssignedJournals_Reviewers" DROP CONSTRAINT "_AssignedJournals_Reviewers_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_AssignedJournals_Reviewers_AB_unique" ON "_AssignedJournals_Reviewers"("A", "B");
