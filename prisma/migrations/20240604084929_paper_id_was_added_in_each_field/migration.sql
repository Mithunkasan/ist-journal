-- AlterTable
ALTER TABLE "Archives" ADD COLUMN     "paperID" TEXT;

-- AlterTable
ALTER TABLE "AssignedJournals" ADD COLUMN     "paperID" TEXT;

-- AlterTable
ALTER TABLE "SubmittedJournals" ADD COLUMN     "paperID" TEXT;
