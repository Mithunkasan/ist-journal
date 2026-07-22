import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { sendEmailNotification } from "@/lib/mail";
import { logActivity, createNotificationAndEmail, ensureUserProfile } from "@/lib/workflow";
import { Status } from "@prisma/client";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "REVIEWER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { paperID, commentsToAuthor, commentsToEditor, recommendation } = body;

    if (!paperID || !commentsToAuthor || !recommendation) {
      return new NextResponse("Missing required review fields", { status: 400 });
    }

    const parsedPaperID = parseInt(paperID);

    // Find or create the reviewer profile
    let reviewerProfile = await prisma.reviewer.findUnique({
      where: { userId: session.user.id }
    });

    if (!reviewerProfile) {
      await ensureUserProfile(session.user.id, "REVIEWER");
      reviewerProfile = await prisma.reviewer.findUnique({
        where: { userId: session.user.id }
      });
    }

    if (!reviewerProfile) {
      return new NextResponse("Reviewer profile could not be created", { status: 500 });
    }

    // Find the relational Submission
    let submission = await prisma.submission.findUnique({
      where: { paperID: parsedPaperID }
    });

    if (!submission) {
      // It's a legacy paper! Let's find it in SubmittedJournals or AssignedJournals
      const legacyPaper = await prisma.submittedJournals.findFirst({
        where: { paperID: parsedPaperID }
      }) || await prisma.assignedJournals.findFirst({
        where: { paperID: parsedPaperID }
      });

      if (!legacyPaper) {
        return new NextResponse("Submission not found", { status: 404 });
      }

      // Get or create Author user
      const authorEmail = legacyPaper.authorEmail || "author@example.com";
      let authorUser = await prisma.user.findFirst({
        where: { email: authorEmail, role: "AUTHOR" }
      });

      if (!authorUser) {
        authorUser = await prisma.user.create({
          data: {
            email: authorEmail,
            name: legacyPaper.authorNames || "Author",
            role: "AUTHOR",
            Status: "ACTIVE"
          }
        });
      }

      // Ensure author has Author profile
      await ensureUserProfile(authorUser.id, "AUTHOR");
      const authorProfile = await prisma.author.findUnique({
        where: { userId: authorUser.id }
      });

      if (!authorProfile) {
        return new NextResponse("Author profile could not be created", { status: 500 });
      }

      // Map status
      let mappedStatus: Status = Status.UNDER_REVIEW;
      if (legacyPaper.status) {
        if (Object.values(Status).includes(legacyPaper.status as any)) {
          mappedStatus = legacyPaper.status as Status;
        }
      }

      // Create Submission
      submission = await prisma.submission.create({
        data: {
          paperID: parsedPaperID,
          title: legacyPaper.title || "Untitled Paper",
          status: mappedStatus,
          authorId: authorProfile.id,
          createdAt: legacyPaper.createdAt || new Date(),
        }
      });

      // Create Manuscript
      await prisma.manuscript.create({
        data: {
          submissionId: submission.id,
          title: legacyPaper.title || "Untitled Paper",
          abstract: legacyPaper.abstract || "",
          keywords: legacyPaper.keywords || "",
          category: legacyPaper.category || "General",
          authors: legacyPaper.authorNames || "Author",
          pdfUrl: legacyPaper.paperUrl || "",
          roundNumber: 1
        }
      });
    }

    // Get the latest manuscript to link this review to
    const latestManuscript = await prisma.manuscript.findFirst({
      where: { submissionId: submission.id },
      orderBy: { roundNumber: "desc" }
    });

    if (!latestManuscript) {
      return new NextResponse("Manuscript not found", { status: 404 });
    }

    const currentRound = latestManuscript.roundNumber;

    // Find or create the active review assignment for this reviewer, submission and round
    let activeAssignment = await prisma.reviewAssignment.findFirst({
      where: {
        submissionId: submission.id,
        reviewerId: reviewerProfile.id,
        roundNumber: currentRound,
        status: { in: ["INVITED", "ACCEPTED", "PENDING", "COMPLETED"] }
      }
    });

    if (!activeAssignment) {
      activeAssignment = await prisma.reviewAssignment.create({
        data: {
          submissionId: submission.id,
          reviewerId: reviewerProfile.id,
          roundNumber: currentRound,
          status: "ACCEPTED",
          blindType: "SINGLE_BLIND"
        }
      });
    }

    // Find or create the relational Review record
    let activeReview = await prisma.review.findFirst({
      where: {
        assignmentId: activeAssignment.id,
        reviewerId: reviewerProfile.id,
        roundNumber: currentRound,
      }
    });

    if (!activeReview) {
      activeReview = await prisma.review.create({
        data: {
          assignmentId: activeAssignment.id,
          reviewerId: reviewerProfile.id,
          manuscriptId: latestManuscript.id,
          roundNumber: currentRound,
          recommendation: recommendation,
          commentsForAuthor: commentsToAuthor,
          commentsForEditor: commentsToEditor
        }
      });
    }

    // 1. Update Review report with comments and recommendations
    await prisma.review.update({
      where: { id: activeReview.id },
      data: {
        recommendation,
        commentsForAuthor: commentsToAuthor,
        commentsForEditor: commentsToEditor,
        submittedAt: new Date()
      }
    });

    // 2. Update ReviewAssignment status to COMPLETED
    await prisma.reviewAssignment.update({
      where: { id: activeAssignment.id },
      data: { status: "COMPLETED" }
    });

    // 3. Update legacy ReviewLegacy record (for backward compatibility)
    const activeLegacyReview = await prisma.reviewLegacy.findFirst({
      where: {
        paperID: parsedPaperID,
        reviewerId: session.user.id,
        status: { in: ["INVITED", "ACCEPTED"] }
      }
    });

    if (activeLegacyReview) {
      await prisma.reviewLegacy.update({
        where: { id: activeLegacyReview.id },
        data: {
          commentsToAuthor,
          commentsToEditor,
          recommendation,
          status: "COMPLETED",
          updatedAt: new Date()
        }
      });
    }

    // 4. Log activity
    await logActivity(
      session.user.id,
      `SUBMIT_REVIEW_ROUND_${currentRound}`,
      submission.id,
      submission.status,
      submission.status
    );

    // 5. Find if there are other pending reviews for this round
    const pendingAssignments = await prisma.reviewAssignment.findMany({
      where: {
        submissionId: submission.id,
        roundNumber: currentRound,
        status: { in: ["INVITED", "ACCEPTED", "PENDING"] }
      }
    });

    // If no other reviews are pending or accepted, the paper is fully evaluated!
    // Set status to EDITOR_DECISION (Awaiting final EIC decision, maps to DECISION_PENDING in legacy)
    if (pendingAssignments.length === 0) {
      const nextStatus = Status.EDITOR_DECISION;

      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: nextStatus }
      });

      await prisma.submittedJournals.updateMany({
        where: { paperID: parsedPaperID },
        data: { status: "DECISION_PENDING" }
      });

      await prisma.assignedJournals.updateMany({
        where: { paperID: parsedPaperID },
        data: { status: "DECISION_PENDING" }
      });

      // Notify Editor that all review reports are in!
      const editors = await prisma.user.findMany({
        where: { role: "EDITOR", Status: "ACTIVE" }
      });

      for (const editor of editors) {
        if (editor.email) {
          const notificationMsg = `Dear EIC ${editor.name},\n\nWe have received all peer review reports for manuscript ID ${parsedPaperID} ("${submission.title}").\n\nThe manuscript has been moved to "Awaiting Final Editor Decision" stage. Please log in to your EIC Dashboard to analyze the reviews and make your decision.\n\nBest regards,\nEditorial Office`;
          await createNotificationAndEmail(
            editor.id,
            editor.email,
            "All Review Reports Received",
            notificationMsg,
            parsedPaperID
          );
        }
      }
    }

    return NextResponse.json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting peer review:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
