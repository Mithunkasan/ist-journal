import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { sendEmailNotification } from "@/lib/mail";
import { Status } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "REVIEWER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const reviewId = parseInt(params.id);
  const body = await request.json();
  const { decision } = body;

  try {
    const review = await prisma.reviewLegacy.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return new NextResponse("Invitation not found", { status: 404 });
    }

    const paper = await prisma.submittedJournals.findFirst({
      where: { paperID: review.paperID }
    });

    if (!paper) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    // Resolve reviewer profile
    const reviewerProfile = await prisma.reviewer.findUnique({
      where: { userId: session.user.id }
    });

    if (decision === "ACCEPT") {
      // 1. Update legacy review record
      await prisma.reviewLegacy.update({
        where: { id: reviewId },
        data: { status: "ACCEPTED" }
      });

      // Update new relational assignment status
      if (reviewerProfile) {
        const submission = await prisma.submission.findUnique({
          where: { paperID: review.paperID }
        });
        if (submission) {
          const assignment = await prisma.reviewAssignment.findFirst({
            where: {
              submissionId: submission.id,
              reviewerId: reviewerProfile.id,
              status: "INVITED"
            }
          });
          if (assignment) {
            await prisma.reviewAssignment.update({
              where: { id: assignment.id },
              data: { status: "ACCEPTED" }
            });
          }
        }
      }

      // 2. Add reviewer to AssignedJournals.reviewers relation if not already added
      const assignment = await prisma.assignedJournals.findFirst({
        where: { paperID: review.paperID }
      });

      if (assignment) {
        await prisma.assignedJournals.update({
          where: { id: assignment.id },
          data: {
            reviewers: {
              connect: { id: session.user.id }
            },
            status: "UNDER_REVIEW_BY_REVIEWER" // Shifts paper into active review
          }
        });
      }

      // 3. Update status in SubmittedJournals
      await prisma.submittedJournals.updateMany({
        where: { paperID: review.paperID },
        data: { status: "UNDER_REVIEW_BY_REVIEWER" }
      });

      await prisma.submission.updateMany({
        where: { paperID: review.paperID },
        data: { status: Status.UNDER_REVIEW }
      });

      // 4. Send email notification to AE
      if (paper.associateEditor) {
        const ae = await prisma.user.findFirst({
          where: { name: paper.associateEditor, role: "ASSOCIATE_EDITOR" }
        });
        if (ae && ae.email) {
          await sendEmailNotification({
            to: ae.email,
            subject: `[IST Journal] Invitation Accepted by Reviewer for Paper ID ${review.paperID}`,
            body: `Dear Dr. ${ae.name},\n\nWe are pleased to inform you that Dr. ${session.user.name} has ACCEPTED your peer review invitation for manuscript ID ${review.paperID} ("${paper.title}").\n\nThe review timeline has commenced, and the report is scheduled to be completed by ${review.deadline ? new Date(review.deadline).toLocaleDateString() : "N/A"}.\n\nBest regards,\nJournal Peer Review system`,
            templateParams: { paperID: review.paperID, reviewerName: session.user.name }
          });
        }
      }

      return NextResponse.json({ message: "Invitation accepted" });

    } else if (decision === "DECLINE") {
      // 1. Update legacy review record
      await prisma.reviewLegacy.update({
        where: { id: reviewId },
        data: { status: "DECLINED" }
      });

      // Update new relational assignment status
      if (reviewerProfile) {
        const submission = await prisma.submission.findUnique({
          where: { paperID: review.paperID }
        });
        if (submission) {
          const assignment = await prisma.reviewAssignment.findFirst({
            where: {
              submissionId: submission.id,
              reviewerId: reviewerProfile.id,
              status: "INVITED"
            }
          });
          if (assignment) {
            await prisma.reviewAssignment.update({
              where: { id: assignment.id },
              data: { status: "DECLINED" }
            });
          }
        }
      }

      // 2. Notify AE of decline
      if (paper.associateEditor) {
        const ae = await prisma.user.findFirst({
          where: { name: paper.associateEditor, role: "ASSOCIATE_EDITOR" }
        });
        if (ae && ae.email) {
          await sendEmailNotification({
            to: ae.email,
            subject: `[IST Journal] Review Invitation Declined for Paper ID ${review.paperID}`,
            body: `Dear Dr. ${ae.name},\n\nThis is to notify you that Dr. ${session.user.name} has DECLINED your peer review invitation for manuscript ID ${review.paperID} ("${paper.title}").\n\nPlease log in to your Associate Editor Dashboard to select and invite alternative peer reviewers.\n\nBest regards,\nJournal Peer Review system`,
            templateParams: { paperID: review.paperID, reviewerName: session.user.name }
          });
        }
      }

      return NextResponse.json({ message: "Invitation declined" });
    }

    return new NextResponse("Invalid decision option", { status: 400 });
  } catch (error) {
    console.error("Error processing invitation decision:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
