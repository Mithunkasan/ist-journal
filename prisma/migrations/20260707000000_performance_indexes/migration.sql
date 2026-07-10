CREATE INDEX IF NOT EXISTS "User_Status_idx" ON "User"("Status");
CREATE INDEX IF NOT EXISTS "User_Status_createdDate_idx" ON "User"("Status", "createdDate");
CREATE INDEX IF NOT EXISTS "ActivityLog_timestamp_idx" ON "ActivityLog"("timestamp");

CREATE INDEX IF NOT EXISTS "SubmittedJournals_associateEditor_status_createdAt_idx"
  ON "SubmittedJournals"("associateEditor", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "SubmittedJournals_isAccepted_updatedAt_idx"
  ON "SubmittedJournals"("isAccepted", "updatedAt");
CREATE INDEX IF NOT EXISTS "SubmittedJournals_updatedAt_idx" ON "SubmittedJournals"("updatedAt");

CREATE INDEX IF NOT EXISTS "AssignedJournals_associateEditor_status_updatedAt_idx"
  ON "AssignedJournals"("associateEditor", "status", "updatedAt");
CREATE INDEX IF NOT EXISTS "AssignedJournals_updatedAt_idx" ON "AssignedJournals"("updatedAt");

CREATE INDEX IF NOT EXISTS "ReviewLegacy_reviewerId_status_createdAt_idx"
  ON "ReviewLegacy"("reviewerId", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "ReviewLegacy_paperID_idx" ON "ReviewLegacy"("paperID");

CREATE INDEX IF NOT EXISTS "Published_paperID_idx" ON "Published"("paperID");
CREATE INDEX IF NOT EXISTS "Published_status_updatedAt_idx" ON "Published"("status", "updatedAt");

CREATE INDEX IF NOT EXISTS "RejectedJournal_authorEmail_idx" ON "RejectedJournal"("authorEmail");
CREATE INDEX IF NOT EXISTS "RejectedJournal_paperID_idx" ON "RejectedJournal"("paperID");
CREATE INDEX IF NOT EXISTS "RejectedJournal_status_updatedAt_idx" ON "RejectedJournal"("status", "updatedAt");
CREATE INDEX IF NOT EXISTS "RejectedJournal_updatedAt_idx" ON "RejectedJournal"("updatedAt");
