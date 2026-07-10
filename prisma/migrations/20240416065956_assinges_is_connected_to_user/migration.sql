/*
  Warnings:

  - You are about to drop the `Editor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Editor" DROP CONSTRAINT "Editor_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "areaOfExpertise" TEXT,
ADD COLUMN     "qualification" TEXT,
ADD COLUMN     "university" TEXT;

-- DropTable
DROP TABLE "Editor";
