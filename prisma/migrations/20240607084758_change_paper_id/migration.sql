/*
  Warnings:

  - You are about to drop the column `paperId` on the `Published` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Published" DROP COLUMN "paperId",
ADD COLUMN     "paperID" TEXT;
