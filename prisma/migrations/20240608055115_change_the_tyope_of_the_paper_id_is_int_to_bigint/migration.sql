-- AlterTable
ALTER TABLE "Archives" ALTER COLUMN "paperID" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "AssignedJournals" ALTER COLUMN "paperID" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Published" ALTER COLUMN "paperID" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "SubmittedJournals" ALTER COLUMN "paperID" SET DATA TYPE BIGINT;
