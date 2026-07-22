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
    const { paperID, reviewers, deadline, blindType } = body;

    if (!paperID || !reviewers || reviewers.length === 0) {
      return new NextResponse("Missing paper ID or reviewers selection", { status: 400 });
    }

    const parsedPaperID = parseInt(paperID);
    const parsedDeadline = deadline ? new Date(deadline) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Default 14 days
    const chosenBlindType = blindType || "SINGLE_BLIND"; // SINGLE_BLIND, DOUBLE_BLIND, TRIPLE_BLIND, OPEN

    // Fetch the relational Submission
    let submission = await prisma.submission.findUnique({
      where: { paperID: parsedPaperID }
    });

    if (!submission) {
      return new NextResponse("Submission not found", { status: 404 });
    }

    // Get the latest manuscript to link the review reports
    const latestManuscript = await prisma.manuscript.findFirst({
      where: { submissionId: submission.id },
      orderBy: { roundNumber: "desc" }
    });

    if (!latestManuscript) {
      return new NextResponse("No manuscript found for this submission", { status: 404 });
    }

    const currentRound = latestManuscript.roundNumber;
    const prevStatus = submission.status;

    const validReviewerUsers = await prisma.user.findMany({
      where: {
        id: {
          in: reviewers.map((reviewer: any) => reviewer.id).filter(Boolean),
        },
        role: "REVIEWER",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (validReviewerUsers.length === 0) {
      return new NextResponse("No valid reviewers selected", { status: 400 });
    }

    const submittedPaper = await prisma.submittedJournals.findFirst({
      where: { paperID: parsedPaperID },
    });

    // 1. Create a ReviewAssignment and Review record for each invited reviewer
    for (const rev of validReviewerUsers) {
      // Find or create Reviewer profile
      let reviewerProfile = await prisma.reviewer.findUnique({
        where: { userId: rev.id }
      });

      if (!reviewerProfile) {
        reviewerProfile = await prisma.reviewer.create({
          data: { userId: rev.id }
        });
      }

      let assignment = await prisma.reviewAssignment.findFirst({
        where: {
          submissionId: submission.id,
          reviewerId: reviewerProfile.id,
          roundNumber: currentRound,
        },
      });

      if (!assignment) {
        assignment = await prisma.reviewAssignment.create({
          data: {
            submissionId: submission.id,
            reviewerId: reviewerProfile.id,
            roundNumber: currentRound,
            status: "INVITED",
            blindType: chosenBlindType,
          }
        });

        await prisma.review.create({
          data: {
            assignmentId: assignment.id,
            reviewerId: reviewerProfile.id,
            manuscriptId: latestManuscript.id,
            roundNumber: currentRound,
          }
        });
      }

      // Also create legacy Review record for backward compatibility
      const existingLegacyReview = await prisma.reviewLegacy.findFirst({
        where: {
          paperID: parsedPaperID,
          reviewerId: rev.id,
        },
        select: { id: true },
      });

      if (existingLegacyReview) {
        await prisma.reviewLegacy.update({
          where: { id: existingLegacyReview.id },
          data: {
            reviewerName: rev.name || "Reviewer",
            status: "INVITED",
            deadline: parsedDeadline,
          },
        });
      } else {
        await prisma.reviewLegacy.create({
          data: {
            paperID: parsedPaperID,
            reviewerId: rev.id,
            reviewerName: rev.name || "Reviewer",
            status: "INVITED",
            deadline: parsedDeadline
          },
        });
      }

      const emailBody =
        chosenBlindType === "DOUBLE_BLIND"
          ? `Dear Dr. ${rev.name || "Reviewer"},\n\nYou have been invited to review a manuscript for the International Scientific and Technological Journal under DOUBLE-BLIND review guidelines.\n\nPaper Details:\n- ID: ${parsedPaperID}\n- Title: [Title is hidden for double-blind review]\n\nPlease log in to your portal within 3 days to ACCEPT or DECLINE this invitation. If accepted, your review will be due by ${parsedDeadline.toLocaleDateString()}.\n\nBest regards,\nEditorial Office`
          : `Dear Dr. ${rev.name || "Reviewer"},\n\nYou have been invited to review the manuscript titled "${latestManuscript.title}" (ID: ${parsedPaperID}) under ${chosenBlindType} guidelines.\n\nPlease log in to your portal within 3 days to ACCEPT or DECLINE this invitation. If accepted, your review will be due by ${parsedDeadline.toLocaleDateString()}.\n\nBest regards,\nEditorial Office`;

      await createNotificationAndEmail(
        rev.id,
        rev.email,
        `Peer Review Invitation (ID: ${parsedPaperID})`,
        emailBody,
        parsedPaperID
      );
    }

    // 2. Update status of Submission to reviewer assignment until a reviewer accepts.
    const nextStatus = Status.REVIEWER_ASSIGNMENT;
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: nextStatus }
    });

    // 3. Update status of SubmittedJournals (Legacy)
    await prisma.submittedJournals.updateMany({
      where: { paperID: parsedPaperID },
      data: {
        status: Status.REVIEWER_ASSIGNED,
        isReviewerAssigned: true,
      }
    });

    // 4. Update status of AssignedJournals (Legacy)
    const assignedPaper = await prisma.assignedJournals.findFirst({
      where: { paperID: parsedPaperID },
      select: {
        id: true,
        reviewers: {
          select: { id: true },
        },
      },
    });

    const assignedPaperData = {
      type: submittedPaper?.type,
      title: submittedPaper?.title || latestManuscript.title,
      abstract: submittedPaper?.abstract || latestManuscript.abstract,
      paperUrl: submittedPaper?.paperUrl || latestManuscript.pdfUrl,
      primaryDomain: submittedPaper?.primaryDomain,
      secondaryDomain: submittedPaper?.secondaryDomain,
      country: submittedPaper?.country,
      authorNames: submittedPaper?.authorNames || latestManuscript.authors,
      authorEmail: submittedPaper?.authorEmail,
      howToKnow: submittedPaper?.howToKnow,
      editorName: session.user.name,
      paperID: parsedPaperID,
      keywords: submittedPaper?.keywords || latestManuscript.keywords,
      category: submittedPaper?.category || latestManuscript.category,
      supportingFilesUrl: submittedPaper?.supportingFilesUrl,
      coverLetterUrl: submittedPaper?.coverLetterUrl,
      createdAt: submittedPaper?.createdAt || new Date(),
      status: Status.REVIEWER_ASSIGNED,
      isSubmitted: true,
      isAssigndToEditor: true,
      isReviewerAssigned: true,
      isAssociatedEditorAssigned: Boolean(submittedPaper?.isAssociatedEditorAssigned),
      associateEditor: submittedPaper?.associateEditor,
    };

    if (assignedPaper) {
      const existingReviewerIds = new Set(assignedPaper.reviewers.map((reviewer) => reviewer.id));
      const newReviewers = validReviewerUsers.filter((reviewer) => !existingReviewerIds.has(reviewer.id));

      await prisma.assignedJournals.update({
        where: { id: assignedPaper.id },
        data: {
          status: Status.REVIEWER_ASSIGNED,
          isReviewerAssigned: true,
          ...(newReviewers.length > 0
            ? {
                reviewers: {
                  connect: newReviewers.map((reviewer) => ({ id: reviewer.id })),
                },
              }
            : {}),
        },
      });
    } else {
      await prisma.assignedJournals.create({
      data: {
          ...assignedPaperData,
          user: {
            connect: { id: session.user.id },
          },
          reviewers: {
            connect: validReviewerUsers.map((reviewer) => ({ id: reviewer.id })),
          },
        },
      });
    }

    // 5. Audit Logging
    await logActivity(
      session.user.id,
      `ASSIGN_REVIEWERS_${chosenBlindType}`,
      submission.id,
      prevStatus,
      nextStatus
    );

    return NextResponse.json({ message: "Reviewers invited successfully" });
  } catch (error) {
    console.error("Error inviting reviewers:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
