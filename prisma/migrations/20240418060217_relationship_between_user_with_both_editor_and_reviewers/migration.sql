-- AlterTable
ALTER TABLE "AssignedJournals" ADD COLUMN     "reviewerId" TEXT;

-- AddForeignKey
ALTER TABLE "AssignedJournals" ADD CONSTRAINT "AssignedJournals_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
