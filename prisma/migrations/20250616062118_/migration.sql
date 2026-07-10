-- AlterTable
ALTER TABLE "_AssignedJournals_Reviewers" ADD CONSTRAINT "_AssignedJournals_Reviewers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AssignedJournals_Reviewers_AB_unique";
