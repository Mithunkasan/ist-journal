import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logActivity, createNotificationAndEmail } from "@/lib/workflow";
import { Status } from "@prisma/client";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { paperID, decision, comments } = body;

    if (!paperID || !decision || !comments) {
      return new NextResponse("Missing required decision fields", { status: 400 });
    }

    const parsedPaperID = parseInt(paperID);

    // Fetch the existing paper to get author details
    const paper = await prisma.submittedJournals.findFirst({
      where: { paperID: parsedPaperID }
    });

    if (!paper) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    // Fetch relational Submission
    let submission = await prisma.submission.findUnique({
      where: { paperID: parsedPaperID }
    });

    if (!submission) {
      // Fallback submission creation
      const authorUser = await prisma.user.findFirst({
        where: { email: { contains: paper.authorEmail || "" }, role: "AUTHOR" }
      });

      let authorProfile = authorUser ? await prisma.author.findUnique({ where: { userId: authorUser.id } }) : null;
      if (authorUser && !authorProfile) {
        authorProfile = await prisma.author.create({ data: { userId: authorUser.id } });
      }

      submission = await prisma.submission.create({
        data: {
          paperID: parsedPaperID,
          title: paper.title || "Untitled",
          status: Status.SUBMITTED,
          authorId: authorProfile ? authorProfile.id : session.user.id,
        }
      });
    }

    const prevStatus = submission.status;

    // Get the latest manuscript to find current round number
    const latestManuscript = await prisma.manuscript.findFirst({
      where: { submissionId: submission.id },
      orderBy: { roundNumber: "desc" }
    });
    const currentRound = latestManuscript ? latestManuscript.roundNumber : 1;

    if (decision === "ACCEPT") {
      // 1. ACCEPT -> Moves to production
      const nextStatus = Status.ACCEPTED;

      // Update relational Submission
      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: nextStatus }
      });

      // Log Decision
      await prisma.decision.create({
        data: {
          submissionId: submission.id,
          decisionType: "ACCEPTED",
          comments: comments || "Accepted for publication.",
          editorId: session.user.id,
          roundNumber: currentRound,
        }
      });

      // Initialize Production Stage
      await prisma.production.upsert({
        where: { submissionId: submission.id },
        update: { stage: "COPY_EDITING" },
        create: {
          submissionId: submission.id,
          stage: "COPY_EDITING"
        }
      });

      // Update legacy SubmittedJournals
      await prisma.submittedJournals.updateMany({
        where: { paperID: parsedPaperID },
        data: {
          status: "ACCEPTED",
          isAccepted: true,
          productionStep: 1, // Ready for copy editing (Step 1)
          revisionComments: comments
        }
      });

      // Update legacy AssignedJournals
      await prisma.assignedJournals.updateMany({
        where: { paperID: parsedPaperID },
        data: {
          status: "ACCEPTED",
          isEditable: true, // Allow editing in production
        }
      });

      // Log Activity
      await logActivity(session.user.id, "EDITOR_DECISION_ACCEPT", submission.id, prevStatus, nextStatus);

      // Send simulated email & Notification
      const authorUser = await prisma.user.findFirst({
        where: { email: { contains: paper.authorEmail || "" }, role: "AUTHOR" }
      });
      const targetUserId = authorUser ? authorUser.id : session.user.id;

      const emailBody = `Dear ${paper.authorNames},\n\nWe are absolutely delighted to inform you that your manuscript titled "${paper.title}" (ID: ${parsedPaperID}) has been ACCEPTED for publication in the International Scientific and Technological Journal.\n\nComments:\n${comments}\n\nYour paper has now entered our Production stage (Copy editing, Grammar correction, DOI generation). Our production editors will contact you if any proof checking is required.\n\nThank you for choosing to publish with us.\n\nBest regards,\nEditor-in-Chief`;
      await createNotificationAndEmail(
        targetUserId,
        paper.authorEmail || "",
        "Editorial Decision: Accepted for Publication!",
        emailBody,
        parsedPaperID
      );

      return NextResponse.json({ message: "Paper accepted successfully" });

    } else if (decision === "MINOR_REVISION" || decision === "MAJOR_REVISION") {
      // 2. REVISION -> Revision Required
      const nextStatus = decision === "MINOR_REVISION" ? Status.MINOR_REVISION : Status.MAJOR_REVISION;
      const decisionLabel = decision === "MINOR_REVISION" ? "Minor Revision Required" : "Major Revision Required";

      // Update relational Submission
      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: nextStatus }
      });

      // Log Decision
      await prisma.decision.create({
        data: {
          submissionId: submission.id,
          decisionType: decision,
          comments: comments || `${decisionLabel} requested.`,
          editorId: session.user.id,
          roundNumber: currentRound,
        }
      });

      // Update legacy SubmittedJournals
      await prisma.submittedJournals.updateMany({
        where: { paperID: parsedPaperID },
        data: {
          status: "REVISIONS_REQUESTED", // Maps to "Revision Required"
          revisionComments: comments
        }
      });

      // Update legacy AssignedJournals
      await prisma.assignedJournals.updateMany({
        where: { paperID: parsedPaperID },
        data: {
          status: "REVISIONS_REQUESTED",
          revisionComments: comments
        }
      });

      // Log Activity
      await logActivity(session.user.id, `EDITOR_DECISION_${decision}`, submission.id, prevStatus, nextStatus);

      // Send simulated email & Notification
      const authorUser = await prisma.user.findFirst({
        where: { email: { contains: paper.authorEmail || "" }, role: "AUTHOR" }
      });
      const targetUserId = authorUser ? authorUser.id : session.user.id;

      const emailBody = `Dear ${paper.authorNames},\n\nThank you for submitting your manuscript titled "${paper.title}" (ID: ${parsedPaperID}) to the International Scientific and Technological Journal.\n\nAfter comprehensive peer review evaluation and editorial synthesis, we would like to invite you to revise your manuscript. Your paper has been marked as: ${decisionLabel}.\n\nRevision Comments & Reviewer Feedback:\n${comments}\n\nPlease submit your revised manuscript and a separate "Response to Reviewers" document through your Author Dashboard.\n\nBest regards,\nEditor-in-Chief`;
      await createNotificationAndEmail(
        targetUserId,
        paper.authorEmail || "",
        `Editorial Decision: ${decisionLabel}`,
        emailBody,
        parsedPaperID
      );

      return NextResponse.json({ message: "Revision request submitted successfully" });

    } else if (decision === "REJECT") {
      // 3. REJECT -> Rejected
      const nextStatus = Status.REJECTED;

      // Update relational Submission
      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: nextStatus }
      });

      // Log Decision
      await prisma.decision.create({
        data: {
          submissionId: submission.id,
          decisionType: "REJECTED",
          comments: comments || "Manuscript rejected.",
          editorId: session.user.id,
          roundNumber: currentRound,
        }
      });

      // Update legacy SubmittedJournals
      await prisma.submittedJournals.updateMany({
        where: { paperID: parsedPaperID },
        data: {
          status: "REJECTED",
          isAccepted: false,
        },
      });

      // Create legacy RejectedJournal entry
      await prisma.rejectedJournal.create({
        data: {
          rejectedPerson: session.user.name || "Editor-in-Chief",
          rejectedReasons: comments,
          type: paper.type,
          title: paper.title,
          paperID: parsedPaperID,
          paperUrl: paper.paperUrl,
          abstract: paper.abstract,
          country: paper.country,
          editorName: session.user.name,
          primaryDomain: paper.primaryDomain,
          secondaryDomain: paper.secondaryDomain,
          authorNames: paper.authorNames,
          authorEmail: paper.authorEmail,
          keywords: paper.keywords,
          isSubmitted: paper.isSubmitted,
          isAssigndToEditor: paper.isAssigndToEditor,
          isReviewerAssigned: paper.isReviewerAssigned,
          isAssociatedEditorAssigned: paper.isAssociatedEditorAssigned,
          status: "REJECTED",
          createdAt: new Date(),
          coverLetterUrl: paper.coverLetterUrl,
        }
      });

      // Delete from legacy AssignedJournals
      await prisma.assignedJournals.deleteMany({
        where: { paperID: parsedPaperID }
      });

      // Log Activity
      await logActivity(session.user.id, "EDITOR_DECISION_REJECT", submission.id, prevStatus, nextStatus);

      // Send simulated email & Notification
      const authorUser = await prisma.user.findFirst({
        where: { email: { contains: paper.authorEmail || "" }, role: "AUTHOR" }
      });
      const targetUserId = authorUser ? authorUser.id : session.user.id;

      const emailBody = `Dear ${paper.authorNames},\n\nThank you for submitting your manuscript titled "${paper.title}" (ID: ${parsedPaperID}) to the International Scientific and Technological Journal.\n\nWe regret to inform you that following comprehensive peer review and editorial evaluation, we are unable to accept your manuscript for publication. The decision is: Reject.\n\nEvaluation Feedback:\n${comments}\n\nWe appreciate the opportunity to review your work and wish you success with your future research endeavors.\n\nBest regards,\nEditor-in-Chief`;
      await createNotificationAndEmail(
        targetUserId,
        paper.authorEmail || "",
        "Editorial Decision: Manuscript Rejected",
        emailBody,
        parsedPaperID
      );

      return NextResponse.json({ message: "Rejection decision processed successfully" });
    }

    return new NextResponse("Invalid decision option", { status: 400 });
  } catch (error) {
    console.error("Error submitting EIC decision:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
