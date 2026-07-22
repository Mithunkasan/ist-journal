import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logActivity, createNotificationAndEmail } from "@/lib/workflow";
import { Status } from "@prisma/client";
import { sendEmailNotification } from "@/lib/mail";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const paperID = parseInt(params.id);
  const body = await request.json();
  const { reviewers, status, blindType } = body.data;
  const chosenBlindType = blindType || "SINGLE_BLIND";
  const parsedDeadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Default 14 days

  try {
    const existingJournal = await prisma.assignedJournals.findFirst({
      where: { paperID: paperID },
    });

    if (!existingJournal) {
      console.error("Journal not found");
      return new NextResponse("Journal not found", { status: 404 });
    }

    // Update legacy AssignedJournals
    const updatedJournal = await prisma.assignedJournals.update({
      where: { id: existingJournal.id },
      data: {
        status: status,
        reviewers: {
          connect: reviewers.map((reviewer: any) => ({
            id: reviewer.id,
          })),
        },
        isAssociatedEditorAssigned: body.data.isAssociatedEditorAssigned,
        isReviewerAssigned: body.data.isReviewerAssigned,
      },
    });

    // Sync in relational database models
    let submission = await prisma.submission.findUnique({
      where: { paperID }
    });

    if (!submission) {
      // Find author user
      const authorUser = await prisma.user.findFirst({
        where: { email: { contains: existingJournal.authorEmail || "" }, role: "AUTHOR" }
      });
      
      let authorProfile = authorUser ? await prisma.author.findUnique({ where: { userId: authorUser.id } }) : null;
      if (authorUser && !authorProfile) {
        authorProfile = await prisma.author.create({ data: { userId: authorUser.id } });
      }

      submission = await prisma.submission.create({
        data: {
          paperID,
          title: existingJournal.title || "Untitled",
          status: Status.SUBMITTED,
          authorId: authorProfile ? authorProfile.id : session.user.id,
        }
      });
    }

    const prevStatus = submission.status;

    // Get the latest manuscript to link the review reports
    const latestManuscript = await prisma.manuscript.findFirst({
      where: { submissionId: submission.id },
      orderBy: { roundNumber: "desc" }
    });

    if (latestManuscript) {
      const currentRound = latestManuscript.roundNumber;

      for (const rev of reviewers) {
        // Find or create Reviewer profile
        let reviewerProfile = await prisma.reviewer.findUnique({
          where: { userId: rev.id }
        });

        if (!reviewerProfile) {
          reviewerProfile = await prisma.reviewer.create({
            data: { userId: rev.id }
          });
        }

        // Create ReviewAssignment
        const assignment = await prisma.reviewAssignment.create({
          data: {
            submissionId: submission.id,
            reviewerId: reviewerProfile.id,
            roundNumber: currentRound,
            status: "INVITED",
            blindType: chosenBlindType,
          }
        });

        // Create Review report
        await prisma.review.create({
          data: {
            assignmentId: assignment.id,
            reviewerId: reviewerProfile.id,
            manuscriptId: latestManuscript.id,
            roundNumber: currentRound,
          }
        });

        // Create legacy Review record
        await prisma.reviewLegacy.create({
          data: {
            paperID: paperID,
            reviewerId: rev.id,
            reviewerName: rev.name,
            status: "INVITED",
            deadline: parsedDeadline
          }
        });

        // Send simulated invitation email
        const user = await prisma.user.findUnique({ where: { id: rev.id } });
        if (user && user.email) {
          let emailBody = "";
          if (chosenBlindType === "DOUBLE_BLIND") {
            emailBody = `Dear Dr. ${user.name},\n\nYou have been invited to review a manuscript for the International Scientific and Technological Journal under DOUBLE-BLIND review guidelines.\n\nPaper Details:\n- ID: ${paperID}\n- Title: [Title is hidden for double-blind review]\n\nPlease log in to your portal within 3 days to ACCEPT or DECLINE this invitation. If accepted, your review will be due by ${parsedDeadline.toLocaleDateString()}.\n\nBest regards,\nEditorial Office`;
          } else {
            emailBody = `Dear Dr. ${user.name},\n\nYou have been invited to review the manuscript titled "${latestManuscript.title}" (ID: ${paperID}) under ${chosenBlindType} guidelines.\n\nPlease log in to your portal within 3 days to ACCEPT or DECLINE this invitation. If accepted, your review will be due by ${parsedDeadline.toLocaleDateString()}.\n\nBest regards,\nEditorial Office`;
          }

          await sendEmailNotification({
            to: user.email,
            subject: `[IST Journal] Peer Review Invitation (ID: ${paperID})`,
            body: emailBody,
            templateParams: { paperID, reviewerName: user.name, deadline: parsedDeadline }
          });
        }
      }
    }

    // Update submission status to UNDER_REVIEW
    const nextStatus = Status.UNDER_REVIEW;
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: nextStatus }
    });

    // Legacy SubmittedJournals Status Sync
    await prisma.submittedJournals.updateMany({
      where: { paperID },
      data: {
        status: Status.UNDER_REVIEW,
        isReviewerAssigned: true,
      }
    });

    // Audit Logging
    await logActivity(
      session.user.id,
      `ASSIGN_REVIEWERS_${chosenBlindType}`,
      submission.id,
      prevStatus,
      nextStatus
    );

    return NextResponse.json(updatedJournal);
  } catch (error) {
    console.error("Error updating journal status:", error);
    return new NextResponse("Failed to update journal status", { status: 500 });
  }
}
