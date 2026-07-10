/*
  Warnings:

  - The `paperID` column on the `Archives` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paperID` column on the `AssignedJournals` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paperID` column on the `Published` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paperID` column on the `SubmittedJournals` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Archives" DROP COLUMN "paperID",
ADD COLUMN     "paperID" INTEGER;

-- AlterTable
ALTER TABLE "AssignedJournals" DROP COLUMN "paperID",
ADD COLUMN     "paperID" INTEGER;

-- AlterTable
ALTER TABLE "Published" DROP COLUMN "paperID",
ADD COLUMN     "paperID" INTEGER;

-- AlterTable
ALTER TABLE "SubmittedJournals" DROP COLUMN "paperID",
ADD COLUMN     "paperID" INTEGER;
