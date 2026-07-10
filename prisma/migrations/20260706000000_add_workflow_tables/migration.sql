-- Add workflow enum values used by the redesigned editorial process.
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'EDITOR_SCREENING';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'DESK_REJECTED';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'ASSOCIATE_EDITOR_REVIEW';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'REVIEWER_ASSIGNMENT';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'UNDER_REVIEW';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'EDITOR_DECISION';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'MINOR_REVISION';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'MAJOR_REVISION';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'REVISION_SUBMITTED';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'UNDER_REVIEW_AGAIN';
ALTER TYPE "Status" ADD VALUE IF NOT EXISTS 'PRODUCTION';

-- Backfill columns present in schema.prisma but missing from the older
-- migration history, so fresh resets match the current Prisma schema.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "orcid" TEXT;

ALTER TABLE "SubmittedJournals" ADD COLUMN IF NOT EXISTS "associateEditor" TEXT;
ALTER TABLE "SubmittedJournals" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "SubmittedJournals" ADD COLUMN IF NOT EXISTS "supportingFilesUrl" TEXT;
ALTER TABLE "SubmittedJournals" ADD COLUMN IF NOT EXISTS "doi" TEXT;
ALTER TABLE "SubmittedJournals" ADD COLUMN IF NOT EXISTS "productionStep" INTEGER DEFAULT 0;
ALTER TABLE "SubmittedJournals" ADD COLUMN IF NOT EXISTS "revisionComments" TEXT;
ALTER TABLE "SubmittedJournals" ADD COLUMN IF NOT EXISTS "responseLetterUrl" TEXT;
ALTER TABLE "SubmittedJournals" ADD COLUMN IF NOT EXISTS "orcid" TEXT;
ALTER TABLE "SubmittedJournals" ADD COLUMN IF NOT EXISTS "coverLetterUrl" TEXT;

ALTER TABLE "AssignedJournals" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "AssignedJournals" ADD COLUMN IF NOT EXISTS "supportingFilesUrl" TEXT;
ALTER TABLE "AssignedJournals" ADD COLUMN IF NOT EXISTS "doi" TEXT;
ALTER TABLE "AssignedJournals" ADD COLUMN IF NOT EXISTS "productionStep" INTEGER DEFAULT 0;
ALTER TABLE "AssignedJournals" ADD COLUMN IF NOT EXISTS "revisionComments" TEXT;
ALTER TABLE "AssignedJournals" ADD COLUMN IF NOT EXISTS "responseLetterUrl" TEXT;
ALTER TABLE "AssignedJournals" ADD COLUMN IF NOT EXISTS "orcid" TEXT;
ALTER TABLE "AssignedJournals" ADD COLUMN IF NOT EXISTS "coverLetterUrl" TEXT;

ALTER TABLE "Archives" ADD COLUMN IF NOT EXISTS "doi" TEXT;
ALTER TABLE "Archives" ADD COLUMN IF NOT EXISTS "orcid" TEXT;
ALTER TABLE "Archives" ADD COLUMN IF NOT EXISTS "coverLetterUrl" TEXT;

ALTER TABLE "Published" ADD COLUMN IF NOT EXISTS "doi" TEXT;
ALTER TABLE "Published" ADD COLUMN IF NOT EXISTS "orcid" TEXT;
ALTER TABLE "Published" ADD COLUMN IF NOT EXISTS "coverLetterUrl" TEXT;

ALTER TABLE "RejectedJournal" ADD COLUMN IF NOT EXISTS "coverLetterUrl" TEXT;

-- Redesigned workflow profile tables.
CREATE TABLE IF NOT EXISTS "Author" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Editor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Editor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AssociateEditor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AssociateEditor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Reviewer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Reviewer_pkey" PRIMARY KEY ("id")
);

-- Redesigned manuscript workflow tables.
CREATE TABLE IF NOT EXISTS "Submission" (
    "id" TEXT NOT NULL,
    "paperID" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "authorId" TEXT NOT NULL,
    "editorId" TEXT,
    "associateEditorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Manuscript" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "coverLetterUrl" TEXT,
    "supplementaryFilesUrl" TEXT,
    "roundNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Manuscript_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ReviewAssignment" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "blindType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "manuscriptId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "recommendation" TEXT,
    "commentsForAuthor" TEXT,
    "commentsForEditor" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Revision" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "revisedPdfUrl" TEXT NOT NULL,
    "responseLetterUrl" TEXT NOT NULL,
    "revisionNotes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Decision" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "decisionType" TEXT NOT NULL,
    "comments" TEXT,
    "editorId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Production" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "doi" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Production_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "submissionId" TEXT,
    "previousStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ReviewLegacy" (
    "id" SERIAL NOT NULL,
    "paperID" INTEGER NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "commentsToAuthor" TEXT,
    "commentsToEditor" TEXT,
    "recommendation" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3),

    CONSTRAINT "ReviewLegacy_pkey" PRIMARY KEY ("id")
);

-- Unique constraints.
CREATE UNIQUE INDEX IF NOT EXISTS "Author_userId_key" ON "Author"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Editor_userId_key" ON "Editor"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "AssociateEditor_userId_key" ON "AssociateEditor"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Reviewer_userId_key" ON "Reviewer"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Submission_paperID_key" ON "Submission"("paperID");
CREATE UNIQUE INDEX IF NOT EXISTS "Production_submissionId_key" ON "Production"("submissionId");

-- Foreign keys.
ALTER TABLE "Author" ADD CONSTRAINT "Author_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Editor" ADD CONSTRAINT "Editor_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AssociateEditor" ADD CONSTRAINT "AssociateEditor_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reviewer" ADD CONSTRAINT "Reviewer_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Submission" ADD CONSTRAINT "Submission_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Submission" ADD CONSTRAINT "Submission_editorId_fkey"
  FOREIGN KEY ("editorId") REFERENCES "Editor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Submission" ADD CONSTRAINT "Submission_associateEditorId_fkey"
  FOREIGN KEY ("associateEditorId") REFERENCES "AssociateEditor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Manuscript" ADD CONSTRAINT "Manuscript_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReviewAssignment" ADD CONSTRAINT "ReviewAssignment_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReviewAssignment" ADD CONSTRAINT "ReviewAssignment_reviewerId_fkey"
  FOREIGN KEY ("reviewerId") REFERENCES "Reviewer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" ADD CONSTRAINT "Review_assignmentId_fkey"
  FOREIGN KEY ("assignmentId") REFERENCES "ReviewAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey"
  FOREIGN KEY ("reviewerId") REFERENCES "Reviewer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" ADD CONSTRAINT "Review_manuscriptId_fkey"
  FOREIGN KEY ("manuscriptId") REFERENCES "Manuscript"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Revision" ADD CONSTRAINT "Revision_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Decision" ADD CONSTRAINT "Decision_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Decision" ADD CONSTRAINT "Decision_editorId_fkey"
  FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Production" ADD CONSTRAINT "Production_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
