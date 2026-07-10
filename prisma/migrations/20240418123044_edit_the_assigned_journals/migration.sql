/*
  Warnings:

  - You are about to drop the column `reviewerName` on the `AssignedJournals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssignedJournals" DROP COLUMN "reviewerName";

-- CreateTable
CREATE TABLE "_AssignedJournals_Reviewers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AssignedJournals_Reviewers_AB_unique" ON "_AssignedJournals_Reviewers"("A", "B");

-- CreateIndex
CREATE INDEX "_AssignedJournals_Reviewers_B_index" ON "_AssignedJournals_Reviewers"("B");

-- AddForeignKey
ALTER TABLE "_AssignedJournals_Reviewers" ADD CONSTRAINT "_AssignedJournals_Reviewers_A_fkey" FOREIGN KEY ("A") REFERENCES "AssignedJournals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedJournals_Reviewers" ADD CONSTRAINT "_AssignedJournals_Reviewers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
