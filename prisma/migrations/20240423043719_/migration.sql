/*
  Warnings:

  - The values [ASSIGNED,PENDINGTOEDITORREVIEW,CORRECTIONS] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('SUBMITTED', 'ASSIGNED_TO_EDITOR', 'UNDER_EDITOR_REVIEW', 'REVIEWER_ASSIGNED', 'UNDER_REVIEW_BY_REVIEWER', 'DECISION_PENDING', 'REVISIONS_REQUESTED', 'REVISIONS_SUBMITTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
ALTER TABLE "SubmittedJournals" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "AssignedJournals" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;
