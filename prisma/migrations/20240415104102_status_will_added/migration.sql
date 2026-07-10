/*
  Warnings:

  - The `status` column on the `AssignedJournals` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `SubmittedJournals` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SUBMITTED', 'ASSIGNED', 'PENDINGTOEDITORREVIEW', 'CORRECTIONS', 'REJECTED');

-- AlterTable
ALTER TABLE "AssignedJournals" DROP COLUMN "status",
ADD COLUMN     "status" "Status";

-- AlterTable
ALTER TABLE "SubmittedJournals" DROP COLUMN "status",
ADD COLUMN     "status" "Status";

-- DropEnum
DROP TYPE "JournalStatus";
