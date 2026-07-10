/*
  Warnings:

  - You are about to drop the column `ispublished` on the `Archives` table. All the data in the column will be lost.
  - You are about to drop the column `ispublished` on the `AssignedJournals` table. All the data in the column will be lost.
  - You are about to drop the column `ispublished` on the `Published` table. All the data in the column will be lost.
  - You are about to drop the column `ispublished` on the `SubmittedJournals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Archives" DROP COLUMN "ispublished",
ADD COLUMN     "isPublished" BOOLEAN;

-- AlterTable
ALTER TABLE "AssignedJournals" DROP COLUMN "ispublished",
ADD COLUMN     "isPublished" BOOLEAN;

-- AlterTable
ALTER TABLE "Published" DROP COLUMN "ispublished",
ADD COLUMN     "isPublished" BOOLEAN;

-- AlterTable
ALTER TABLE "SubmittedJournals" DROP COLUMN "ispublished",
ADD COLUMN     "isPublished" BOOLEAN;
